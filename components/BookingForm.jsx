'use client';

import { useState } from 'react';

const serviceOptions = [
  'Regular Domestic Cleaning — from £16.50/hour, minimum 2 hours',
  'Deep Cleaning — fixed price from £120',
  'Airbnb Cleaning — from £55',
  'End of Tenancy Cleaning — custom quote',
  'Office Cleaning — custom quote',
  'Restaurant Cleaning — custom quote',
  'Pressure Washing — from £60',
  'Ironing Service — from £15/hour',
];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  service: serviceOptions[0],
  date: '',
  time: '',
  propertySize: '',
  notes: '',
};

export default function BookingForm() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (!response.ok) {
        throw new Error(result?.message || 'Something went wrong. Please try again.');
      }

      setStatus({
        type: 'success',
        message: 'Thank you. Your booking request has been sent to NVG Cleaning Services.',
      });
      setFormData(initialForm);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Sorry, your request could not be sent. Please call or WhatsApp us.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 grid gap-4">
      <input name="name" value={formData.name} onChange={handleChange} required placeholder="Full name" className="border rounded-xl p-3" />
      <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone number" className="border rounded-xl p-3" />
      <input name="email" value={formData.email} onChange={handleChange} type="email" required placeholder="Email address" className="border rounded-xl p-3" />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Property address" className="border rounded-xl p-3" />

      <select name="service" value={formData.service} onChange={handleChange} className="border rounded-xl p-3">
        {serviceOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>

      <div className="grid md:grid-cols-2 gap-4">
        <input name="date" value={formData.date} onChange={handleChange} type="date" className="border rounded-xl p-3" />
        <input name="time" value={formData.time} onChange={handleChange} type="time" className="border rounded-xl p-3" />
      </div>

      <input name="propertySize" value={formData.propertySize} onChange={handleChange} placeholder="Property size e.g. 2 bedroom" className="border rounded-xl p-3" />
      <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional notes" rows="4" className="border rounded-xl p-3" />

      <button className="btn btn-primary disabled:opacity-60" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Booking Request'}
      </button>

      {status.message && (
        <p className={`text-sm ${status.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {status.message}
        </p>
      )}

      <p className="text-sm text-slate-500">
        Booking requests are sent securely to <a href="mailto:booking@nvgcleaningservices.co.uk" className="font-bold text-nvg">booking@nvgcleaningservices.co.uk</a>.
      </p>
    </form>
  );
}
