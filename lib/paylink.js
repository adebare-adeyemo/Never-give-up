import crypto from 'node:crypto';

/**
 * Signed payment links.
 *
 * The invoice email needs a link that still works days later. Rather than
 * pre-creating anything at the gateway, the email links to our own /pay/<token>
 * route, which builds and signs the gateway request at the moment the customer
 * clicks.
 *
 * The token carries the booking itself, signed with HMAC-SHA256, so no database
 * is needed to look it up and a tampered amount fails verification.
 */

const ALGORITHM = 'sha256';

/** Links stay valid well past a typical booking lead time, then lapse. */
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 60; // 60 days

function secret() {
  /*
   * Falls back to the gateway pre-shared key so there is one fewer required
   * variable: payment links only exist when the gateway is configured anyway.
   * Set BOOKING_LINK_SECRET explicitly to rotate links independently.
   */
  const value = process.env.BOOKING_LINK_SECRET || process.env.TAKEPAYMENTS_PRESHARED_KEY;
  if (!value) throw new Error('No secret available for signing payment links.');
  return value;
}

const b64url = {
  encode: (buf) => Buffer.from(buf).toString('base64url'),
  decode: (str) => Buffer.from(str, 'base64url'),
};

function sign(payloadB64) {
  return crypto.createHmac(ALGORITHM, secret()).update(payloadB64).digest('base64url');
}

/**
 * @param {object} booking  Minimal detail needed to build a Checkout Session.
 * @returns {string} url-safe token
 */
export function createPayToken(booking, ttlSeconds = DEFAULT_TTL_SECONDS) {
  const payload = {
    ...booking,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const payloadB64 = b64url.encode(JSON.stringify(payload));
  return `${payloadB64}.${sign(payloadB64)}`;
}

/**
 * Verifies and decodes a token.
 *
 * @returns {{ok: true, booking: object} | {ok: false, error: string}}
 */
export function readPayToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) {
    return { ok: false, error: 'malformed' };
  }

  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return { ok: false, error: 'malformed' };

  let expected;
  try {
    expected = sign(payloadB64);
  } catch {
    return { ok: false, error: 'unconfigured' };
  }

  // Constant-time compare so the signature cannot be guessed byte by byte.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, error: 'bad-signature' };
  }

  let payload;
  try {
    payload = JSON.parse(b64url.decode(payloadB64).toString('utf8'));
  } catch {
    return { ok: false, error: 'malformed' };
  }

  if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return { ok: false, error: 'expired' };
  }

  return { ok: true, booking: payload };
}

/** Short reference shown on the invoice and sent to the gateway as OrderID. */
export function bookingReference(email, date) {
  const hash = crypto
    .createHash('sha256')
    .update(`${email}|${date}|${Date.now()}`)
    .digest('hex')
    .slice(0, 6)
    .toUpperCase();
  return `NVG-${hash}`;
}
