"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { TIME_SLOT_GROUPS } from "@/data/clinic-seed";
import { useClinicStore } from "@/lib/clinic-store";
import { calculateAgeFromDOB } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";

export function WalkInModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { treatments, clinicians, todayISO, isSlotReserved, createAppointment } =
    useClinicStore();

  const allSlots = TIME_SLOT_GROUPS.flatMap((g) => g.slots);

  const [patientName, setPatientName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [treatmentId, setTreatmentId] = React.useState(treatments[0].id);
  const [clinicianId, setClinicianId] = React.useState(clinicians[0].id);
  const [pickedDateISO, setPickedDateISO] = React.useState("");
  const dateISO = pickedDateISO || todayISO;
  const [timeSlot, setTimeSlot] = React.useState("16:30");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const agePreview = calculateAgeFromDOB(dateOfBirth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (patientName.trim().length < 2) {
      setError("Enter the patient's full name.");
      return;
    }
    if (!dateOfBirth || agePreview < 1 || agePreview > 115) {
      setError("Enter a valid date of birth.");
      return;
    }
    if (phone.replace(/[^\d]/g, "").length < 8) {
      setError("Enter a valid phone number.");
      return;
    }

    setIsSaving(true);
    try {
      await createAppointment({
        patientName,
        dateOfBirth,
        phone,
        email: email.trim() || "desk-walkin@aureldental.my",
        treatmentId,
        clinicianId,
        dateISO,
        timeSlot,
        isFirstVisit: true,
        notes,
      });
      setPatientName("");
      setDateOfBirth("");
      setPhone("");
      setEmail("");
      setNotes("");
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not schedule walk-in patient."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant="modal"
        title="Add Walk-In or Phone Booking"
        description="Adds a confirmed appointment directly into today's clinic roster."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-[var(--radius-control)] border border-[var(--red-6)] bg-[var(--red-3)] px-3 py-2 text-[13px] text-[var(--red-11)]"
            >
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label
                htmlFor="walkin-name"
                className="block text-[13px] font-medium"
              >
                Patient Full Name
              </label>
              <Input
                id="walkin-name"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Patient name"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="walkin-dob"
                  className="block text-[13px] font-medium"
                >
                  Date of Birth
                </label>
                {agePreview > 0 && (
                  <span className="font-mono text-[11px] text-[var(--accent-11)] tabular-nums">
                    {agePreview} yrs
                  </span>
                )}
              </div>
              <Input
                id="walkin-dob"
                type="date"
                required
                max={todayISO}
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="walkin-phone"
                className="block text-[13px] font-medium"
              >
                Phone Number
              </label>
              <Input
                id="walkin-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+60 12 345 6789"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label
                htmlFor="walkin-treatment"
                className="block text-[13px] font-medium"
              >
                Procedure
              </label>
              <select
                id="walkin-treatment"
                value={treatmentId}
                onChange={(e) => setTreatmentId(e.target.value)}
                className="w-full h-[var(--control-h)] rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] px-3 text-[13px] text-[var(--ink-12)] focus:bg-[var(--raised)]"
              >
                {treatments.map((tr) => (
                  <option key={tr.id} value={tr.id}>
                    {tr.title} ({tr.durationMinutes} min)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="walkin-clinician"
                className="block text-[13px] font-medium"
              >
                Clinician
              </label>
              <select
                id="walkin-clinician"
                value={clinicianId}
                onChange={(e) => setClinicianId(e.target.value)}
                className="w-full h-[var(--control-h)] rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] px-3 text-[13px] text-[var(--ink-12)] focus:bg-[var(--raised)]"
              >
                {clinicians.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="walkin-date"
                  className="block text-[13px] font-medium"
                >
                  Date
                </label>
                <Input
                  id="walkin-date"
                  type="date"
                  value={dateISO}
                  onChange={(e) => setPickedDateISO(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="walkin-slot"
                  className="block text-[13px] font-medium"
                >
                  Slot
                </label>
                <select
                  id="walkin-slot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full h-[var(--control-h)] rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] px-2.5 font-mono text-[13px] text-[var(--ink-12)] tabular-nums focus:bg-[var(--raised)]"
                >
                  {allSlots.map((slot) => {
                    const taken = isSlotReserved(clinicianId, dateISO, slot);
                    return (
                      <option key={slot} value={slot} disabled={taken}>
                        {slot} {taken ? "(Taken)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label
                htmlFor="walkin-notes"
                className="block text-[13px] font-medium"
              >
                Clinical Notes (optional)
              </label>
              <Textarea
                id="walkin-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reason for visit or sensitivity notes..."
                className="min-h-[68px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2
                    className="size-3.5 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Scheduling…</span>
                </>
              ) : (
                <span>Add to Roster</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
