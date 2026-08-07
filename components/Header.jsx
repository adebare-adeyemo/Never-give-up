'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, Phone } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/SocialIcons';
import { SITE } from '@/lib/site';

const NAV = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Pricing', '/pricing'],
  ['Results', '/gallery'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape to close, and keep Tab focus inside the drawer while it is open.
  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    // Move focus into the drawer so keyboard users start inside it.
    panelRef.current?.querySelector('a, button')?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between gap-4 px-5">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            aria-label={`${SITE.name} — home`}
          >
            <Image
              src="/assets/nvg-logo.JPG"
              alt=""
              width={52}
              height={52}
              priority
              className="h-[52px] w-[52px] rounded-2xl object-cover shadow-glow"
            />
            <span className="leading-tight">
              <span className="block text-lg font-extrabold text-ink">NVG Cleaning</span>
              <span className="block text-base font-extrabold tracking-wide text-nvg-700">
                Services
              </span>
            </span>
          </Link>

          {/* Desktop navigation — no drawer required on large screens. */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? 'page' : undefined}
                    className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                      isActive(href)
                        ? 'bg-nvg-50 text-nvg-700'
                        : 'text-ink-muted hover:bg-slate-100 hover:text-ink'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={SITE.phoneHref}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-ink hover:text-nvg-700 md:inline-flex"
            >
              <Phone size={18} aria-hidden="true" />
              {SITE.phoneDisplay}
            </a>
            <Link href="/contact" className="btn btn-primary hidden !py-2.5 text-sm sm:inline-flex">
              Get Free Quote
            </Link>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="rounded-2xl border border-slate-300 bg-white p-2.5 text-ink hover:bg-slate-50 lg:hidden"
            >
              <Menu size={26} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer. `invisible` when closed removes its links from the tab order. */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden ${
          open ? 'visible' : 'pointer-events-none invisible'
        }`}
      >
        <div
          onClick={close}
          aria-hidden="true"
          className={`absolute inset-0 bg-slate-900/60 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={`absolute left-0 top-0 flex h-full w-[86%] max-w-[360px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <Image
              src="/assets/nvg-logo.jpeg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={() => {
                close();
                triggerRef.current?.focus();
              }}
              aria-label="Close menu"
              className="rounded-full border border-slate-300 p-2 text-ink hover:bg-slate-50"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-2">
            <ul>
              {NAV.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? 'page' : undefined}
                    className={`flex items-center justify-between border-b border-slate-100 py-4 text-lg font-semibold ${
                      isActive(href) ? 'text-nvg-700' : 'text-ink hover:text-nvg-700'
                    }`}
                  >
                    <span>{label}</span>
                    <ChevronRight size={20} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-slate-200 px-6 py-5">
            <Link href="/contact" className="btn btn-primary w-full">
              Get Free Quote
            </Link>
            <a
              href={SITE.phoneHref}
              className="mt-3 flex items-center justify-center gap-2 text-base font-bold text-ink"
            >
              <Phone size={18} aria-hidden="true" />
              {SITE.phoneDisplay}
            </a>
            <div className="mt-5 flex justify-center gap-6 text-nvg-700">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NVG Cleaning Services on Facebook (opens in a new tab)"
              >
                <FacebookIcon size={24} />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NVG Cleaning Services on Instagram (opens in a new tab)"
              >
                <InstagramIcon size={24} />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
