import { SITE } from '@/lib/site';
import { calculateQuote, cancellationFeePence, formatPence } from '@/lib/pricing';
import {
  sendBookingNotification,
  sendBookingInvoice,
  sendCustomerAcknowledgement,
  smtpConfigured,
} from '@/lib/email';
import { stripeConfigured } from '@/lib/stripe';
import { bookingReference, createPayToken } from '@/lib/paylink';

// nodemailer and the Stripe SDK both need the Node runtime (not Edge).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* -------------------------------------------------------------------------- */
/* Limits                                                                      */
/* -------------------------------------------------------------------------- */

const MAX_BODY_BYTES = 16 * 1024;
const FIELD_LIMITS = {
  name: 120,
  phone: 40,
  email: 200,
  address: 300,
  service: 120,
  deepCleaningSize: 80,
  serviceTier: 80,
  hours: 40,
  customHours: 40,
  date: 40,
  time: 40,
  propertySize: 120,
  notes: 2000,
};
const MAX_ADDONS = 20;
const MAX_ADDON_LENGTH = 80;

// Deliberately conservative: this endpoint sends email and can open a Stripe
// session, so abuse costs the business its SMTP reputation.
const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 5 };

/* -------------------------------------------------------------------------- */
/* Rate limiting                                                               */
/* -------------------------------------------------------------------------- */

/**
 * In-memory fixed-window counter, keyed by client IP.
 *
 * This is per-instance: on a multi-instance/serverless deploy each instance
 * keeps its own window, so it throttles rather than hard-caps. That is a large
 * improvement over no limit at all, but for a strict global limit move this to
 * a shared store (Upstash Redis, Vercel KV).
 */
const hits = new Map();

function clientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function rateLimited(ip) {
  const now = Date.now();

  // Opportunistic sweep so the map cannot grow without bound.
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key);
  }

  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

/* -------------------------------------------------------------------------- */
/* Validation helpers                                                          */
/* -------------------------------------------------------------------------- */

/** Trims, coerces to string and enforces a per-field length cap. */
function clean(value, limit) {
  if (value === undefined || value === null) return '';
  return String(value).trim().slice(0, limit);
}

// Intentionally permissive but structurally strict: exactly one @, no spaces,
// a dot-separated TLD. Also blocks CR/LF, which is the header-injection vector.
const EMAIL_RE = /^[^\s@,;:<>()[\]\\]+@[^\s@.,;:<>()[\]\\]+(\.[^\s@.,;:<>()[\]\\]+)+$/;

function hasHeaderInjection(value) {
  return /[\r\n]/.test(value);
}

function jsonError(message, status) {
  return Response.json({ success: false, message }, { status });
}

function originFrom(req) {
  return process.env.NEXT_PUBLIC_SITE_URL || req.headers.get('origin') || SITE.url;
}

/* -------------------------------------------------------------------------- */
/* Handler                                                                     */
/* -------------------------------------------------------------------------- */

export async function POST(req) {
  try {
    // Reject oversized payloads before parsing.
    const declaredLength = Number(req.headers.get('content-length') || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return jsonError('That request was too large. Please shorten your notes.', 413);
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return jsonError('That request was too large. Please shorten your notes.', 413);
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return jsonError('We could not read that request. Please try again.', 400);
    }

    if (!body || typeof body !== 'object') {
      return jsonError('We could not read that request. Please try again.', 400);
    }

    // Honeypot — real users never fill a visually hidden field. Return a
    // success shape so bots cannot distinguish a rejection from a send.
    if (clean(body.company, 100)) {
      return Response.json({ success: true, message: 'Booking request sent.' });
    }

    if (rateLimited(clientIp(req))) {
      return jsonError(
        `Too many booking requests from this connection. Please call ${SITE.phoneDisplay} instead.`,
        429
      );
    }

    // Normalise every field to a capped string.
    const data = {};
    for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
      data[field] = clean(body[field], limit);
    }

    data.addons = Array.isArray(body.addons)
      ? body.addons.slice(0, MAX_ADDONS).map((item) => clean(item, MAX_ADDON_LENGTH))
      : [];

    const required = {
      name: 'your name',
      phone: 'your phone number',
      email: 'your email address',
      address: 'the cleaning address',
      date: 'a preferred date',
      time: 'a preferred time',
    };

    for (const [field, label] of Object.entries(required)) {
      if (!data[field]) return jsonError(`Please provide ${label}.`, 400);
    }

    // Must be well-formed: this address is used as an envelope recipient.
    if (!EMAIL_RE.test(data.email)) {
      return jsonError('Please provide a valid email address.', 400);
    }

    // Defence in depth against SMTP header injection.
    for (const value of [data.name, data.email, data.phone, data.service]) {
      if (hasHeaderInjection(value)) {
        return jsonError('Please remove line breaks from your details.', 400);
      }
    }

    // Consent is required before we store or process personal data.
    if (body.consent !== true) {
      return jsonError('Please confirm you agree to our Privacy Policy.', 400);
    }

    // Fail loudly in logs (never to the client) if SMTP is misconfigured.
    if (!smtpConfigured()) {
      console.error('Booking form: SMTP environment variables are not configured.');
      return jsonError(
        `Our booking system is temporarily unavailable. Please call ${SITE.phoneDisplay}.`,
        503
      );
    }

    /*
     * The quote is built server-side from the published price list. The browser
     * sends a service name and tier, never an amount — otherwise anyone could
     * book a five-bedroom deep clean for a penny.
     */
    const quote = calculateQuote(data);
    const canInvoice = !quote.quoteOnly && quote.totalPence > 0 && stripeConfigured();

    if (!quote.quoteOnly && quote.totalPence > 0 && !stripeConfigured()) {
      console.warn('Booking has a calculable total but STRIPE_SECRET_KEY is not configured.');
    }

    /*
     * Consumer Contracts Regulations 2013: taking payment before the 14-day
     * cancellation period ends requires the customer's express request for
     * work to begin within it. Without that, a completed job could still be
     * cancelled for a full refund.
     */
    if (canInvoice && body.startWithinCancellationPeriod !== true) {
      return jsonError(
        'Please confirm you would like us to schedule the work before you can be invoiced.',
        400
      );
    }

    const reference = bookingReference(data.email, data.date);

    const staffNote = canInvoice
      ? `Invoice ${reference} for ${formatPence(quote.totalPence)} sent — awaiting payment. ` +
        `Late-cancellation fee would be ${formatPence(cancellationFeePence(quote.totalPence))}.`
      : `Quote required: ${quote.reason} No invoice sent.`;

    // Notify the business first: no enquiry is lost even if the customer never
    // opens the invoice. Its failure fails the request.
    await sendBookingNotification(data, { depositNote: staffNote });

    if (!canInvoice) {
      // No published price for this booking, so it is taken as an enquiry and
      // priced by hand — exactly as it was before payments existed.
      try {
        await sendCustomerAcknowledgement(data);
      } catch (ackError) {
        console.error('Booking acknowledgement email failed (booking was received):', ackError);
      }
      return Response.json({ success: true, message: 'Booking request sent.' });
    }

    /*
     * Signed token rather than a Checkout Session: sessions expire within 24
     * hours, and the invoice link needs to keep working for as long as the
     * booking is live. /pay/<token> mints a session when the customer clicks.
     */
    const token = createPayToken({
      reference,
      name: data.name,
      email: data.email,
      service: data.service,
      amountPence: quote.totalPence,
      date: data.date,
      time: data.time,
    });

    const payUrl = `${originFrom(req)}/pay/${token}`;

    // Funds are only held (rather than taken) when the clean is close enough
    // for a card authorisation to still be valid on the day.
    const leadDays = Math.ceil(
      (new Date(`${data.date}T00:00:00`).getTime() - Date.now()) / 86400000
    );
    const holdsFunds = Number.isFinite(leadDays) && leadDays <= 7;

    try {
      await sendBookingInvoice({ data, quote, reference, payUrl, holdsFunds });
    } catch (invoiceError) {
      console.error('Invoice email failed (booking was received):', invoiceError);
      return jsonError(
        `We received your booking but could not email your invoice. Please call ${SITE.phoneDisplay}.`,
        500
      );
    }

    return Response.json({
      success: true,
      message: `Thank you. Invoice ${reference} for ${formatPence(quote.totalPence)} has been emailed to you with a secure payment link.`,
      reference,
      totalLabel: formatPence(quote.totalPence),
    });
  } catch (error) {
    // Log the detail server-side; return nothing that reveals SMTP or Stripe internals.
    console.error('Booking form error:', error);
    return jsonError(
      `Your request could not be sent. Please call or WhatsApp us on ${SITE.phoneDisplay}.`,
      500
    );
  }
}
