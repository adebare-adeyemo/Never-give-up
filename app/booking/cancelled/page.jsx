import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Payment cancelled',
  robots: { index: false, follow: false },
};

export default function BookingCancelled() {
  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-2xl px-5 text-center">
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Payment cancelled</h1>
        <p className="mt-4 text-lg leading-8 text-ink-muted">
          No payment was taken and nothing has been charged to your card.
        </p>
        <p className="mt-4 text-ink-muted">
          We have still received your enquiry, so our team can get back to you — but your slot is
          not reserved until the deposit is paid.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn btn-primary">
            Try again
          </Link>
          <a href={SITE.phoneHref} className="btn btn-outline">
            Call {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </main>
  );
}
