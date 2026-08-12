import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import GalleryGrid from '@/components/GalleryGrid';
import { WhatsAppIcon } from '@/components/SocialIcons';
import { SITE } from '@/lib/site';
import {
  Home as HomeIcon,
  Sparkles,
  Building2,
  CalendarCheck,
  ShieldCheck,
  BadgeCheck,
  ThumbsUp,
  Star,
  Phone,
  ArrowRight,
  ClipboardCheck,
} from 'lucide-react';

const SERVICES = [
  {
    title: 'Domestic Cleaning',
    icon: HomeIcon,
    img: 'nvg-team-cleaning-kitchen.webp',
    text: 'Regular home cleaning tailored to your routine and the rooms you want cleaned.',
  },
  {
    title: 'Deep Cleaning',
    icon: Sparkles,
    img: 'toaster-cleaning-before-after.webp',
    text: 'Detailed cleaning for kitchens, bathrooms, appliances, floors and neglected corners.',
  },
  {
    title: 'Airbnb Cleaning',
    icon: CalendarCheck,
    img: 'bedroom-deep-cleaning-leeds-before-after.webp',
    text: 'Guest-ready turnover cleaning with linen, towels, staging and restocking options.',
  },
  {
    title: 'End of Tenancy Cleaning',
    icon: ClipboardCheck,
    img: 'end-of-tenancy-room-cleaning-before-after.webp',
    text: 'Move-out cleaning for tenants, landlords and letting agents across Yorkshire.',
  },
  {
    title: 'Commercial Cleaning',
    icon: Building2,
    img: 'oven-cleaning-leeds-before-after.webp',
    text: 'Office, restaurant and business cleaning packages tailored to your needs.',
  },
];

const PRICING_PREVIEW = [
  ['Regular Domestic Cleaning', '£20/hour', 'Minimum booking: 2 hours'],
  ['Deep Cleaning', 'From £120', 'Studio/1 bed starting price'],
  ['Airbnb Cleaning', 'From £55', 'Guest-ready turnover cleaning'],
  ['Pressure Washing', 'From £60', 'Decking, patio and driveway options'],
];

const WHY_US = [
  [ShieldCheck, 'Trusted & Reliable', 'We turn up on time and get the job done.'],
  [Sparkles, 'Attention to Detail', 'We clean every corner to a high standard.'],
  [Phone, 'Flexible & Affordable', 'Services tailored to your needs and budget.'],
  [ThumbsUp, 'Satisfaction Guaranteed', 'Happy customers are our priority.'],
];

const REVIEWS = [
  [
    'Akinro Olubunmi',
    'I recently used this cleaning company and I was very impressed with their service. The team was professional, punctual, and paid attention to every detail. They did an excellent job cleaning my space, leaving everything spotless and fresh.',
  ],
  [
    'Billie Morris',
    'I had a great experience with Never Give Up Cleaning Services Ltd. Bami is easy to communicate with, arrived on time, and did an amazing job cleaning my home. Bami is respectful, efficient, and paid attention to small details.',
  ],
  [
    'Itohan Odekunle',
    'An excellent cleaning service. Bami always delivers exceptional results and is extremely personable!',
  ],
  [
    'Raj Bharath',
    'Bami is an excellent cleaner with very high standards, very polite and always does a great job. I would recommend him to anyone.',
  ],
  [
    'Jennifer Williams',
    'I’ve been with NGU Cleaning for some time now. What a joy my cleaner is. Polite, professional and does an excellent job. Highly recommend and a greatly appreciated service.',
  ],
  [
    'Kathryn',
    'Bamidele was so courteous, professional and thorough. He did such a great job deep cleaning our new home and work space.',
  ],
];

// Service cards render in a 1/2/3-column grid.
const CARD_SIZES = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw';

export const metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CleaningService',
    name: SITE.legalName,
    image: `${SITE.url}/assets/nvg-logo.jpeg`,
    telephone: SITE.phoneDisplay,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      postalCode: SITE.address.postcode,
      addressCountry: SITE.address.country,
    },
    areaServed: SITE.areas,
    url: SITE.url,
    priceRange: '££',
    sameAs: [SITE.social.instagram, SITE.social.facebook, SITE.social.google].filter(Boolean),
  };

  /*
   * Trust bar.
   *
   * Counts come from SITE.stats and appear only when a real figure has been
   * entered. Whatever is missing is made up by claims that are true by
   * construction — insurance, vetting, free quotes — rather than by a round
   * number that cannot be evidenced if the ASA asks.
   */
  const { stats } = SITE;
  const trustSignals = [
    {
      icon: BadgeCheck,
      value: `${stats.googleRating}★`,
      label: stats.googleReviews ? `From ${stats.googleReviews} Google reviews` : 'Google rating',
      href: SITE.social.google || undefined,
    },
    stats.jobs && { icon: HomeIcon, value: stats.jobs, label: 'Cleans completed' },
    stats.clients && { icon: Star, value: stats.clients, label: 'Regular clients' },
    stats.since && { icon: CalendarCheck, value: stats.since, label: 'Cleaning since' },
    { icon: ShieldCheck, value: 'Insured', label: 'Public liability cover' },
    { icon: ClipboardCheck, value: 'Vetted', label: 'Right-to-work checked' },
    { icon: ThumbsUp, value: 'Free', label: 'No-obligation quotes' },
  ]
    .filter(Boolean)
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ---------- Hero ---------- */}
      <section className="hero-surface relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/nvg-team-cleaning-kitchen.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Scrim keeps hero text above 4.5:1 against the photo. */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[1180px] items-center px-5 py-20 lg:min-h-[calc(100dvh-var(--header-h))]">
          <Reveal className="max-w-2xl">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              Reliable • Professional • Detail-focused
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Professional <span className="text-nvg-300">Cleaning</span> Services You Can Trust
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              We help homes, landlords, Airbnb hosts and businesses keep their spaces fresh, clean
              and guest-ready across Leeds and Yorkshire.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Book Now
              </Link>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <WhatsAppIcon size={20} />
                WhatsApp Us
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-200">
              <li>✓ Reliable</li>
              <li>✓ Trained Cleaners</li>
              <li>✓ Satisfaction Guaranteed</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- Trust bar ---------- */}
      <section aria-label="At a glance" className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-px overflow-hidden px-5 py-10 md:grid-cols-4">
          {trustSignals.map(({ icon: Icon, value, label, href }) => (
            <div key={label} className="px-3 text-center">
              <Icon className="mx-auto mb-2 text-nvg-700" aria-hidden="true" />
              <p className="text-2xl font-extrabold text-ink sm:text-3xl">{value}</p>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-nvg-700 underline underline-offset-2"
                >
                  {label}
                </a>
              ) : (
                <p className="text-sm font-semibold text-ink-subtle">{label}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="section surface-tint">
        <div className="mx-auto max-w-[1180px] px-5">
          <Reveal className="text-center">
            <span className="eyebrow">Our Services</span>
            <h2 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">
              Cleaning Services <span className="text-nvg-700">We Offer</span>
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ title, icon: Icon, img, text }) => (
              <li key={title}>
                <Reveal className="group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-4xl border border-slate-200 shadow-card">
                  <Image
                    src={`/assets/${img}`}
                    alt=""
                    fill
                    sizes={CARD_SIZES}
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/75 to-navy/25" />
                  <div className="relative z-10 p-6">
                    <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-nvg-300 backdrop-blur">
                      <Icon size={26} aria-hidden="true" />
                    </span>
                    <h3 className="text-xl font-extrabold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Pricing preview ---------- */}
      <section className="section bg-white">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <span className="eyebrow">Pricing</span>
              <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
                Clear Starting Prices
              </h2>
              <p className="mt-3 max-w-2xl text-ink-muted">
                Prices may vary depending on property condition, size, accessibility and specific
                cleaning requirements.
              </p>
            </Reveal>
            <Link href="/pricing" className="btn btn-outline">
              View Full Pricing <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PRICING_PREVIEW.map(([name, price, note]) => (
              <li key={name}>
                <Reveal className="card h-full p-6">
                  <h3 className="text-lg font-extrabold text-ink">{name}</h3>
                  <p className="mt-4 text-2xl font-extrabold text-nvg-700">{price}</p>
                  <p className="mt-3 text-sm leading-6 text-ink-muted">{note}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Why us ---------- */}
      <section className="section surface-soft">
        <div className="mx-auto max-w-[1180px] px-5">
          <Reveal className="text-center">
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
              Why Choose <span className="text-nvg-700">NVG Cleaning?</span>
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map(([Icon, title, text]) => (
              <li key={title}>
                <Reveal className="card h-full p-6 text-center">
                  <Icon className="mx-auto mb-4 text-nvg-700" size={36} aria-hidden="true" />
                  <h3 className="font-extrabold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Gallery ---------- */}
      <section className="section bg-white">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <span className="eyebrow">Our Work</span>
              <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
                Cleaning Results That Speak for Themselves
              </h2>
            </Reveal>
            <Link href="/gallery" className="btn btn-outline">
              View More Results <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <GalleryGrid />
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section id="testimonials" className="section surface-tint">
        <div className="mx-auto max-w-[1180px] px-5">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Testimonials</span>
              <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
                What Our <span className="text-nvg-700">Clients Say</span>
              </h2>
            </div>
            <div className="card p-5">
              <p className="text-lg font-extrabold text-ink">
                Google Reviews <span className="text-star">{SITE.stats.googleRating} ★★★★★</span>
              </p>
              <p className="mt-1 text-sm text-ink-subtle">
                {SITE.social.google ? (
                  <a
                    href={SITE.social.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-nvg-700 underline underline-offset-2"
                  >
                    Read our reviews on Google
                  </a>
                ) : (
                  'Based on recent Google customer feedback.'
                )}
              </p>
            </div>
          </Reveal>

          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map(([name, text]) => (
              <li key={name}>
                <Reveal className="card h-full p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xl text-star" aria-label="Rated 5 out of 5">
                      <span aria-hidden="true">★★★★★</span>
                    </p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-ink-muted">
                      Google
                    </span>
                  </div>
                  <blockquote className="mt-5 leading-7 text-ink-muted">“{text}”</blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 place-items-center rounded-full bg-nvg-700 font-extrabold text-white"
                    >
                      {name[0]}
                    </span>
                    <div>
                      <p className="font-bold text-ink">{name}</p>
                      <p className="text-xs text-ink-subtle">Google Review</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="section bg-white">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="flex flex-col items-center justify-between gap-6 rounded-5xl border border-slate-200 bg-slate-50 p-8 text-center md:flex-row md:text-left">
            <Image
              src="/assets/nvg-logo.jpeg"
              alt=""
              width={80}
              height={80}
              className="h-20 w-20 rounded-3xl object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
                Ready for a Spotless Space?
              </h2>
              <p className="mt-2 text-ink-muted">Get a free, no-obligation quote today.</p>
            </div>
            <Link href="/contact" className="btn btn-primary">
              Get Free Quote <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
