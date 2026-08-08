import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Booking confirmed',
  // A transactional page with no standalone value to searchers.
  robots: { index: false, follow: false },
};

export default function BookingConfirmed() {
  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-2xl px-5 text-center">
        <CheckCircle2 size={56} className="mx-auto text-nvg-700" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-extrabold text-ink sm:text-4xl">
          Thank you — your deposit is confirmed
        </h1>
        <p className="mt-4 text-lg leading-8 text-ink-muted">
          Your slot is secured and our team will be in touch shortly to confirm the details. A
          receipt has been emailed to you.
        </p>

        <div className="mt-8 rounded-4xl border border-slate-200 bg-slate-50 p-6 text-left">
          <h2 className="text-lg font-extrabold text-ink">What happens next</h2>
          <ol className="mt-4 space-y-3 text-ink-muted">
            <li>
              <strong className="text-ink">1.</strong> We confirm your date and time by email or
              phone.
            </li>
            <li>
              <strong className="text-ink">2.</strong> Our cleaners carry out the work.
            </li>
            <li>
              <strong className="text-ink">3.</strong> We invoice the balance once the job is
              complete — your deposit is deducted from the final price.
            </li>
          </ol>
        </div>

        <p className="mt-8 text-ink-muted">
          Need to change something? Call{' '}
          <a href={SITE.phoneHref} className="font-semibold text-nvg-700 underline">
            {SITE.phoneDisplay}
          </a>{' '}
          or email{' '}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-nvg-700 underline">
            {SITE.email}
          </a>
          . Cancellation terms are in our{' '}
          <Link href="/terms" className="font-semibold text-nvg-700 underline">
            Terms &amp; Conditions
          </Link>
          .
        </p>

        <Link href="/" className="btn btn-primary mt-8">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
