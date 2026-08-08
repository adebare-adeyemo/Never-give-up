import { readPayToken } from '@/lib/paylink';
import { getStripe, stripeConfigured } from '@/lib/stripe';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/*
 * Payment link target.
 *
 * The invoice email points here rather than at a Checkout Session directly,
 * because sessions expire within 24 hours. A signed token carries the booking,
 * so a session is minted at the moment the customer clicks — the link keeps
 * working for as long as the token is valid, and no database is needed.
 */

/** Hold window we can rely on without IC+ pricing on the Stripe account. */
const GUARANTEED_HOLD_DAYS = 7;

function redirectTo(path) {
  return Response.redirect(`${SITE.url}${path}`, 303);
}

function daysUntil(dateString) {
  const target = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  return Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export async function GET(_req, { params }) {
  if (!stripeConfigured()) {
    return redirectTo('/booking/link-problem?reason=unavailable');
  }

  const result = readPayToken(params.token);
  if (!result.ok) {
    return redirectTo(`/booking/link-problem?reason=${encodeURIComponent(result.error)}`);
  }

  const { booking } = result;

  try {
    const stripe = getStripe();

    /*
     * Authorise now, capture when the work is done — so the customer is only
     * charged for a clean that actually happened, and a cancelled job costs
     * neither side a processing fee.
     *
     * A card authorisation is only valid for 7 days by default (up to 30 with
     * extended authorisation, which needs IC+ pricing). For a job further out
     * than that the hold would lapse before the clean, so those are taken as a
     * normal immediate payment and refunded if the work does not go ahead.
     */
    const lead = daysUntil(booking.date);
    const canHold = lead !== null && lead <= GUARANTEED_HOLD_DAYS;

    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        customer_email: booking.email,
        client_reference_id: booking.reference,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'gbp',
              unit_amount: booking.amountPence,
              product_data: {
                name: `${booking.service} — ${booking.reference}`,
                description: `Cleaning on ${booking.date} at ${booking.time}.`,
              },
            },
          },
        ],
        payment_intent_data: {
          capture_method: canHold ? 'manual' : 'automatic',
          description: `${booking.reference} — ${booking.name}`,
        },
        // Asks for the 30-day window where the account and card network allow
        // it; silently falls back to the standard 7 days when they do not.
        ...(canHold
          ? { payment_method_options: { card: { request_extended_authorization: 'if_available' } } }
          : {}),
        success_url: `${SITE.url}/booking/confirmed?ref=${encodeURIComponent(booking.reference)}`,
        cancel_url: `${SITE.url}/booking/cancelled`,
        metadata: {
          reference: booking.reference,
          customerName: String(booking.name || '').slice(0, 100),
          customerEmail: String(booking.email || '').slice(0, 100),
          service: String(booking.service || '').slice(0, 100),
          cleaningDate: booking.date,
          cleaningTime: booking.time,
          captureMode: canHold ? 'manual' : 'automatic',
        },
      },
      {
        // Repeated clicks on the emailed link reuse the same session.
        idempotencyKey: `pay:${booking.reference}:${booking.amountPence}`,
      }
    );

    return Response.redirect(session.url, 303);
  } catch (error) {
    console.error('Failed to create Checkout Session from pay link:', error);
    return redirectTo('/booking/link-problem?reason=error');
  }
}
