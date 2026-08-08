import { SITE } from '@/lib/site';
import { POSTS } from '@/lib/blog';

/*
 * Dates are pinned per page rather than stamped at request time: reporting
 * every page as just-modified on each crawl devalues the freshness signal.
 */
const PAGES = [
  { path: '', changeFrequency: 'monthly', priority: 1, lastModified: '2026-08-07' },
  { path: '/services', changeFrequency: 'monthly', priority: 0.9, lastModified: '2026-08-07' },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.9, lastModified: '2026-08-07' },
  { path: '/gallery', changeFrequency: 'monthly', priority: 0.7, lastModified: '2026-08-07' },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7, lastModified: '2026-08-07' },
  { path: '/about', changeFrequency: 'yearly', priority: 0.6, lastModified: '2026-08-07' },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.9, lastModified: '2026-08-07' },
  {
    path: '/privacy',
    changeFrequency: 'yearly',
    priority: 0.3,
    lastModified: SITE.legalLastUpdated,
  },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3, lastModified: SITE.legalLastUpdated },
];

export default function sitemap() {
  const staticEntries = PAGES.map(({ path, changeFrequency, priority, lastModified }) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
  }));

  const postEntries = POSTS.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.published),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  // Staff verification pages are deliberately excluded — they are noindex and
  // contain employee personal data.
  return [...staticEntries, ...postEntries];
}
