/**
 * Single source of truth for business details that appear in metadata,
 * structured data, the header/footer and transactional email.
 */
export const SITE = {
  name: 'NVG Cleaning Services',
  legalName: 'NVG Cleaning Services LTD',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nvgcleaningservices.co.uk',
  // Rendered as a link and read aloud by screen readers, so keep both forms.
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
  },
  // Empty unless a real GA4 measurement ID is supplied — never ship a placeholder.
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  // Used for "last reviewed" dates on the legal pages.
  legalLastUpdated: '2026-08-07',

  /*
   * Statutory identifiers. Each is omitted from the legal pages while blank,
   * so nothing incorrect is ever published — fill these in before go-live.
   *  - companyNumber:   Companies House registration (required on the website
   *                     of a UK limited company).
   *  - icoRegistration: ICO data protection register entry. Most UK businesses
   *                     processing personal data must register and pay the fee.
   *  - vatNumber:       Only if VAT registered.
   */
  companyNumber: '',
  icoRegistration: '',
  vatNumber: '',
};

export function absoluteUrl(path = '') {
  return `${SITE.url}${path}`;
}
