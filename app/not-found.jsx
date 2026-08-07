import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

const SUGGESTIONS = [
  ['Services', '/services'],
  ['Pricing', '/pricing'],
  ['Before & After Gallery', '/gallery'],
  ['Book a Clean', '/contact'],
];

export default function NotFound() {
  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-2xl px-5 text-center">
        <p className="text-6xl font-extrabold text-nvg-700">404</p>
        <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
          We couldn&rsquo;t find that page
        </h1>
        <p className="mt-4 text-lg leading-8 text-ink-muted">
          The page may have moved or no longer exists. Try one of the links below, or call us on{' '}
          <a href={SITE.phoneHref} className="font-semibold text-nvg-700 underline">
            {SITE.phoneDisplay}
          </a>
          .
        </p>

        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {SUGGESTIONS.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="btn btn-outline">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/" className="btn btn-primary mt-8">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
