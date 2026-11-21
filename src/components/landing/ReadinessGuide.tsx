"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Clock, ShieldCheck } from "lucide-react";
import { READINESS_CONCERNS, TREATMENTS } from "@/data/clinic-seed";
import { cn } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ArchitecturalReveal } from "@/components/shared/MotionPrimitives";

export function ReadinessGuide() {
  const [selectedId, setSelectedId] = React.useState(READINESS_CONCERNS[0].id);
  const active =
    READINESS_CONCERNS.find((c) => c.id === selectedId) ?? READINESS_CONCERNS[0];
  const suggestedTreatment = TREATMENTS.find(
    (t) => t.id === active.suggestedTreatmentId
  );

  return (
    <section
      id="readiness-guide"
      aria-labelledby="readiness-heading"
      className="border-b border-[var(--line)] bg-[var(--panel)]"
    >
      <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <ArchitecturalReveal variant="rise" className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent-11)]">
              03 · Pre-Consultation Care Guide
            </p>
            <h2
              id="readiness-heading"
              className="font-serif text-[30px] leading-[36px] tracking-[-0.02em] text-[var(--ink-12)] sm:text-[38px] sm:leading-[44px]"
            >
              Check preparation steps and realistic RM ranges before you book.
            </h2>
            <p className="text-[15px] leading-[24px] text-[var(--ink-11)]">
              Select what brings you in to see the recommended first-visit pathway,
              clinical preparation checklist, and expected recovery window.
            </p>

            <fieldset className="pt-3 divide-y divide-[var(--line)] border-y border-[var(--line)]">
              <legend className="visually-hidden">
                Select your primary dental or aesthetic concern
              </legend>
              {READINESS_CONCERNS.map((concern, index) => {
                const checked = concern.id === active.id;
                return (
                  <label
                    key={concern.id}
                    className={cn(
                      "relative flex min-h-13 items-center justify-between gap-3 px-4 py-3.5",
                      "transition-colors duration-[var(--dur-hover)] ease-[var(--ease-out)]",
                      checked
                        ? "bg-[var(--raised)] text-[var(--ink-12)]"
                        : "bg-transparent text-[var(--ink-11)] hover:bg-[var(--raised)]/60 hover:text-[var(--ink-12)]"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-y-0 left-0 w-[2px] bg-[var(--accent-9)] origin-top",
                        "transition-transform duration-[220ms] ease-[var(--ease-caliper)]",
                        checked ? "scale-y-100" : "scale-y-0"
                      )}
                    />
                    <span className="flex items-baseline gap-3 text-[14px] leading-[20px] font-medium">
                      <span className="font-mono text-[11px] text-[var(--ink-9)] tabular-nums">
                        0{index + 1}
                      </span>
                      <span>{concern.label}</span>
                    </span>
                    <input
                      type="radio"
                      name="readiness-concern"
                      value={concern.id}
                      checked={checked}
                      onChange={() => setSelectedId(concern.id)}
                      className="size-4 accent-[var(--accent-9)] shrink-0"
                    />
                  </label>
                );
              })}
            </fieldset>
          </ArchitecturalReveal>

          {/* Live Clinical Readiness Dossier */}
          <div
            aria-live="polite"
            className="rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--raised)] p-6 sm:p-8"
          >
            <div key={active.id} className="motion-dossier-swap">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] pb-5">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                    Recommended Starting Visit
                  </p>
                  <h3 className="mt-1.5 font-serif text-[24px] leading-[30px] text-[var(--ink-12)]">
                    {suggestedTreatment?.title ?? "Comprehensive Consultation"}
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--accent-6)] bg-[var(--accent-3)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--accent-11)]">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  <span>Zero-Obligation Assessment</span>
                </span>
              </div>

              <p className="mt-5 text-[14px] leading-[23px] text-[var(--ink-11)]">
                {active.clinicalContext}
              </p>

              <div className="mt-6 grid divide-y divide-[var(--line)] rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                    Transparent Fee Range
                  </p>
                  <p className="mt-1.5 font-mono text-[15px] font-medium text-[var(--ink-12)] tabular-nums">
                    {active.estimatedFeeRange}
                  </p>
                </div>
                <div className="p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                    Recovery & Downtime
                  </p>
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--ink-12)]">
                    <Clock
                      className="size-3.5 text-[var(--accent-11)]"
                      aria-hidden="true"
                    />
                    <span>{active.expectedDowntime}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                  Preparation Checklist Before Your Visit
                </p>
                <ul className="mt-3 space-y-2.5">
                  {active.prepSteps.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-start gap-3 text-[14px] leading-[21px] text-[var(--ink-11)]"
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
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 flex flex-col gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[13px] leading-[19px] text-[var(--ink-10)] max-w-sm">
                  {active.suitabilityNote}
                </p>
                <Button asChild variant="primary" className="shrink-0">
                  <Link
                    href={`/book?treatment=${active.suggestedTreatmentId}`}
                    className="gap-1.5"
                  >
                    <span>Reserve This Assessment</span>
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
