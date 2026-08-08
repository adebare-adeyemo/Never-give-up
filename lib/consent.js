/** Shared constants for analytics consent, imported by both client components. */
export const CONSENT_STORAGE_KEY = 'nvg-analytics-consent';

/** Dispatched on `window` to reopen the banner so a choice can be changed. */
export const CONSENT_EVENT = 'nvg:cookie-settings';

export const GRANTED = 'granted';
export const DENIED = 'denied';
