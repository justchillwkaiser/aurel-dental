"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CalendarPlus,
  Check,
  Clock,
  RefreshCw,
} from "lucide-react";
import { TIME_SLOT_GROUPS } from "@/data/clinic-seed";
import { useClinicStore } from "@/lib/clinic-store";
import {
  buildICSContent,
  calculateAgeFromDOB,
  cn,
  formatDisplayDate,
  formatRMRange,
  formatShortDay,
  getOffsetDateISO,
} from "@/lib/format";
import type { Appointment, TreatmentCategory } from "@/types/clinic";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { CopyButton } from "@/components/ui/copy-button";
import { Input, Textarea } from "@/components/ui/input";
import { useSlidingIndicator } from "@/components/shared/MotionPrimitives";
import { ProgressiveImage } from "@/components/shared/ProgressiveImage";

type FieldKey = "patientName" | "dateOfBirth" | "phone" | "email";

const CATEGORIES: { id: TreatmentCategory; label: string }[] = [
  { id: "restorative", label: "Restorative" },
  { id: "smile-design", label: "Smile Design" },
  { id: "facial-aesthetics", label: "Facial Aesthetics" },
];

export function BookingFlow() {
  const searchParams = useSearchParams();
  const {
    treatments,
    clinicians,
    todayISO,
    isSlotReserved,
    createAppointment,
    updateAppointmentStatus,
    simulateNetworkError,
    setSimulateNetworkError,
  } = useClinicStore();

  const initialTreatmentParam = searchParams.get("treatment");
  const initialCategoryParam = searchParams.get(
    "category"
  ) as TreatmentCategory | null;
  const initialClinicianParam = searchParams.get("clinician");

  const defaultTreatment =
    treatments.find((t) => t.id === initialTreatmentParam) ??
    treatments.find((t) => t.category === initialCategoryParam) ??
    treatments[0];

  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [selectedCategory, setSelectedCategory] =
    React.useState<TreatmentCategory>(defaultTreatment.category);
  const [treatmentId, setTreatmentId] = React.useState<string>(
    defaultTreatment.id
  );

  const [clinicianId, setClinicianId] = React.useState<string>(
    clinicians.find((c) => c.id === initialClinicianParam)?.id ??
      clinicians[0].id
  );
  const dateOptions = React.useMemo(() => {
    if (!todayISO) return [];
    const [y, m, d] = todayISO.split("-").map(Number);
    const base = new Date(y, m - 1, d, 12, 0, 0);
    return Array.from({ length: 7 }, (_, i) => getOffsetDateISO(i, base));
  }, [todayISO]);
  const [pickedDateISO, setPickedDateISO] = React.useState<string>("");
  const dateISO = pickedDateISO || dateOptions[0] || "";
  const [timeSlot, setTimeSlot] = React.useState<string>("");
  const [slotsLoading, setSlotsLoading] = React.useState<boolean>(false);

  // Step 3 intake state
  const [patientName, setPatientName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isFirstVisit, setIsFirstVisit] = React.useState(true);
  const [notes, setNotes] = React.useState("");

  // Post-interaction validation tracking
  const [touched, setTouched] = React.useState<Record<FieldKey, boolean>>({
    patientName: false,
    dateOfBirth: false,
    phone: false,
    email: false,
  });
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = React.useState("");

  // Dialog & outcome states
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [bookingError, setBookingError] = React.useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] =
    React.useState<Appointment | null>(null);

  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [cancelError, setCancelError] = React.useState<string | null>(null);

  const nameInputRef = React.useRef<HTMLInputElement | null>(null);
  const dobInputRef = React.useRef<HTMLInputElement | null>(null);
  const phoneInputRef = React.useRef<HTMLInputElement | null>(null);
  const emailInputRef = React.useRef<HTMLInputElement | null>(null);
  const stepHeadingRef = React.useRef<HTMLHeadingElement | null>(null);

  const { containerRef, registerItem, indicator, remeasure } =
    useSlidingIndicator(selectedCategory);

  React.useEffect(() => {
    if (step === 1) remeasure();
  }, [step, selectedCategory, remeasure]);

  const queryKey = `${initialTreatmentParam ?? ""}|${initialCategoryParam ?? ""}|${initialClinicianParam ?? ""}`;
  const [prevQueryKey, setPrevQueryKey] = React.useState(queryKey);
  if (queryKey !== prevQueryKey) {
    setPrevQueryKey(queryKey);
    if (initialTreatmentParam) {
      const matched = treatments.find((t) => t.id === initialTreatmentParam);
      if (matched) {
        setSelectedCategory(matched.category);
        setTreatmentId(matched.id);
      }
    } else if (
      initialCategoryParam &&
      CATEGORIES.some((c) => c.id === initialCategoryParam)
    ) {
      setSelectedCategory(initialCategoryParam);
      const firstInCat = treatments.find(
        (t) => t.category === initialCategoryParam
      );
      if (firstInCat) setTreatmentId(firstInCat.id);
    }

    if (initialClinicianParam) {
      const doc = clinicians.find((c) => c.id === initialClinicianParam);
      if (doc) setClinicianId(doc.id);
    }
  }

  // Brief realistic availability check when clinician or date shifts.
  const triggerSlotCheck = (nextClinician: string, nextDate: string) => {
    setSlotsLoading(true);
    setClinicianId(nextClinician);
    setPickedDateISO(nextDate);
    setTimeSlot("");
    window.setTimeout(() => {
      setSlotsLoading(false);
    }, 180);
  };

  const selectedTreatment =
    treatments.find((t) => t.id === treatmentId) ?? treatments[0];
  const selectedClinician =
    clinicians.find((c) => c.id === clinicianId) ?? clinicians[0];
  const categoryTreatments = treatments.filter(
    (t) => t.category === selectedCategory
  );

  const calculatedAge = React.useMemo(
    () => calculateAgeFromDOB(dateOfBirth),
    [dateOfBirth]
  );

  const validationErrors = React.useMemo(() => {
    const errors: Partial<Record<FieldKey, string>> = {};

    if (!patientName.trim() || patientName.trim().length < 2) {
      errors.patientName =
        "Enter the patient's full name (at least 2 characters).";
    }

    if (!dateOfBirth) {
      errors.dateOfBirth = "Select a date of birth to confirm patient age.";
    } else {
      const age = calculateAgeFromDOB(dateOfBirth);
      const dobYear = Number(dateOfBirth.split("-")[0]);
      if (Number.isNaN(dobYear) || dobYear < 1910 || age < 1 || age > 115) {
        errors.dateOfBirth =
          "Enter a valid date of birth between 1 and 115 years ago.";
      }
    }

    const digitsOnly = phone.replace(/[^\d]/g, "");
    if (!phone.trim() || digitsOnly.length < 8) {
      errors.phone =
        "Enter a reachable contact number with at least 8 digits.";
    }

    const emailTrimmed = email.trim();
    if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errors.email = "Enter an email address in the format you@example.my.";
    }

    return errors;
  }, [dateOfBirth, email, patientName, phone]);

  const showError = (field: FieldKey): string | undefined => {
    if (!touched[field] && !submitAttempted) return undefined;
    return validationErrors[field];
  };

  const markBlurred = (field: FieldKey) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (validationErrors[field]) {
      setLiveAnnouncement(validationErrors[field] ?? "");
    }
  };

  const handleStepChange = (nextStep: 1 | 2 | 3) => {
    setStep(nextStep);
    setBookingError(null);
    window.setTimeout(() => {
      stepHeadingRef.current?.focus();
    }, 50);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setBookingError(null);

    if (Object.keys(validationErrors).length > 0) {
      const firstKey = (
        ["patientName", "dateOfBirth", "phone", "email"] as FieldKey[]
      ).find((key) => validationErrors[key]);
      if (firstKey === "patientName") nameInputRef.current?.focus();
      else if (firstKey === "dateOfBirth") dobInputRef.current?.focus();
      else if (firstKey === "phone") phoneInputRef.current?.focus();
      else if (firstKey === "email") emailInputRef.current?.focus();

      if (firstKey) {
        setLiveAnnouncement(
          validationErrors[firstKey] ?? "Please check highlighted fields."
        );
      }
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setBookingError(null);
    try {
      const created = await createAppointment({
        patientName,
        dateOfBirth,
        phone,
        email,
        treatmentId,
        clinicianId,
        dateISO,
        timeSlot,
        isFirstVisit,
        notes,
      });
      setConfirmOpen(false);
      setConfirmedBooking(created);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to complete reservation right now.";
      setBookingError(message);
      setConfirmOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadICS = (apt: Appointment) => {
    const tr =
      treatments.find((t) => t.id === apt.treatmentId) ?? selectedTreatment;
    const doc =
      clinicians.find((c) => c.id === apt.clinicianId) ?? selectedClinician;
    const content = buildICSContent({
      referenceCode: apt.referenceCode,
      title: tr.title,
      clinicianName: doc.name,
      dateISO: apt.dateISO,
      timeSlot: apt.timeSlot,
      durationMinutes: tr.durationMinutes,
      patientName: apt.patientName,
    });
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aurel-${apt.referenceCode.toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCancelConfirmed = async () => {
    if (!confirmedBooking) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      const updated = await updateAppointmentStatus(
        confirmedBooking.id,
        "Cancelled",
        "Cancelled from patient booking receipt."
      );
      setConfirmedBooking(updated);
      setCancelModalOpen(false);
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Could not cancel reservation."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const startFreshBooking = () => {
    setConfirmedBooking(null);
    setStep(1);
    setTimeSlot("");
    setPatientName("");
    setDateOfBirth("");
    setPhone("");
    setEmail("");
    setNotes("");
    setSubmitAttempted(false);
    setTouched({
      patientName: false,
      dateOfBirth: false,
      phone: false,
      email: false,
    });
    setBookingError(null);
  };

  // Peak-End Confirmation Receipt View (Paper Artboard 05)
  if (confirmedBooking) {
    const bookedTreatment =
      treatments.find((t) => t.id === confirmedBooking.treatmentId) ??
      selectedTreatment;
    const bookedClinician =
      clinicians.find((c) => c.id === confirmedBooking.clinicianId) ??
      selectedClinician;

    return (
      <div className="motion-dossier-swap mx-auto max-w-[780px] space-y-6">
        <div className="rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--raised)] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--line)] pb-6">
            <div>
              <StatusBadge status={confirmedBooking.status} />
              <h2 className="mt-3 font-serif text-[28px] leading-[34px] text-[var(--ink-12)]">
                {confirmedBooking.status === "Cancelled"
                  ? "This reservation has been cancelled"
                  : "Your suite time is reserved"}
              </h2>
              <p className="mt-1.5 text-[14px] leading-[22px] text-[var(--ink-11)]">
                {confirmedBooking.status === "Cancelled"
                  ? "The slot has been released back to the clinic calendar and synced with the Staff Portal."
                  : "Your reservation appears immediately in the Doctor & Staff Portal for suite preparation."}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                Reference Code
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[20px] font-medium tracking-[0.04em] text-[var(--ink-12)] tabular-nums">
                  {confirmedBooking.referenceCode}
                </span>
                <CopyButton
                  value={confirmedBooking.referenceCode}
                  label="Copy ID"
                />
              </div>
            </div>
          </div>

          <dl className="grid divide-y divide-[var(--line)] rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] sm:grid-cols-2 sm:divide-x">
            <div className="p-4">
              <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                Patient
              </dt>
              <dd className="mt-1 text-[14px] font-medium text-[var(--ink-12)] tabular-nums">
                {confirmedBooking.patientName} ({confirmedBooking.patientAge} yrs)
              </dd>
            </div>
            <div className="p-4">
              <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                Attending Clinician
              </dt>
              <dd className="mt-1 text-[14px] font-medium text-[var(--ink-12)]">
                {bookedClinician.name} ({bookedClinician.suiteName})
              </dd>
            </div>
            <div className="p-4 border-t border-[var(--line)]">
              <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                Procedure
              </dt>
              <dd className="mt-1 text-[14px] font-medium text-[var(--ink-12)]">
                {bookedTreatment.title}
              </dd>
            </div>
            <div className="p-4 border-t border-[var(--line)]">
              <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                Date & Time
              </dt>
              <dd className="mt-1 text-[14px] font-medium text-[var(--ink-12)] tabular-nums">
                {formatDisplayDate(confirmedBooking.dateISO)} at{" "}
                {confirmedBooking.timeSlot}
              </dd>
            </div>
          </dl>

          {confirmedBooking.status !== "Cancelled" && (
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                Before You Arrive (28 Jalan Telawi 3, Bangsar)
              </p>
              <ul className="space-y-2.5">
                {bookedTreatment.prepChecklist.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13px] leading-[20px] text-[var(--ink-11)]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--accent-6)] bg-[var(--accent-3)] text-[var(--accent-11)]"
                    >
                      <Check
                        className="motion-check-draw size-3"
                        style={{ animationDelay: `${i * 75}ms` }}
                        strokeWidth={2.4}
                      />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {confirmedBooking.status !== "Cancelled" && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleDownloadICS(confirmedBooking)}
                  >
                    <CalendarPlus className="size-4" aria-hidden="true" />
                    <span>Add to Calendar (.ics)</span>
                  </Button>
                  <Button
                    type="button"
                    variant="destructiveTrigger"
                    onClick={() => {
                      setCancelError(null);
                      setCancelModalOpen(true);
                    }}
                  >
                    Cancel Reservation
                  </Button>
                </>
              )}
              <Button type="button" variant="ghost" onClick={startFreshBooking}>
                Book Another Visit
              </Button>
            </div>

            <Button asChild variant="primary">
              <Link href="/dashboard">View in Staff Portal</Link>
            </Button>
          </div>
        </div>

        <ConfirmationDialog
          open={cancelModalOpen}
          onOpenChange={setCancelModalOpen}
          title="Cancel this reservation?"
          description="Releasing this appointment opens the suite time for other patients and updates the Staff Portal immediately."
          summaryRows={[
            { label: "Reference", value: confirmedBooking.referenceCode },
            { label: "Patient", value: confirmedBooking.patientName },
            {
              label: "Scheduled",
              value: `${formatDisplayDate(confirmedBooking.dateISO)} at ${confirmedBooking.timeSlot}`,
            },
          ]}
          confirmLabel="Yes, Cancel Reservation"
          pendingLabel="Cancelling…"
          cancelLabel="Keep Reservation"
          destructive
          isPending={isCancelling}
          errorMessage={cancelError}
          onConfirm={handleCancelConfirmed}
        />
      </div>
    );
  }

  const progressRatio = step === 1 ? 0.333 : step === 2 ? 0.667 : 1;
  const progressPercent = step === 1 ? 33 : step === 2 ? 67 : 100;
  const proximityCue =
    step === 1
      ? "Choose a procedure to view matching suite times."
      : step === 2
      ? "Almost done. One final step remains after picking your time."
      : "Final step. Confirm your details to reserve the suite.";

  return (
    <div className="space-y-8">
      {/* Precision Swiss Progress Caliper Rail */}
      <div className="rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--raised)] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <nav
            aria-label="Booking progress"
            className="flex flex-wrap items-center gap-2"
          >
            {[
              { num: 1 as const, label: "01. Care" },
              { num: 2 as const, label: "02. Schedule" },
              { num: 3 as const, label: "03. Details" },
            ].map((item) => {
              const active = step === item.num;
              const completed = step > item.num;
              const canJump =
                item.num < step || (item.num === 2 && Boolean(treatmentId));
              return (
                <button
                  key={item.num}
                  type="button"
                  disabled={!canJump && !active}
                  aria-current={active ? "step" : undefined}
                  onClick={() => {
                    if (item.num < step) handleStepChange(item.num);
                  }}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-control)] border px-3 font-mono text-[12px] tracking-[0.02em] font-medium transition-[background-color,border-color,color] duration-150",
                    active
                      ? "border-[var(--primary-bg)] bg-[var(--primary-bg)] text-[var(--primary-fg)]"
                      : completed
                      ? "border-[var(--accent-6)] bg-[var(--accent-3)] text-[var(--accent-11)]"
                      : "border-[var(--line)] bg-[var(--panel)] text-[var(--ink-9)]"
                  )}
                >
                  {completed && <Check className="size-3.5" aria-hidden="true" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <p className="font-mono text-[12px] text-[var(--ink-10)] tabular-nums">
            {progressPercent}% COMPLETE
          </p>
        </div>

        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Appointment reservation progress"
          className="mt-4 h-[3px] w-full overflow-hidden bg-[var(--line)]"
        >
          <div
            className="h-full w-full origin-left bg-[var(--accent-9)] transition-transform duration-[320ms] ease-[var(--ease-caliper)]"
            style={{ transform: `scaleX(${progressRatio})` }}
          />
        </div>
        <p className="mt-2.5 text-[12px] text-[var(--ink-10)]">{proximityCue}</p>
      </div>

      {/* Main Split: Active Step Form + Sticky Suite Reservation Ledger */}
      <div className="grid gap-8 lg:grid-cols-[1.22fr_0.78fr] lg:items-start">
        <div className="rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--raised)] p-5 sm:p-8">
          {step === 1 && (
            <div key="step-1" className="motion-dossier-swap space-y-6">
              <div className="space-y-1">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="font-serif text-[26px] leading-[32px] text-[var(--ink-12)] outline-none"
                >
                  Select the care you would like to reserve
                </h2>
                <p className="text-[14px] text-[var(--ink-11)]">
                  Filtered to three procedures per department so choices remain straightforward.
                </p>
              </div>

              {/* Department Filter with Sliding Plate */}
              <div
                ref={containerRef}
                role="radiogroup"
                aria-label="Clinical departments"
                className="relative inline-flex flex-wrap gap-1 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] p-1"
              >
                {indicator.ready && (
                  <span
                    aria-hidden="true"
                    style={{
                      width: `${indicator.width}px`,
                      transform: `translate3d(${indicator.left - 4}px, 0, 0)`,
                    }}
                    className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-[2px] border border-[var(--line)] bg-[var(--raised)] transition-[transform,width] duration-[220ms] ease-[var(--ease-caliper)] motion-reduce:transition-none"
                  />
                )}

                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      ref={registerItem(cat.id)}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        const first = treatments.find(
                          (t) => t.category === cat.id
                        );
                        if (first) setTreatmentId(first.id);
                      }}
                      className={cn(
                        "relative z-10 h-8 rounded-[2px] px-3.5 text-[13px] font-medium transition-colors duration-150",
                        active
                          ? "text-[var(--ink-12)]"
                          : "text-[var(--ink-9)] hover:text-[var(--ink-12)]"
                      )}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Ruled Procedure Selector Rows */}
              <div
                className="divide-y divide-[var(--line)] border-y border-[var(--line)]"
                role="radiogroup"
                aria-label="Procedures"
              >
                {categoryTreatments.map((tr) => {
                  const picked = tr.id === treatmentId;
                  return (
                    <button
                      key={tr.id}
                      type="button"
                      role="radio"
                      aria-checked={picked}
                      onClick={() => setTreatmentId(tr.id)}
                      className={cn(
                        "relative w-full py-4 pl-4 pr-3 text-left transition-colors duration-150",
                        picked
                          ? "bg-[var(--panel)]"
                          : "bg-transparent hover:bg-[var(--panel)]/50"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-y-0 left-0 w-[2.5px] bg-[var(--accent-9)] origin-top transition-transform duration-200 ease-[var(--ease-caliper)]",
                          picked ? "scale-y-100" : "scale-y-0"
                        )}
                      />

                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[15px] font-medium text-[var(--ink-12)]">
                              {tr.title}
                            </span>
                            {tr.recommendedStarter && (
                              <Badge tone="accent">Recommended first visit</Badge>
                            )}
                          </div>
                          <p className="text-[13px] leading-[20px] text-[var(--ink-11)]">
                            {tr.summary}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[12px] text-[var(--ink-10)] tabular-nums">
                        <span className="font-medium text-[var(--ink-12)]">
                          {formatRMRange(tr.priceFromRM, tr.priceToRM)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" aria-hidden="true" />
                          {tr.durationMinutes} min suite
                        </span>
                        <span className="font-sans">Recovery: {tr.downtimeLabel}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleStepChange(2)}
                  className="gap-1.5"
                >
                  <span>Continue to Schedule</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div key="step-2" className="motion-dossier-swap space-y-7">
              <div className="space-y-1">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="font-serif text-[26px] leading-[32px] text-[var(--ink-12)] outline-none"
                >
                  Choose your clinician and suite time
                </h2>
                <p className="text-[14px] text-[var(--ink-11)]">
                  Reserved times lock automatically to prevent double-booking.
                </p>
              </div>

              {/* Clinician Selection */}
              <div className="space-y-2.5">
                <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                  Attending Clinician
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {clinicians.map((doc) => {
                    const picked = doc.id === clinicianId;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        aria-pressed={picked}
                        onClick={() => triggerSlotCheck(doc.id, dateISO)}
                        className={cn(
                          "flex items-center gap-3 rounded-[var(--radius-control)] border p-2.5 text-left transition-[background-color,border-color,transform] duration-150 active:scale-[0.985]",
                          picked
                            ? "border-[var(--accent-9)] bg-[var(--accent-3)]/50"
                            : "border-[var(--line)] bg-[var(--panel)] hover:border-[var(--ink-8)]"
                        )}
                      >
                        <ProgressiveImage
                          src={doc.avatarUrl}
                          alt={doc.name}
                          width={72}
                          height={96}
                          sizes="48px"
                          wrapperClassName="size-11 rounded-[2px] shrink-0 border border-[var(--line)]"
                          className="h-full w-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-[var(--ink-12)] truncate">
                            {doc.shortName}
                          </p>
                          <p className="font-mono text-[11px] text-[var(--ink-9)] truncate">
                            {doc.suiteName}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 7-Day Date Strip */}
              <div className="space-y-2.5">
                <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                  Preferred Day
                </p>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {dateOptions.map((iso, idx) => {
                    const { weekday, dayNum, month } = formatShortDay(iso);
                    const picked = iso === dateISO;
                    return (
                      <button
                        key={iso}
                        type="button"
                        aria-pressed={picked}
                        onClick={() => triggerSlotCheck(clinicianId, iso)}
                        className={cn(
                          "flex min-h-15 flex-col items-center justify-center rounded-[var(--radius-control)] border px-2 py-2 text-center transition-[background-color,border-color,transform] duration-150 active:scale-[0.97]",
                          picked
                            ? "border-[var(--primary-bg)] bg-[var(--primary-bg)] text-[var(--primary-fg)]"
                            : "border-[var(--line)] bg-[var(--panel)] text-[var(--ink-12)] hover:border-[var(--ink-8)]"
                        )}
                      >
                        <span
                          className={cn(
                            "font-mono text-[10px] uppercase tracking-[0.04em]",
                            picked
                              ? "text-[var(--primary-fg)]/80"
                              : "text-[var(--ink-9)]"
                          )}
                        >
                          {idx === 0 ? "Today" : weekday}
                        </span>
                        <span className="mt-0.5 text-[16px] font-medium tabular-nums">
                          {dayNum}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[10px]",
                            picked
                              ? "text-[var(--primary-fg)]/75"
                              : "text-[var(--ink-9)]"
                          )}
                        >
                          {month}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chunked Time Slots */}
              <div className="space-y-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                  Suite Time ({selectedClinician.name})
                </p>

                {slotsLoading ? (
                  <div
                    className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
                    aria-busy="true"
                    aria-label="Checking slot availability"
                  >
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-11 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] animate-pulse motion-reduce:animate-none"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {TIME_SLOT_GROUPS.map((group) => (
                      <div key={group.label} className="space-y-2">
                        <p className="text-[12px] text-[var(--ink-10)]">
                          {group.label}
                        </p>
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                          {group.slots.map((slot) => {
                            const reserved = isSlotReserved(
                              clinicianId,
                              dateISO,
                              slot
                            );
                            const picked = timeSlot === slot && !reserved;
                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={reserved}
                                aria-pressed={picked}
                                onClick={() => setTimeSlot(slot)}
                                className={cn(
                                  "flex min-h-11 items-center justify-between rounded-[var(--radius-control)] border px-3.5 text-[13px] font-medium tabular-nums transition-[background-color,border-color,transform] duration-150",
                                  reserved
                                    ? "border-[var(--line)] bg-[var(--panel)] text-[var(--ink-8)] opacity-55"
                                    : picked
                                    ? "border-[var(--primary-bg)] bg-[var(--primary-bg)] text-[var(--primary-fg)]"
                                    : "border-[var(--line)] bg-[var(--raised)] text-[var(--ink-12)] hover:border-[var(--ink-8)] active:scale-[0.97]"
                                )}
                              >
                                <span className="font-mono">{slot}</span>
                                <span
                                  className={cn(
                                    "font-mono text-[10px] uppercase tracking-[0.06em]",
                                    picked
                                      ? "text-[#6DB49F]"
                                      : reserved
                                      ? "text-[var(--ink-8)]"
                                      : "text-[var(--accent-11)]"
                                  )}
                                >
                                  {reserved ? "Reserved" : picked ? "Selected" : "Open"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] pt-5">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleStepChange(1)}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={!timeSlot}
                  onClick={() => handleStepChange(3)}
                  className="gap-1.5"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form
              key="step-3"
              onSubmit={handleReviewSubmit}
              noValidate
              className="motion-dossier-swap space-y-5"
            >
              <div className="space-y-1">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="font-serif text-[26px] leading-[32px] text-[var(--ink-12)] outline-none"
                >
                  Patient intake details
                </h2>
                <p className="text-[14px] text-[var(--ink-11)]">
                  Your name, age, and clinical notes prepare your attending clinician ahead of arrival.
                </p>
              </div>

              {bookingError && (
                <div
                  role="alert"
                  className="motion-dossier-swap rounded-[var(--radius-control)] border border-[var(--red-6)] bg-[var(--red-3)] p-4 text-[13px] text-[var(--red-11)] space-y-2.5"
                >
                  <p className="font-medium">Reservation could not be saved</p>
                  <p>{bookingError}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="compact"
                      onClick={() => setConfirmOpen(true)}
                    >
                      <RefreshCw className="size-3.5" aria-hidden="true" />
                      <span>Retry Confirmation</span>
                    </Button>
                    {simulateNetworkError && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="compact"
                        onClick={() => setSimulateNetworkError(false)}
                      >
                        Disable Error Simulation
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="patient-name"
                    className="block text-[13px] font-medium text-[var(--ink-12)]"
                  >
                    Full Name{" "}
                    <span aria-hidden="true" className="text-[var(--red-11)]">
                      *
                    </span>
                  </label>
                  <Input
                    ref={nameInputRef}
                    id="patient-name"
                    name="patientName"
                    type="text"
                    required
                    minLength={2}
                    autoComplete="name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    onBlur={() => markBlurred("patientName")}
                    aria-invalid={Boolean(showError("patientName"))}
                    aria-describedby={
                      showError("patientName") ? "patient-name-error" : undefined
                    }
                    placeholder="Your full name as on IC or passport"
                  />
                  {showError("patientName") && (
                    <p
                      id="patient-name-error"
                      className="text-[12px] text-[var(--red-11)]"
                    >
                      {showError("patientName")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="patient-dob"
                      className="block text-[13px] font-medium text-[var(--ink-12)]"
                    >
                      Date of Birth{" "}
                      <span aria-hidden="true" className="text-[var(--red-11)]">
                        *
                      </span>
                    </label>
                    {calculatedAge > 0 && !validationErrors.dateOfBirth && (
                      <span className="font-mono text-[11px] font-medium text-[var(--accent-11)] tabular-nums">
                        Age: {calculatedAge} yrs
                      </span>
                    )}
                  </div>
                  <Input
                    ref={dobInputRef}
                    id="patient-dob"
                    name="dateOfBirth"
                    type="date"
                    required
                    max={dateOptions[0]}
                    autoComplete="bday"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    onBlur={() => markBlurred("dateOfBirth")}
                    aria-invalid={Boolean(showError("dateOfBirth"))}
                    aria-describedby={
                      showError("dateOfBirth") ? "patient-dob-error" : undefined
                    }
                  />
                  {showError("dateOfBirth") && (
                    <p
                      id="patient-dob-error"
                      className="text-[12px] text-[var(--red-11)]"
                    >
                      {showError("dateOfBirth")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="patient-phone"
                    className="block text-[13px] font-medium text-[var(--ink-12)]"
                  >
                    Mobile Phone{" "}
                    <span aria-hidden="true" className="text-[var(--red-11)]">
                      *
                    </span>
                  </label>
                  <Input
                    ref={phoneInputRef}
                    id="patient-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => markBlurred("phone")}
                    aria-invalid={Boolean(showError("phone"))}
                    aria-describedby={
                      showError("phone") ? "patient-phone-error" : undefined
                    }
                    placeholder="+60 12 345 6789"
                  />
                  {showError("phone") && (
                    <p
                      id="patient-phone-error"
                      className="text-[12px] text-[var(--red-11)]"
                    >
                      {showError("phone")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="patient-email"
                    className="block text-[13px] font-medium text-[var(--ink-12)]"
                  >
                    Email Address{" "}
                    <span aria-hidden="true" className="text-[var(--red-11)]">
                      *
                    </span>
                  </label>
                  <span
                    id="patient-email-hint"
                    className="block text-[12px] text-[var(--ink-9)]"
                  >
                    Format: you@example.my (used for appointment summary)
                  </span>
                  <Input
                    ref={emailInputRef}
                    id="patient-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => markBlurred("email")}
                    aria-invalid={Boolean(showError("email"))}
                    aria-describedby={
                      showError("email")
                        ? "patient-email-hint patient-email-error"
                        : "patient-email-hint"
                    }
                    placeholder="you@example.my"
                  />
                  {showError("email") && (
                    <p
                      id="patient-email-error"
                      className="text-[12px] text-[var(--red-11)]"
                    >
                      {showError("email")}
                    </p>
                  )}
                </div>

                <fieldset className="sm:col-span-2 space-y-2">
                  <legend className="text-[13px] font-medium text-[var(--ink-12)]">
                    Visit History at Aurel
                  </legend>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {[
                      { val: true, label: "First-time patient at Aurel" },
                      { val: false, label: "Returning patient" },
                    ].map((opt) => {
                      const picked = isFirstVisit === opt.val;
                      return (
                        <label
                          key={String(opt.val)}
                          className={cn(
                            "flex min-h-11 items-center justify-between rounded-[var(--radius-control)] border px-3.5 text-[13px] font-medium transition-[background-color,border-color] duration-150",
                            picked
                              ? "border-[var(--accent-9)] bg-[var(--accent-3)]/45 text-[var(--ink-12)]"
                              : "border-[var(--line)] bg-[var(--panel)] text-[var(--ink-11)] hover:border-[var(--ink-8)]"
                          )}
                        >
                          <span>{opt.label}</span>
                          <input
                            type="radio"
                            name="visitHistory"
                            checked={picked}
                            onChange={() => setIsFirstVisit(opt.val)}
                            className="size-4 accent-[var(--accent-9)]"
                          />
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="patient-notes"
                    className="block text-[13px] font-medium text-[var(--ink-12)]"
                  >
                    Clinical Notes or Sensitivities{" "}
                    <span className="font-normal text-[var(--ink-9)]">
                      (optional)
                    </span>
                  </label>
                  <Textarea
                    id="patient-notes"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share cold sensitivity, dental anxiety preferences, allergies, or aesthetic goals..."
                  />
                </div>
              </div>

              <div aria-live="polite" className="visually-hidden">
                {liveAnnouncement}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] pt-5">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleStepChange(2)}
                >
                  Back
                </Button>
                <Button type="submit" variant="primary">
                  Review & Reserve Slot
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Sticky Suite Reservation Ledger (Paper Artboard 02) */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-9)]">
                Suite Reservation Ledger
              </h3>
              <span className="font-mono text-[11px] text-[var(--accent-11)]">
                STEP 0{step}
              </span>
            </div>

            <dl className="divide-y divide-[var(--line)] text-[13px]">
              <div className="pb-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                  Procedure
                </dt>
                <dd className="mt-1 font-serif text-[19px] leading-[24px] text-[var(--ink-12)]">
                  {selectedTreatment.title}
                </dd>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[var(--line)] py-3">
                <div className="pr-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                    Fee Range
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] font-medium text-[var(--ink-12)] tabular-nums">
                    {formatRMRange(
                      selectedTreatment.priceFromRM,
                      selectedTreatment.priceToRM
                    )}
                  </dd>
                </div>
                <div className="pl-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                    Suite Duration
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] font-medium text-[var(--ink-12)] tabular-nums">
                    {selectedTreatment.durationMinutes} min
                  </dd>
                </div>
              </div>
              <div className="py-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                  Attending Clinician
                </dt>
                <dd className="mt-1 text-[14px] font-medium text-[var(--ink-12)]">
                  {selectedClinician.name} · {selectedClinician.suiteName}
                </dd>
              </div>
              <div className="pt-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                  Scheduled Window
                </dt>
                <dd className="mt-1 font-mono text-[13px] font-medium text-[var(--ink-12)] tabular-nums">
                  {timeSlot
                    ? `${formatDisplayDate(dateISO)} · ${timeSlot}`
                    : `${formatDisplayDate(dateISO)} · select time`}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--raised)] p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-medium text-[var(--ink-12)]">
                Test Network Error State
              </p>
              <p className="text-[11px] text-[var(--ink-9)]">
                Verify form retention on failure
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={simulateNetworkError}
              aria-label="Simulate booking network failure"
              onClick={() => setSimulateNetworkError(!simulateNetworkError)}
              className={cn(
                "relative inline-flex h-[24px] w-[44px] shrink-0 items-center rounded-[var(--radius-control)] border p-0.5 transition-colors duration-150",
                simulateNetworkError
                  ? "border-[var(--red-9)] bg-[var(--red-9)]"
                  : "border-[var(--line)] bg-[var(--panel)]"
              )}
            >
              <span
                className={cn(
                  "size-[18px] rounded-[2px] bg-[#FFFFFF] border border-[var(--line)] transition-transform duration-150 ease-[var(--ease-caliper)]",
                  simulateNetworkError ? "translate-x-[20px]" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </aside>
      </div>

      {/* Final Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm suite reservation?"
        description="Please verify your details below. Confirming reserves this suite slot immediately and notifies your clinician in the Staff Portal."
        summaryRows={[
          {
            label: "Patient",
            value: `${patientName.trim()} (${calculatedAge} yrs)`,
          },
          { label: "Procedure", value: selectedTreatment.title },
          { label: "Clinician", value: selectedClinician.name },
          {
            label: "Date & Time",
            value: `${formatDisplayDate(dateISO)} at ${timeSlot}`,
          },
          {
            label: "Estimated Fee",
            value: formatRMRange(
              selectedTreatment.priceFromRM,
              selectedTreatment.priceToRM
            ),
          },
        ]}
        confirmLabel="Confirm Reservation"
        pendingLabel="Reserving…"
        cancelLabel="Edit Details"
        isPending={isSubmitting}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}
