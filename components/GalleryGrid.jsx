import Image from 'next/image';

/**
 * Each asset is a single pre-composited before/after photo, so the card carries
 * one "Before & After" badge and no drag handle — there is no slider to drag.
 */
const ITEMS = [
  ['bedroom-deep-cleaning-leeds-before-after.webp', 'Bedroom Deep Clean', 'Leeds'],
  ['toaster-cleaning-before-after.webp', 'Appliance Detail Clean', 'Leeds'],
  ['radiator-cleaning-before-after.webp', 'Radiator Cleaning', 'Yorkshire'],
  ['end-of-tenancy-room-cleaning-before-after.webp', 'End of Tenancy Room Clean', 'Leeds'],
  ['oven-cleaning-leeds-before-after.webp', 'Oven Deep Cleaning', 'Leeds'],
  ['sink-cupboard-cleaning-before-after.webp', 'Sink Cupboard Cleaning', 'Yorkshire'],
];

// Cards sit in a 1/2/3-column grid, so never request a full-viewport-width image.
const GALLERY_SIZES = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw';

export default function GalleryGrid() {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {ITEMS.map(([img, title, location]) => (
        <li key={img}>
          <article className="group h-full overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-card transition hover:shadow-lift">
            <div className="relative h-64 overflow-hidden bg-slate-100">
              <Image
                src={`/assets/${img}`}
                alt={`${title} in ${location} — before and after cleaning by NVG Cleaning Services`}
                fill
                sizes={GALLERY_SIZES}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                Before &amp; After
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-extrabold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-ink-subtle">{location}</p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
