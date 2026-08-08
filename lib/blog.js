import { SITE } from '@/lib/site';

/**
 * Post metadata lives here so the index page, sitemap and per-post structured
 * data all read from one list and cannot drift apart.
 */
export const POSTS = [
  {
    slug: 'deep-cleaning-leeds',
    title: 'How Often Should You Deep Clean Your Home in Leeds?',
    description:
      'Find out how often homes in Leeds should be professionally deep cleaned and what a deep clean includes.',
    excerpt: 'Learn when your home needs a professional deep clean and what is included.',
    published: '2025-11-04',
    readingTime: '4 min read',
  },
  {
    slug: 'airbnb-cleaning-yorkshire',
    title: 'Why Airbnb Hosts in Yorkshire Need Professional Cleaning Services',
    description:
      'Professional Airbnb cleaning helps Yorkshire hosts improve guest reviews, reduce complaints and keep properties guest-ready.',
    excerpt: 'How professional turnover cleaning protects your reviews and guest experience.',
    published: '2025-12-02',
    readingTime: '4 min read',
  },
  {
    slug: 'end-of-tenancy-cleaning',
    title: 'What Landlords Expect During End of Tenancy Cleaning',
    description:
      'A clear guide to end of tenancy cleaning expectations for tenants, landlords and letting agents in Leeds and Yorkshire.',
    excerpt: 'A practical guide for tenants, landlords and letting agents.',
    published: '2026-01-15',
    readingTime: '4 min read',
  },
];

export function getPost(slug) {
  return POSTS.find((post) => post.slug === slug);
}

/** BlogPosting + BreadcrumbList structured data for a single article. */
export function articleSchema(post) {
  const url = `${SITE.url}/blog/${post.slug}`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.published,
      dateModified: post.published,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: { '@type': 'Organization', name: SITE.legalName, url: SITE.url },
      publisher: {
        '@type': 'Organization',
        name: SITE.legalName,
        logo: { '@type': 'ImageObject', url: `${SITE.url}/assets/nvg-logo.jpeg` },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE.url}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];
}
