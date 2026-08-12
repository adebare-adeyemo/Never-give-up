import Link from 'next/link';
import { ArrowRight, CheckCircle2, Plus } from 'lucide-react';
import Reveal from '@/components/Reveal';

export const metadata = {
  title: 'Cleaning Prices',
  description:
    'NVG Cleaning Services pricing for regular domestic cleaning, deep cleaning, Airbnb cleaning, pressure washing and add-ons across Leeds and Yorkshire.',
  alternates: { canonical: '/pricing' },
};

// Every list below runs cheapest first, with custom-quote items last.
const DOMESTIC = [
  [
    'Ironing Service',
    'From £15/hour',
    'Can be added to regular domestic cleaning or booked separately.',
  ],
  [
    'Regular Domestic Cleaning',
    '£20/hour',
    'Minimum booking: 2 hours. Perfect for weekly, bi-weekly or monthly maintenance cleaning.',
  ],
];

const DEEP = [
  ['Studio/1 Bed', 'From £120'],
  ['2 Bedroom', 'From £160'],
  ['3 Bedroom', 'From £250'],
  ['4 Bedroom', 'From £350'],
  ['5+ Bedroom', 'From £500+'],
];

const AIRBNB = [
  ['1 Bedroom Airbnb', 'From £55'],
  ['2 Bedroom Airbnb', 'From £75'],
  ['3 Bedroom Airbnb', 'From £95'],
  ['4+ Bedroom Airbnb', 'Custom Quote'],
];

const PRESSURE = [
  ['Decking Cleaning', 'From £60'],
  ['Patio Cleaning', 'From £70'],
  ['Driveway Cleaning', 'From £80'],
  ['Commercial Exterior', 'Custom Quote'],
];

const ADDONS = [
  ['Ironing Service', 'From £15/hour'],
  ['Inside Fridge', '£20'],
  ['Inside Oven', '£35'],
];

const EXTRAS = [
  'Carpet cleaning',
  'Heavy mould',
  'Pet hair',
  'Upholstery cleaning',
  'Nicotine staining',
  'External windows',
  'Biohazard issues',
  'Balconies',
  'Heavily neglected kitchens / ovens',
];

function PriceCard({ title, children }) {
  return (
    <Reveal className="card h-full p-6">
      <h2 className="text-xl font-extrabold text-ink">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </Reveal>
  );
}

function Row({ name, price, note }) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="font-bold text-ink">{name}</p>
        <p className="font-extrabold text-nvg-700">{price}</p>
      </div>
      {note ? <p className="mt-2 text-sm leading-6 text-ink-muted">{note}</p> : null}
    </li>
  );
}

export default function Pricing() {
  return (
    <main className="section surface-tint">
      <div className="mx-auto max-w-[1180px] px-5">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Transparent pricing</span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">
            Cleaning Prices Built Around Your Needs
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink-muted">
            Use our starting prices as a guide. Final quotes may vary depending on property
            condition, size, accessibility and specific cleaning requirements.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <PriceCard title="Regular Domestic Cleaning">
            {DOMESTIC.map(([name, price, note]) => (
              <Row key={name} name={name} price={price} note={note} />
            ))}
          </PriceCard>
          <PriceCard title="Airbnb Cleaning">
            {AIRBNB.map(([name, price]) => (
              <Row key={name} name={name} price={price} />
            ))}
          </PriceCard>
          <PriceCard title="Pressure Washing">
            {PRESSURE.map(([name, price]) => (
              <Row key={name} name={name} price={price} />
            ))}
          </PriceCard>
          <PriceCard title="Deep Cleaning">
            {DEEP.map(([name, price]) => (
              <Row key={name} name={name} price={price} />
            ))}
          </PriceCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <PriceCard title="Popular Add-ons">
            {ADDONS.map(([name, price]) => (
              <Row key={name} name={name} price={price} />
            ))}
          </PriceCard>

          <Reveal className="card h-full p-6">
            <h2 className="text-xl font-extrabold text-ink">
              Commercial &amp; Restaurant Cleaning
            </h2>
            <p className="mt-4 leading-7 text-ink-muted">
              Office cleaning and restaurant cleaning are priced by custom quote because every space
              has different size, frequency, toilets, kitchen areas and hygiene needs.
            </p>
            <ul className="mt-5 space-y-3 text-ink-muted">
              {[
                'Daily or weekly office cleaning',
                'Restaurant front-of-house cleaning',
                'Deep kitchen and floor degreasing',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="shrink-0 text-nvg-700" size={20} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn btn-primary mt-7">
              Request Free Quote <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <Reveal className="mt-8 rounded-5xl border border-slate-200 bg-nvg-50 p-7">
          <h2 className="text-center text-xl font-extrabold text-ink sm:text-2xl">
            Extras that may increase the price
          </h2>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-nvg-500" />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EXTRAS.map((extra) => (
              <li
                key={extra}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-semibold text-ink"
              >
                <Plus className="shrink-0 text-nvg-700" size={20} aria-hidden="true" />
                <span>{extra}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-ink-subtle">
          All prices are subject to our{' '}
          <Link href="/terms" className="font-semibold text-nvg-700 underline">
            Terms &amp; Conditions
          </Link>
          . Quotations are estimates until confirmed in writing.
        </p>
      </div>
    </main>
  );
}
