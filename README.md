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
measurement ID is present, and then only after the visitor opts in.

`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are optional too. Leave them
blank and the booking form works exactly as it did before payments existed: no
deposit is requested and the enquiry is emailed as usual.

## Booking, invoicing and payment

Every price comes from [`lib/pricing.js`](lib/pricing.js), which mirrors the
published price list on `/pricing` exactly. Services marked "custom quote" there
have no figure here either — those bookings are taken as enquiries and priced by
hand, with no invoice sent.

Totals are always computed **server-side from the selected service and tier**.
The browser sends a service name, never a price.

Flow:

1. The form submits to `/api/book`, which validates, works out the quote, and
   emails staff (so nothing is lost even if the customer never pays).
2. The customer is emailed an invoice containing a link to `/pay/<token>`. The
   token is the booking itself, HMAC-signed — no database, and a tampered amount
   fails verification.
3. Clicking the link mints a fresh Stripe Checkout Session. Card details never
   touch this server, which keeps the business at PCI **SAQ-A**.
4. Stripe calls `/api/stripe/webhook`, which verifies the signature and tells
   staff what to do next. The redirect to `/booking/confirmed` proves nothing on
   its own and is never treated as payment.

### Held funds, not taken funds

Where the clean is within the card authorisation window, paying places a **hold**
on the card. Money moves only when staff capture it:

| Outcome                         | Action in the Stripe Dashboard | Customer pays        |
| ------------------------------- | ------------------------------ | -------------------- |
| Clean completed                 | Capture in full                | Full amount          |
| Cancelled with under 24h notice | Capture 60%                    | 60% cancellation fee |
| Clean did not go ahead          | Cancel the payment             | Nothing              |

Capturing nothing costs nothing — an authorisation that is cancelled carries no
processing fee, which is why this is preferred over charging and refunding.

Card authorisations are valid for **7 days** by default, and up to 30 with
extended authorisation (which Stripe only enables on IC+ pricing — ask them).
For a clean booked further out than the hold can last, payment is taken normally
and refunded under the same rules; `/pay/[token]` decides which applies and
records it in the session metadata.

Staff never have to work out the 60% themselves — the notification email states
the exact amounts to capture.

### Testing payments locally

```bash
# terminal 1
npm run dev

# terminal 2 — forwards real Stripe events to your machine
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET` in `.env.local`, then
pay with test card `4242 4242 4242 4242`, any future expiry and any CVC.
Card `4000 0027 6000 3184` triggers a 3-D Secure challenge, which is worth
exercising at least once since UK cards frequently require it.

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
