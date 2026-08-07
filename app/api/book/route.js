import nodemailer from 'nodemailer';
import { SITE } from '@/lib/site';

// nodemailer needs the Node runtime (not Edge).
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
  hours: 40,
  customHours: 40,
  date: 40,
  time: 40,
  propertySize: 120,
  notes: 2000,
};
const MAX_ADDONS = 20;
const MAX_ADDON_LENGTH = 80;

// Deliberately conservative: this endpoint sends two emails per call, so abuse
// costs the business its SMTP reputation.
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

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

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
    const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.error('Booking form: SMTP environment variables are not configured.');
      return jsonError(
        `Our booking system is temporarily unavailable. Please call ${SITE.phoneDisplay}.`,
        503
      );
    }

    const port = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const recipient = process.env.SMTP_TO || SITE.email;
    const from = process.env.SMTP_FROM || SMTP_USER;

    // Single source of truth for both the HTML and plaintext bodies, so the
    // two can never drift apart.
    const summary = [
      ['Name', data.name],
      ['Phone', data.phone],
      ['Email', data.email],
      ['Address', data.address],
      ['Service', data.service],
      ['Deep cleaning property size', data.deepCleaningSize],
      ['Hours requested', data.hours === 'Other' ? data.customHours : data.hours],
      ['Add-on services', data.addons.join(', ')],
      ['Preferred date', data.date],
      ['Preferred time', data.time],
      ['Property size', data.propertySize],
      ['Additional notes', data.notes],
    ].filter(([, value]) => value);

    const htmlRows = summary
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#475569;"><strong>${escapeHtml(
            label
          )}</strong></td><td style="padding:6px 0;vertical-align:top;color:#0f172a;">${escapeHtml(
            value
          ).replaceAll('\n', '<br/>')}</td></tr>`
      )
      .join('');

    const textRows = summary.map(([label, value]) => `${label}: ${value}`).join('\n');

    const wrap = (heading, inner) => `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#0f172a;">
        <h2 style="color:#0f766e;margin:0 0 16px;">${escapeHtml(heading)}</h2>
        ${inner}
      </div>`;

    // Internal notification.
    await transporter.sendMail({
      from: `${SITE.name} Website <${from}>`,
      to: recipient,
      replyTo: `${data.name} <${data.email}>`,
      subject: `New booking request — ${data.service || 'Cleaning Service'}`,
      html: wrap(
        'New Booking Request',
        `<table cellpadding="0" cellspacing="0">${htmlRows}</table>`
      ),
      text: `New Booking Request\n\n${textRows}\n`,
    });

    // Customer acknowledgement.
    const ackRows = summary
      .filter(([label]) =>
        [
          'Service',
          'Preferred date',
          'Preferred time',
          'Hours requested',
          'Property size',
        ].includes(label)
      )
      .map(
        ([label, value]) =>
          `<p style="margin:4px 0;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
      )
      .join('');

    await transporter.sendMail({
      from: `${SITE.name} <${from}>`,
      to: data.email,
      subject: `Thank you for your booking request — ${SITE.name}`,
      html: wrap(
        'Thank you for your booking request',
        `<p>Hi ${escapeHtml(data.name)},</p>
         <p>Thank you for contacting ${escapeHtml(SITE.name)}. We have received your request and will get back to you shortly.</p>
         <h3 style="margin:20px 0 8px;">Your booking details</h3>
         ${ackRows}
         <p style="margin-top:20px;">If anything changes, reply to this email or call us on <strong>${SITE.phoneDisplay}</strong>.</p>
         <p>Kind regards,<br/>${escapeHtml(SITE.name)}<br/>${SITE.phoneDisplay}<br/>${SITE.email}</p>`
      ),
      text:
        `Hi ${data.name},\n\n` +
        `Thank you for contacting ${SITE.name}. We have received your request and will get back to you shortly.\n\n` +
        `Your booking details:\n${summary
          .filter(([label]) =>
            [
              'Service',
              'Preferred date',
              'Preferred time',
              'Hours requested',
              'Property size',
            ].includes(label)
          )
          .map(([label, value]) => `${label}: ${value}`)
          .join('\n')}\n\n` +
        `If anything changes, reply to this email or call us on ${SITE.phoneDisplay}.\n\n` +
        `Kind regards,\n${SITE.name}\n${SITE.phoneDisplay}\n${SITE.email}\n`,
    });

    return Response.json({ success: true, message: 'Booking request sent.' });
  } catch (error) {
    // Log the detail server-side; return nothing that reveals SMTP internals.
    console.error('Booking form email error:', error);
    return jsonError(
      `Your request could not be sent. Please call or WhatsApp us on ${SITE.phoneDisplay}.`,
      500
    );
  }
}
