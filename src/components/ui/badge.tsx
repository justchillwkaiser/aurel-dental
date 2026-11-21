import * as React from "react";
import { cn } from "@/lib/format";
import type { AppointmentStatus } from "@/types/clinic";

type BadgeTone = "neutral" | "accent" | "green" | "amber" | "red";

const TONE_STYLES: Record<BadgeTone, string> = {
  neutral:
    "bg-[var(--panel)] text-[var(--ink-11)] border border-[var(--line)] dark:bg-[var(--ink-3)]",
  accent:
    "bg-[var(--accent-3)] text-[var(--accent-11)] border border-[var(--accent-6)]",
  green:
    "bg-[var(--green-3)] text-[var(--green-11)] border border-[var(--green-6)]",
  amber:
    "bg-[var(--amber-3)] text-[var(--amber-11)] border border-[var(--amber-6)]",
  red: "bg-[var(--red-3)] text-[var(--red-11)] border border-[var(--red-6)]",
};

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[var(--badge-h)] items-center gap-1.5 rounded-[var(--radius-control)] px-2 text-[11px] leading-none font-mono tracking-[0.04em] uppercase font-medium tabular-nums",
        TONE_STYLES[tone],
        className
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-current shrink-0"
        />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const map: Record<AppointmentStatus, { tone: BadgeTone; symbol: string }> = {
    Confirmed: { tone: "green", symbol: "Confirmed" },
    "Checked In": { tone: "amber", symbol: "Checked In" },
    "In Consultation": { tone: "amber", symbol: "In Consultation" },
    Completed: { tone: "accent", symbol: "Completed" },
    Cancelled: { tone: "red", symbol: "Cancelled" },
  };
  const cfg = map[status];
  return (
    <Badge tone={cfg.tone} dot>
      {cfg.symbol}
    </Badge>
  );
}
