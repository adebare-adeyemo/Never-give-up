import { SITE } from '@/lib/site';
import { formatPence, cancellationFeePence, CANCELLATION } from '@/lib/pricing';

/**
 * Invoice email markup.
 *
 * Written for email clients, not browsers: tables for layout, inline styles
 * only, a fixed 600px content width and no external CSS or web fonts. Outlook
 * ignores most of what a normal stylesheet would do, so nothing here relies on
 * flexbox, grid or classes.
 */

const C = {
  brand: '#0f766e',
  brandDark: '#115e59',
  navy: '#061113',
  ink: '#0f172a',
  muted: '#475569',
  subtle: '#64748b',
  border: '#e2e8f0',
  wash: '#f1f5f9',
  tint: '#f0fdfa',
};

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return escapeHtml(value);
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Rows of the itemised table. Unpriced lines show "Quoted separately". */
function lineRows(lines) {
  return lines
    .map(
      (line) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid ${C.border};font-family:${FONT};font-size:15px;color:${C.ink};">
            ${escapeHtml(line.description)}
            ${
              line.note
                ? `<div style="font-size:13px;color:${C.subtle};margin-top:3px;">${escapeHtml(line.note)}</div>`
                : ''
            }
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid ${C.border};font-family:${FONT};font-size:15px;font-weight:700;color:${
            line.pence === null ? C.subtle : C.ink
          };white-space:nowrap;">
            ${line.pence === null ? 'Quoted separately' : formatPence(line.pence)}
          </td>
        </tr>`
    )
    .join('');
}

function detailRow(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:4px 16px 4px 0;font-family:${FONT};font-size:14px;color:${C.subtle};white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:4px 0;font-family:${FONT};font-size:14px;color:${C.ink};font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;
}

/**
 * @param {object} params
 * @param {string} params.reference    Booking reference
 * @param {object} params.data         Normalised booking fields
 * @param {object} params.quote        Result of calculateQuote()
 * @param {string} params.payUrl       Link to the payment page
 * @param {boolean} params.holdsFunds  True when the charge is authorised, not taken
 */
export function invoiceHtml({ reference, data, quote, payUrl, holdsFunds }) {
  const total = formatPence(quote.totalPence);
  const cancellationFee = formatPence(cancellationFeePence(quote.totalPence));

  const paymentExplainer = holdsFunds
    ? `We place a hold on your card for ${total} now. <strong>The money is only taken once your clean is complete.</strong> If the work does not go ahead, the hold is released and you are not charged.`
    : `Payment of ${total} is taken when you complete the form below. If the work does not go ahead, you are refunded in full.`;

  return `<!-- preheader -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your NVG Cleaning booking ${escapeHtml(reference)} — ${total} due.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.wash};margin:0;padding:24px 12px;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${C.border};">

        <!-- Header -->
        <tr>
          <td style="background-color:${C.navy};padding:28px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:${FONT};font-size:19px;font-weight:700;color:#ffffff;">
                  NVG Cleaning <span style="color:#5eead4;">Services</span>
                </td>
                <td align="right" style="font-family:${FONT};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;">
                  Invoice
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Reference -->
        <tr>
          <td style="padding:28px 32px 0;">
            <p style="margin:0 0 6px;font-family:${FONT};font-size:16px;color:${C.ink};">
              Hi ${escapeHtml(data.name)},
            </p>
            <p style="margin:0 0 22px;font-family:${FONT};font-size:15px;line-height:24px;color:${C.muted};">
              Thank you for booking with NVG Cleaning Services. Here is your invoice.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:${C.wash};border-radius:8px;padding:0;">
              <tr>
                <td style="padding:14px 16px;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    ${detailRow('Reference', reference)}
                    ${detailRow('Issued', formatDate(new Date().toISOString()))}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Booking details -->
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 10px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.brand};">
              Your booking
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0">
              ${detailRow('Service', data.service)}
              ${detailRow('Date', formatDate(data.date))}
              ${detailRow('Time', data.time)}
              ${detailRow('Address', data.address)}
            </table>
          </td>
        </tr>

        <!-- Items -->
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 4px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.brand};">
              Summary
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${lineRows(quote.lines)}
              <tr>
                <td style="padding:16px 0 0;font-family:${FONT};font-size:17px;font-weight:700;color:${C.ink};">
                  Total due
                </td>
                <td align="right" style="padding:16px 0 0;font-family:${FONT};font-size:22px;font-weight:700;color:${C.brand};white-space:nowrap;">
                  ${total}
                </td>
              </tr>
            </table>
            <p style="margin:10px 0 0;font-family:${FONT};font-size:13px;line-height:20px;color:${C.subtle};">
              Prices are starting prices. If the property needs more work than described, we will
              agree any change with you before we start.
            </p>
          </td>
        </tr>

        <!-- Pay button -->
        <tr>
          <td style="padding:28px 32px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" bgcolor="${C.brand}" style="border-radius:8px;">
                  <a href="${payUrl}" target="_blank" rel="noopener"
                     style="display:block;padding:16px 24px;font-family:${FONT};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">
                    Pay ${total} securely
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:14px 0 0;font-family:${FONT};font-size:13px;line-height:20px;color:${C.subtle};text-align:center;">
              Payments are handled by Stripe. We never see or store your card details.
            </p>
          </td>
        </tr>

        <!-- How payment works -->
        <tr>
          <td style="padding:24px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.tint};border-radius:8px;">
              <tr>
                <td style="padding:16px 18px;font-family:${FONT};font-size:14px;line-height:22px;color:${C.muted};">
                  <strong style="color:${C.ink};">How payment works</strong><br/>
                  ${paymentExplainer}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Cancellation -->
        <tr>
          <td style="padding:16px 32px 0;">
            <p style="margin:0;font-family:${FONT};font-size:13px;line-height:21px;color:${C.subtle};">
              <strong style="color:${C.ink};">Cancellations.</strong>
              Cancel more than ${CANCELLATION.noticeHours} hours before your clean and you pay nothing.
              Cancel with less than ${CANCELLATION.noticeHours} hours' notice and a cancellation fee of
              ${cancellationFee} applies —
              because the slot and staff time are already reserved. Full details are in our
              <a href="${SITE.url}/terms" style="color:${C.brand};">Terms &amp; Conditions</a>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:26px 32px 30px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="border-top:1px solid ${C.border};padding-top:20px;">
                <p style="margin:0 0 4px;font-family:${FONT};font-size:14px;font-weight:700;color:${C.ink};">
                  ${escapeHtml(SITE.legalName)}
                </p>
                <p style="margin:0;font-family:${FONT};font-size:13px;line-height:21px;color:${C.subtle};">
                  ${escapeHtml(SITE.address.street)}, ${escapeHtml(SITE.address.locality)} ${escapeHtml(SITE.address.postcode)}<br/>
                  <a href="tel:${SITE.phoneDisplay.replace(/\s/g, '')}" style="color:${C.brand};text-decoration:none;">${SITE.phoneDisplay}</a>
                  &nbsp;·&nbsp;
                  <a href="mailto:${SITE.email}" style="color:${C.brand};text-decoration:none;">${SITE.email}</a>
                </p>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin:16px 0 0;font-family:${FONT};font-size:12px;color:${C.subtle};text-align:center;">
        Questions about this invoice? Just reply to this email.
      </p>
    </td>
  </tr>
</table>`;
}

/** Plain-text alternative. Every email should carry one. */
export function invoiceText({ reference, data, quote, payUrl, holdsFunds }) {
  const total = formatPence(quote.totalPence);
  const fee = formatPence(cancellationFeePence(quote.totalPence));

  const items = quote.lines
    .map(
      (l) => `  ${l.description} — ${l.pence === null ? 'Quoted separately' : formatPence(l.pence)}`
    )
    .join('\n');

  return `NVG CLEANING SERVICES — INVOICE
Reference: ${reference}

Hi ${data.name},

Thank you for booking with NVG Cleaning Services. Here is your invoice.

YOUR BOOKING
  Service: ${data.service}
  Date:    ${data.date}
  Time:    ${data.time}
  Address: ${data.address}

SUMMARY
${items}

  TOTAL DUE: ${total}

Prices are starting prices. If the property needs more work than described, we
will agree any change with you before we start.

PAY SECURELY
${payUrl}

HOW PAYMENT WORKS
${
  holdsFunds
    ? `We place a hold on your card for ${total} now. The money is only taken once your clean is complete. If the work does not go ahead, the hold is released and you are not charged.`
    : `Payment of ${total} is taken when you complete the form. If the work does not go ahead, you are refunded in full.`
}
Payments are handled by Stripe. We never see or store your card details.

CANCELLATIONS
Cancel more than ${CANCELLATION.noticeHours} hours before your clean and you pay nothing.
Cancel with less than ${CANCELLATION.noticeHours} hours' notice and a cancellation fee of
${fee} applies. Full terms: ${SITE.url}/terms

${SITE.legalName}
${SITE.address.street}, ${SITE.address.locality} ${SITE.address.postcode}
${SITE.phoneDisplay} · ${SITE.email}
`;
}
