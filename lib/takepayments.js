import crypto from 'node:crypto';

/**
 * takepayments (Payzone UK) Hosted Payment Form.
 *
 * The gateway protects request and response with a hash built from the field
 * values plus two secrets that never cross the wire — the gateway password and
 * the pre-shared key. Two rules make or break the integration:
 *
 *   1. Fields must appear in the exact order the integration guide lists them,
 *      not alphabetically.
 *   2. Values are hashed EXACTLY as they appear in the form — not URL-encoded.
 *
 * Get an order or an encoding wrong and every transaction is rejected as
 * tampered, so the field orders below are transcribed from the guide verbatim.
 */

export const GATEWAY_URL = 'https://mms.tponlinepayments2.com/Pages/PublicPages/PaymentForm.aspx';

export const CURRENCY_GBP = '826';
export const COUNTRY_GB = '826';

/** Gateway status codes. */
export const STATUS = {
  SUCCESS: '0',
  REFERRED: '4',
  DECLINED: '5',
  DUPLICATE: '20',
  EXCEPTION: '30',
};

/** Order of fields when hashing a request to the gateway. */
const REQUEST_FIELD_ORDER = [
  'MerchantID',
  'Password',
  'Amount',
  'CurrencyCode',
  'EchoAVSCheckResult',
  'EchoCV2CheckResult',
  'EchoThreeDSecureAuthenticationCheckResult',
  'EchoCardType',
  'EchoCardNumberFirstSix',
  'EchoCardNumberLastFour',
  'EchoCardExpiryDate',
  'EchoDonationAmount',
  'AVSOverridePolicy',
  'CV2OverridePolicy',
  'ThreeDSecureOverridePolicy',
  'OrderID',
  'TransactionType',
  'TransactionDateTime',
  'CallbackURL',
  'OrderDescription',
  'CustomerName',
  'Address1',
  'Address2',
  'Address3',
  'Address4',
  'City',
  'State',
  'PostCode',
  'CountryCode',
  'EmailAddress',
  'PhoneNumber',
  'DateOfBirth',
  'EmailAddressEditable',
  'PhoneNumberEditable',
  'DateOfBirthEditable',
  'CV2Mandatory',
  'Address1Mandatory',
  'CityMandatory',
  'PostCodeMandatory',
  'StateMandatory',
  'CountryMandatory',
  'ResultDeliveryMethod',
  'ServerResultURL',
  'PaymentFormDisplaysResult',
  'PrimaryAccountName',
  'PrimaryAccountNumber',
  'PrimaryAccountDateOfBirth',
  'PrimaryAccountPostCode',
];

/** Order of fields when verifying a result posted back by the gateway. */
const RESPONSE_FIELD_ORDER = [
  'MerchantID',
  'Password',
  'StatusCode',
  'Message',
  'PreviousStatusCode',
  'PreviousMessage',
  'CrossReference',
  'AddressNumericCheckResult',
  'PostCodeCheckResult',
  'CV2CheckResult',
  'ThreeDSecureAuthenticationCheckResult',
  'CardType',
  'CardClass',
  'CardIssuer',
  'CardIssuerCountryCode',
  'CardNumberFirstSix',
  'CardNumberLastFour',
  'CardExpiryDate',
  'Amount',
  'DonationAmount',
  'CurrencyCode',
  'OrderID',
  'TransactionType',
  'TransactionDateTime',
  'OrderDescription',
  'CustomerName',
  'Address1',
  'Address2',
  'Address3',
  'Address4',
  'City',
  'State',
  'PostCode',
  'CountryCode',
  'EmailAddress',
  'PhoneNumber',
  'DateOfBirth',
  'PrimaryAccountName',
  'PrimaryAccountNumber',
  'PrimaryAccountDateOfBirth',
  'PrimaryAccountPostCode',
];

export function takepaymentsConfigured() {
  return Boolean(
    process.env.TAKEPAYMENTS_MERCHANT_ID &&
    process.env.TAKEPAYMENTS_PASSWORD &&
    process.env.TAKEPAYMENTS_PRESHARED_KEY
  );
}

function config() {
  return {
    merchantId: process.env.TAKEPAYMENTS_MERCHANT_ID,
    password: process.env.TAKEPAYMENTS_PASSWORD,
    preSharedKey: process.env.TAKEPAYMENTS_PRESHARED_KEY,
    // Must match Account Admin -> Gateway Account Settings in the MMS.
    hashMethod: (process.env.TAKEPAYMENTS_HASH_METHOD || 'SHA1').toUpperCase(),
  };
}

/**
 * Hashes a pre-built `name=value&name=value` string.
 *
 * For the HMAC methods the pre-shared key is the HMAC key and must be absent
 * from the string entirely — the guide notes that including it even as an empty
 * value causes the gateway to throw.
 */
export function hashString(value, { hashMethod, preSharedKey }) {
  switch (hashMethod) {
    case 'HMACSHA1':
      return crypto.createHmac('sha1', preSharedKey).update(value, 'utf8').digest('hex');
    case 'HMACMD5':
      return crypto.createHmac('md5', preSharedKey).update(value, 'utf8').digest('hex');
    case 'MD5':
      return crypto.createHash('md5').update(value, 'utf8').digest('hex');
    case 'SHA256':
      return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
    case 'SHA512':
      return crypto.createHash('sha512').update(value, 'utf8').digest('hex');
    case 'SHA1':
    default:
      return crypto.createHash('sha1').update(value, 'utf8').digest('hex');
  }
}

function usesHmac(hashMethod) {
  return hashMethod === 'HMACSHA1' || hashMethod === 'HMACMD5';
}

/**
 * Builds the hash string for a set of fields.
 *
 * @param {string[]} order   Canonical field order from the integration guide.
 * @param {object} fields    Values present in the form or response.
 * @param {boolean} strict   When true, every ordered field is included even if
 *                           absent (used for responses, where the gateway sends
 *                           empty values that must still be hashed).
 */
function buildHashString(order, fields, settings, { onlyPresent }) {
  const parts = [];

  if (!usesHmac(settings.hashMethod)) {
    parts.push(`PreSharedKey=${settings.preSharedKey}`);
  }

  for (const name of order) {
    if (onlyPresent && !(name in fields)) continue;
    parts.push(`${name}=${fields[name] ?? ''}`);
  }

  return parts.join('&');
}

/**
 * Builds the complete set of hidden form fields to POST to the gateway.
 *
 * Only fields we actually send are hashed, which sidesteps the guide's rule
 * that any optional field included in the hash must also appear (empty) in the
 * form.
 */
export function buildPaymentRequest({
  amountPence,
  orderId,
  orderDescription,
  customerName,
  email,
  phone,
  address1 = '',
  city = '',
  postCode = '',
  callbackUrl,
  transactionType = 'SALE',
}) {
  const settings = config();

  const fields = {
    MerchantID: settings.merchantId,
    Amount: String(amountPence),
    CurrencyCode: CURRENCY_GBP,
    OrderID: orderId,
    TransactionType: transactionType,
    TransactionDateTime: gatewayTimestamp(),
    CallbackURL: callbackUrl,
    OrderDescription: orderDescription,
    CustomerName: customerName,
    Address1: address1,
    City: city,
    PostCode: postCode,
    CountryCode: COUNTRY_GB,
    EmailAddress: email,
    PhoneNumber: phone,
    // Results are posted back to CallbackURL over HTTPS and hash-verified there.
    ResultDeliveryMethod: 'POST',
  };

  // Password is hashed but never sent in the form.
  const hashFields = { ...fields, Password: settings.password };
  const hashDigest = hashString(
    buildHashString(REQUEST_FIELD_ORDER, hashFields, settings, { onlyPresent: true }),
    settings
  );

  return { url: GATEWAY_URL, fields: { HashDigest: hashDigest, ...fields } };
}

/** "YYYY-MM-DD HH:MM:SS +OO:OO" in the server's local offset, as the guide requires. */
export function gatewayTimestamp(date = new Date()) {
  const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ` +
    `${sign}${pad(offsetMinutes / 60)}:${pad(offsetMinutes % 60)}`
  );
}

/**
 * Verifies a result posted back by the gateway.
 *
 * Only fields actually present in the POST are hashed, matching the guide's
 * rule that absent fields are excluded while present-but-empty ones are kept.
 *
 * @returns {{valid: boolean, succeeded: boolean, statusCode: string, ...}}
 */
export function verifyPaymentResult(received) {
  const settings = config();
  const supplied = received.HashDigest;

  if (!supplied) return { valid: false, reason: 'missing-hash' };

  const fields = { ...received, Password: settings.password };
  delete fields.HashDigest;

  const expected = hashString(
    buildHashString(RESPONSE_FIELD_ORDER, fields, settings, { onlyPresent: true }),
    settings
  );

  const a = Buffer.from(String(supplied).toLowerCase());
  const b = Buffer.from(expected.toLowerCase());
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!valid) return { valid: false, reason: 'bad-hash' };

  const statusCode = String(received.StatusCode ?? '');

  return {
    valid: true,
    statusCode,
    // A duplicate means this exact OrderID already went through; the original's
    // outcome is in PreviousStatusCode, so a repeated submit is not a failure.
    succeeded:
      statusCode === STATUS.SUCCESS ||
      (statusCode === STATUS.DUPLICATE &&
        String(received.PreviousStatusCode ?? '') === STATUS.SUCCESS),
    duplicate: statusCode === STATUS.DUPLICATE,
    message: received.Message || '',
    orderId: received.OrderID || '',
    crossReference: received.CrossReference || '',
    amountPence: Number(received.Amount || 0),
    cardLastFour: received.CardNumberLastFour || '',
  };
}
