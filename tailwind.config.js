const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1180px', '2xl': '1180px' },
    },
    extend: {
      colors: {
        // Brand teal. 700 (5.47:1 on white) is the lightest shade that clears
        // WCAG AA for text, so 400-600 are decorative fills only — never type.
        nvg: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          DEFAULT: '#0f766e',
        },
        ink: { DEFAULT: '#0f172a', muted: '#475569', subtle: '#64748b' },
        navy: '#061113',
        accent: '#0369a1', // 5.93:1 on white
        star: '#b45309', // 5.02:1 on white
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '4xl': '28px', '5xl': '32px' },
      boxShadow: {
        glow: '0 0 0 1px rgba(15,118,110,.18), 0 12px 30px rgba(15,118,110,.14)',
        card: '0 18px 45px rgba(15,23,42,.08)',
        lift: '0 24px 60px rgba(15,23,42,.12)',
      },
      typography: ({ theme }) => ({
        nvg: {
          css: {
            '--tw-prose-body': theme('colors.ink.muted'),
            '--tw-prose-headings': theme('colors.ink.DEFAULT'),
            '--tw-prose-links': theme('colors.nvg.700'),
            '--tw-prose-bold': theme('colors.ink.DEFAULT'),
            '--tw-prose-bullets': theme('colors.nvg.500'),
            '--tw-prose-quotes': theme('colors.ink.DEFAULT'),
            '--tw-prose-quote-borders': theme('colors.nvg.500'),
          },
        },
      }),
    },
  },
  plugins: [typography],
};
