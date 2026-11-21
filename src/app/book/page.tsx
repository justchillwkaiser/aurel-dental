import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { ReservationLookup } from "@/components/booking/ReservationLookup";

export const metadata: Metadata = {
  title: "Reserve an Appointment",
  description:
    "Three-step dental and aesthetic suite booking at Aurel Dental & Aesthetics in Bangsar, Kuala Lumpur.",
};

function BookingSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading booking wizard"
    >
      <div className="h-24 rounded-[var(--radius-container)] border border-[var(--line)] atelier-skeleton" />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="h-[460px] rounded-[var(--radius-container)] border border-[var(--line)] atelier-skeleton" />
        <div className="h-[340px] rounded-[var(--radius-container)] border border-[var(--line)] atelier-skeleton" />
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <div>
      {/* Architectural Header */}
      <section className="border-b border-[var(--line)] bg-[var(--panel)]">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-10 lg:py-14">
          <div className="max-w-2xl space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent-11)]">
              Suite Reservation · Jalan Telawi 3
            </p>
            <h1 className="font-serif text-[34px] leading-[40px] tracking-[-0.02em] text-[var(--ink-12)] sm:text-[42px] sm:leading-[48px]">
              Reserve your consultation or procedure
            </h1>
            <p className="text-[15px] leading-[24px] text-[var(--ink-11)]">
              Each reservation allocates a private suite window with one attending
              clinician and syncs immediately with the Staff Portal.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
        <Suspense fallback={<BookingSkeleton />}>
          <BookingFlow />
        </Suspense>

        <ReservationLookup />
      </div>
    </div>
  );
}
