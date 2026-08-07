import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/SocialIcons';
import CookieSettingsButton from '@/components/CookieSettingsButton';
import { SITE } from '@/lib/site';

const SERVICES = [
  ['Domestic Cleaning', '/services'],
  ['Deep Cleaning', '/services'],
  ['Airbnb Cleaning', '/services'],
  ['End of Tenancy Cleaning', '/services'],
  ['Commercial Cleaning', '/services'],
  ['Pressure Washing', '/services'],
];

const COMPANY = [
  ['About Us', '/about'],
  ['Pricing', '/pricing'],
  ['Before & After Gallery', '/gallery'],
  ['Cleaning Blog', '/blog'],
  ['Book a Clean', '/contact'],
];

const LEGAL = [
  ['Privacy Policy', '/privacy'],
  ['Terms & Conditions', '/terms'],
];

function ColumnHeading({ children }) {
  return (
    <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-nvg-300">{children}</h3>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-slate-300">
      {/* ---------- Main columns ---------- */}
      <div className="mx-auto max-w-[1180px] px-5 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="lg:pr-6">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/nvg-logo.jpeg"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-xl object-cover"
              />
              <span className="leading-tight">
                <span className="block text-base font-extrabold text-white">NVG Cleaning</span>
                <span className="block text-sm font-extrabold tracking-wide text-nvg-300">
                  Services
                </span>
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              Professional cleaning for homes, landlords, Airbnb hosts and businesses across Leeds
              and the wider Yorkshire area.
            </p>

            <ul className="mt-6 flex gap-3" aria-label="Social media">
              <li>
                <a
                  href={SITE.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${SITE.name} on Facebook (opens in a new tab)`}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-nvg-700"
                >
                  <FacebookIcon size={18} />
                </a>
              </li>
              <li>
                <a
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${SITE.name} on Instagram (opens in a new tab)`}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-nvg-700"
                >
                  <InstagramIcon size={18} />
                </a>
              </li>
              <li>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message NVG Cleaning Services on WhatsApp (opens in a new tab)"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-nvg-700"
                >
                  <WhatsAppIcon size={18} />
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <ColumnHeading>Services</ColumnHeading>
            <ul className="mt-5 space-y-3">
              {SERVICES.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-slate-300 transition hover:text-nvg-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <ColumnHeading>Company</ColumnHeading>
            <ul className="mt-5 space-y-3">
              {COMPANY.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-slate-300 transition hover:text-nvg-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <ColumnHeading>Get in touch</ColumnHeading>
            <ul className="mt-5 space-y-4">
              <li className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-nvg-300" aria-hidden="true" />
                <a
                  href={SITE.phoneHref}
                  className="text-sm font-semibold text-white transition hover:text-nvg-300"
                >
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-nvg-300" aria-hidden="true" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="break-all text-sm text-slate-300 transition hover:text-nvg-300"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-nvg-300" aria-hidden="true" />
                <address className="text-sm not-italic leading-6 text-slate-300">
                  {SITE.address.street}
                  <br />
                  {SITE.address.locality} {SITE.address.postcode}
                </address>
              </li>
              <li className="flex gap-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-nvg-300"
                  aria-hidden="true"
                />
                <span className="text-sm leading-6 text-slate-300">Free, no-obligation quotes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ---------- Areas served ---------- */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-3 gap-y-2 px-5 py-6">
          <span className="text-sm font-bold text-white">Areas we cover:</span>
          <span className="text-sm text-slate-400">{SITE.areas.join(' · ')}</span>
        </div>
      </div>

      {/* ---------- Legal bar ---------- */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">
            © {year} {SITE.legalName}. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {LEGAL.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 transition hover:text-nvg-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {/* Only meaningful when analytics is configured and can be consented to. */}
              {SITE.gaId ? (
                <li>
                  <CookieSettingsButton className="text-sm text-slate-400 transition hover:text-nvg-300" />
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
