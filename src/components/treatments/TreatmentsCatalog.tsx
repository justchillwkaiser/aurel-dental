"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Search } from "lucide-react";
import { TREATMENTS } from "@/data/clinic-seed";
import { cn, formatRMRange } from "@/lib/format";
import type { TreatmentCategory } from "@/types/clinic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSlidingIndicator } from "@/components/shared/MotionPrimitives";

type FilterCategory = "all" | TreatmentCategory;

const CATEGORIES: { id: FilterCategory; label: string }[] = [
  { id: "all", label: "All Care (9)" },
  { id: "restorative", label: "Restorative" },
  { id: "smile-design", label: "Smile Design" },
  { id: "facial-aesthetics", label: "Facial Aesthetics" },
];

export function TreatmentsCatalog() {
  const [category, setCategory] = React.useState<FilterCategory>("all");
  const [query, setQuery] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  const { containerRef, registerItem, indicator, remeasure } =
    useSlidingIndicator(category);

  React.useEffect(() => {
    remeasure();
  }, [category, remeasure]);

  // '/' keyboard shortcut focuses treatment search when outside inputs.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return TREATMENTS.filter((item) => {
      const matchesCat = category === "all" || item.category === category;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="space-y-8">
      {/* Controls Strip with Sliding Filter Plate */}
      <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 md:flex-row md:items-center md:justify-between">
        <div
          ref={containerRef}
          role="radiogroup"
          aria-label="Filter treatments by clinical department"
          className="relative inline-flex flex-wrap items-center gap-1 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] p-1"
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
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                ref={registerItem(cat.id)}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setCategory(cat.id)}
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

        <search className="w-full md:w-80">
          <label htmlFor="treatment-search" className="visually-hidden">
            Search treatments
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ink-9)]"
              aria-hidden="true"
            />
            <Input
              ref={searchInputRef}
              id="treatment-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search procedure or concern..."
              className="pl-9 pr-10"
            />
            {!query && (
              <kbd
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[2px] border border-[var(--line)] bg-[var(--raised)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ink-9)]"
              >
                /
              </kbd>
            )}
          </div>
        </search>
      </div>

      {/* Ruled Ledger Rows or Honest Empty State */}
      {filtered.length === 0 ? (
        <div className="motion-dossier-swap rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--panel)] px-6 py-14 text-center">
          <p className="text-[15px] font-medium text-[var(--ink-12)]">
            No procedures matched &ldquo;{query}&rdquo;.
          </p>
          <p className="mt-1.5 text-[13px] text-[var(--ink-10)]">
            Clear your search phrase or switch back to all departments.
          </p>
          <div className="mt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCategory("all");
                setQuery("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      ) : (
        <div
          key={`${category}-${query}`}
          className="motion-dossier-swap divide-y divide-[var(--line)] border-y border-[var(--line)]"
        >
          {filtered.map((tr, index) => (
            <article
              key={tr.id}
              className="group relative grid gap-6 py-6 pl-4 pr-2 transition-colors duration-150 hover:bg-[var(--panel)]/55 lg:grid-cols-[1.35fr_0.9fr_auto] lg:items-center"
            >
              {/* Left Caliper Hover Rail */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-[var(--accent-9)] transition-transform duration-200 ease-[var(--ease-caliper)] group-hover:scale-y-100"
              />

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-[11px] text-[var(--ink-9)] tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-10)]">
                    {tr.categoryLabel}
                  </span>
                  {tr.recommendedStarter && (
                    <Badge tone="accent">Recommended first visit</Badge>
                  )}
                </div>
                <h2 className="font-serif text-[23px] leading-[29px] text-[var(--ink-12)]">
                  {tr.title}
                </h2>
                <p className="text-[14px] leading-[22px] text-[var(--ink-11)] max-w-2xl">
                  {tr.summary}
                </p>
              </div>

              <dl className="grid grid-cols-2 divide-x divide-[var(--line)] rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] text-[13px]">
                <div className="p-3.5">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                    Fee Guide
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] font-medium text-[var(--ink-12)] tabular-nums">
                    {formatRMRange(tr.priceFromRM, tr.priceToRM)}
                  </dd>
                </div>
                <div className="p-3.5">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                    Suite Time
                  </dt>
                  <dd className="mt-1 inline-flex items-center gap-1.5 font-mono text-[13px] font-medium text-[var(--ink-12)] tabular-nums">
                    <Clock className="size-3.5 text-[var(--ink-9)]" aria-hidden="true" />
                    <span>{tr.durationMinutes} min</span>
                  </dd>
                </div>
                <div className="col-span-2 border-t border-[var(--line)] px-3.5 py-2.5">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                    Recovery Window
                  </dt>
                  <dd className="mt-0.5 text-[13px] text-[var(--ink-11)]">
                    {tr.downtimeLabel}
                  </dd>
                </div>
              </dl>

              <div className="flex items-center lg:justify-end">
                <Button asChild variant="primary" className="w-full lg:w-auto">
                  <Link href={`/book?treatment=${tr.id}`} className="gap-1.5">
                    <span>Book Procedure</span>
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
