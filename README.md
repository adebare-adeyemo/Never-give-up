# NVG Cleaning Services — Next.js Website

This version includes:
- Premium dark green/black/blue redesign inspired by the reference website style
- Logo loading screen
- Slide-out mobile toolbar/menu
- Hero section using the NVG team cleaning image
- Service cards with animation-ready reveal styling
- Before/after cleaning results gallery
- Testimonials/Google Reviews styled section
- Blog page with 3 SEO articles
- Contact/booking form connected to Next.js API route
- GoDaddy SMTP/Nodemailer setup
- Sitemap, robots.txt and schema markup

## Install
```bash
npm install
```

## Run locally
```bash
npm run dev
```

## GoDaddy SMTP Environment Variables
Add these in Vercel Project Settings > Environment Variables:

```env


If port 465 fails, try:
```env
SMTP_PORT=587
```

## Google Reviews
The testimonial section is designed to match Google Reviews style. For live reviews, connect a Google Reviews widget/API after launch, such as Trustindex, Elfsight, or Google Places API.

## Google Analytics
Replace `G-XXXXXXXXXX` in `app/layout.jsx` with the real Google Analytics ID.
