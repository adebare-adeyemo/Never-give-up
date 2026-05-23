'use client';

import { useMemo, useState } from 'react';

const serviceOptions = [
  'Regular Domestic Cleaning — £16.50/hour',
  'Ironing Service — from £15/hour',
  'Deep Cleaning — fixed quote from £120',
  'Airbnb Cleaning — from £55',
  'End of Tenancy Cleaning — custom quote',
  'Office Cleaning — custom quote',
  'Restaurant Cleaning — custom quote',
  'Pressure Washing — from £60',
];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  service: serviceOptions[0],
  hours: '',
  date: '',
  time: '',
  propertySize: '',
  notes: '',
};

export default function BookingForm() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showHours = useMemo(() => formData.service.includes('/hour'), [formData.service]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
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
      if (!response.ok) throw new Error(result?.message || 'Something went wrong. Please try again.');

      setStatus({ type: 'success', message: 'Thank you. Your booking request has been sent to NVG Cleaning Services.' });
      setFormData(initialForm);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Sorry, your request could not be sent. Please call or WhatsApp us.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = 'block w-full min-w-0 min-h-[58px] rounded-2xl border border-cyan-400/20 bg-white px-4 py-4 text-base font-semibold text-[#071316] placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15';

  return (
    <form onSubmit={handleSubmit} className="card grid gap-4 p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" value={formData.name} onChange={handleChange} required placeholder="Full name" className={inputClass} />
        <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone number" className={inputClass} />
      </div>
      <input name="email" value={formData.email} onChange={handleChange} type="email" required placeholder="Email address" className={inputClass} />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Property address" className={inputClass} />

      <select name="service" value={formData.service} onChange={handleChange} className={inputClass}>
        {serviceOptions.map((option) => <option key={option}>{option}</option>)}
      </select>

      {showHours && (
        <input name="hours" value={formData.hours} onChange={handleChange} inputMode="numeric" placeholder="How many hours? Minimum 2 hours for regular cleaning" className={inputClass} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <input name="date" value={formData.date} onChange={handleChange} type="date" className={inputClass} />
        <input name="time" value={formData.time} onChange={handleChange} type="time" className={inputClass} />
      </div>

      <input name="propertySize" value={formData.propertySize} onChange={handleChange} placeholder="Property size e.g. 2 bedroom" className={inputClass} />
      <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional notes" rows="4" className={inputClass} />

      <button className="btn btn-primary w-full justify-center disabled:opacity-60" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Booking Request'}
      </button>

      {status.message && <p className={`text-sm font-semibold ${status.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{status.message}</p>}

      <p className="text-sm text-slate-500">
        Booking requests are sent securely to <a className="font-bold text-cyan-700 underline" href="mailto:booking@nvgcleaningservices.co.uk">booking@nvgcleaningservices.co.uk</a>. You can also call <a className="font-bold text-cyan-700 underline" href="tel:03330347101">0333 034 7101</a>.
      </p>
    </form>
  );
}
