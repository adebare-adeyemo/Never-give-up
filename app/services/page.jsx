import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';

export const metadata = {
  title: 'Cleaning Services in Leeds and Yorkshire',
  description:
    'Domestic, deep, Airbnb, end of tenancy, office, restaurant and pressure washing cleaning services by NVG Cleaning Services.',
  alternates: { canonical: '/services' },
};

const SERVICES = [
  [
    'Residential Cleaning',
    'Regular home cleaning, kitchen cleaning, bathroom wipe-down, dusting, vacuuming and mopping.',
  ],
  [
    'Deep Cleaning',
    'A detailed clean for neglected areas, appliances, skirting boards, bathrooms and kitchens.',
  ],
  [
    'Airbnb Turnover Cleaning',
    'Fast guest-ready cleaning, linen change, towel replacement, restocking and staging.',
  ],
  ['Commercial Cleaning', 'Office and business cleaning packages tailored to your needs.'],
  [
    'Restaurant Cleaning',
    'Front-of-house cleaning, after-hours cleaning, floor degreasing and kitchen deep cleaning options.',
  ],
  ['Pressure Washing', 'Driveways, patios, decking and commercial exterior cleaning.'],
];

export default function Services() {
  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-[1180px] px-5">
        <header className="max-w-2xl">
          <span className="eyebrow">Services</span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">Cleaning Services</h1>
          <p className="mt-4 text-lg leading-8 text-ink-muted">
            Choose a full property clean or request cleaning for specific rooms, sections or problem
            areas. We tailor our service to your needs.
          </p>
        </header>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {SERVICES.map(([title, text]) => (
            <li key={title}>
              <Reveal className="card flex h-full flex-col p-7">
                <h2 className="text-xl font-extrabold text-ink">{title}</h2>
                <p className="mt-3 flex-1 leading-7 text-ink-muted">{text}</p>
                <Link href="/contact" className="btn btn-primary mt-6 self-start">
                  Request Quote <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
