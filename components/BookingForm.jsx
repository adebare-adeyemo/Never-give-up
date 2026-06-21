'use client';

import { useMemo, useState } from 'react';

const serviceOptions = [
  'Regular Domestic Cleaning — £20/hour',
  'Ironing Service — from £15/hour',
  'Deep Cleaning — fixed quote from £120',
  'Airbnb Cleaning — from £55',
  'End of Tenancy Cleaning — custom quote',
  'Office Cleaning — custom quote',
  'Restaurant Cleaning — custom quote',
  'Pressure Washing — from £60',
];

const deepCleaningSizes = [
  'Studio/1 Bed — from £120',
  '2 Bedroom — from £160',
  '3 Bedroom — from £250',
  '4 Bedroom — from £350',
  '5+ Bedroom — from £500+',
];

const hourOptions = ['2 hrs', '3 hrs', '4 hrs', '6 hrs', 'Other'];

const addOnOptions = [
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

const initialForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  service: serviceOptions[0],
  deepCleaningSize: '',
  hours: '',
  date: '',
  time: '',
  propertySize: '',
  addons: [],
  notes: '',
};

export default function BookingForm() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showDeepCleaningSizes = useMemo(() => formData.service.includes('Deep Cleaning'), [formData.service]);
  const showOtherHours = formData.hours === 'Other';

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => {
      const next = { ...current, [name]: value };
      if (name === 'service' && !value.includes('Deep Cleaning')) next.deepCleaningSize = '';
      if (name === 'hours' && value !== 'Other') next.customHours = '';
      return next;
    });
  }

  function handleAddonChange(event) {
    const { value, checked } = event.target;
    setFormData((current) => ({
      ...current,
      addons: checked ? [...current.addons, value] : current.addons.filter((item) => item !== value),
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
      if (!response.ok) throw new Error(result?.message || 'Something went wrong. Please try again.');

      setStatus({ type: 'success', message: 'Thank you. Your booking request has been sent to NVG Cleaning Services.' });
      setFormData(initialForm);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Sorry, your request could not be sent. Please call or WhatsApp us.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = 'block w-full min-w-0 min-h-[58px] rounded-2xl border border-slate-300 bg-white px-4 py-4 text-base font-semibold text-[#0f172a] placeholder:text-slate-500 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/15';
  const labelClass = 'text-sm font-black text-[#0f172a]';

  return (
    <form onSubmit={handleSubmit} className="card grid gap-5 p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Full name *</span>
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Phone number *</span>
          <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Enter your phone number" className={inputClass} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Email address *</span>
          <input name="email" value={formData.email} onChange={handleChange} type="email" required placeholder="Enter your email address" className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Property address *</span>
          <input name="address" value={formData.address} onChange={handleChange} required placeholder="Enter the full cleaning address" className={inputClass} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Cleaning type *</span>
          <select name="service" value={formData.service} onChange={handleChange} required className={inputClass}>
            {serviceOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>

        {showDeepCleaningSizes && (
          <label className="grid gap-2">
            <span className={labelClass}>Deep cleaning property size *</span>
            <select name="deepCleaningSize" value={formData.deepCleaningSize} onChange={handleChange} required className={inputClass}>
              <option value="">Select property size</option>
              {deepCleaningSizes.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Preferred date *</span>
          <input name="date" value={formData.date} onChange={handleChange} type="date" required className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Preferred time *</span>
          <input name="time" value={formData.time} onChange={handleChange} type="time" required className={inputClass} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>How many hours? *</span>
          <select name="hours" value={formData.hours} onChange={handleChange} required className={inputClass}>
            <option value="">Select hours</option>
            {hourOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Property size / type</span>
          <input name="propertySize" value={formData.propertySize} onChange={handleChange} placeholder="e.g. 2 bedroom, office, restaurant" className={inputClass} />
        </label>
      </div>

      {showOtherHours && (
        <label className="grid gap-2">
          <span className={labelClass}>Other hours</span>
          <input name="customHours" value={formData.customHours || ''} onChange={handleChange} placeholder="Type the number of hours needed" className={inputClass} />
        </label>
      )}

      <fieldset className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <legend className="px-2 text-sm font-black text-[#0f172a]">Add-on services (optional)</legend>
        <p className="mb-4 text-sm font-medium text-slate-600">Select any extra services you may need.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {addOnOptions.map((option) => (
            <label key={option} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold text-[#0f172a]">
              <input type="checkbox" value={option} checked={formData.addons.includes(option)} onChange={handleAddonChange} className="mt-1 h-4 w-4 accent-cyan-600" />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-2">
        <span className={labelClass}>Additional notes</span>
        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any special instructions or notes?" rows="4" className={inputClass} />
      </label>

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
