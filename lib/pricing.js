/**
 * Service catalogue and pricing.
 *
 * Every figure here mirrors the published price list on /pricing. Where that
 * list says "Custom Quote" the service is marked `quoteOnly` and no total is
 * calculated — those bookings are taken as enquiries and priced by hand.
 *
 * This module is the single source of truth for both the booking form and the
 * server, so the options a customer sees and the amount they are charged can
 * never disagree.
 */

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                   */
/* -------------------------------------------------------------------------- */

export const SERVICES = [
  {
    id: 'domestic',
    label: 'Regular Domestic Cleaning — £20/hour',
    // £20/hour, minimum 2 hours.
    hourlyPence: 2000,
    minimumHours: 2,
  },
  {
    id: 'ironing',
    label: 'Ironing Service — from £15/hour',
    // "From £15/hour" — a starting rate, so the total is quoted by hand.
    quoteOnly: true,
  },
  {
    id: 'deep',
    label: 'Deep Cleaning — fixed quote from £120',
    tierLabel: 'Property size',
    tiers: [
      { label: 'Studio/1 Bed — from £120', pence: 12000 },
      { label: '2 Bedroom — from £160', pence: 16000 },
      { label: '3 Bedroom — from £250', pence: 25000 },
      { label: '4 Bedroom — from £350', pence: 35000 },
      { label: '5+ Bedroom — from £500+', pence: 50000 },
    ],
  },
  {
    id: 'airbnb',
    label: 'Airbnb Cleaning — from £55',
    tierLabel: 'Property size',
    tiers: [
      { label: '1 Bedroom Airbnb — from £55', pence: 5500 },
      { label: '2 Bedroom Airbnb — from £75', pence: 7500 },
      { label: '3 Bedroom Airbnb — from £95', pence: 9500 },
      { label: '4+ Bedroom Airbnb — custom quote', quoteOnly: true },
    ],
  },
  {
    id: 'tenancy',
    label: 'End of Tenancy Cleaning — custom quote',
    quoteOnly: true,
  },
  { id: 'office', label: 'Office Cleaning — custom quote', quoteOnly: true },
  { id: 'restaurant', label: 'Restaurant Cleaning — custom quote', quoteOnly: true },
  {
    id: 'pressure',
    label: 'Pressure Washing — from £60',
    tierLabel: 'Surface',
    tiers: [
      { label: 'Decking Cleaning — from £60', pence: 6000 },
      { label: 'Patio Cleaning — from £70', pence: 7000 },
      { label: 'Driveway Cleaning — from £80', pence: 8000 },
      { label: 'Commercial Exterior — custom quote', quoteOnly: true },
    ],
  },
];

/**
 * Add-ons. Only the three with a published price are charged up front; the
 * "extras that may increase the price" on /pricing have no set figure, so they
 * are recorded on the booking and quoted separately.
 */
export const ADDONS = [
  { label: 'Inside Fridge — £20', pence: 2000 },
  { label: 'Inside Oven — £35', pence: 3500 },
  { label: 'Ironing Service — from £15/hour', quoteOnly: true },
  { label: 'Carpet cleaning', quoteOnly: true },
  { label: 'Heavy mould', quoteOnly: true },
  { label: 'Pet hair', quoteOnly: true },
  { label: 'Upholstery cleaning', quoteOnly: true },
  { label: 'Nicotine staining', quoteOnly: true },
  { label: 'External windows', quoteOnly: true },
  { label: 'Biohazard issues', quoteOnly: true },
  { label: 'Balconies', quoteOnly: true },
  { label: 'Heavily neglected kitchens / ovens', quoteOnly: true },
];

export const HOUR_OPTIONS = ['2 hrs', '3 hrs', '4 hrs', '6 hrs', 'Other'];

/** Charged when a booking is cancelled with less than 24 hours' notice. */
export const CANCELLATION = {
  feePence: 5000, // flat £50
  noticeHours: 24,
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

export function formatPence(pence) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
}

export function findService(label) {
  return SERVICES.find((service) => service.label === label);
}

function findTier(service, tierLabel) {
  return service?.tiers?.find((tier) => tier.label === tierLabel);
}

/** Pulls a whole number of hours out of "2 hrs" or a free-typed "3". */
function parseHours(hours, customHours) {
  const source = hours === 'Other' ? customHours : hours;
  const match = String(source || '').match(/\d+(\.\d+)?/);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isFinite(value) && value > 0 ? value : null;
}

/* -------------------------------------------------------------------------- */
/* Quote                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Builds an itemised quote for a booking.
 *
 * @returns {{
 *   quoteOnly: boolean,      // true when the total must be priced by hand
 *   lines: Array<{description: string, pence: number|null, note?: string}>,
 *   totalPence: number,      // 0 when quoteOnly
 *   reason: string           // why it is quote-only, for staff
 * }}
 */
export function calculateQuote({
  service = '',
  deepCleaningSize = '',
  serviceTier = '',
  hours = '',
  customHours = '',
  addons = [],
} = {}) {
  const lines = [];
  const chosen = findService(service);

  if (!chosen) {
    return { quoteOnly: true, lines, totalPence: 0, reason: 'Unrecognised service.' };
  }

  let quoteOnly = Boolean(chosen.quoteOnly);
  let reason = chosen.quoteOnly ? 'This service is priced by custom quote.' : '';

  if (chosen.hourlyPence) {
    const requested = parseHours(hours, customHours);
    const billable = Math.max(requested || 0, chosen.minimumHours);

    if (!requested) {
      quoteOnly = true;
      reason = 'Number of hours not provided.';
    } else {
      lines.push({
        description: `${chosen.label.split('—')[0].trim()} — ${billable} hour${billable === 1 ? '' : 's'} at ${formatPence(chosen.hourlyPence)}/hour`,
        pence: Math.round(chosen.hourlyPence * billable),
        note:
          requested < chosen.minimumHours
            ? `Minimum booking is ${chosen.minimumHours} hours`
            : undefined,
      });
    }
  } else if (chosen.tiers) {
    // Deep cleaning keeps its own field name for backwards compatibility.
    const selected = chosen.id === 'deep' ? deepCleaningSize : serviceTier;
    const tier = findTier(chosen, selected);

    if (!tier) {
      quoteOnly = true;
      reason = `${chosen.tierLabel || 'Option'} not selected.`;
    } else if (tier.quoteOnly) {
      quoteOnly = true;
      reason = 'The selected option is priced by custom quote.';
      lines.push({ description: tier.label, pence: null });
    } else {
      lines.push({ description: tier.label, pence: tier.pence });
    }
  } else if (!chosen.quoteOnly) {
    quoteOnly = true;
    reason = 'No published price for this service.';
  } else {
    lines.push({ description: chosen.label, pence: null });
  }

  // Priced add-ons join the total; unpriced ones are listed for information.
  const selectedAddons = Array.isArray(addons) ? addons : [];
  for (const label of selectedAddons) {
    const addon = ADDONS.find((item) => item.label === label);
    if (!addon) continue;
    if (addon.quoteOnly) {
      lines.push({ description: addon.label, pence: null, note: 'Quoted separately' });
    } else {
      lines.push({ description: addon.label, pence: addon.pence });
    }
  }

  const totalPence = quoteOnly
    ? 0
    : lines.reduce((sum, line) => sum + (typeof line.pence === 'number' ? line.pence : 0), 0);

  return { quoteOnly, lines, totalPence, reason };
}

/**
 * Flat £50 for cancellations inside the notice period, never more than the
 * booking itself.
 *
 * The cap matters twice over: a held authorisation cannot be captured for more
 * than was authorised, and charging more than the service was worth would be a
 * penalty rather than a genuine estimate of loss.
 */
export function cancellationFeePence(totalPence) {
  return Math.min(CANCELLATION.feePence, totalPence);
}
