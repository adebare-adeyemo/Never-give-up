/**
 * Deposit policy.
 *
 * Lives server-side and is keyed off the service name, never off an amount
 * sent by the browser — the client picks a service, the server decides what
 * that costs.
 *
 * Hourly work takes no deposit: a two-hour domestic clean is not worth the
 * friction. Fixed-quote work does, because a missed deep clean or end-of-tenancy
 * slot cannot be resold at short notice.
 */

/** Percentage of the indicative job value taken up front. */
const DEPOSIT_RATE = 0.25;

/** Deposits below this are not worth charging for. */
const MINIMUM_DEPOSIT_PENCE = 5000; // £50

/** Cap so a large commercial quote does not demand an alarming figure up front. */
const MAXIMUM_DEPOSIT_PENCE = 15000; // £150

/*
 * Ceiling on the deposit as a share of the job. The £50 floor would otherwise
 * ask for 91% up front on a £55 Airbnb turnover, so low-value fixed-quote jobs
 * take no deposit at all rather than an unreasonable one.
 */
const MAXIMUM_DEPOSIT_SHARE = 0.5;

/*
 * Indicative job value per service, in pence, matching the starting prices on
 * /pricing. These drive the deposit only — the balance is invoiced at the real
 * price once the work is quoted and completed.
 */
const SERVICE_BASELINES = [
  { match: 'Regular Domestic Cleaning', baseline: null }, // hourly, no deposit
  { match: 'Ironing Service', baseline: null }, // hourly, no deposit
  { match: 'Deep Cleaning', baseline: 12000 },
  { match: 'Airbnb Cleaning', baseline: 5500 },
  { match: 'End of Tenancy Cleaning', baseline: 20000 },
  { match: 'Office Cleaning', baseline: 20000 },
  { match: 'Restaurant Cleaning', baseline: 20000 },
  { match: 'Pressure Washing', baseline: 6000 },
];

/*
 * Deep cleans are quoted by property size, so use the selected tier rather than
 * the headline "from" price. Keys match the option labels in the booking form.
 */
const DEEP_CLEANING_BASELINES = [
  { match: 'Studio/1 Bed', baseline: 12000 },
  { match: '2 Bedroom', baseline: 16000 },
  { match: '3 Bedroom', baseline: 25000 },
  { match: '4 Bedroom', baseline: 35000 },
  { match: '5+ Bedroom', baseline: 50000 },
];

function findBaseline(list, value) {
  if (!value) return undefined;
  return list.find((entry) => value.includes(entry.match));
}

/**
 * Works out the deposit for a booking.
 *
 * @returns {{required: boolean, amountPence: number, baselinePence: number|null, label: string}}
 */
export function calculateDeposit({ service = '', deepCleaningSize = '' } = {}) {
  const none = { required: false, amountPence: 0, baselinePence: null, label: '' };

  const entry = findBaseline(SERVICE_BASELINES, service);
  if (!entry || entry.baseline === null) return none;

  let baseline = entry.baseline;

  if (entry.match === 'Deep Cleaning') {
    const tier = findBaseline(DEEP_CLEANING_BASELINES, deepCleaningSize);
    if (tier) baseline = tier.baseline;
  }

  const raw = Math.round(baseline * DEPOSIT_RATE);
  const amountPence = Math.min(Math.max(raw, MINIMUM_DEPOSIT_PENCE), MAXIMUM_DEPOSIT_PENCE);

  // Never ask for a disproportionate share of a low-value job up front.
  if (amountPence > baseline * MAXIMUM_DEPOSIT_SHARE) return none;

  return {
    required: true,
    amountPence,
    baselinePence: baseline,
    label: formatPence(amountPence),
  };
}

export function formatPence(pence) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
}

export const DEPOSIT_POLICY = {
  rate: DEPOSIT_RATE,
  minimumPence: MINIMUM_DEPOSIT_PENCE,
  maximumPence: MAXIMUM_DEPOSIT_PENCE,
};
