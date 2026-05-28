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

const hourOptions = ['2 hours', '3 hours', '4 hours', '6 hours', 'Other'];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  service: serviceOptions[0],
  hours: '',
  customHours: '',
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
  const showCustomHours = showHours && formData.hours === 'Other';

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => {
      if (name === 'service' && !value.includes('/hour')) {
        return { ...current, service: value, hours: '', customHours: '' };
      }

      if (name === 'hours' && value !== 'Other') {
        return { ...current, hours: value, customHours: '' };
      }

      return { ...current, [name]: value };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const payload = {
        ...formData,
        hours: formData.hours === 'Other' ? formData.customHours : formData.hours,
      };

      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
  const labelClass = 'mb-2 block text-sm font-black text-slate-900';

  return (
    <form onSubmit={handleSubmit} className="card grid gap-4 p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" value={formData.name} onChange={handleChange} required placeholder="Full name" className={inputClass} />
        <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone number" className={inputClass} />
      </div>

      <input name="email" value={formData.email} onChange={handleChange} type="email" required placeholder="Email address" className={inputClass} />

      <div>
        <label htmlFor="address" className={labelClass}>Property address *</label>
        <input id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="Enter the full cleaning address" className={inputClass} />
      </div>

      <div>
        <label htmlFor="service" className={labelClass}>Cleaning type *</label>
        <select id="service" name="service" value={formData.service} onChange={handleChange} required className={inputClass}>
          {serviceOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>

      {showHours && (
        <div>
          <label htmlFor="hours" className={labelClass}>Number of hours *</label>
          <select id="hours" name="hours" value={formData.hours} onChange={handleChange} required className={inputClass}>
            <option value="">Select hours</option>
            {hourOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      )}

      {showCustomHours && (
        <div>
          <label htmlFor="customHours" className={labelClass}>Specify hours *</label>
          <input id="customHours" name="customHours" value={formData.customHours} onChange={handleChange} required placeholder="Enter preferred hours" className={inputClass} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelClass}>Preferred cleaning date *</label>
          <input id="date" name="date" value={formData.date} onChange={handleChange} type="date" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="time" className={labelClass}>Preferred cleaning time *</label>
          <input id="time" name="time" value={formData.time} onChange={handleChange} type="time" required className={inputClass} />
        </div>
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
