# NVG Cleaning Services - Next.js Website

This is a Next.js website for NVG Cleaning Services with pages for services, pricing, gallery, blog, contact/booking, SEO files, and a GoDaddy SMTP booking form.

## Run locally

```bash
npm install
npm run dev
```

## Booking form email setup

The booking form sends enquiries through the Next.js API route:

`/app/api/book/route.js`

It uses Nodemailer and GoDaddy SMTP. Add these environment variables in Vercel:

```env
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=465
SMTP_USER=booking@nvgcleaningservices.co.uk
SMTP_PASS=your_godaddy_email_password
SMTP_FROM=booking@nvgcleaningservices.co.uk
SMTP_TO=booking@nvgcleaningservices.co.uk
```

If port 465 does not work, try:

```env
SMTP_PORT=587
```

Do not put the real password inside the code. Add it only inside Vercel Environment Variables.

## Deploy on Vercel

1. Upload/import the project to Vercel.
2. Add the environment variables above.
3. Deploy.
4. Test the booking form.
5. Connect the GoDaddy domain.
