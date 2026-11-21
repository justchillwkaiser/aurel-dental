"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TREATMENTS } from "@/data/clinic-seed";
import { cn, formatRMRange } from "@/lib/format";
import type { TreatmentCategory } from "@/types/clinic";
import { Button } from "@/components/ui/button";
import { ArchitecturalReveal, CaliperRule } from "@/components/shared/MotionPrimitives";
import { ProgressiveImage } from "@/components/shared/ProgressiveImage";

interface DisciplineMeta {
  id: TreatmentCategory;
  index: string;
  title: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  caption: string;
}

const DISCIPLINES: DisciplineMeta[] = [
  {
    id: "restorative",
    index: "01",
    title: "Restorative Architecture",
    summary:
      "Tooth-conserving ceramic inlays, guided dental implant planning, and gentle airflow hygiene designed for long-term structural comfort.",
    imageSrc: "/images/hero-suite.jpg",
    imageAlt:
      "Sunlit restorative dental treatment suite with travertine walls and oak cabinetry",
    caption: "Suite 02 · 3D intraoral scanning & low-dose diagnostics",
  },
  {
    id: "smile-design",
    index: "02",
    title: "Porcelain & Smile Design",
    summary:
      "Reversible chairside smile trials, ultra-thin feldspathic veneers, and discreet aligner calibration tailored to natural lip movement.",
    imageSrc: "/images/craft-ceramic.jpg",
    imageAlt:
      "Handcrafted ultra-thin porcelain veneers arranged on a warm limestone tray",
    caption: "Atelier Lab · Custom porcelain shade calibration",
  },
  {
    id: "facial-aesthetics",
    index: "03",
    title: "Facial & Jawline Aesthetics",
    summary:
      "Therapeutic masseter relaxation for clenching relief, perioral hydration support, and buffered medical enamel brightening.",
    imageSrc: "/images/consultation-lounge.jpg",
    imageAlt:
      "Quiet private consultation lounge with warm mineral plaster walls and natural daylight",
    caption: "Consultation Lounge · Unhurried facial mapping",
  },
];

export function DisciplineIndex() {
  const [activeId, setActiveId] = React.useState<TreatmentCategory>("restorative");
  const active =
    DISCIPLINES.find((item) => item.id === activeId) ?? DISCIPLINES[0];
  const categoryTreatments = TREATMENTS.filter((t) => t.category === active.id);
  const minPrice = Math.min(...categoryTreatments.map((t) => t.priceFromRM));
  const maxPrice = Math.max(...categoryTreatments.map((t) => t.priceToRM));

  return (
    <section
      aria-labelledby="disciplines-heading"
      className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-10 lg:py-24"
    >
      <div className="flex flex-col gap-5 pb-6 md:flex-row md:items-end md:justify-between">
        <ArchitecturalReveal variant="rise" className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent-11)]">
            01 · Clinical Disciplines
          </p>
          <h2
            id="disciplines-heading"
            className="mt-2 font-serif text-[30px] leading-[36px] tracking-[-0.02em] text-[var(--ink-12)] sm:text-[38px] sm:leading-[44px]"
          >
            Three focused departments, structured to prevent rushed decisions.
          </h2>
        </ArchitecturalReveal>
        <Button asChild variant="secondary">
          <Link href="/treatments" className="gap-1.5">
            <span>View All 9 Procedures</span>
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <CaliperRule strong />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div
          role="tablist"
          aria-label="Clinical disciplines"
          className="divide-y divide-[var(--line)] border-b border-[var(--line)]"
        >
          {DISCIPLINES.map((discipline) => {
            const isSelected = discipline.id === activeId;
            const list = TREATMENTS.filter((t) => t.category === discipline.id);
            return (
              <div
                key={discipline.id}
                className={cn(
                  "relative transition-colors duration-[var(--dur-swap)] ease-[var(--ease-out)]",
                  isSelected ? "bg-[var(--panel)]/65" : "bg-transparent hover:bg-[var(--panel)]/35"
                )}
              >
                {/* Sliding Left Precision Indicator Bar */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-0 left-0 w-[2px] bg-[var(--accent-9)] origin-top",
                    "transition-transform duration-[260ms] ease-[var(--ease-caliper)]",
                    isSelected ? "scale-y-100" : "scale-y-0"
                  )}
                />

                <button
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveId(discipline.id)}
                  className={cn(
                    "group w-full px-4 py-6 text-left sm:px-6",
                    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus-ring)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span
                        className={cn(
                          "font-mono text-[12px] tabular-nums transition-colors duration-150",
                          isSelected ? "text-[var(--accent-11)]" : "text-[var(--ink-9)]"
                        )}
                      >
                        {discipline.index}
                      </span>
                      <div>
                        <h3 className="font-serif text-[22px] leading-[28px] text-[var(--ink-12)] sm:text-[24px] sm:leading-[30px]">
                          {discipline.title}
                        </h3>
                        <p className="mt-2 text-[14px] leading-[22px] text-[var(--ink-11)] max-w-lg">
                          {discipline.summary}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight
                      className={cn(
                        "size-4 shrink-0 mt-1.5 transition-transform duration-200 ease-[var(--ease-caliper)]",
                        isSelected
                          ? "text-[var(--accent-11)] translate-x-0.5 -translate-y-0.5"
                          : "text-[var(--ink-8)] group-hover:text-[var(--ink-12)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      )}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {/* Non-snapping CSS Grid-Row Animated Drawer */}
                <div className="atelier-drawer" data-open={isSelected}>
                  <div className="atelier-drawer-inner">
                    <div className="mx-4 mb-6 ml-11 sm:mx-6 sm:ml-15 border-t border-[var(--line)] pt-4 space-y-2.5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                        Included Procedures
                      </p>
                      <ul className="divide-y divide-[var(--line)]/60">
                        {list.map((tr) => (
                          <li
                            key={tr.id}
                            className="flex items-center justify-between gap-4 text-[13px]"
                          >
                            <Link
                              href={`/book?treatment=${tr.id}`}
                              className="inline-flex min-h-11 flex-1 items-center py-2 text-[var(--ink-12)] hover:text-[var(--accent-11)] transition-colors duration-150"
                            >
                              {tr.title}
                            </Link>
                            <span className="font-mono text-[12px] text-[var(--ink-10)] tabular-nums shrink-0">
                              {formatRMRange(tr.priceFromRM, tr.priceToRM)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Interactive Specimen Frame */}
        <div className="rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--panel)] p-4 lg:sticky lg:top-24">
          <div
            key={active.id}
            className="motion-dossier-swap space-y-4"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--ink-3)]">
              <ProgressiveImage
                src={active.imageSrc}
                alt={active.imageAlt}
                width={960}
                height={720}
                sizes="(max-width: 1024px) 100vw, 560px"
                skeletonLabel={`Discipline ${active.index} · Loading`}
                wrapperClassName="h-full w-full"
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 z-20 rounded-[var(--radius-control)] bg-[#151513] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-[#F3F1EC]">
                Discipline {active.index}
              </span>
            </div>

            <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--ink-9)]">
                  {active.caption}
                </p>
                <p className="mt-1.5 text-[14px] font-medium text-[var(--ink-12)] tabular-nums">
                  {formatRMRange(minPrice, maxPrice)}
                </p>
              </div>
              <Button asChild variant="primary" className="shrink-0">
                <Link href={`/book?category=${active.id}`}>
                  Book {active.title.split(" ")[0]}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
