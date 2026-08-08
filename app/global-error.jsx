'use client';

import { useEffect } from 'react';

/** Last-resort boundary: replaces the whole document, so it ships its own html/body. */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <html lang="en-GB">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: '24px',
          color: '#0f172a',
          textAlign: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '28px', margin: '0 0 12px' }}>Something went wrong</h1>
          <p style={{ color: '#475569', margin: '0 0 24px' }}>
            Please try again, or call NVG Cleaning Services on 0333 034 7101.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#0f766e',
              color: '#ffffff',
              border: 0,
              borderRadius: '999px',
              padding: '14px 26px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
