import { getStripe, stripeConfigured } from '@/lib/stripe';
import { sendPaymentNotice, smtpConfigured } from '@/lib/email';
import { formatPence } from '@/lib/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/*
 * Stripe webhook.
 *
 * This is the only trustworthy signal that money moved. The browser's redirect
 * to /booking/confirmed proves nothing — a visitor can open that URL directly —
 * so anything that depends on payment happens here, behind a verified
 * signature.
 */

/**
 * Event IDs already handled, so a redelivery cannot send a second email.
 *
 * In-memory and therefore per-instance: Stripe retries land on any instance, so
 * this narrows the window rather than closing it. A shared store (Vercel KV,
 * Upstash) would make it airtight — worth doing before this handles anything
 * with financial side effects beyond a notification.
 */
const processed = new Map();
const PROCESSED_TTL_MS = 24 * 60 * 60 * 1000;

function alreadyHandled(eventId) {
  const now = Date.now();
  for (const [id, seenAt] of processed) {
    if (now - seenAt > PROCESSED_TTL_MS) processed.delete(id);
  }
  return processed.has(eventId);
}

/**
 * Recorded only after the handler succeeds. Marking on receipt instead would
 * make a failed attempt look handled, so Stripe's retry would be skipped and
 * the work silently lost.
 */
function markHandled(eventId) {
  processed.set(eventId, Date.now());
}

export async function POST(req) {
  if (!stripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe webhook received but Stripe is not configured.');
    return new Response('Stripe is not configured.', { status: 503 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature header.', { status: 400 });
  }

  // The raw body is required: constructEvent verifies the signature against the
  // exact bytes Stripe signed, so it must not be parsed first.
  const payload = await req.text();

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    // Either a forgery or a secret mismatch. Never process it.
    console.error('Stripe webhook signature verification failed:', error.message);
    return new Response(`Webhook signature verification failed.`, { status: 400 });
  }

  if (alreadyHandled(event.id)) {
    return Response.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const meta = session.metadata || {};
        const held = meta.captureMode === 'manual';

        /*
         * With manual capture the session completes as `unpaid` — the funds are
         * authorised, not taken. That is the success case for a held booking,
         * so it must not be filtered out as an unpaid session.
         */
        if (!held && session.payment_status !== 'paid') break;

        if (!smtpConfigured()) {
          console.error('Payment event received but SMTP is not configured; no staff email sent.');
          break;
        }

        await sendPaymentNotice({
          held,
          name: meta.customerName || session.customer_details?.name || 'Customer',
          email: meta.customerEmail || session.customer_details?.email || '',
          service: meta.service || 'Cleaning Service',
          reference: meta.reference || session.client_reference_id || session.id,
          cleaningDate: meta.cleaningDate || '',
          amountPence: session.amount_total ?? 0,
          paymentIntentId: session.payment_intent || '',
        });
        break;
      }

      case 'payment_intent.canceled':
        // The hold was released without capture — no charge to the customer.
        console.info('Authorisation released without capture:', event.data.object.id);
        break;

      case 'payment_intent.succeeded': {
        // Fires on capture. Logged so the ledger is visible without opening Stripe.
        const intent = event.data.object;
        console.info(
          `Captured ${formatPence(intent.amount_received ?? 0)} of ${formatPence(intent.amount ?? 0)} for ${intent.id}`
        );
        break;
      }

      case 'checkout.session.expired':
        // Informational: the customer never paid. The enquiry email was already
        // sent when the form was submitted, so there is nothing to undo.
        console.info('Checkout session expired without payment:', event.data.object.id);
        break;

      case 'charge.refunded':
      case 'charge.dispute.created':
        console.warn(`Stripe ${event.type}:`, event.data.object.id);
        break;

      default:
        break;
    }
  } catch (error) {
    /*
     * Returning 500 asks Stripe to retry. That is right for a transient SMTP
     * failure, and the idempotency guard above stops a successful retry from
     * duplicating work.
     */
    console.error(`Failed handling Stripe event ${event.type} (${event.id}):`, error);
    return new Response('Handler error.', { status: 500 });
  }

  markHandled(event.id);
  return Response.json({ received: true });
}
