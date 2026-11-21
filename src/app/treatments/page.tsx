import type { Metadata } from "next";
import { TreatmentsCatalog } from "@/components/treatments/TreatmentsCatalog";

export const metadata: Metadata = {
  title: "Treatments & RM Fee Guide",
  description:
    "Transparent RM fee ranges, suite durations, and clinical recovery details across restorative dentistry, porcelain smile design, and facial aesthetics.",
};

export default function TreatmentsPage() {
  return (
    <div>
      {/* Architectural Honed Travertine Header */}
      <section className="border-b border-[var(--line)] bg-[var(--panel)]">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <div className="max-w-2xl space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent-11)]">
              Procedures & Transparent RM Fee Schedule
            </p>
            <h1 className="font-serif text-[34px] leading-[40px] tracking-[-0.02em] text-[var(--ink-12)] sm:text-[44px] sm:leading-[50px]">
              Restorative care, ceramic design, and facial harmony.
            </h1>
            <p className="text-[15px] leading-[24px] text-[var(--ink-11)]">
              All fee ranges are quoted in Malaysian Ringgit (RM) and confirmed
              with an itemized written treatment plan during your initial diagnostic
              appointment.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
        <TreatmentsCatalog />
      </div>
    </div>
  );
}
