import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { ArrowRight, CheckCircle2, Plus } from 'lucide-react';

export const metadata = {
  title: 'Cleaning Prices | NVG Cleaning Services',
  description: 'NVG Cleaning Services pricing for regular domestic cleaning, deep cleaning, Airbnb cleaning, pressure washing and add-ons across Leeds and Yorkshire.',
};

const domestic = [
  ['Regular Domestic Cleaning', '£18.50/hour', 'Minimum booking: 2 hours. Perfect for weekly, bi-weekly or monthly maintenance cleaning.'],
  ['Ironing Service', 'From £15/hour', 'Can be added to regular domestic cleaning or booked separately.'],
];

const deep = [
  ['Studio/1 Bed', 'From £120'],
  ['2 Bedroom', 'From £160'],
  ['3 Bedroom', 'From £250'],
  ['4 Bedroom', 'From £350'],
  ['5+ Bedroom', 'From £500+'],
];

const airbnb = [
  ['1 Bedroom Airbnb', 'From £55'],
  ['2 Bedroom Airbnb', 'From £75'],
  ['3 Bedroom Airbnb', 'From £95'],
  ['4+ Bedroom Airbnb', 'Custom Quote'],
];

const pressure = [
  ['Driveway Cleaning', 'From £80'],
  ['Patio Cleaning', 'From £70'],
  ['Decking Cleaning', 'From £60'],
  ['Commercial Exterior', 'Custom Quote'],
];

const addons = [
  ['Inside Fridge', '£20'],
  ['Inside Oven', '£35'],
  ['Ironing Service', 'From £15/hour'],
];

const extras = [
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
    <Reveal className="pricing-card rounded-[28px] border border-slate-200 bg-white p-6 shadow-card">
      <h2 className="text-2xl font-black text-[#0f172a]">{title}</h2>
      <div className="mt-5 space-y-3">{children}</div>
    </Reveal>
  );
}

function Row({ name, price, note }) {
  return (
    <div className="pricing-row rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-black text-[#0f172a]">{name}</p>
        <p className="font-black text-cyan-700">{price}</p>
      </div>
      {note && <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>}
    </div>
  );
}

export default function Pricing() {
  return (
    <main className="blue-section pt-28">
      <section className="section">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-nvg/15 px-4 py-2 text-sm font-black text-nvg">Transparent Pricing</span>
            <h1 className="mt-5 text-4xl font-black text-[#0f172a] sm:text-5xl">Cleaning Prices Built Around Your Needs</h1>
            <p className="mt-5 text-slate-600">Use our starting prices as a guide. Final quotes may vary depending on property condition, size, accessibility and specific cleaning requirements.</p>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <PriceCard title="Regular Domestic Cleaning">{domestic.map(([n, p, t]) => <Row key={n} name={n} price={p} note={t} />)}</PriceCard>
            <PriceCard title="Deep Cleaning">{deep.map(([n, p]) => <Row key={n} name={n} price={p} />)}</PriceCard>
            <PriceCard title="Airbnb Cleaning">{airbnb.map(([n, p]) => <Row key={n} name={n} price={p} />)}</PriceCard>
            <PriceCard title="Pressure Washing">{pressure.map(([n, p]) => <Row key={n} name={n} price={p} />)}</PriceCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <PriceCard title="Popular Add-ons">{addons.map(([n, p]) => <Row key={n} name={n} price={p} />)}</PriceCard>
            <Reveal className="rounded-[28px] border border-cyan-400/20 bg-white p-6 shadow-card">
              <h2 className="text-2xl font-black text-[#0f172a]">Commercial & Restaurant Cleaning</h2>
              <p className="mt-4 leading-7 text-slate-600">Office cleaning and restaurant cleaning are priced by custom quote because every space has different size, frequency, toilets, kitchen areas and hygiene needs.</p>
              <div className="mt-5 space-y-3 text-slate-700">
                <p className="flex gap-2"><CheckCircle2 className="text-nvg" /> Daily or weekly office cleaning</p>
                <p className="flex gap-2"><CheckCircle2 className="text-nvg" /> Restaurant front-of-house cleaning</p>
                <p className="flex gap-2"><CheckCircle2 className="text-nvg" /> Deep kitchen and floor degreasing</p>
              </div>
              <Link href="/contact" className="btn btn-primary mt-7">Request Free Quote <ArrowRight className="ml-2" /></Link>
            </Reveal>
          </div>

          <Reveal className="mt-8 rounded-[28px] border border-cyan-400/20 bg-[#eefaf8] p-6 shadow-card">
            <h2 className="text-center text-2xl font-black text-[#0f172a]">EXTRAS THAT MAY INCREASE THE PRICE</h2>
            <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-nvg" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {extras.map((extra) => (
                <div key={extra} className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-white p-4 font-bold text-[#0f172a]">
                  <Plus className="shrink-0 text-nvg" size={20} />
                  <span>{extra}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
