import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Terms & Conditions',
  description: `The terms on which ${SITE.legalName} provides domestic, deep, Airbnb, end of tenancy, commercial and pressure washing cleaning services across Leeds and Yorkshire.`,
  alternates: { canonical: '/terms' },
};

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro={`These terms apply to every cleaning service booked with ${SITE.legalName}. Please read them before confirming a booking — by booking, you agree to them.`}
    >
      <h2 id="about-us">1. About us and how to contact us</h2>
      <p>
        These services are provided by {SITE.legalName}, {SITE.address.street},{' '}
        {SITE.address.locality}, {SITE.address.postcode}, United Kingdom.
      </p>
      <ul>
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
        {SITE.vatNumber ? (
          <li>
            <strong>VAT number:</strong> {SITE.vatNumber}
          </li>
        ) : null}
      </ul>
      <p>
        In these terms, &ldquo;<strong>we</strong>&rdquo; and &ldquo;<strong>us</strong>&rdquo; mean{' '}
        {SITE.legalName}; &ldquo;<strong>you</strong>&rdquo; means the person or business booking
        the service; and &ldquo;<strong>the property</strong>&rdquo; means the address at which the
        cleaning is to be carried out.
      </p>

      <h2 id="contract">2. How a contract is formed</h2>
      <ul>
        <li>
          Submitting the booking form, calling or messaging us is a <strong>request</strong>, not a
          confirmed booking.
        </li>
        <li>
          A contract is formed only when we confirm your booking in writing (by email or message)
          with a date, time and price.
        </li>
        <li>
          We may decline a booking — for example if we do not cover your area, cannot resource the
          date, or the work falls outside section&nbsp;12.
        </li>
        <li>
          Quotations are estimates based on the information you give us and are not binding until we
          issue a booking confirmation.
        </li>
      </ul>

      <h2 id="pricing">3. Prices and quotations</h2>
      <ul>
        <li>
          Prices shown on our <Link href="/pricing">pricing page</Link> are{' '}
          <strong>starting prices</strong>. The final price depends on the size, condition and
          accessibility of the property and the work actually required.
        </li>
        <li>Regular domestic cleaning is charged hourly, with a minimum booking of two hours.</li>
        <li>Deep cleans, end of tenancy cleans and commercial work are quoted as a fixed price.</li>
        <li>
          If, on arrival, the property is materially different from what you described, we will tell
          you before starting and agree a revised price with you, or you may cancel at no cost.
        </li>
        <li>
          Add-on services (for example inside the oven or fridge) are charged in addition to the
          headline price.
        </li>
        <li>
          We may revise our prices from time to time. For recurring bookings we will give you at
          least <strong>30 days&rsquo; notice</strong> in writing before any increase applies.
        </li>
      </ul>

      <h2 id="payment">4. Payment</h2>
      <ul>
        <li>
          Unless we agree otherwise in writing, payment is due on the day the work is completed.
        </li>
        <li>We accept bank transfer and card payment. We do not store your card details.</li>
        <li>
          For commercial accounts with agreed credit terms, invoices are payable within{' '}
          <strong>14 days</strong>.
        </li>
        <li>
          We may charge interest on late payment at{' '}
          <strong>8% above the Bank of England base rate</strong> under the Late Payment of
          Commercial Debts (Interest) Act 1998, where that Act applies.
        </li>
        <li>We may suspend further services while an invoice remains unpaid.</li>
      </ul>

      <h2 id="statutory-cancellation">5. Your statutory right to cancel (consumers)</h2>
      <p>
        Because bookings are usually made online, by telephone or away from our premises, they are{' '}
        <strong>distance or off-premises contracts</strong>. Under the Consumer Contracts
        (Information, Cancellation and Additional Charges) Regulations 2013, if you are a consumer
        you have the right to cancel within <strong>14 days</strong> of us confirming your booking,
        without giving a reason.
      </p>
      <ul>
        <li>
          To cancel, simply tell us in writing — email{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or message us. A clear statement is
          enough; you do not need to use a particular form.
        </li>
        <li>
          We will refund all payments received from you within <strong>14 days</strong> of being
          told, using the same payment method you used.
        </li>
        <li>
          <strong>Important:</strong> if you ask us to start work during the 14-day period and we
          do, you must pay for the work reasonably carried out up to the point you cancel. If the
          service has been <strong>fully performed</strong> within that period with your express
          consent, you lose the right to cancel.
        </li>
      </ul>
      <p>
        This section does not apply to business customers, whose cancellation rights are set out in
        section&nbsp;6.
      </p>

      <h2 id="cancellation">6. Cancelling or rescheduling a booked clean</h2>
      <p>Outside the statutory period in section&nbsp;5, the following applies to all customers.</p>
      <ul>
        <li>
          Please give at least <strong>24 hours&rsquo; notice</strong> to cancel or reschedule.
          There is no charge for cancellations made with that notice.
        </li>
        <li>
          Cancellations with less than 24 hours&rsquo; notice may be charged at{' '}
          <strong>50% of the booking value</strong> to cover the reserved slot and staff time.
        </li>
        <li>
          If our cleaner cannot get in — nobody is home, keys do not work, or the alarm cannot be
          disabled — the booking may be charged <strong>in full</strong>. See section&nbsp;7.
        </li>
        <li>
          If <strong>we</strong> need to cancel, we will tell you as soon as possible, offer an
          alternative slot, and refund you in full if no suitable alternative can be arranged.
        </li>
        <li>
          Recurring bookings may be ended by either party on <strong>7 days&rsquo; notice</strong>{' '}
          in writing.
        </li>
      </ul>

      <h2 id="access">7. Access to the property</h2>
      <ul>
        <li>
          You must make sure we can get in at the agreed time — by being there, or by providing
          keys, a key safe code or entry instructions in advance.
        </li>
        <li>
          Where you give us keys, they are held securely and are never labelled with your address.
          Keys are returned when the arrangement ends.
        </li>
        <li>
          Please make sure there is running water, electricity and adequate lighting. We cannot
          complete most cleans without them.
        </li>
        <li>
          Parking that is unavailable, restricted or chargeable may add to your cost; we will always
          tell you first.
        </li>
      </ul>

      <h2 id="your-responsibilities">8. Your responsibilities</h2>
      <ul>
        <li>Secure pets safely away from the areas being cleaned.</li>
        <li>
          Put away or tell us about cash, jewellery, and fragile, valuable or sentimental items so
          we can avoid handling them.
        </li>
        <li>
          Tell us in advance about anything hazardous — damp or mould, pest infestation, broken
          glass, needles, biohazards, loose electrics or unsafe structures.
        </li>
        <li>
          Tell us about surfaces needing special treatment (natural stone, waxed or oiled wood,
          antique or delicate finishes).
        </li>
        <li>Provide a safe working environment free from harassment or abuse of our staff.</li>
      </ul>

      <h2 id="standards">9. Our service standards and re-clean guarantee</h2>
      <p>
        Under the Consumer Rights Act 2015 we must perform our services with{' '}
        <strong>reasonable care and skill</strong>, within a reasonable time and for a reasonable
        price where none was agreed. Nothing in these terms reduces those rights.
      </p>
      <ul>
        <li>
          If you are not happy with any part of the clean, tell us within <strong>24 hours</strong>{' '}
          of completion, with photographs where possible.
        </li>
        <li>
          We will return and re-clean the areas concerned <strong>free of charge</strong>, normally
          within 48 hours or at the next mutually convenient time.
        </li>
        <li>
          The re-clean guarantee applies once per booking, and does not apply where the property has
          been used or altered after we left, where the work was outside the agreed scope, or where
          the issue is caused by pre-existing damage.
        </li>
        <li>
          If a re-clean does not put things right, you may be entitled to a price reduction under
          the Consumer Rights Act 2015.
        </li>
      </ul>

      <h2 id="pre-existing">10. Pre-existing damage and limits of cleaning</h2>
      <ul>
        <li>
          Some marks cannot be removed by cleaning — permanent staining, limescale damage, burns,
          rust, worn or damaged surfaces, and grout or sealant that has perished. We will point
          these out where we can.
        </li>
        <li>
          We are not responsible for pre-existing damage, or for damage that only becomes visible
          once dirt is removed.
        </li>
        <li>
          We do not move heavy furniture or appliances. We will clean around and behind them where
          it is safe to do so.
        </li>
        <li>
          We do not clean externally above ground-floor level, and do not use ladders beyond a safe
          working height.
        </li>
      </ul>

      <h2 id="damage">11. Breakages, damage and claims</h2>
      <ul>
        <li>
          Accidents are rare, but if something is damaged our cleaner will tell you and report it to
          us the same day.
        </li>
        <li>
          Please report any alleged damage within <strong>24 hours</strong> of the clean so we can
          investigate while the facts are fresh. Reporting later may make a claim harder to
          establish, but this does not affect your statutory rights.
        </li>
        <li>
          We will repair or replace the item, or pay reasonable compensation for it, where we are
          responsible.
        </li>
        <li>
          Claims may be settled through our insurers, and an excess may apply to claims made under
          our policy.
        </li>
      </ul>

      <h2 id="liability">12. Our liability to you</h2>
      <p>
        We do <strong>not</strong> exclude or limit our liability in any way where it would be
        unlawful to do so. This includes liability for death or personal injury caused by our
        negligence, for fraud or fraudulent misrepresentation, and for breach of your statutory
        rights as a consumer.
      </p>
      <ul>
        <li>
          We are responsible for loss or damage you suffer that is a foreseeable result of our
          breaking this contract or failing to use reasonable care and skill.
        </li>
        <li>
          We are <strong>not</strong> liable for loss or damage that was not foreseeable at the time
          the contract was made.
        </li>
        <li>
          Except where the law says otherwise, our total liability for any one booking is limited to{' '}
          <strong>
            the greater of the price paid for that booking or the amount recoverable under our
            insurance
          </strong>
          .
        </li>
        <li>
          If you are a business customer, we are not liable for loss of profit, loss of business,
          business interruption or loss of business opportunity.
        </li>
      </ul>

      <h2 id="insurance">13. Insurance</h2>
      <p>
        We hold public liability insurance covering our cleaning operations. A copy of our
        certificate is available on request by emailing{' '}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. You remain responsible for insuring your
        own property and contents.
      </p>

      <h2 id="refuse">14. Health, safety and our right to refuse work</h2>
      <p>
        Our staff may decline to start, or may stop and leave, where they reasonably believe the
        environment is unsafe or unsuitable. Examples include severe pest infestation, biohazardous
        waste, human or animal waste, hazardous materials, extreme unsanitary conditions, unsafe
        structures, or threatening, abusive or discriminatory behaviour. Where work is stopped for
        one of these reasons, the booking may be charged in full.
      </p>

      <h2 id="staff">15. Our staff</h2>
      <p>
        Our cleaners are vetted and, where applicable, right-to-work checked. Please do not directly
        employ or engage a cleaner introduced to you by us, other than through us, for{' '}
        <strong>12 months</strong> after their last visit. Recruiting and training staff is a
        significant cost, and a reasonable referral fee may be payable if you wish to do so.
      </p>

      <h2 id="photography">16. Photography</h2>
      <p>
        We sometimes take before-and-after photographs for quality-control and marketing purposes.
        Photographs never include people, identifying documents or anything that identifies your
        address. If you would prefer we did not photograph your property, simply tell us — we will
        note it on your record.
      </p>

      <h2 id="complaints">17. Complaints</h2>
      <p>
        We want to put problems right quickly. Email{' '}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call{' '}
        <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a> with your booking date, address and
        photographs where relevant. We will acknowledge your complaint within{' '}
        <strong>2 working days</strong> and give a full response within{' '}
        <strong>5 working days</strong>. If you remain unhappy, you may be able to use an
        alternative dispute resolution provider, or take the matter to court.
      </p>

      <h2 id="data">18. Data protection</h2>
      <p>
        We handle your personal data in line with our <Link href="/privacy">Privacy Policy</Link>,
        which explains what we collect, our lawful basis, how long we keep it and your rights under
        the UK GDPR.
      </p>

      <h2 id="force-majeure">19. Events outside our control</h2>
      <p>
        We are not liable for failure or delay caused by events beyond our reasonable control,
        including severe weather, flood, fire, epidemic, utility failure, road closure or industrial
        action. We will contact you as soon as possible and arrange a new date; you may cancel and
        receive a refund for services not yet provided.
      </p>

      <h2 id="changes">20. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The version published on this page when you
        book is the version that applies to that booking. For recurring bookings we will give you
        reasonable notice of any material change.
      </p>

      <h2 id="general">21. General</h2>
      <ul>
        <li>
          We may transfer our rights and obligations to another organisation; we will always tell
          you in writing and this will not affect your rights.
        </li>
        <li>You may only transfer your rights to someone else with our written agreement.</li>
        <li>This contract is between you and us; no other person has any right to enforce it.</li>
        <li>
          If any part of these terms is found to be unlawful, the remaining paragraphs continue in
          force.
        </li>
        <li>A delay in enforcing these terms does not prevent us from enforcing them later.</li>
      </ul>

      <h2 id="law">22. Governing law</h2>
      <p>
        These terms are governed by the law of England and Wales, and disputes may be brought in the
        courts of England and Wales. If you live in Scotland or Northern Ireland, you may also bring
        proceedings in your local courts.
      </p>

      <hr />
      <p>
        See also our <Link href="/privacy">Privacy Policy</Link> and{' '}
        <Link href="/pricing">pricing information</Link>.
      </p>
    </LegalPage>
  );
}
