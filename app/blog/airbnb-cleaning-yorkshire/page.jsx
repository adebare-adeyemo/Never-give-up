import ArticleLayout from '@/components/ArticleLayout';
import { getPost } from '@/lib/blog';

const post = getPost('airbnb-cleaning-yorkshire');

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
        Running an Airbnb property can be profitable, but cleanliness plays a major role in guest
        satisfaction and reviews.
      </p>
      <p>
        Guests expect hotel-level cleanliness when they arrive. Even small issues like dust, stains,
        hair or unpleasant smells can lead to negative reviews and lower bookings.
      </p>
      <p>
        This is why many successful Airbnb hosts across Leeds, Bradford, Wakefield and nearby
        Yorkshire areas rely on professional Airbnb cleaning services.
      </p>

      <h2>What our Airbnb cleaning can include</h2>
      <ul>
        <li>Full property cleaning and bathroom sanitisation</li>
        <li>Kitchen cleaning and appliance wipe-down</li>
        <li>Bed making, linen changing and towel replacement</li>
        <li>Floor cleaning throughout</li>
        <li>Restocking essentials and final presentation checks</li>
      </ul>

      <h2>Why it protects your listing</h2>
      <p>
        A professional Airbnb cleaning service helps improve guest satisfaction, increase positive
        reviews, reduce complaints, save hosts time and keep properties consistently guest-ready.
        Consistency matters as much as quality — guests notice when one stay is spotless and the
        next is not.
      </p>
      <p>
        Whether you manage one Airbnb apartment or multiple short-let properties, NVG Cleaning
        Services can provide flexible cleaning solutions tailored to your changeover schedule, with
        turnover cleaning starting from £55.
      </p>
    </ArticleLayout>
  );
}
