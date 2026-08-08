'use client';

import { CONSENT_EVENT } from '@/lib/consent';

/** Reopens the consent banner so a saved choice can be changed or withdrawn. */
export default function CookieSettingsButton({ className = '' }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}
      className={className}
    >
      Cookie settings
    </button>
  );
}
