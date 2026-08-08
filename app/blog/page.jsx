import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { POSTS } from '@/lib/blog';

export const metadata = {
  title: 'Cleaning Blog',
  description:
    'Cleaning tips, Airbnb cleaning advice, deep cleaning guides and end of tenancy cleaning help from NVG Cleaning Services.',
  alternates: { canonical: '/blog' },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Blog() {
  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-[1180px] px-5">
        <header className="max-w-2xl">
          <span className="eyebrow">Blog</span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">Cleaning Blog</h1>
          <p className="mt-4 text-lg leading-8 text-ink-muted">
            Practical cleaning advice for homeowners, tenants, landlords and Airbnb hosts across
            Leeds and Yorkshire.
          </p>
        </header>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Reveal className="h-full">
                <article className="card relative flex h-full flex-col p-7 transition hover:-translate-y-1 hover:shadow-lift">
                  <p className="flex flex-wrap items-center gap-x-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                    <time dateTime={post.published}>{formatDate(post.published)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime}</span>
                  </p>
                  <h2 className="mt-3 text-xl font-extrabold leading-snug text-ink">
                    <Link href={`/blog/${post.slug}`} className="hover:text-nvg-700">
                      {/* Stretched link keeps the whole card clickable without nesting anchors. */}
                      <span className="absolute inset-0" aria-hidden="true" />
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">{post.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-bold text-nvg-700">
                    Read article <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
