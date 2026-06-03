import BookingForm from '@/components/BookingForm';

export const metadata = {
  title: 'Book Cleaning Service',
  description: 'Book NVG Cleaning Services or request a free cleaning quote across Leeds and Yorkshire.',
};

export default function Contact() {
  return (
    <main className="section">
      <div className="container">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold">Book a Cleaning Service</h1>
          <p className="mt-4 text-slate-600">Fill the form below and we will reply from <a className="font-bold text-cyan-700 underline" href="mailto:booking@nvgcleaningservices.co.uk">booking@nvgcleaningservices.co.uk</a>.</p>
        </div>

        <div className="mx-auto max-w-5xl">
          <BookingForm />
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
          <div className="card p-6">
            <h2 className="font-extrabold text-xl">Message on WhatsApp</h2>
            <p className="mt-2 text-slate-600">Quick response and easy booking support.</p>
            <a className="btn btn-primary mt-5" href="https://wa.me/443330347101">Chat on WhatsApp</a>
          </div>
          <div className="card p-6">
            <h2 className="font-extrabold text-xl">Call Us Now</h2>
            <p className="mt-2 text-slate-600">Speak directly with our team.</p>
            <a className="btn btn-outline mt-5" href="tel:03330347101">0333 034 7101</a>
          </div>
          <div className="card p-6">
            <h2 className="font-extrabold text-xl">Areas We Cover</h2>
            <p className="mt-2 text-slate-600">Leeds, York, Bradford, Wakefield, Harrogate and nearby Yorkshire areas.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
