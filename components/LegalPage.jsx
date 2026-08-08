import { SITE } from '@/lib/site';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Shared shell for the Privacy Policy and Terms & Conditions so both pages get
 * the same heading hierarchy, measure and "last updated" treatment.
 */
export default function LegalPage({ title, intro, updated = SITE.legalLastUpdated, children }) {
  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-3xl px-5">
        <header className="border-b border-slate-200 pb-8">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">{title}</h1>
          {intro ? <p className="mt-4 text-lg leading-8 text-ink-muted">{intro}</p> : null}
          <p className="mt-6 text-sm text-ink-subtle">
            Last updated: <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
        </header>

        <div className="prose prose-slate prose-nvg mt-10 max-w-none prose-headings:font-extrabold prose-h2:mt-12 prose-h2:scroll-mt-28 prose-h2:text-2xl prose-h3:text-lg prose-a:font-semibold prose-th:text-left">
          {children}
        </div>
      </div>
    </main>
  );
}
