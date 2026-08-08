'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google';
import { CONSENT_EVENT, CONSENT_STORAGE_KEY, DENIED, GRANTED } from '@/lib/consent';

/**
 * Gates Google Analytics behind an explicit opt-in.
 *
 * PECR requires consent before non-essential cookies are set, so the gtag
 * script is not rendered at all until the visitor accepts — nothing is loaded
 * and no cookie is written while the choice is outstanding.
 */
export default function Analytics({ gaId }) {
  // undefined = storage not read yet, null = undecided, else GRANTED / DENIED.
  const [consent, setConsent] = useState(undefined);

  useEffect(() => {
    let stored = null;
    try {
      stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    } catch {
      // Private browsing can throw on access; treat as undecided.
    }
    setConsent(stored === GRANTED || stored === DENIED ? stored : null);
  }, []);

  // Lets the footer link reopen the banner to change a saved choice.
  useEffect(() => {
    const reopen = () => setConsent(null);
    window.addEventListener(CONSENT_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_EVENT, reopen);
  }, []);

  const choose = useCallback((value) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      // Choice simply will not persist; the banner reappears next visit.
    }
    if (value === DENIED) clearAnalyticsCookies();
    setConsent(value);
  }, []);

  // Render nothing until storage has been read, so the markup matches the
  // server output and the banner never flashes for people who already chose.
  if (consent === undefined) return null;

  return (
    <>
      {consent === GRANTED && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      {consent === null ? <ConsentBanner onChoose={choose} /> : null}
    </>
  );
}

/** Removes any _ga cookies left behind when consent is withdrawn. */
function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];

  document.cookie
    .split(';')
    .map((entry) => entry.split('=')[0].trim())
    .filter((name) => name.startsWith('_ga') || name === '_gid')
    .forEach((name) => {
      domains.forEach((domain) => {
        document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      });
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
}

function ConsentBanner({ onChoose }) {
  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-heading"
      aria-describedby="cookie-consent-body"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-slate-200 bg-white p-4 shadow-lift sm:p-5"
    >
      <div className="mx-auto flex max-w-[1180px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id="cookie-consent-heading" className="text-base font-extrabold text-ink">
            Can we use analytics cookies?
          </h2>
          <p id="cookie-consent-body" className="mt-1 text-sm leading-6 text-ink-muted">
            We would like to measure which pages are useful so we can improve the site. We will only
            set these cookies if you accept. See our{' '}
            <Link href="/privacy" className="font-semibold text-nvg-700 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onChoose(DENIED)}
            className="btn btn-outline !py-2.5"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => onChoose(GRANTED)}
            className="btn btn-primary !py-2.5"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
