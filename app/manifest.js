import { SITE } from '@/lib/site';

export default function manifest() {
  return {
    name: `${SITE.name} — Professional Cleaning in Leeds`,
    short_name: 'NVG Cleaning',
    description:
      'Domestic, deep, Airbnb, end of tenancy, commercial and pressure washing cleaning across Leeds and Yorkshire.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f766e',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
