import GalleryGrid from '@/components/GalleryGrid';

export const metadata = {
  title: 'Before and After Cleaning Gallery',
  description:
    'See real before and after cleaning transformations by NVG Cleaning Services in Leeds and Yorkshire.',
  alternates: { canonical: '/gallery' },
};

export default function Gallery() {
  return (
    <main className="section bg-white">
      <div className="mx-auto max-w-[1180px] px-5">
        <header className="max-w-2xl">
          <span className="eyebrow">Our work</span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">
            Before &amp; After Gallery
          </h1>
          <p className="mt-4 text-lg leading-8 text-ink-muted">
            Real cleaning transformations from bedrooms, appliances, ovens, radiators and end of
            tenancy cleaning jobs.
          </p>
        </header>

        <div className="mt-12">
          <GalleryGrid />
        </div>
      </div>
    </main>
  );
}
