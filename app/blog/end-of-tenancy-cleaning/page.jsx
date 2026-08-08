import ArticleLayout from '@/components/ArticleLayout';
import { getPost } from '@/lib/blog';

const post = getPost('end-of-tenancy-cleaning');

export const metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: { type: 'article', publishedTime: post.published, title: post.title },
};

export default function Post() {
  return (
    <ArticleLayout post={post}>
      <p>
        Moving out of a rented property can feel stressful, and one of the biggest concerns for
        tenants is getting their deposit back.
      </p>
      <p>
        One of the main reasons deposits are reduced is poor cleaning. Landlords and letting agents
        usually expect the property to be returned in clean condition, ready for the next tenant.
      </p>

      <h2>What is usually included?</h2>
      <ul>
        <li>Deep kitchen cleaning and degreasing</li>
        <li>Bathroom descaling and sanitisation</li>
        <li>Vacuuming and mopping throughout</li>
        <li>Dust removal and cobweb clearance</li>
        <li>Interior window cleaning</li>
        <li>Appliance exterior cleaning</li>
        <li>Surface sanitisation and skirting board cleaning</li>
      </ul>

      <h2>What landlords tend to check</h2>
      <p>
        Some landlords may also inspect grease buildup, bathroom mould, carpet condition, kitchen
        appliances, limescale and lingering odours. Comparing the property against the original
        inventory report is common, so it is worth checking that document before your final clean.
      </p>
      <p>
        At NVG Cleaning Services, we provide thorough end of tenancy cleaning across Leeds and
        surrounding Yorkshire areas to help tenants, landlords and letting agents prepare properties
        properly.
      </p>
    </ArticleLayout>
  );
}
