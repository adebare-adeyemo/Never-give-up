import crypto from 'node:crypto';

/**
 * Signed payment links. The token carries the booking itself, HMAC-signed, so
 * the invoice link keeps working without a database and a tampered amount fails
 * verification.
 */

const ALGORITHM = 'sha256';

/** Links stay valid well past a typical booking lead time, then lapse. */
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 60; // 60 days

function secret() {
  // Falls back to the gateway key; set explicitly to rotate links on their own.
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

/** @returns {string} url-safe token carrying the booking */
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
