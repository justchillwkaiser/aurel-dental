export default function BookLoading() {
  return (
    <div aria-busy="true" aria-label="Loading booking wizard">
      <section className="border-b border-[var(--line)] bg-[var(--panel)]">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-10 lg:py-14 space-y-3">
          <div className="h-3 w-44 rounded-[2px] atelier-skeleton" />
          <div className="h-10 w-full max-w-lg rounded-[2px] atelier-skeleton" />
          <div className="h-4 w-full max-w-md rounded-[2px] atelier-skeleton" />
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-10 space-y-8">
        <div className="h-24 rounded-[var(--radius-container)] border border-[var(--line)] atelier-skeleton" />
        <div className="grid gap-8 lg:grid-cols-[1.22fr_0.78fr]">
          <div className="h-[460px] rounded-[var(--radius-container)] border border-[var(--line)] atelier-skeleton" />
          <div className="h-[340px] rounded-[var(--radius-container)] border border-[var(--line)] atelier-skeleton" />
        </div>
      </div>
    </div>
  );
}
