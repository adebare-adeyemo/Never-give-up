import Link from 'next/link';
import { ShieldCheck, Sparkles, Users, MapPin } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'About NVG Cleaning Services',
  description:
    'Learn about NVG Cleaning Services LTD, a UK-based professional cleaning company focused on reliability and attention to detail.',
  alternates: { canonical: '/about' },
};

const VALUES = [
  [ShieldCheck, 'Reliability', 'We turn up when we say we will, and we do what we agreed.'],
  [Sparkles, 'Attention to detail', 'The corners and edges matter as much as the open floor.'],
  [Users, 'Vetted people', 'Our cleaners are checked, trained and insured before they visit you.'],
  [MapPin, 'Local knowledge', 'We work across Leeds and the wider Yorkshire area.'],
];

export default function About() {
  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-[1180px] px-5">
        <header className="mx-auto max-w-3xl">
          <span className="eyebrow">About us</span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">
            About NVG Cleaning Services
          </h1>
          <p className="mt-6 text-lg leading-8 text-ink-muted">
            {SITE.legalName} is a UK-based professional cleaning company built on reliability,
            professionalism and attention to detail. We help households, landlords, Airbnb hosts and
            businesses keep their spaces clean, fresh and presentable.
          </p>
          <p className="mt-4 text-lg leading-8 text-ink-muted">
            Our mission is simple: provide exceptional cleaning services that improve the
            environment and give clients confidence in their space. Whether you need regular
            domestic cleaning, deep cleaning, an Airbnb turnaround, office cleaning or pressure
            washing, our service can be tailored to your needs.
          </p>
        </header>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([Icon, title, text]) => (
            <li key={title}>
              <Reveal className="card h-full p-6">
                <Icon className="mb-4 text-nvg-700" size={32} aria-hidden="true" />
                <h2 className="text-lg font-extrabold text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-14 rounded-5xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h2 className="text-2xl font-extrabold text-ink">Areas we cover</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
            {SITE.areas.join(', ')} and nearby areas. Not sure if we reach you? Just ask.
          </p>
          <Link href="/contact" className="btn btn-primary mt-6">
            Get a Free Quote
          </Link>
        </div>
      </div>
    </main>
  );
}
