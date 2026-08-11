import { redirect } from 'next/navigation';
import { readPayToken } from '@/lib/paylink';
import { buildPaymentRequest, takepaymentsConfigured } from '@/lib/takepayments';
import { formatPence } from '@/lib/pricing';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Continue to payment',
  robots: { index: false, follow: false },
};

/*
 * Hands the customer off to the takepayments hosted form.
 *
 * The form is built and hashed server-side and rendered as hidden inputs, then
 * submitted straight to the gateway. Card details are entered on the gateway's
 * own page and never reach this server, which keeps the business at PCI SAQ-A.
 */
export default function PayPage({ params }) {
  if (!takepaymentsConfigured()) {
    redirect('/booking/link-problem?reason=unavailable');
  }

  const result = readPayToken(params.token);
  if (!result.ok) {
    redirect(`/booking/link-problem?reason=${encodeURIComponent(result.error)}`);
  }

  const booking = result.booking;

  const { url, fields } = buildPaymentRequest({
    amountPence: booking.amountPence,
    orderId: booking.reference,
    orderDescription: `${booking.service} on ${booking.date}`,
    customerName: booking.name,
    email: booking.email,
    phone: booking.phone || '',
    callbackUrl: `${SITE.url}/api/takepayments/callback`,
  });

  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-lg px-5 text-center">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">Taking you to payment…</h1>
        <p className="mt-4 text-ink-muted">
          Booking <strong className="text-ink">{booking.reference}</strong> —{' '}
          <strong className="text-ink">{formatPence(booking.amountPence)}</strong>
        </p>

        <form id="tp-form" method="POST" action={url} className="mt-8">
          {Object.entries(fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          {/* Works without JavaScript; the script below just saves a click. */}
          <noscript>
            <p className="mb-4 text-sm text-ink-muted">
              JavaScript is turned off — press the button to continue.
            </p>
          </noscript>
          <button type="submit" className="btn btn-primary w-full">
            Continue to secure payment
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-subtle">
          Payments are processed by takepayments. We never see or store your card details.
        </p>

        <script
          dangerouslySetInnerHTML={{
            __html: "document.getElementById('tp-form').submit();",
          }}
        />
      </div>
    </main>
  );
}
