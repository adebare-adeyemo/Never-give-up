import nodemailer from 'nodemailer';
import { SITE } from '@/lib/site';
import { invoiceHtml, invoiceText } from '@/lib/invoiceTemplate';
import { formatPence, cancellationFeePence, CANCELLATION } from '@/lib/pricing';

/**
 * Transactional email for bookings.
 *
 * Shared by the booking route and the payment callback so the two cannot
 * drift apart in wording or in which fields they expose.
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

/**
 * Emails the customer their invoice with a payment link.
 *
 * Sent instead of the plain acknowledgement whenever the booking has a
 * calculable total. Failure is non-fatal to the caller: the booking has already
 * reached the business, and the link can be resent.
 */
export async function sendBookingInvoice({ data, quote, reference, payUrl, holdsFunds }) {
  const transporter = createTransport();
  const { from } = addresses();

  await transporter.sendMail({
    from: { name: SITE.name, address: from },
    to: data.email,
    subject: `Invoice ${reference} — ${formatPence(quote.totalPence)} — ${SITE.name}`,
    html: invoiceHtml({ reference, data, quote, payUrl, holdsFunds }),
    text: invoiceText({ reference, data, quote, payUrl, holdsFunds }),
  });
}

/**
 * Tells the business a customer has paid, or that funds are being held.
 *
 * Where funds are held it spells out the exact amounts to capture, so nobody
 * has to work out the cancellation fee under pressure.
 */
export async function sendPaymentNotice({
  held,
  name,
  email,
  service,
  reference,
  cleaningDate,
  amountPence,
  paymentIntentId,
}) {
  const transporter = createTransport();
  const { recipient, from } = addresses();
  const total = formatPence(amountPence);
  const lateFee = formatPence(cancellationFeePence(amountPence));

  const rows = [
    ['Reference', reference],
    ['Customer', name],
    ['Email', email],
    ['Service', service],
    ['Cleaning date', cleaningDate],
    [held ? 'Amount held' : 'Amount paid', total],
    ['Gateway reference', paymentIntentId],
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<p style="margin:4px 0;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
    )
    .join('');

  const actions = held
    ? `<div style="margin-top:18px;padding:14px 16px;background:#f0fdfa;border-left:4px solid #0f766e;">
         <p style="margin:0 0 8px;"><strong>The money is not yours yet — it is on hold.</strong>
         Act on it in the Stripe Dashboard under Payments:</p>
         <p style="margin:0 0 4px;">• Clean completed &rarr; <strong>Capture ${escapeHtml(total)}</strong></p>
         <p style="margin:0 0 4px;">• Cancelled with less than ${CANCELLATION.noticeHours}h notice &rarr; <strong>Capture ${escapeHtml(lateFee)}</strong> (cancellation fee)</p>
         <p style="margin:0;">• Clean did not go ahead &rarr; <strong>Cancel</strong> the payment; the customer is charged nothing</p>
         <p style="margin:10px 0 0;font-size:13px;color:#475569;">Authorisations expire — capture or cancel before the deadline shown on the payment in Stripe, or the hold lapses on its own.</p>
       </div>`
    : `<div style="margin-top:18px;padding:14px 16px;background:#f0fdfa;border-left:4px solid #0f766e;">
         <p style="margin:0 0 8px;"><strong>This payment has been taken.</strong> If the booking changes, refund in the takepayments portal:</p>
         <p style="margin:0 0 4px;">• Clean did not go ahead &rarr; refund <strong>${escapeHtml(total)}</strong> in full</p>
         <p style="margin:0;">• Cancelled with less than ${CANCELLATION.noticeHours}h notice &rarr; refund <strong>${escapeHtml(formatPence(amountPence - cancellationFeePence(amountPence)))}</strong>, keeping the ${escapeHtml(lateFee)} cancellation fee</p>
       </div>`;

  const heading = held ? `Funds held — ${total}` : `Payment received — ${total}`;

  await transporter.sendMail({
    from: { name: `${SITE.name} Website`, address: from },
    to: recipient,
    subject: `${held ? 'Funds held' : 'Payment received'} — ${total} — ${reference}`,
    html: shell(heading, rows + actions),
    text:
      `${heading}\n\n` +
      `Reference: ${reference}\nCustomer: ${name}\nEmail: ${email}\nService: ${service}\n` +
      `Cleaning date: ${cleaningDate}\n${held ? 'Held' : 'Paid'}: ${total}\nGateway reference: ${paymentIntentId}\n\n` +
      (held
        ? `THE MONEY IS ON HOLD. In the Stripe Dashboard:\n` +
          `  Clean completed              -> Capture ${total}\n` +
          `  Cancelled <${CANCELLATION.noticeHours}h notice        -> Capture ${lateFee} (cancellation fee)\n` +
          `  Clean did not go ahead       -> Cancel the payment (no charge)\n\n` +
          `Capture or cancel before the authorisation expires.\n`
        : `PAYMENT TAKEN. In the takepayments portal:\n` +
          `  Clean did not go ahead       -> Refund ${total} in full\n` +
          `  Cancelled <${CANCELLATION.noticeHours}h notice        -> Refund ${formatPence(amountPence - cancellationFeePence(amountPence))}, keep ${lateFee}\n`),
  });
}
