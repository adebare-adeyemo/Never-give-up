import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon for iOS, which does not support SVG favicons. */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f766e',
        color: '#ffffff',
        fontSize: 64,
        fontWeight: 700,
        fontFamily: 'sans-serif',
      }}
    >
      NVG
    </div>,
    size
  );
}
