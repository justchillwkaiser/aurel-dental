"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useClinicStore } from "@/lib/clinic-store";
import { formatDisplayDate } from "@/lib/format";
import type { Appointment } from "@/types/clinic";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";

export function ReservationLookup() {
  const {
    treatments,
    clinicians,
    findByReference,
    updateAppointmentStatus,
  } = useClinicStore();

  const [code, setCode] = React.useState("");
  const [searchedCode, setSearchedCode] = React.useState("");
  const [result, setResult] = React.useState<Appointment | null>(null);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [cancelError, setCancelError] = React.useState<string | null>(null);

  const runLookup = (targetCode: string) => {
    const clean = targetCode.trim().toUpperCase();
    setSearchedCode(clean);
    if (!clean) {
      setResult(null);
      return;
    }
    setResult(findByReference(clean) ?? null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runLookup(code);
  };

  const handleConfirmCancel = async () => {
    if (!result) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      const updated = await updateAppointmentStatus(
        result.id,
        "Cancelled",
        "Cancelled via patient reservation lookup."
      );
      setResult(updated);
      setCancelOpen(false);
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Could not cancel reservation."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const matchedTreatment = result
    ? treatments.find((t) => t.id === result.treatmentId)
    : undefined;
  const matchedClinician = result
    ? clinicians.find((c) => c.id === result.clinicianId)
    : undefined;

  return (
    <section
      id="lookup"
      aria-labelledby="lookup-heading"
      className="mt-16 border-t border-[var(--line)] pt-12"
    >
      <div className="rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-lg space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
              Booking Lookup
            </p>
            <h2
              id="lookup-heading"
              className="font-serif text-[24px] leading-[30px] text-[var(--ink-12)]"
            >
              Manage an existing reservation
            </h2>
            <p className="text-[13px] leading-[20px] text-[var(--ink-11)]">
              Enter your reference code to inspect status or release a slot. Try sample codes{" "}
              <button
                type="button"
                onClick={() => {
                  setCode("AUR-4084");
                  runLookup("AUR-4084");
                }}
                className="font-mono text-[12px] underline underline-offset-4 text-[var(--ink-12)] hover:text-[var(--accent-11)]"
              >
                AUR-4084
              </button>{" "}
              or{" "}
              <button
                type="button"
                onClick={() => {
                  setCode("AUR-4085");
                  runLookup("AUR-4085");
                }}
                className="font-mono text-[12px] underline underline-offset-4 text-[var(--ink-12)] hover:text-[var(--accent-11)]"
              >
                AUR-4085
              </button>
              .
            </p>
          </div>

          <search className="w-full lg:w-auto">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <label htmlFor="lookup-ref-code" className="visually-hidden">
                Booking reference code
              </label>
              <div className="relative flex-1 sm:w-56">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ink-9)]"
                  aria-hidden="true"
                />
                <Input
                  id="lookup-ref-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="AUR-4084"
                  className="bg-[var(--raised)] pl-9 font-mono uppercase"
                />
              </div>
              <Button type="submit" variant="primary">
                Check Status
              </Button>
            </form>
          </search>
        </div>

        {searchedCode && !result && (
          <div className="motion-dossier-swap mt-5 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--raised)] p-4 text-[13px] text-[var(--ink-11)]">
            No reservation matched code{" "}
            <span className="font-mono font-medium text-[var(--ink-12)]">
              {searchedCode}
            </span>
            . Check the four-digit suffix and try again.
          </div>
        )}

        {result && (
          <div
            key={result.id + result.status}
            className="motion-dossier-swap mt-5 flex flex-col gap-4 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--raised)] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[13px] font-medium text-[var(--ink-12)]">
                  {result.referenceCode}
                </span>
                <StatusBadge status={result.status} />
              </div>
              <p className="text-[14px] font-medium text-[var(--ink-12)]">
                {result.patientName} ({result.patientAge} yrs) ·{" "}
                {matchedTreatment?.title}
              </p>
              <p className="text-[13px] text-[var(--ink-10)] tabular-nums">
                {formatDisplayDate(result.dateISO)} at {result.timeSlot} with{" "}
                {matchedClinician?.name}
              </p>
            </div>

            {result.status !== "Cancelled" && result.status !== "Completed" && (
              <Button
                type="button"
                variant="destructiveTrigger"
                onClick={() => {
                  setCancelError(null);
                  setCancelOpen(true);
                }}
              >
                Cancel Visit
              </Button>
            )}
          </div>
        )}
      </div>

      {result && (
        <ConfirmationDialog
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          title="Cancel this appointment?"
          description="This marks the appointment as Cancelled and frees the time slot across both patient booking and Staff Portal."
          summaryRows={[
            { label: "Reference", value: result.referenceCode },
            {
              label: "Patient",
              value: `${result.patientName} (${result.patientAge} yrs)`,
            },
            {
              label: "Scheduled",
              value: `${formatDisplayDate(result.dateISO)} at ${result.timeSlot}`,
            },
          ]}
          confirmLabel="Yes, Cancel Appointment"
          pendingLabel="Cancelling…"
          cancelLabel="Keep Appointment"
          destructive
          isPending={isCancelling}
          errorMessage={cancelError}
          onConfirm={handleConfirmCancel}
        />
      )}
    </section>
  );
}
