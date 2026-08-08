import Stripe from 'stripe';

/**
 * Lazily constructed Stripe client.
 *
 * Built on first use rather than at module load so the site still builds and
 * runs with no Stripe keys configured — same pattern as the SMTP settings.
 */
let client;

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  if (!stripeConfigured()) {
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }
  if (!client) {
    // apiVersion is deliberately not set: the SDK pins the API version it was
    // built against, and overriding it with an older string risks the client
    // and the API disagreeing. Upgrade the version by upgrading the package.
    client = new Stripe(process.env.STRIPE_SECRET_KEY, {
      appInfo: { name: 'NVG Cleaning Services', url: 'https://nvgcleaningservices.co.uk' },
    });
  }
  return client;
}
