"use client";

import * as React from "react";
import { cn } from "@/lib/format";

/**
 * Observes element intersection once to trigger architectural CSS transitions
 * without blocking SSR content visibility or violating reduced-motion preferences.
 */
export function ArchitecturalReveal({
  children,
  variant = "aperture",
  delayMs = 0,
  className,
}: {
  children: React.ReactNode;
  variant?: "aperture" | "rule" | "rise";
  delayMs?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) ||
      typeof IntersectionObserver === "undefined"
    ) {
      const rafId = window.requestAnimationFrame(() => setRevealed(true));
      return () => window.cancelAnimationFrame(rafId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const initialStyles =
    variant === "rule"
      ? "scale-x-0 origin-left"
      : variant === "aperture"
      ? "opacity-0 translate-y-3 [clip-path:inset(8%_0%_0%_0%)]"
      : "opacity-0 translate-y-3";

  const activeStyles =
    variant === "rule"
      ? "scale-x-100 origin-left"
      : "opacity-100 translate-y-0 [clip-path:inset(0%_0%_0%_0%)]";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        "motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-x-100 motion-reduce:[clip-path:none]",
        "transition-[transform,opacity,clip-path] duration-500 ease-[var(--ease-move)]",
        revealed ? activeStyles : initialStyles,
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Precision 1px Swiss caliper rule that draws horizontally across a section header.
 */
export function CaliperRule({
  strong = false,
  delayMs = 0,
  className,
}: {
  strong?: boolean;
  delayMs?: number;
  className?: string;
}) {
  return (
    <ArchitecturalReveal variant="rule" delayMs={delayMs} className={className}>
      <div
        aria-hidden="true"
        className={cn(
          "h-px w-full",
          strong ? "bg-[var(--line-strong)]" : "bg-[var(--line)]"
        )}
      />
    </ArchitecturalReveal>
  );
}

/**
 * Measures active item geometry inside a horizontal rail so a shared active indicator
 * glides smoothly between tabs/nav links via GPU transform.
 */
export function useSlidingIndicator(activeKey: string) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const [indicator, setIndicator] = React.useState<{
    left: number;
    width: number;
    ready: boolean;
  }>({ left: 0, width: 0, ready: false });

  const registerItem = React.useCallback(
    (key: string) => (el: HTMLElement | null) => {
      itemRefs.current[key] = el;
    },
    []
  );

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    const activeEl = itemRefs.current[activeKey];
    if (!container || !activeEl) return;
    const cRect = container.getBoundingClientRect();
    const aRect = activeEl.getBoundingClientRect();
    setIndicator({
      left: aRect.left - cRect.left,
      width: aRect.width,
      ready: true,
    });
  }, [activeKey]);

  React.useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return { containerRef, registerItem, indicator, remeasure: measure };
}
