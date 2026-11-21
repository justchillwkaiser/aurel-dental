export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Loading Doctor & Staff Schedule Portal">
      <section className="border-b border-[#2A2A25] bg-[#151513]">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-10 lg:py-12 space-y-3">
          <div className="h-3 w-52 rounded-[2px] bg-[#2A2A25]" />
          <div className="h-10 w-80 rounded-[2px] bg-[#252521]" />
          <div className="h-4 w-full max-w-lg rounded-[2px] bg-[#252521]" />
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 lg:px-10 space-y-6">
        <div className="h-20 rounded-[var(--radius-container)] border border-[var(--line)] atelier-skeleton" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((k) => (
            <div
              key={k}
              className="h-24 rounded-[var(--radius-container)] border border-[var(--line)] atelier-skeleton"
            />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="h-[420px] rounded-[var(--radius-container)] border border-[var(--line)] atelier-skeleton" />
          <div className="hidden xl:block h-[420px] rounded-[var(--radius-container)] border border-[var(--line)] atelier-skeleton" />
        </div>
      </div>
    </div>
  );
}
