import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Payment link problem',
  robots: { index: false, follow: false },
};

const REASONS = {
  expired: {
    heading: 'This payment link has expired',
    body: 'Payment links stay valid for 60 days. We can send you a fresh one straight away.',
  },
  'bad-signature': {
    heading: 'This payment link is not valid',
    body: 'The link appears to have been altered or copied incorrectly. Please use the link exactly as it appears in your invoice email.',
  },
  malformed: {
    heading: 'This payment link is not valid',
    body: 'The link looks incomplete — it may have been cut short by your email app. Try clicking it directly from the invoice email.',
  },
  unavailable: {
    heading: 'Online payment is temporarily unavailable',
    body: 'We cannot take card payments at the moment. Please get in touch and we will arrange payment another way.',
  },
  error: {
    heading: 'Something went wrong',
    body: 'We could not open the payment page. Please try again, or contact us and we will help.',
  },
};

export default function LinkProblem({ searchParams }) {
  const reason = REASONS[searchParams?.reason] || REASONS.error;

  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-2xl px-5 text-center">
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">{reason.heading}</h1>
        <p className="mt-4 text-lg leading-8 text-ink-muted">{reason.body}</p>
        <p className="mt-4 text-ink-muted">
          Your booking has not been cancelled and no payment has been taken.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={`mailto:${SITE.email}`} className="btn btn-primary">
            Email us for a new link
          </a>
          <a href={SITE.phoneHref} className="btn btn-outline">
            Call {SITE.phoneDisplay}
          </a>
        </div>

        <Link href="/" className="mt-8 inline-block font-semibold text-nvg-700 underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}
