import Image from "next/image";

export const dynamic = "force-static";

export default function CleanerProfile() {
  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-10 text-white text-center">
          <h1 className="text-4xl font-bold">NVG Cleaning Services</h1>
          <p className="mt-2">Cleaner Verification Profile</p>

          <div className="inline-block mt-4 bg-white text-teal-700 px-4 py-2 rounded-full font-semibold">
            ✓ VERIFIED NVG CLEANER
          </div>

          <p className="mt-3">
            Cleaner ID: NVG-CLN-003
          </p>
        </div>

        <div className="p-8">

          <div className="flex flex-col items-center text-center">
            <Image
              src="/cleaners/oluwatobi-bakare.jpg"
              alt="Oluwatobi Bakare"
              width={220}
              height={220}
              className="rounded-full border-4 border-teal-500"
            />

            <h2 className="text-4xl font-bold mt-5">
              Oluwatobi Bakare
            </h2>

            <p className="text-slate-500">
              Professional Cleaner
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <div className="border rounded-2xl p-6">
              <h3 className="font-bold text-2xl mb-4">
                Cleaner Information
              </h3>

              <p><strong>Status:</strong> Active Cleaner</p>

              <p><strong>Cleaner ID:</strong> NVG-CLN-003</p>
            </div>

            <div className="border rounded-2xl p-6">
              <h3 className="font-bold text-2xl mb-4">
                Verification Status
              </h3>

              <p>✓ Identity Verified</p>

              <p>✓ Right To Work Verified</p>

              <p>✓ NVG Approved Cleaner</p>

              <p>✓ Covered Under NVG Insurance</p>
            </div>

          </div>

          <div className="mt-8 bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center">

            <h3 className="font-bold text-2xl mb-4">
              Verify This Cleaner
            </h3>

            <Image
              src="/qr/oluwatobi-bakare-qr.png"
              alt="Verification QR Code"
              width={200}
              height={200}
              className="mx-auto"
            />

          </div>

        </div>
      </div>
    </main>
  );
}
