export default function HomeLoading() {
  return (
    <div aria-busy="true" aria-label="Loading Aurel Dental homepage">
      {/* Hero Skeleton */}
      <section className="border-b border-[var(--line)] bg-[var(--ground)]">
        <div className="atelier-skeleton min-h-[540px] lg:min-h-[640px]">
          <div className="mx-auto flex min-h-[540px] lg:min-h-[640px] max-w-[1320px] flex-col justify-end px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
            <div className="max-w-2xl space-y-5">
              <div className="h-3.5 w-64 rounded-[2px] bg-[var(--line)]/70" />
              <div className="h-12 w-full max-w-xl rounded-[2px] bg-[var(--line)]/70" />
              <div className="h-12 w-4/5 rounded-[2px] bg-[var(--line)]/70" />
              <div className="flex gap-3 pt-2">
                <div className="h-11 w-48 rounded-[var(--radius-control)] bg-[var(--line)]/80" />
                <div className="h-11 w-44 rounded-[var(--radius-control)] bg-[var(--line)]/60" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
          <div className="grid divide-y divide-[var(--line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="py-5 sm:px-6 first:sm:pl-0 space-y-2">
                <div className="h-3 w-28 rounded-[2px] atelier-skeleton" />
                <div className="h-4 w-52 rounded-[2px] atelier-skeleton" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
