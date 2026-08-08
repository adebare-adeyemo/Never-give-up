import { getStripe, stripeConfigured } from '@/lib/stripe';
import { sendDepositReceipt, smtpConfigured } from '@/lib/email';
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

        // `complete` with an unpaid status happens for delayed payment methods;
        // only treat an actually-paid session as a deposit.
        if (session.payment_status !== 'paid') break;

        const meta = session.metadata || {};

        if (smtpConfigured()) {
          await sendDepositReceipt({
            name: meta.customerName || session.customer_details?.name || 'Customer',
            email: meta.customerEmail || session.customer_details?.email || '',
            service: meta.service || 'Cleaning Service',
            amountLabel: formatPence(session.amount_total ?? 0),
            reference: session.payment_intent || session.id,
          });
        } else {
          console.error('Deposit paid but SMTP is not configured; no staff email sent.');
        }
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
