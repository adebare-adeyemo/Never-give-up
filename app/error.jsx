'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';

/** Route-level error boundary. Never renders the raw error to the visitor. */
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled route error:', error);
  }, [error]);

  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-2xl px-5 text-center">
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Something went wrong</h1>
        <p className="mt-4 text-lg leading-8 text-ink-muted">
          Sorry — this page failed to load. Please try again, or contact us directly and we will
          help.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-outline">
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-ink-muted">
          Call{' '}
          <a href={SITE.phoneHref} className="font-semibold text-nvg-700 underline">
            {SITE.phoneDisplay}
          </a>{' '}
          or email{' '}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-nvg-700 underline">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
