# NVG Cleaning Services — Website

Marketing and booking site for NVG Cleaning Services LTD. Next.js 14 (App
Router), React 18 and Tailwind CSS.

## Getting started

Requires Node.js 18.17+ and npm 9+.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Runs at http://localhost:3000.

## Scripts

| Command          | What it does               |
| ---------------- | -------------------------- |
| `npm run dev`    | Development server         |
| `npm run build`  | Production build           |
| `npm start`      | Serve the production build |
| `npm run lint`   | ESLint                     |
| `npm run format` | Format with Prettier       |

## Environment variables

See [`.env.example`](.env.example). Each group is optional and degrades
cleanly: without the `SMTP_*` values the booking form returns a 503, and
without `NEXT_PUBLIC_GA_ID` no analytics is loaded at all.

## Structure

```
app/         Routes, plus sitemap, robots, manifest and icon generators
components/  Shared UI
lib/         Site config, blog metadata and staff data
public/      Photography, staff photos and printed-QR targets
```

## Before deploying

- Fill in `companyNumber`, `icoRegistration` and `vatNumber` in
  [`lib/site.js`](lib/site.js) — they are omitted from the legal pages while
  blank.
- `/staff/*` URLs must not change: printed QR badges point at them.
- Have `/privacy` and `/terms` reviewed by a solicitor before going live.
