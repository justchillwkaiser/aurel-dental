"use client";

import * as React from "react";
import { Mail, Phone, UserCheck } from "lucide-react";
import { useClinicStore } from "@/lib/clinic-store";
import { formatDisplayDate, formatRMRange } from "@/lib/format";
import type { Appointment, AppointmentStatus } from "@/types/clinic";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { CopyButton } from "@/components/ui/copy-button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";

interface PatientDetailBodyProps {
  appointment: Appointment;
}

export function PatientDetailBody({ appointment }: PatientDetailBodyProps) {
  const { treatments, clinicians, updateAppointmentStatus } = useClinicStore();

  const [pendingAction, setPendingAction] = React.useState<{
    nextStatus: AppointmentStatus;
    title: string;
    description: string;
    confirmLabel: string;
    destructive: boolean;
  } | null>(null);
  const [cancelReason, setCancelReason] = React.useState("");
  const [isMutating, setIsMutating] = React.useState(false);
  const [mutationError, setMutationError] = React.useState<string | null>(null);

  const treatment = treatments.find((t) => t.id === appointment.treatmentId);
  const clinician = clinicians.find((c) => c.id === appointment.clinicianId);

  const openTransition = (nextStatus: AppointmentStatus) => {
    setMutationError(null);
    setCancelReason("");

    if (nextStatus === "Checked In") {
      setPendingAction({
        nextStatus,
        title: `Check in ${appointment.patientName}?`,
        description:
          "Marks the patient as arrived in the Bangsar reception lounge and alerts the attending clinician.",
        confirmLabel: "Confirm Check-In",
        destructive: false,
      });
    } else if (nextStatus === "In Consultation") {
      setPendingAction({
        nextStatus,
        title: `Begin consultation in ${clinician?.suiteName ?? "suite"}?`,
        description:
          "Updates live suite occupancy to In Consultation for clinical timing.",
        confirmLabel: "Start Consultation",
        destructive: false,
      });
    } else if (nextStatus === "Completed") {
      setPendingAction({
        nextStatus,
        title: "Mark appointment as completed?",
        description:
          "Completes this clinical visit and logs it as finished on today's roster.",
        confirmLabel: "Mark Completed",
        destructive: false,
      });
    } else if (nextStatus === "Cancelled") {
      setPendingAction({
        nextStatus,
        title: `Cancel appointment ${appointment.referenceCode}?`,
        description:
          "This cancels the patient's reservation and immediately releases the suite slot for new bookings.",
        confirmLabel: "Yes, Cancel Appointment",
        destructive: true,
      });
    }
  };

  const handleConfirmTransition = async () => {
    if (!pendingAction) return;
    setIsMutating(true);
    setMutationError(null);
    try {
      await updateAppointmentStatus(
        appointment.id,
        pendingAction.nextStatus,
        pendingAction.nextStatus === "Cancelled" ? cancelReason : undefined
      );
      setPendingAction(null);
    } catch (err) {
      setMutationError(
        err instanceof Error ? err.message : "Could not update appointment."
      );
    } finally {
      setIsMutating(false);
    }
  };

  const isClosed =
    appointment.status === "Completed" || appointment.status === "Cancelled";

  return (
    <>
      <div key={appointment.id} className="motion-dossier-swap space-y-5">
        {/* Reference & Status Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] p-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-medium text-[var(--ink-12)]">
              {appointment.referenceCode}
            </span>
            <CopyButton value={appointment.referenceCode} label="Copy" />
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        {/* Patient Contact & Visit Type */}
        <div className="space-y-2.5 text-[13px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[var(--ink-9)]">Visit Type</span>
            {appointment.isFirstVisit ? (
              <Badge tone="accent">
                <UserCheck className="size-3" aria-hidden="true" />
                First-time
              </Badge>
            ) : (
              <Badge tone="neutral">Returning</Badge>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[var(--ink-9)]">
              <Phone className="size-3.5" aria-hidden="true" />
              Phone
            </span>
            <span className="font-mono text-[12px] font-medium text-[var(--ink-12)] tabular-nums">
              {appointment.phone}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[var(--ink-9)]">
              <Mail className="size-3.5" aria-hidden="true" />
              Email
            </span>
            <span className="font-medium text-[var(--ink-12)] truncate max-w-[210px]">
              {appointment.email}
            </span>
          </div>
        </div>

        {/* Procedure & Suite Details */}
        <dl className="space-y-3 border-t border-[var(--line)] pt-4 text-[13px]">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
              Procedure
            </dt>
            <dd className="mt-0.5 font-medium text-[var(--ink-12)]">
              {treatment?.title ?? appointment.treatmentId}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                Fee Range
              </dt>
              <dd className="mt-0.5 font-mono text-[12px] font-medium text-[var(--ink-12)] tabular-nums">
                {treatment
                  ? formatRMRange(treatment.priceFromRM, treatment.priceToRM)
                  : "Confirmed in suite"}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                Duration
              </dt>
              <dd className="mt-0.5 font-mono text-[12px] font-medium text-[var(--ink-12)] tabular-nums">
                {treatment ? `${treatment.durationMinutes} min` : "60 min"}
              </dd>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                Clinician
              </dt>
              <dd className="mt-0.5 font-medium text-[var(--ink-12)]">
                {clinician?.name}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                Scheduled
              </dt>
              <dd className="mt-0.5 font-mono text-[12px] font-medium text-[var(--ink-12)] tabular-nums">
                {formatDisplayDate(appointment.dateISO)}, {appointment.timeSlot}
              </dd>
            </div>
          </div>
        </dl>

        {/* Clinical Intake Notes */}
        <div className="border-t border-[var(--line)] pt-4 space-y-1.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
            Patient Clinical Notes
          </p>
          <p className="rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] p-3 text-[13px] leading-[20px] text-[var(--ink-11)]">
            {appointment.notes || "No sensitivities or notes recorded."}
          </p>
        </div>

        {appointment.cancellationReason && (
          <div className="rounded-[var(--radius-control)] border border-[var(--red-6)] bg-[var(--red-3)] p-3 text-[13px] text-[var(--red-11)]">
            <p className="font-medium">Cancellation Reason</p>
            <p className="mt-0.5">{appointment.cancellationReason}</p>
          </div>
        )}

        {/* Status Transition Actions */}
        {!isClosed && (
          <div className="border-t border-[var(--line)] pt-4 space-y-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
              Update Patient Status
            </p>
            <div className="flex flex-col gap-2">
              {appointment.status === "Confirmed" && (
                <Button
                  type="button"
                  variant="primary"
                  className="w-full"
                  onClick={() => openTransition("Checked In")}
                >
                  Check In Patient
                </Button>
              )}
              {(appointment.status === "Confirmed" ||
                appointment.status === "Checked In") && (
                <Button
                  type="button"
                  variant={
                    appointment.status === "Checked In"
                      ? "primary"
                      : "secondary"
                  }
                  className="w-full"
                  onClick={() => openTransition("In Consultation")}
                >
                  Start Suite Consultation
                </Button>
              )}
              {appointment.status === "In Consultation" && (
                <Button
                  type="button"
                  variant="primary"
                  className="w-full"
                  onClick={() => openTransition("Completed")}
                >
                  Mark Visit Completed
                </Button>
              )}
              <Button
                type="button"
                variant="destructiveTrigger"
                className="w-full"
                onClick={() => openTransition("Cancelled")}
              >
                Cancel Appointment
              </Button>
            </div>
          </div>
        )}
      </div>

      {pendingAction && (
        <ConfirmationDialog
          open={Boolean(pendingAction)}
          onOpenChange={(open) => !open && setPendingAction(null)}
          title={pendingAction.title}
          description={pendingAction.description}
          summaryRows={[
            { label: "Reference", value: appointment.referenceCode },
            {
              label: "Patient",
              value: `${appointment.patientName} (${appointment.patientAge} yrs)`,
            },
            { label: "New Status", value: pendingAction.nextStatus },
          ]}
          confirmLabel={pendingAction.confirmLabel}
          pendingLabel="Updating…"
          cancelLabel="Keep Current Status"
          destructive={pendingAction.destructive}
          isPending={isMutating}
          errorMessage={mutationError}
          onConfirm={handleConfirmTransition}
        >
          {pendingAction.nextStatus === "Cancelled" && (
            <div className="space-y-1.5">
              <label
                htmlFor="cancel-reason-input"
                className="block text-[12px] font-medium text-[var(--ink-11)]"
              >
                Cancellation Reason (optional)
              </label>
              <Textarea
                id="cancel-reason-input"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Patient requested reschedule or unable to attend..."
                className="min-h-[68px]"
              />
            </div>
          )}
        </ConfirmationDialog>
      )}
    </>
  );
}

interface PatientDetailSheetProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export function PatientDetailSheet({
  appointment,
  onClose,
}: PatientDetailSheetProps) {
  if (!appointment) return null;

  return (
    <Dialog
      open={Boolean(appointment)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        variant="sheet"
        title={appointment.patientName}
        description={`${appointment.patientAge} years old · born ${appointment.dateOfBirth}`}
      >
        <PatientDetailBody appointment={appointment} />
      </DialogContent>
    </Dialog>
  );
}
