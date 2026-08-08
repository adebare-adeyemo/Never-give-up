import nodemailer from 'nodemailer';
import { SITE } from '@/lib/site';

/**
 * Transactional email for bookings.
 *
 * Shared by the booking route and the Stripe webhook so the two cannot drift
 * apart in wording or in which fields they expose.
 */

export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function smtpConfigured() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function addresses() {
  return {
    recipient: process.env.SMTP_TO || SITE.email,
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
  };
}

const shell = (heading, inner) => `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#0f172a;">
    <h2 style="color:#0f766e;margin:0 0 16px;">${escapeHtml(heading)}</h2>
    ${inner}
  </div>`;

/** Ordered field list shared by the HTML and plaintext bodies. */
function buildSummary(data) {
  return [
    ['Name', data.name],
    ['Phone', data.phone],
    ['Email', data.email],
    ['Address', data.address],
    ['Service', data.service],
    ['Deep cleaning property size', data.deepCleaningSize],
    ['Hours requested', data.hours === 'Other' ? data.customHours : data.hours],
    ['Add-on services', Array.isArray(data.addons) ? data.addons.join(', ') : data.addons],
    ['Preferred date', data.date],
    ['Preferred time', data.time],
    ['Property size', data.propertySize],
    ['Additional notes', data.notes],
  ].filter(([, value]) => value);
}

const ACK_LABELS = [
  'Service',
  'Deep cleaning property size',
  'Property size',
  'Hours requested',
  'Preferred date',
  'Preferred time',
];

/** Notifies the business. Its failure should fail the request. */
export async function sendBookingNotification(data, { depositNote = '' } = {}) {
  const transporter = createTransport();
  const { recipient, from } = addresses();
  const summary = buildSummary(data);

  const htmlRows = summary
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#475569;"><strong>${escapeHtml(
          label
        )}</strong></td><td style="padding:6px 0;vertical-align:top;color:#0f172a;">${escapeHtml(
          value
        ).replaceAll('\n', '<br/>')}</td></tr>`
    )
    .join('');

  const noteHtml = depositNote
    ? `<p style="margin:0 0 16px;padding:12px 14px;background:#f0fdfa;border-left:4px solid #0f766e;"><strong>${escapeHtml(
        depositNote
      )}</strong></p>`
    : '';

  await transporter.sendMail({
    from: { name: `${SITE.name} Website`, address: from },
    to: recipient,
    // Structured so nodemailer quotes the display name itself — a name
    // containing < > " ; or , cannot then reshape the header.
    replyTo: { name: data.name, address: data.email },
    subject: `New booking request — ${data.service || 'Cleaning Service'}`,
    html: shell(
      'New Booking Request',
      `${noteHtml}<table cellpadding="0" cellspacing="0">${htmlRows}</table>`
    ),
    text:
      (depositNote ? `${depositNote}\n\n` : '') +
      `New Booking Request\n\n${summary.map(([l, v]) => `${l}: ${v}`).join('\n')}\n`,
  });
}

/**
 * Courtesy email to the customer. Callers should treat failure as non-fatal:
 * the booking has already reached the business by this point.
 */
export async function sendCustomerAcknowledgement(data, { depositNote = '' } = {}) {
  const transporter = createTransport();
  const { from } = addresses();
  const fields = buildSummary(data).filter(([label]) => ACK_LABELS.includes(label));

  const rows = fields
    .map(
      ([label, value]) =>
        `<p style="margin:4px 0;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
    )
    .join('');

  const noteHtml = depositNote ? `<p>${escapeHtml(depositNote)}</p>` : '';

  await transporter.sendMail({
    from: { name: SITE.name, address: from },
    to: data.email,
    subject: `Thank you for your booking request — ${SITE.name}`,
    html: shell(
      'Thank you for your booking request',
      `<p>Hi ${escapeHtml(data.name)},</p>
       <p>Thank you for contacting ${escapeHtml(SITE.name)}. We have received your request and will get back to you shortly.</p>
       ${noteHtml}
       <h3 style="margin:20px 0 8px;">Your booking details</h3>
       ${rows}
       <p style="margin-top:20px;">If anything changes, reply to this email or call us on <strong>${SITE.phoneDisplay}</strong>.</p>
       <p>Kind regards,<br/>${escapeHtml(SITE.name)}<br/>${SITE.phoneDisplay}<br/>${SITE.email}</p>`
    ),
    text:
      `Hi ${data.name},\n\n` +
      `Thank you for contacting ${SITE.name}. We have received your request and will get back to you shortly.\n\n` +
      (depositNote ? `${depositNote}\n\n` : '') +
      `Your booking details:\n${fields.map(([l, v]) => `${l}: ${v}`).join('\n')}\n\n` +
      `If anything changes, reply to this email or call us on ${SITE.phoneDisplay}.\n\n` +
      `Kind regards,\n${SITE.name}\n${SITE.phoneDisplay}\n${SITE.email}\n`,
  });
}

/** Tells the business a deposit has cleared, once Stripe confirms it. */
export async function sendDepositReceipt({ name, email, service, amountLabel, reference }) {
  const transporter = createTransport();
  const { recipient, from } = addresses();

  const rows = [
    ['Customer', name],
    ['Email', email],
    ['Service', service],
    ['Deposit received', amountLabel],
    ['Stripe reference', reference],
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<p style="margin:4px 0;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
    )
    .join('');

  await transporter.sendMail({
    from: { name: `${SITE.name} Website`, address: from },
    to: recipient,
    subject: `Deposit received — ${amountLabel} — ${name}`,
    html: shell('Deposit Received', rows),
    text: `Deposit Received\n\nCustomer: ${name}\nEmail: ${email}\nService: ${service}\nDeposit: ${amountLabel}\nStripe reference: ${reference}\n`,
  });
}
