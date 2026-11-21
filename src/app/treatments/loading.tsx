export default function TreatmentsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading treatments catalog">
      <section className="border-b border-[var(--line)] bg-[var(--panel)]">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16 space-y-3">
          <div className="h-3 w-48 rounded-[2px] atelier-skeleton" />
          <div className="h-10 w-full max-w-xl rounded-[2px] atelier-skeleton" />
          <div className="h-4 w-full max-w-lg rounded-[2px] atelier-skeleton" />
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-10 space-y-6">
        <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 md:flex-row md:justify-between">
          <div className="h-10 w-80 rounded-[var(--radius-control)] atelier-skeleton" />
          <div className="h-10 w-full md:w-80 rounded-[var(--radius-control)] atelier-skeleton" />
        </div>

        <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className="grid gap-6 py-6 lg:grid-cols-[1.35fr_0.9fr_auto] lg:items-center"
            >
              <div className="space-y-2.5">
                <div className="h-3 w-36 rounded-[2px] atelier-skeleton" />
                <div className="h-7 w-72 rounded-[2px] atelier-skeleton" />
                <div className="h-4 w-full max-w-xl rounded-[2px] atelier-skeleton" />
              </div>
              <div className="h-24 rounded-[var(--radius-control)] border border-[var(--line)] atelier-skeleton" />
              <div className="h-10 w-36 rounded-[var(--radius-control)] atelier-skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
