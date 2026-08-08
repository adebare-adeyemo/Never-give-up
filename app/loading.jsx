/** Lightweight skeleton shown during route transitions. */
export default function Loading() {
  return (
    <div className="section" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="mx-auto max-w-[1180px] animate-pulse px-5">
        <div className="h-4 w-28 rounded-full bg-slate-200" />
        <div className="mt-6 h-10 w-3/4 rounded-2xl bg-slate-200" />
        <div className="mt-4 h-4 w-full max-w-xl rounded-full bg-slate-100" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((key) => (
            <div key={key} className="h-56 rounded-4xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
