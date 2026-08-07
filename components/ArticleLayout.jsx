import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { articleSchema } from '@/lib/blog';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Shared shell for blog posts: breadcrumbs, prose styling and Article schema. */
export default function ArticleLayout({ post, children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(post)) }}
      />

      <main className="section bg-white">
        <article className="mx-auto max-w-3xl px-5">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-subtle">
              <li>
                <Link href="/" className="hover:text-nvg-700">
                  Home
                </Link>
              </li>
              <ChevronRight size={14} aria-hidden="true" />
              <li>
                <Link href="/blog" className="hover:text-nvg-700">
                  Blog
                </Link>
              </li>
            </ol>
          </nav>

          <header className="border-b border-slate-200 pb-8">
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-subtle">
              <time dateTime={post.published}>{formatDate(post.published)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}</span>
            </p>
          </header>

          <div className="prose prose-slate prose-nvg mt-10 max-w-none prose-headings:font-extrabold prose-h2:mt-10 prose-h2:text-2xl prose-a:font-semibold">
            {children}
          </div>

          <aside className="mt-14 rounded-4xl border border-slate-200 bg-slate-50 p-7 text-center">
            <h2 className="text-xl font-extrabold text-ink">Need a professional clean?</h2>
            <p className="mt-2 text-ink-muted">
              Get a free, no-obligation quote for your home or business.
            </p>
            <Link href="/contact" className="btn btn-primary mt-5">
              Get Free Quote
            </Link>
          </aside>
        </article>
      </main>
    </>
  );
}
