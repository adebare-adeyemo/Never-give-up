import { verifyPaymentResult, takepaymentsConfigured } from '@/lib/takepayments';
import { sendPaymentNotice, smtpConfigured } from '@/lib/email';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/*
 * Payment result from the takepayments hosted form.
 *
 * The gateway posts the outcome here as form-encoded fields, hashed with the
 * pre-shared key. Nothing is believed until that hash re-computes: without it,
 * anyone could post "StatusCode=0" and claim a booking was paid.
 */

/** Order references already handled, so a repeated post cannot re-notify. */
const handled = new Map();
const HANDLED_TTL_MS = 24 * 60 * 60 * 1000;

function alreadyHandled(reference) {
  const now = Date.now();
  for (const [key, seenAt] of handled) {
    if (now - seenAt > HANDLED_TTL_MS) handled.delete(key);
  }
  return handled.has(reference);
}

function redirectTo(path) {
  // 303 so the browser follows the gateway's POST with a GET.
  return Response.redirect(`${SITE.url}${path}`, 303);
}

export async function POST(req) {
  if (!takepaymentsConfigured()) {
    console.error('takepayments callback received but the gateway is not configured.');
    return redirectTo('/booking/link-problem?reason=unavailable');
  }

  let received;
  try {
    const body = await req.formData();
    received = Object.fromEntries([...body.entries()].map(([k, v]) => [k, String(v)]));
  } catch (error) {
    console.error('Could not parse takepayments callback body:', error);
    return redirectTo('/booking/link-problem?reason=error');
  }

  const result = verifyPaymentResult(received);

  if (!result.valid) {
    // Either tampering or a hash-method mismatch in the MMS. Never proceed.
    console.error(`takepayments callback rejected: ${result.reason}`, {
      orderId: received.OrderID,
      statusCode: received.StatusCode,
    });
    return redirectTo('/booking/link-problem?reason=bad-signature');
  }

  if (!result.succeeded) {
    console.warn(
      `Payment not completed for ${result.orderId}: status ${result.statusCode} — ${result.message}`
    );
    return redirectTo(`/booking/cancelled?ref=${encodeURIComponent(result.orderId)}`);
  }

  if (!alreadyHandled(result.orderId)) {
    handled.set(result.orderId, Date.now());

    if (smtpConfigured()) {
      try {
        await sendPaymentNotice({
          held: false,
          name: received.CustomerName || 'Customer',
          email: received.EmailAddress || '',
          service: received.OrderDescription || 'Cleaning Service',
          reference: result.orderId,
          cleaningDate: '',
          amountPence: result.amountPence,
          paymentIntentId: result.crossReference,
        });
      } catch (error) {
        // The customer has paid — never fail their redirect over an email.
        console.error('Payment succeeded but the staff notification failed:', error);
      }
    } else {
      console.error('Payment succeeded but SMTP is not configured; no staff email sent.');
    }
  }

  return redirectTo(`/booking/confirmed?ref=${encodeURIComponent(result.orderId)}`);
}
