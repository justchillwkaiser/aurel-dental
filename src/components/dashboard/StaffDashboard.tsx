"use client";

import * as React from "react";
import { Plus, RefreshCw, RotateCcw, Search } from "lucide-react";
import { useClinicStore } from "@/lib/clinic-store";
import { cn, formatShortDay } from "@/lib/format";
import type { Appointment, AppointmentStatus } from "@/types/clinic";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import {
  PatientDetailBody,
  PatientDetailSheet,
} from "@/components/dashboard/PatientDetailSheet";
import { WalkInModal } from "@/components/dashboard/WalkInModal";
import { useSlidingIndicator } from "@/components/shared/MotionPrimitives";

type StatusFilter = "All" | AppointmentStatus;
type DateScope = "today" | "upcoming" | "all";

const STATUS_OPTIONS: StatusFilter[] = [
  "All",
  "Confirmed",
  "Checked In",
  "In Consultation",
  "Completed",
  "Cancelled",
];

export function StaffDashboard() {
  const {
    appointments,
    treatments,
    clinicians,
    isHydrated,
    todayISO,
    simulateNetworkError,
    setSimulateNetworkError,
    resetDemoData,
  } = useClinicStore();

  const [roleClinicianId, setRoleClinicianId] = React.useState<string>("all");
  const [dateScope, setDateScope] = React.useState<DateScope>("all");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const [inspectedId, setInspectedId] = React.useState<string | null>(null);
  const [drawerAppointmentId, setDrawerAppointmentId] = React.useState<
    string | null
  >(null);
  const [walkInOpen, setWalkInOpen] = React.useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false);

  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  const { containerRef, registerItem, indicator, remeasure } =
    useSlidingIndicator(roleClinicianId);

  React.useEffect(() => {
    remeasure();
  }, [roleClinicianId, clinicians.length, remeasure]);

  // Cmd/Ctrl+K shortcut to focus roster search.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const roleFiltered = React.useMemo(() => {
    if (roleClinicianId === "all") return appointments;
    return appointments.filter((a) => a.clinicianId === roleClinicianId);
  }, [appointments, roleClinicianId]);

  const metrics = React.useMemo(() => {
    return {
      activeConfirmed: roleFiltered.filter((a) => a.status === "Confirmed")
        .length,
      checkedIn: roleFiltered.filter((a) => a.status === "Checked In").length,
      inSuite: roleFiltered.filter((a) => a.status === "In Consultation")
        .length,
      completed: roleFiltered.filter((a) => a.status === "Completed").length,
    };
  }, [roleFiltered]);

  const visibleRows = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return roleFiltered
      .filter((apt) => {
        if (dateScope === "today" && apt.dateISO !== todayISO) return false;
        if (dateScope === "upcoming" && apt.dateISO < todayISO) return false;
        if (statusFilter !== "All" && apt.status !== statusFilter) return false;

        if (!q) return true;
        const tr = treatments.find((t) => t.id === apt.treatmentId);
        return (
          apt.patientName.toLowerCase().includes(q) ||
          apt.referenceCode.toLowerCase().includes(q) ||
          apt.notes.toLowerCase().includes(q) ||
          (tr?.title.toLowerCase().includes(q) ?? false)
        );
      })
      .sort((a, b) => {
        if (a.dateISO !== b.dateISO) return a.dateISO.localeCompare(b.dateISO);
        return a.timeSlot.localeCompare(b.timeSlot);
      });
  }, [dateScope, roleFiltered, searchQuery, statusFilter, todayISO, treatments]);

  const drawerAppointment: Appointment | null = React.useMemo(
    () => appointments.find((a) => a.id === drawerAppointmentId) ?? null,
    [appointments, drawerAppointmentId]
  );

  // Desktop sticky inspector falls back cleanly to first visible row.
  const desktopInspectedAppointment: Appointment | null = React.useMemo(() => {
    const picked = visibleRows.find((a) => a.id === inspectedId);
    return picked ?? visibleRows[0] ?? null;
  }, [inspectedId, visibleRows]);

  const activeClinicianName =
    roleClinicianId === "all"
      ? "Clinic Director · All 3 Suites"
      : clinicians.find((c) => c.id === roleClinicianId)?.name ?? "Clinician";

  return (
    <div className="space-y-6">
      {/* Staff Role Switcher & Action Bar */}
      <div className="rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--panel)] p-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
              Active View
            </span>
            <span className="text-[13px] font-medium text-[var(--ink-12)]">
              {activeClinicianName}
            </span>
            <Badge tone="neutral">Live Client Sync</Badge>
          </div>

          <div
            ref={containerRef}
            role="radiogroup"
            aria-label="Switch staff role view"
            className="relative inline-flex flex-wrap gap-1 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--raised)] p-1"
          >
            {indicator.ready && (
              <span
                aria-hidden="true"
                style={{
                  width: `${indicator.width}px`,
                  transform: `translate3d(${indicator.left - 4}px, 0, 0)`,
                }}
                className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-[2px] bg-[var(--panel)] border border-[var(--line)] transition-[transform,width] duration-[220ms] ease-[var(--ease-caliper)] motion-reduce:transition-none"
              />
            )}

            <button
              ref={registerItem("all")}
              type="button"
              role="radio"
              aria-checked={roleClinicianId === "all"}
              onClick={() => setRoleClinicianId("all")}
              className={cn(
                "relative z-10 h-8 rounded-[2px] px-3 text-[12px] font-medium transition-colors duration-150",
                roleClinicianId === "all"
                  ? "text-[var(--ink-12)]"
                  : "text-[var(--ink-9)] hover:text-[var(--ink-12)]"
              )}
            >
              All Suites
            </button>
            {clinicians.map((doc) => {
              const active = roleClinicianId === doc.id;
              return (
                <button
                  key={doc.id}
                  ref={registerItem(doc.id)}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setRoleClinicianId(doc.id)}
                  className={cn(
                    "relative z-10 h-8 rounded-[2px] px-3 text-[12px] font-medium transition-colors duration-150",
                    active
                      ? "text-[var(--ink-12)]"
                      : "text-[var(--ink-9)] hover:text-[var(--ink-12)]"
                  )}
                >
                  {doc.shortName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="compact"
            onClick={() => setSimulateNetworkError(!simulateNetworkError)}
          >
            {simulateNetworkError ? "Error Mode: On" : "Simulate Error"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="compact"
            onClick={() => setResetConfirmOpen(true)}
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span>Reset Demo Data</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="compact"
            onClick={() => setWalkInOpen(true)}
          >
            <Plus className="size-3.5" aria-hidden="true" />
            <span>Add Walk-In</span>
          </Button>
        </div>
      </div>

      {/* Simulated Network Error Recovery Banner */}
      {simulateNetworkError && (
        <div
          role="alert"
          className="motion-dossier-swap rounded-[var(--radius-container)] border border-[var(--red-6)] bg-[var(--red-3)] p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-[14px] font-medium text-[var(--red-11)]">
              Error simulation is active
            </p>
            <p className="text-[13px] text-[var(--red-11)]">
              Status changes and new reservations will return a connection timeout error until you restore normal sync.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="compact"
            onClick={() => setSimulateNetworkError(false)}
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            <span>Restore Connection</span>
          </Button>
        </div>
      )}

      {/* 4-Column Ruled Operational KPIs */}
      <div className="grid grid-cols-2 divide-y divide-[var(--line)] rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--raised)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {[
          { label: "Confirmed Upcoming", value: metrics.activeConfirmed },
          { label: "Checked In Lounge", value: metrics.checkedIn },
          { label: "In Suite Consultation", value: metrics.inSuite },
          { label: "Completed Visits", value: metrics.completed },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 sm:p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
              {kpi.label}
            </p>
            <p className="mt-1.5 font-serif text-[28px] leading-[34px] font-medium text-[var(--ink-12)] tabular-nums">
              {isHydrated ? kpi.value : "–"}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="radiogroup"
            aria-label="Filter by date range"
            className="inline-flex rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] p-1"
          >
            {[
              { id: "today" as const, label: "Today" },
              { id: "upcoming" as const, label: "Upcoming" },
              { id: "all" as const, label: "All Dates" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={dateScope === item.id}
                onClick={() => setDateScope(item.id)}
                className={cn(
                  "h-7 rounded-[2px] px-3 text-[12px] font-medium transition-colors duration-150",
                  dateScope === item.id
                    ? "bg-[var(--raised)] text-[var(--ink-12)] border border-[var(--line)]"
                    : "text-[var(--ink-9)] hover:text-[var(--ink-12)]"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((st) => {
              const active = statusFilter === st;
              return (
                <button
                  key={st}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "h-7 rounded-[var(--radius-control)] border px-2.5 text-[12px] font-medium transition-[background-color,border-color,color] duration-150",
                    active
                      ? "border-[var(--primary-bg)] bg-[var(--primary-bg)] text-[var(--primary-fg)]"
                      : "border-[var(--line)] bg-[var(--raised)] text-[var(--ink-10)] hover:text-[var(--ink-12)]"
                  )}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        <search className="w-full lg:w-76">
          <label htmlFor="dashboard-search" className="visually-hidden">
            Search patient name, reference code, or clinical notes
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ink-9)]"
              aria-hidden="true"
            />
            <Input
              ref={searchInputRef}
              id="dashboard-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Patient name or AUR code..."
              className="pl-9 pr-12"
            />
            {!searchQuery && (
              <kbd
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[2px] border border-[var(--line)] bg-[var(--raised)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ink-9)]"
              >
                ⌘K
              </kbd>
            )}
          </div>
        </search>
      </div>

      {/* 70/30 Roster Table + Sticky Desktop Patient Detail Inspector (Paper Artboard 06) */}
      {!isHydrated ? (
        <div
          aria-busy="true"
          aria-label="Loading clinic roster"
          className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
        >
          <div className="rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--raised)] p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-11 rounded-[var(--radius-control)] atelier-skeleton"
              />
            ))}
          </div>
          <div className="hidden xl:block h-[380px] rounded-[var(--radius-container)] border border-[var(--line)] atelier-skeleton" />
        </div>
      ) : visibleRows.length === 0 ? (
        <div className="motion-dossier-swap rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--panel)] px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[var(--ink-12)]">
            No appointments match the active filters.
          </p>
          <p className="mt-1 text-[13px] text-[var(--ink-10)]">
            Clear your search or reset date and status filters to view all scheduled patients.
          </p>
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setRoleClinicianId("all");
                setDateScope("all");
                setStatusFilter("All");
                setSearchQuery("");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          {/* Left: Patient Roster Table */}
          <div
            tabIndex={0}
            role="region"
            aria-labelledby="roster-table-caption"
            className="clinic-table-wrapper rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--raised)]"
          >
            <table className="clinic-table w-full border-collapse text-left text-[13px]">
              <caption id="roster-table-caption" className="visually-hidden">
                Scheduled patient appointments with age, procedure, clinician, time, and status
              </caption>
              <thead className="sticky top-0 z-10 bg-[var(--panel)] border-b border-[var(--line)]">
                <tr className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--ink-9)]">
                  <th scope="col" className="px-3.5 py-3 font-medium">
                    Patient & Ref
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 font-medium border-l border-[var(--line)]"
                  >
                    Procedure
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 font-medium border-l border-[var(--line)]"
                  >
                    Clinician
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 font-medium border-l border-[var(--line)]"
                  >
                    Slot
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 font-medium border-l border-[var(--line)]"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 font-medium border-l border-[var(--line)] text-right"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {visibleRows.map((apt) => {
                  const tr = treatments.find((t) => t.id === apt.treatmentId);
                  const doc = clinicians.find((c) => c.id === apt.clinicianId);
                  const dimmed = apt.status === "Cancelled";
                  const isSelected =
                    desktopInspectedAppointment?.id === apt.id;
                  return (
                    <tr
                      key={apt.id}
                      onClick={() => setInspectedId(apt.id)}
                      className={cn(
                        "cursor-pointer transition-colors duration-150",
                        isSelected
                          ? "bg-[var(--accent-3)]/45"
                          : "hover:bg-[var(--panel)]/65",
                        dimmed && "opacity-60"
                      )}
                    >
                      <th
                        scope="row"
                        data-label="Patient & Ref"
                        className={cn(
                          "px-3.5 py-3 font-medium text-[var(--ink-12)]",
                          isSelected && "border-l-2 border-l-[var(--accent-9)]"
                        )}
                      >
                        <div className="flex flex-col">
                          <span className="truncate max-w-[165px]">
                            {apt.patientName}
                          </span>
                          <span className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap text-[11px] font-normal text-[var(--ink-9)] tabular-nums">
                            <span className="font-mono text-[var(--ink-11)] whitespace-nowrap">
                              {apt.referenceCode}
                            </span>
                            <span>·</span>
                            <span>
                              Age {apt.patientAge} ({apt.isFirstVisit ? "New" : "Ret"})
                            </span>
                          </span>
                        </div>
                      </th>
                      <td
                        data-label="Procedure"
                        className="px-3 py-3 border-l border-[var(--line)] text-[var(--ink-11)]"
                      >
                        <span
                          className="block truncate max-w-[155px]"
                          title={tr?.title}
                        >
                          {tr?.title ?? apt.treatmentId}
                        </span>
                      </td>
                      <td
                        data-label="Clinician"
                        className="px-2.5 py-3 border-l border-[var(--line)] text-[var(--ink-11)] whitespace-nowrap"
                      >
                        {doc?.shortName ?? apt.clinicianId}
                      </td>
                      <td
                        data-label="Date & Time"
                        className="px-2.5 py-3 border-l border-[var(--line)] font-mono text-[12px] text-[var(--ink-11)] tabular-nums whitespace-nowrap"
                      >
                        {(() => {
                          if (apt.dateISO === todayISO) return `Today, ${apt.timeSlot}`;
                          const { dayNum, month } = formatShortDay(apt.dateISO);
                          return `${dayNum} ${month}, ${apt.timeSlot}`;
                        })()}
                      </td>
                      <td
                        data-label="Status"
                        className="px-2.5 py-3 border-l border-[var(--line)] whitespace-nowrap"
                      >
                        <StatusBadge status={apt.status} />
                      </td>
                      <td
                        data-label="Action"
                        className="px-2.5 py-3 border-l border-[var(--line)] text-right whitespace-nowrap"
                      >
                        <Button
                          type="button"
                          variant="pill"
                          size="pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedId(apt.id);
                            setDrawerAppointmentId(apt.id);
                          }}
                        >
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right: Sticky Desktop Clinical Inspector Dossier */}
          {desktopInspectedAppointment && (
            <aside
              aria-label="Selected Patient Inspector"
              className="hidden xl:block sticky top-24 rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--raised)] p-5 space-y-4"
            >
              <div className="border-b border-[var(--line)] pb-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent-11)]">
                  Patient Dossier
                </p>
                <h2 className="mt-1 font-serif text-[22px] leading-[28px] text-[var(--ink-12)]">
                  {desktopInspectedAppointment.patientName}
                </h2>
                <p className="text-[12px] text-[var(--ink-9)] tabular-nums">
                  {desktopInspectedAppointment.patientAge} years old · born{" "}
                  {desktopInspectedAppointment.dateOfBirth}
                </p>
              </div>
              <PatientDetailBody appointment={desktopInspectedAppointment} />
            </aside>
          )}
        </div>
      )}

      {/* Slide-Over Sheet on Mobile / Tablet or Explicit Inspect */}
      <PatientDetailSheet
        appointment={drawerAppointment}
        onClose={() => setDrawerAppointmentId(null)}
      />

      {/* Walk-In Modal */}
      <WalkInModal open={walkInOpen} onOpenChange={setWalkInOpen} />

      {/* Reset Demo Data Confirmation */}
      <ConfirmationDialog
        open={resetConfirmOpen}
        onOpenChange={setResetConfirmOpen}
        title="Reset clinic demo schedule?"
        description="Restores the 10 initial sample appointments and clears any custom bookings created during this session."
        confirmLabel="Yes, Reset Schedule"
        cancelLabel="Keep Current Data"
        destructive
        onConfirm={() => {
          resetDemoData();
          setInspectedId(null);
          setDrawerAppointmentId(null);
          setResetConfirmOpen(false);
        }}
      />
    </div>
  );
}
