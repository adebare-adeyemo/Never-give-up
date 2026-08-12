/** Business details used across metadata, structured data, pages and email. */
export const SITE = {
  name: 'NVG Cleaning Services',
  legalName: 'NVG Cleaning Services LTD',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nvgcleaningservices.co.uk',
  phoneDisplay: '0333 034 7101',
  phoneHref: 'tel:+443330347101',
  whatsapp: 'https://wa.me/443330347101',
  email: 'booking@nvgcleaningservices.co.uk',
  address: {
    street: '36 Dawlish Mount',
    locality: 'Leeds',
    postcode: 'LS9 9DZ',
    country: 'GB',
  },
  areas: ['Leeds', 'York', 'Bradford', 'Wakefield', 'Harrogate', 'Yorkshire'],
  social: {
    facebook: 'https://www.facebook.com/share/17jNNdiyoM/',
    instagram: 'https://www.instagram.com/nvgcleaningservices',
    google: '', // Business Profile URL; the home page rating links here when set
  },

  // Home page figures. Blank ones are replaced by non-numeric trust signals.
  stats: {
    googleRating: '5.0',
    googleReviews: '', // e.g. '38'
    clients: '', // e.g. '124'
    jobs: '', // e.g. '318'
    since: '', // e.g. '2021'
  },

  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  legalLastUpdated: '2026-08-07',

  // Omitted from the legal pages while blank.
  companyNumber: '',
  icoRegistration: '',
  vatNumber: '',
};

export function absoluteUrl(path = '') {
  return `${SITE.url}${path}`;
}
