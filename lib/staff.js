/**
 * Cleaner verification profiles.
 *
 * These pages are linked from printed QR badges, so the route segments must
 * never change — renaming one would break every badge already in circulation.
 * They are all `noindex` because they contain employee personal data.
 */
export const CLEANERS = {
  'nvg-cln-001-susan-bello-8f4k29x': {
    id: 'NVG-CLN-001',
    name: 'Susan Bello',
    photo: '/cleaners/susan-bello.jpg',
    qr: '/qr/susan-bello-qr.png',
    verifications: [
      'Identity Verified',
      'Address Verified',
      'Right To Work Verified',
      'NVG Approved Cleaner',
      'Covered Under NVG Insurance',
    ],
    services: [
      'Regular Domestic Cleaning',
      'Deep Cleaning',
      'Airbnb Cleaning',
      'End Of Tenancy Cleaning',
      'Ironing Services',
      'General Housekeeping',
    ],
  },
  'nvg-cln-002-esosa-tamara-bello': {
    id: 'NVG-CLN-002',
    name: 'Esosa Tamara Bello',
    photo: '/cleaners/esosa-tamara-bello.jpg',
    qr: '/qr/esosa-tamara-bello-qr.png',
    verifications: [
      'Identity Verified',
      'Right To Work Verified',
      'NVG Approved Cleaner',
      'Covered Under NVG Insurance',
    ],
    services: [],
  },
  'nvg-cln-003-oluwatobi-bakare': {
    id: 'NVG-CLN-003',
    name: 'Oluwatobi Bakare',
    photo: '/cleaners/oluwatobi-bakare.jpg',
    qr: '/qr/oluwatobi-bakare-qr.png',
    verifications: [
      'Identity Verified',
      'Right To Work Verified',
      'NVG Approved Cleaner',
      'Covered Under NVG Insurance',
    ],
    services: [],
  },
  'nvg-cln-004-chinwike-godswill': {
    id: 'NVG-CLN-004',
    name: 'Chinwike Godswill',
    photo: '/cleaners/chinwike-godswill.jpg',
    qr: '/qr/chinwike-godswill-qr.png',
    verifications: [
      'Identity Verified',
      'Right To Work Verified',
      'NVG Approved Cleaner',
      'Covered Under NVG Insurance',
    ],
    services: [],
  },
};

/** Shared metadata for every staff route — never indexable. */
export function cleanerMetadata(slug) {
  const cleaner = CLEANERS[slug];
  return {
    title: `${cleaner.name} — Cleaner Verification`,
    description: `Verification profile for ${cleaner.name}, cleaner ID ${cleaner.id}.`,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
  };
}
