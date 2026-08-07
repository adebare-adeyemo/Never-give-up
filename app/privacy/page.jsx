import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE.legalName} collects, uses, shares and protects your personal data under the UK GDPR and the Data Protection Act 2018.`,
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`This notice explains what personal data ${SITE.legalName} collects, why we collect it, how long we keep it and what rights you have over it.`}
    >
      <h2 id="who-we-are">1. Who we are</h2>
      <p>
        {SITE.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is the{' '}
        <strong>data controller</strong> for the personal data described in this notice. That means
        we decide why and how your personal data is processed.
      </p>
      <ul>
        <li>
          <strong>Address:</strong> {SITE.address.street}, {SITE.address.locality},{' '}
          {SITE.address.postcode}, United Kingdom
        </li>
        <li>
          <strong>Email:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </li>
        <li>
          <strong>Telephone:</strong> <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
        </li>
        {SITE.companyNumber ? (
          <li>
            <strong>Registered in England &amp; Wales, company number:</strong> {SITE.companyNumber}
          </li>
        ) : null}
        {SITE.icoRegistration ? (
          <li>
            <strong>ICO data protection register number:</strong> {SITE.icoRegistration}
          </li>
        ) : null}
      </ul>
      <p>
        We are not required to appoint a Data Protection Officer. Any question about this notice
        should be sent to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2 id="what-we-collect">2. What personal data we collect</h2>
      <p>We only collect what we need in order to quote for and carry out cleaning work.</p>
      <ul>
        <li>
          <strong>Identity and contact data</strong> — your name, email address and telephone
          number.
        </li>
        <li>
          <strong>Property data</strong> — the address where cleaning is to take place, property
          size or type, and access instructions you choose to give us.
        </li>
        <li>
          <strong>Booking data</strong> — the service requested, preferred date and time, hours
          required, any add-on services and any notes you send us.
        </li>
        <li>
          <strong>Correspondence data</strong> — the content of emails, WhatsApp messages, text
          messages and call notes exchanged with us.
        </li>
        <li>
          <strong>Payment data</strong> — records of invoices and payments received. We do{' '}
          <strong>not</strong> collect or store card numbers on this website.
        </li>
        <li>
          <strong>Technical data</strong> — if you consent to analytics, your IP address, device
          type, browser and pages viewed.
        </li>
      </ul>
      <p>
        We do not ask for special category data (such as health information). Please do not include
        it in the notes field of the booking form.
      </p>

      <h2 id="how-we-collect">3. How we collect it</h2>
      <ul>
        <li>Directly from you, when you complete the booking form, call, email or message us.</li>
        <li>
          From a letting agent, landlord or property manager who books a clean on your behalf.
        </li>
        <li>Automatically through cookies and analytics, where you have consented.</li>
      </ul>

      <h2 id="why-we-use-it">4. Why we use it, and our lawful basis</h2>
      <p>
        The UK GDPR requires us to have a lawful basis for each purpose. The table below sets out
        each activity separately so you can see which basis applies and therefore which rights are
        available to you.
      </p>
      <table>
        <thead>
          <tr>
            <th>What we do</th>
            <th>Data used</th>
            <th>Lawful basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Reply to an enquiry and prepare a quote</td>
            <td>Identity, contact, property, booking</td>
            <td>
              <strong>Consent</strong> — you asked us to contact you
            </td>
          </tr>
          <tr>
            <td>Arrange, deliver and invoice a cleaning job</td>
            <td>Identity, contact, property, booking, payment</td>
            <td>
              <strong>Contract</strong> — necessary to perform our agreement with you
            </td>
          </tr>
          <tr>
            <td>Keep accounting and tax records</td>
            <td>Identity, contact, payment</td>
            <td>
              <strong>Legal obligation</strong> — Companies Act and HMRC requirements
            </td>
          </tr>
          <tr>
            <td>Handle complaints, insurance claims and disputes</td>
            <td>All of the above</td>
            <td>
              <strong>Legitimate interests</strong> — defending our legal position and improving
              service quality
            </td>
          </tr>
          <tr>
            <td>Protect the booking form from spam and abuse</td>
            <td>Technical data</td>
            <td>
              <strong>Legitimate interests</strong> — keeping our systems secure and available
            </td>
          </tr>
          <tr>
            <td>Measure website usage with analytics</td>
            <td>Technical data</td>
            <td>
              <strong>Consent</strong> — you may withdraw it at any time
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Where we rely on <strong>legitimate interests</strong>, we have balanced those interests
        against your rights and freedoms and consider that our processing is not unfair or
        unexpected. You can object at any time — see section&nbsp;8.
      </p>
      <p>
        We do not use your personal data for automated decision-making or profiling that produces
        legal or similarly significant effects.
      </p>

      <h2 id="marketing">5. Marketing</h2>
      <p>
        We may send you occasional service updates or offers by email only where you have asked us
        to, or where you are an existing customer and the message relates to a similar cleaning
        service (the &ldquo;soft opt-in&rdquo; permitted by the Privacy and Electronic
        Communications Regulations). Every marketing message includes an unsubscribe link, and you
        can opt out at any time by emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We
        never sell your data or share it with third parties for their own marketing.
      </p>

      <h2 id="who-we-share-with">6. Who we share your data with</h2>
      <p>We share personal data only where it is necessary, and only with:</p>
      <ul>
        <li>
          <strong>Our cleaning staff and vetted subcontractors</strong> — the name, address, access
          details and job notes needed to complete your booking.
        </li>
        <li>
          <strong>Our email and hosting providers</strong> — who process booking enquiries and host
          this website on our instructions.
        </li>
        <li>
          <strong>Our accountant and payment providers</strong> — for invoicing, bookkeeping and
          tax.
        </li>
        <li>
          <strong>Our insurers and professional advisers</strong> — where a claim, complaint or
          dispute arises.
        </li>
        <li>
          <strong>Law enforcement, regulators or courts</strong> — where we are legally required to
          disclose information.
        </li>
      </ul>
      <p>
        All of our suppliers act as processors under a written contract and may only use your data
        on our documented instructions. We never sell your personal data.
      </p>

      <h2 id="international-transfers">7. International transfers</h2>
      <p>
        We aim to keep personal data within the UK. Some of our suppliers (for example website
        hosting and analytics) may process data in the European Economic Area or the United States.
        Where data leaves the UK, we rely on UK adequacy regulations, the UK International Data
        Transfer Agreement, or the UK Addendum to the EU Standard Contractual Clauses. You may
        request details of the safeguards in place by emailing us.
      </p>

      <h2 id="retention">8. How long we keep it</h2>
      <table>
        <thead>
          <tr>
            <th>Record</th>
            <th>Retention period</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Enquiries that do not become bookings</td>
            <td>12 months from last contact</td>
          </tr>
          <tr>
            <td>Customer and booking records</td>
            <td>6 years after the end of our relationship</td>
          </tr>
          <tr>
            <td>Accounting and tax records</td>
            <td>6 years after the end of the relevant financial year (HMRC requirement)</td>
          </tr>
          <tr>
            <td>Complaints, incidents and insurance claims</td>
            <td>6 years after the matter is closed</td>
          </tr>
          <tr>
            <td>Website analytics</td>
            <td>Up to 14 months</td>
          </tr>
        </tbody>
      </table>
      <p>
        At the end of these periods we securely delete or anonymise the data. Where deletion is not
        immediately possible (for example in encrypted backups) we isolate the data until deletion
        is possible.
      </p>

      <h2 id="your-rights">9. Your rights</h2>
      <p>Under the UK GDPR you have the right to:</p>
      <ul>
        <li>
          <strong>Be informed</strong> about how we use your personal data — this notice.
        </li>
        <li>
          <strong>Access</strong> a copy of the personal data we hold about you.
        </li>
        <li>
          <strong>Rectification</strong> of inaccurate or incomplete data.
        </li>
        <li>
          <strong>Erasure</strong> of your data where there is no good reason for us to continue
          holding it.
        </li>
        <li>
          <strong>Restrict processing</strong> while a concern you have raised is investigated.
        </li>
        <li>
          <strong>Data portability</strong> — receive the data you gave us in a structured, commonly
          used, machine-readable format.
        </li>
        <li>
          <strong>Object</strong> to processing based on our legitimate interests, and to direct
          marketing at any time.
        </li>
        <li>
          <strong>Withdraw consent</strong> at any time, where our basis is consent. Withdrawing
          consent does not affect the lawfulness of processing carried out beforehand.
        </li>
        <li>
          <strong>Not be subject</strong> to solely automated decision-making with legal or
          similarly significant effects.
        </li>
      </ul>
      <p>
        To exercise any right, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We will
        respond within <strong>one month</strong>. There is normally no fee. We may ask you to
        confirm your identity before we release information.
      </p>

      <h2 id="cookies">10. Cookies and analytics</h2>
      <p>
        This website sets only the cookies strictly necessary to serve the site unless you tell us
        otherwise. If analytics is enabled, we use Google Analytics to understand which pages are
        useful, which sets cookies that collect usage statistics.
      </p>
      <p>
        We ask before we do this. The analytics script is <strong>not loaded at all</strong> and no
        analytics cookie is set until you press &ldquo;Accept&rdquo; on the cookie banner. If you
        decline, nothing is loaded. You can change or withdraw your choice at any time using the{' '}
        <strong>Cookie settings</strong> link in the footer — withdrawing consent also deletes any
        analytics cookies already stored on your device.
      </p>
      <p>
        You can block or delete cookies in your browser settings at any time. Doing so will not stop
        you using this website. You can also install the{' '}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Analytics opt-out browser add-on
        </a>
        .
      </p>

      <h2 id="security">11. How we keep your data secure</h2>
      <p>
        This website is served over HTTPS and booking submissions are transmitted over an encrypted
        connection. Access to booking emails is limited to staff who need it, accounts are password
        protected, and our cleaning staff are vetted and bound by confidentiality obligations. We
        have procedures to deal with any suspected personal data breach, and will notify you and the
        Information Commissioner&rsquo;s Office where we are legally required to do so.
      </p>

      <h2 id="children">12. Children</h2>
      <p>
        Our services are directed at adults. We do not knowingly collect personal data about
        children. If you believe a child has given us their data, contact us and we will delete it.
      </p>

      <h2 id="third-party-sites">13. Third-party links</h2>
      <p>
        This website links to third-party sites such as Facebook, Instagram and WhatsApp. We are not
        responsible for their privacy practices and encourage you to read their own privacy notices.
      </p>

      <h2 id="changes">14. Changes to this notice</h2>
      <p>
        We review this notice regularly and will update the &ldquo;last updated&rdquo; date at the
        top of the page whenever it changes. Where changes are significant, we will tell customers
        by email.
      </p>

      <h2 id="complaints">15. How to complain</h2>
      <p>
        Please contact us first at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> so we can try
        to put things right. You also have the right to complain to the UK supervisory authority for
        data protection:
      </p>
      <ul>
        <li>
          <strong>Information Commissioner&rsquo;s Office (ICO)</strong>
        </li>
        <li>Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
        <li>
          Helpline: <a href="tel:03031231113">0303 123 1113</a>
        </li>
        <li>
          Website:{' '}
          <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
            ico.org.uk
          </a>
        </li>
      </ul>

      <hr />
      <p>
        See also our <Link href="/terms">Terms &amp; Conditions</Link>, which govern the cleaning
        services we provide.
      </p>
    </LegalPage>
  );
}
