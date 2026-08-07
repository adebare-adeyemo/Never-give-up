import ArticleLayout from '@/components/ArticleLayout';
import { getPost } from '@/lib/blog';

const post = getPost('deep-cleaning-leeds');

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
        Many people keep up with regular cleaning but still notice dust building up, hidden dirt,
        stains, or unpleasant smells over time. That is because regular cleaning and deep cleaning
        are not the same thing.
      </p>
      <p>
        A deep clean goes beyond surface cleaning. It targets areas often missed during weekly
        maintenance cleaning, including skirting boards, behind appliances, grout lines, inside
        cupboards, bathroom buildup, and hidden dust areas.
      </p>

      <h2>How often is often enough?</h2>
      <p>
        For most homes in Leeds, professional deep cleaning is recommended every three to six months
        depending on the number of occupants, pets, children, allergies, lifestyle habits and
        property size.
      </p>
      <p>
        Homes with pets or young children may require deep cleaning more frequently because dirt,
        bacteria and allergens build up faster.
      </p>

      <h2>What can be included?</h2>
      <ul>
        <li>Kitchen degreasing and appliance exterior cleaning</li>
        <li>Bathroom descaling and mould treatment</li>
        <li>Floor scrubbing and hard-floor detailing</li>
        <li>Interior surface cleaning and dust removal</li>
        <li>High-touch point sanitisation</li>
      </ul>

      <h2>Booking a deep clean</h2>
      <p>
        At NVG Cleaning Services, our deep cleaning service is designed to restore freshness,
        hygiene and comfort to your home. Prices start from £120 for a studio or one-bedroom
        property, and final quotes depend on the size and condition of the property.
      </p>
    </ArticleLayout>
  );
}
