import Image from 'next/image';
import { Check, ShieldCheck } from 'lucide-react';
import { SITE } from '@/lib/site';

/** Renders one cleaner verification badge page. */
export default function CleanerProfile({ cleaner }) {
  return (
    <main className="section bg-slate-100">
      <div className="mx-auto max-w-3xl px-5">
        <div className="overflow-hidden rounded-5xl bg-white shadow-lift">
          <header className="bg-nvg-800 p-8 text-center text-white">
            <h1 className="text-2xl font-extrabold sm:text-3xl">{SITE.name}</h1>
            <p className="mt-2 text-nvg-100">Cleaner Verification Profile</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-nvg-800">
              <ShieldCheck size={18} aria-hidden="true" />
              Verified NVG Cleaner
            </p>
            <p className="mt-3 text-sm text-nvg-100">Cleaner ID: {cleaner.id}</p>
          </header>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <Image
                src={cleaner.photo}
                alt={cleaner.name}
                width={180}
                height={180}
                sizes="180px"
                className="h-[180px] w-[180px] rounded-full border-4 border-nvg-700 object-cover"
              />
              <h2 className="mt-5 text-2xl font-extrabold text-ink sm:text-3xl">{cleaner.name}</h2>
              <p className="text-ink-subtle">Professional Cleaner</p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <section className="rounded-4xl border border-slate-200 p-6">
                <h3 className="text-lg font-extrabold text-ink">Cleaner Information</h3>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex gap-2">
                    <dt className="font-bold text-ink">Status:</dt>
                    <dd className="text-ink-muted">Active Cleaner</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-bold text-ink">Cleaner ID:</dt>
                    <dd className="text-ink-muted">{cleaner.id}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-4xl border border-slate-200 p-6">
                <h3 className="text-lg font-extrabold text-ink">Verification Status</h3>
                <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                  {cleaner.verifications.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-nvg-700"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {cleaner.services.length > 0 && (
              <section className="mt-6 rounded-4xl border border-slate-200 p-6">
                <h3 className="text-lg font-extrabold text-ink">Services Qualified For</h3>
                <ul className="mt-4 grid gap-2 text-sm text-ink-muted md:grid-cols-2">
                  {cleaner.services.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-nvg-700"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-6 rounded-4xl border border-nvg-200 bg-nvg-50 p-6 text-center">
              <h3 className="text-lg font-extrabold text-ink">Verify This Cleaner</h3>
              <Image
                src={cleaner.qr}
                alt={`QR code linking to the verification profile for ${cleaner.name}`}
                width={180}
                height={180}
                sizes="180px"
                className="mx-auto mt-4"
              />
              <p className="mt-3 text-sm text-ink-muted">
                Scan this QR code to verify this cleaner profile.
              </p>
            </section>

            <footer className="mt-6 rounded-4xl bg-navy p-7 text-center text-slate-300">
              <p className="text-lg font-extrabold text-white">{SITE.legalName}</p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>
                  <a href={SITE.phoneHref} className="hover:text-nvg-300">
                    {SITE.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`} className="break-all hover:text-nvg-300">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a href={SITE.url} className="hover:text-nvg-300">
                    nvgcleaningservices.co.uk
                  </a>
                </li>
              </ul>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
