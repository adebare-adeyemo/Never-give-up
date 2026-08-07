import { Phone, MapPin } from 'lucide-react';
import BookingForm from '@/components/BookingForm';
import { WhatsAppIcon } from '@/components/SocialIcons';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Book Cleaning Service',
  description:
    'Book NVG Cleaning Services or request a free cleaning quote across Leeds and Yorkshire.',
  alternates: { canonical: '/contact' },
};

export default function Contact() {
  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-[1180px] px-5">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <span className="eyebrow">Contact</span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">
            Book a Cleaning Service
          </h1>
          <p className="mt-4 text-lg leading-8 text-ink-muted">
            Fill in the form below and we will reply from{' '}
            <a className="font-semibold text-nvg-700 underline" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            .
          </p>
        </header>

        <div className="mx-auto max-w-5xl">
          <BookingForm />
        </div>

        <ul className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-3">
          <li>
            <div className="card h-full p-6">
              <WhatsAppIcon size={28} className="text-nvg-700" />
              <h2 className="mt-4 text-lg font-extrabold text-ink">Message on WhatsApp</h2>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Quick response and easy booking support.
              </p>
              <a
                className="btn btn-primary mt-5"
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>
          </li>
          <li>
            <div className="card h-full p-6">
              <Phone size={28} className="text-nvg-700" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-extrabold text-ink">Call Us</h2>
              <p className="mt-2 text-sm leading-6 text-ink-muted">Speak directly with our team.</p>
              <a className="btn btn-outline mt-5" href={SITE.phoneHref}>
                {SITE.phoneDisplay}
              </a>
            </div>
          </li>
          <li>
            <div className="card h-full p-6">
              <MapPin size={28} className="text-nvg-700" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-extrabold text-ink">Areas We Cover</h2>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                {SITE.areas.join(', ')} and nearby Yorkshire areas.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
}
