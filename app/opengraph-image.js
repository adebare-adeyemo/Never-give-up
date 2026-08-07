import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

/*
 * Rendered as PNG: Facebook, LinkedIn and WhatsApp do not reliably display
 * WebP OG images, so link previews need a PNG or JPEG source.
 */
// next/og requires the edge runtime; under the Node runtime @vercel/og fails to
// resolve its WASM asset path at build time.
export const runtime = 'edge';
export const alt = `${SITE.name} — Professional Cleaning Services in Leeds and Yorkshire`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #061113 0%, #0f766e 100%)',
        padding: '72px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: 18,
            background: '#ffffff',
            color: '#0f766e',
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          NVG
        </div>
        <div
          style={{
            display: 'flex',
            marginLeft: 20,
            fontSize: 30,
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {SITE.name}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: 68,
            lineHeight: 1.1,
            color: '#ffffff',
            fontWeight: 700,
            maxWidth: 940,
          }}
        >
          Professional Cleaning Services You Can Trust
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 30,
            color: '#99f6e4',
          }}
        >
          Leeds · Bradford · York · Wakefield · Harrogate
        </div>
      </div>

      <div style={{ display: 'flex', fontSize: 26, color: '#ffffff' }}>
        {SITE.phoneDisplay} · nvgcleaningservices.co.uk
      </div>
    </div>,
    size
  );
}
