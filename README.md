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
cleanly: without the `SMTP_*` values the booking form returns a 503, without
`NEXT_PUBLIC_GA_ID` no analytics is loaded at all, and without the
`TAKEPAYMENTS_*` values the booking form works as a plain enquiry form.

## Payments

Prices come from [`lib/pricing.js`](lib/pricing.js) and totals are always
worked out server-side — the browser sends a service name, never an amount.

Booking emails an invoice containing a signed `/pay/<token>` link. Opening it
posts the customer to the takepayments hosted form, so card details never reach
this server. The gateway returns the result to `/api/takepayments/callback`,
which re-computes the hash before trusting it; the redirect alone is never
treated as proof of payment.

`TAKEPAYMENTS_HASH_METHOD` must match the setting on the gateway account or
every transaction is rejected. Implementation notes are in
[`lib/takepayments.js`](lib/takepayments.js).

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
