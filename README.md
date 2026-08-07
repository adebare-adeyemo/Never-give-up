# NVG Cleaning Services — Website

Marketing and booking site for NVG Cleaning Services LTD, built with Next.js 14
(App Router), React 18 and Tailwind CSS.

## Requirements

- Node.js 18.17 or newer
- npm 9 or newer

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

The site runs at http://localhost:3000.

## Scripts

| Command          | What it does                          |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Start the development server          |
| `npm run build`  | Production build                      |
| `npm start`      | Serve the production build            |
| `npm run lint`   | ESLint (`next/core-web-vitals`)       |
| `npm run format` | Format all source files with Prettier |

## Environment variables

See [`.env.example`](.env.example) for the full list. The booking form needs the
`SMTP_*` variables; without them `/api/book` returns a 503 and logs a warning
rather than failing silently.

`NEXT_PUBLIC_GA_ID` is optional — analytics is only injected when a real GA4
measurement ID is present.

## Project structure

```
app/            Routes (App Router). Also holds sitemap, robots, manifest,
                icon and OG-image generators.
app/api/book/   Booking form handler — validates, rate-limits and emails.
components/     Shared UI.
lib/            Site config, blog metadata, staff data.
public/assets/  Photography and logos.
public/cleaners Staff photos, referenced by the verification pages.
public/qr/      Printed QR codes that link to /staff/* routes.
```

## Things to know before deploying

1. **Fill in the statutory identifiers** in [`lib/site.js`](lib/site.js):
   `companyNumber`, `icoRegistration` and `vatNumber`. They are omitted from the
   Privacy Policy and Terms pages while blank, so nothing incorrect is
   published — but a UK limited company must show its registered number.
2. **Have the legal pages reviewed.** `/privacy` and `/terms` are written to the
   UK GDPR Article 13 checklist and the Consumer Contracts Regulations 2013, but
   they are not a substitute for advice from a solicitor.
3. **Verify the homepage trust figures** ("100+ Happy Clients", "200+ Jobs
   Completed", "5.0★ Google Rating") in [`app/page.jsx`](app/page.jsx) — these
   are advertising claims and must be substantiable under the CAP Code.
4. **`/staff/*` routes are `noindex` and excluded from the sitemap** because they
   contain employee personal data. Their URLs must not change: printed QR badges
   point at them.
5. **Rate limiting is per-instance.** `/api/book` uses an in-memory counter,
   which throttles rather than hard-caps across a multi-instance deployment. For
   a strict global limit, move it to Vercel KV or Upstash Redis.
