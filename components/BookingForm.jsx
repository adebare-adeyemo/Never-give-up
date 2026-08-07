'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';

const SERVICE_OPTIONS = [
  'Regular Domestic Cleaning — £20/hour',
  'Ironing Service — from £15/hour',
  'Deep Cleaning — fixed quote from £120',
  'Airbnb Cleaning — from £55',
  'End of Tenancy Cleaning — custom quote',
  'Office Cleaning — custom quote',
  'Restaurant Cleaning — custom quote',
  'Pressure Washing — from £60',
];

const DEEP_CLEANING_SIZES = [
  'Studio/1 Bed — from £120',
  '2 Bedroom — from £160',
  '3 Bedroom — from £250',
  '4 Bedroom — from £350',
  '5+ Bedroom — from £500+',
];

const HOUR_OPTIONS = ['2 hrs', '3 hrs', '4 hrs', '6 hrs', 'Other'];

const ADDON_OPTIONS = [
  'Inside Fridge — £20',
  'Inside Oven — £35',
  'Ironing Service — from £15/hour',
  'Carpet cleaning',
  'Heavy mould',
  'Pet hair',
  'Upholstery cleaning',
  'Nicotine staining',
  'External windows',
  'Biohazard issues',
  'Balconies',
  'Heavily neglected kitchens / ovens',
];

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  address: '',
  service: SERVICE_OPTIONS[0],
  deepCleaningSize: '',
  hours: '',
  customHours: '',
  date: '',
  time: '',
  propertySize: '',
  addons: [],
  notes: '',
  consent: false,
  company: '', // honeypot — must stay empty
};

export default function BookingForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const statusRef = useRef(null);

  const showDeepCleaningSizes = useMemo(
    () => formData.service.includes('Deep Cleaning'),
    [formData.service]
  );
  const showOtherHours = formData.hours === 'Other';

  /*
   * Stop people picking a date in the past. Built from local date components,
   * not toISOString() — that returns the UTC day, so during BST anyone loading
   * the form between midnight and 1am would be offered "yesterday".
   */
  const today = useMemo(() => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((current) => {
      const next = { ...current, [name]: type === 'checkbox' ? checked : value };
      if (name === 'service' && !value.includes('Deep Cleaning')) next.deepCleaningSize = '';
      if (name === 'hours' && value !== 'Other') next.customHours = '';
      return next;
    });
  }

  function handleAddonChange(event) {
    const { value, checked } = event.target;
    setFormData((current) => ({
      ...current,
      addons: checked
        ? [...current.addons, value]
        : current.addons.filter((item) => item !== value),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result?.message || 'Something went wrong. Please try again.');

      setStatus({
        type: 'success',
        message: `Thank you. Your booking request has been sent to ${SITE.name}. We will reply by email shortly.`,
      });
      setFormData(INITIAL_FORM);
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.message ||
          `Sorry, your request could not be sent. Please call ${SITE.phoneDisplay}.`,
      });
    } finally {
      setIsSubmitting(false);
      // Move focus to the result so screen readers and keyboard users notice it.
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-5 p-5 sm:p-7" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="field-label">
            Full name <span aria-hidden="true">*</span>
          </span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            maxLength={120}
            placeholder="Enter your full name"
            className="field"
          />
        </label>
        <label className="grid gap-2">
          <span className="field-label">
            Phone number <span aria-hidden="true">*</span>
          </span>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder="Enter your phone number"
            className="field"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="field-label">
            Email address <span aria-hidden="true">*</span>
          </span>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            placeholder="Enter your email address"
            className="field"
          />
        </label>
        <label className="grid gap-2">
          <span className="field-label">
            Property address <span aria-hidden="true">*</span>
          </span>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            autoComplete="street-address"
            maxLength={300}
            placeholder="Enter the full cleaning address"
            className="field"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="field-label">
            Cleaning type <span aria-hidden="true">*</span>
          </span>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="field"
          >
            {SERVICE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        {showDeepCleaningSizes && (
          <label className="grid gap-2">
            <span className="field-label">
              Deep cleaning property size <span aria-hidden="true">*</span>
            </span>
            <select
              name="deepCleaningSize"
              value={formData.deepCleaningSize}
              onChange={handleChange}
              required
              className="field"
            >
              <option value="">Select property size</option>
              {DEEP_CLEANING_SIZES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="field-label">
            Preferred date <span aria-hidden="true">*</span>
          </span>
          <input
            name="date"
            value={formData.date}
            onChange={handleChange}
            type="date"
            min={today}
            required
            className="field"
          />
        </label>
        <label className="grid gap-2">
          <span className="field-label">
            Preferred time <span aria-hidden="true">*</span>
          </span>
          <input
            name="time"
            value={formData.time}
            onChange={handleChange}
            type="time"
            required
            className="field"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="field-label">
            How many hours? <span aria-hidden="true">*</span>
          </span>
          <select
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            required
            className="field"
          >
            <option value="">Select hours</option>
            {HOUR_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="field-label">Property size / type</span>
          <input
            name="propertySize"
            value={formData.propertySize}
            onChange={handleChange}
            maxLength={120}
            placeholder="e.g. 2 bedroom, office, restaurant"
            className="field"
          />
        </label>
      </div>

      {showOtherHours && (
        <label className="grid gap-2">
          <span className="field-label">Other hours</span>
          <input
            name="customHours"
            value={formData.customHours}
            onChange={handleChange}
            maxLength={40}
            placeholder="Type the number of hours needed"
            className="field"
          />
        </label>
      )}

      <fieldset className="rounded-4xl border border-slate-200 bg-slate-50 p-4">
        <legend className="px-2 text-sm font-bold text-ink">Add-on services (optional)</legend>
        <p className="mb-4 text-sm text-ink-muted">Select any extra services you may need.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ADDON_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold text-ink"
            >
              <input
                type="checkbox"
                value={option}
                checked={formData.addons.includes(option)}
                onChange={handleAddonChange}
                className="mt-0.5 h-4 w-4 accent-nvg-700"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-2">
        <span className="field-label">Additional notes</span>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          maxLength={2000}
          placeholder="Any special instructions or notes?"
          rows="4"
          className="field"
        />
      </label>

      {/*
        Honeypot. Hidden from sighted users and from assistive tech, but a bot
        that fills every input will trip it. Not `display:none` — some bots skip
        those — so it is moved off-screen instead.
      */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="company">Company (leave this field empty)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.company}
          onChange={handleChange}
        />
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-ink-muted">
        <input
          type="checkbox"
          name="consent"
          checked={formData.consent}
          onChange={handleChange}
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-nvg-700"
        />
        <span>
          I agree that {SITE.name} may use the details above to respond to my booking request, as
          described in the{' '}
          <Link href="/privacy" className="font-bold text-nvg-700 underline">
            Privacy Policy
          </Link>
          . <span aria-hidden="true">*</span>
        </span>
      </label>

      <button
        className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending…' : 'Send Booking Request'}
      </button>

      {/* Always in the DOM so assistive tech announces changes. */}
      <p
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={
          status.message
            ? `rounded-2xl p-4 text-sm font-semibold ${
                status.type === 'success' ? 'bg-nvg-50 text-nvg-800' : 'bg-red-50 text-red-800'
              }`
            : 'sr-only'
        }
      >
        {status.message}
      </p>

      <p className="text-sm text-ink-subtle">
        Booking requests are sent to{' '}
        <a className="font-bold text-nvg-700 underline" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        . You can also call{' '}
        <a className="font-bold text-nvg-700 underline" href={SITE.phoneHref}>
          {SITE.phoneDisplay}
        </a>
        .
      </p>
    </form>
  );
}
