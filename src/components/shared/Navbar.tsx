"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/components/shared/ThemeProvider";
import { useSlidingIndicator } from "@/components/shared/MotionPrimitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/format";

const PATIENT_NAV_ITEMS = [
  { href: "/", label: "Clinic" },
  { href: "/treatments", label: "Treatments" },
  { href: "/book", label: "Book Visit" },
];

function AurelMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-[var(--ink-12)]"
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M7.5 17.5C7.5 12.2 9.4 7.5 12 6.5C14.6 7.5 16.5 12.2 16.5 17.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M9.4 13.5H14.6"
        stroke="var(--accent-9)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const activeNavKey = React.useMemo(() => {
    const found = PATIENT_NAV_ITEMS.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    );
    return found?.href ?? "";
  }, [pathname]);

  const { containerRef, registerItem, indicator, remeasure } =
    useSlidingIndicator(activeNavKey);

  React.useEffect(() => {
    remeasure();
  }, [pathname, remeasure]);

  React.useEffect(() => {
    let rafId = 0;
    const updateProgress = () => {
      rafId = 0;
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const ratio = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      setScrollProgress(ratio);
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const isStaffRoute = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--line)] bg-[var(--surface-top)]/94 backdrop-blur-md">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left Swiss Clinic Wordmark */}
          <div className="flex items-center gap-3.5 min-w-0">
            <Link
              href="/"
              className="group inline-flex min-h-11 items-center gap-2.5 rounded-[var(--radius-control)] py-1 pr-2 text-[var(--ink-12)]"
            >
              <AurelMark />
              <span className="font-sans text-[17px] font-semibold leading-none tracking-[-0.02em] text-[var(--ink-12)]">
                Aurel
              </span>
            </Link>
            <span
              aria-hidden="true"
              className="hidden lg:inline-block h-4 w-px bg-[var(--line)]"
            />
            <span className="hidden lg:inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-9)] truncate">
              Bangsar, Kuala Lumpur
            </span>
          </div>

          {/* Center Architectural Navigation with Sliding Caliper Underline */}
          <nav
            ref={containerRef}
            aria-label="Primary"
            className="relative hidden md:flex h-16 items-center gap-7"
          >
            {PATIENT_NAV_ITEMS.map((item) => {
              const isActive = item.href === activeNavKey;
              return (
                <Link
                  key={item.href}
                  ref={registerItem(item.href)}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex h-16 min-w-11 items-center justify-center px-2.5 text-[13px] font-medium tracking-[var(--tracking-label)]",
                    "transition-colors duration-[var(--dur-hover)] ease-[var(--ease-out)]",
                    isActive
                      ? "text-[var(--ink-12)]"
                      : "text-[var(--ink-9)] hover:text-[var(--ink-12)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            {isStaffRoute && (
              <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--accent-6)] bg-[var(--accent-3)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--accent-11)]">
                <span className="size-1.5 rounded-full bg-[var(--accent-9)]" aria-hidden="true" />
                Operations Mode
              </span>
            )}

            {/* Sliding Caliper Active Underline */}
            <span
              aria-hidden="true"
              style={{
                width: `${indicator.width}px`,
                transform: `translate3d(${indicator.left}px, 0, 0)`,
              }}
              className={cn(
                "pointer-events-none absolute bottom-0 left-0 h-[2px] bg-[var(--accent-9)]",
                "transition-[transform,width,opacity] duration-[240ms] ease-[var(--ease-caliper)] motion-reduce:transition-none",
                indicator.ready && activeNavKey ? "opacity-100" : "opacity-0"
              )}
            />
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Switch to dark theme"
                  : "Switch to light theme"
              }
              className={cn(
                "inline-flex size-11 md:size-9 items-center justify-center rounded-[var(--radius-control)]",
                "border border-[var(--line)] bg-[var(--panel)] text-[var(--ink-11)]",
                "hover:border-[var(--ink-8)] hover:bg-[var(--raised)] hover:text-[var(--ink-12)] active:scale-[0.95]",
                "transition-[transform,scale,background-color,border-color,color] duration-[var(--dur-hover)] ease-[var(--ease-out)]"
              )}
            >
              {theme === "light" ? (
                <Moon className="size-4" strokeWidth={1.6} aria-hidden="true" />
              ) : (
                <Sun className="size-4" strokeWidth={1.6} aria-hidden="true" />
              )}
            </button>

            <Button asChild variant="primary" className="hidden sm:inline-flex gap-1.5">
              <Link href="/book">
                <span>Reserve Consultation</span>
                <ArrowUpRight
                  className="size-3.5 transition-transform duration-[var(--dur-hover)] ease-[var(--ease-caliper)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  strokeWidth={1.85}
                  aria-hidden="true"
                />
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-clinic-menu"
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              className={cn(
                "md:hidden inline-flex size-11 items-center justify-center rounded-[var(--radius-control)]",
                "border border-[var(--line)] bg-[var(--panel)] text-[var(--ink-12)]",
                "active:scale-[0.95]"
              )}
            >
              {mobileOpen ? (
                <X className="size-4.5" strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <Menu className="size-4.5" strokeWidth={1.75} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Precision Optical Scroll Progress Caliper */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] overflow-hidden"
      >
        <div
          style={{ transform: `scaleX(${scrollProgress})` }}
          className="h-full w-full origin-left bg-[var(--accent-9)]/70 transition-transform duration-75 ease-linear motion-reduce:hidden"
        />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav
          id="mobile-clinic-menu"
          aria-label="Mobile"
          className="motion-dossier-swap border-t border-[var(--line)] bg-[var(--surface-top)] px-4 py-4 md:hidden"
        >
          <div className="mx-auto max-w-[1320px] flex flex-col divide-y divide-[var(--line)] border border-[var(--line)] rounded-[var(--radius-control)] bg-[var(--panel)]">
            {PATIENT_NAV_ITEMS.map((item) => {
              const isActive = item.href === activeNavKey;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-12 items-center justify-between px-4 text-[15px] font-medium",
                    isActive
                      ? "bg-[var(--raised)] text-[var(--ink-12)]"
                      : "text-[var(--ink-11)] hover:text-[var(--ink-12)]"
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-[1px] bg-[var(--accent-9)]"
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href="/dashboard"
              className="flex h-11 items-center justify-between px-4 font-mono text-[12px] uppercase tracking-[0.06em] text-[var(--ink-9)] hover:text-[var(--ink-12)]"
            >
              <span>Doctor & Staff Portal</span>
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-3">
            <Button asChild variant="primary" className="w-full">
              <Link href="/book">Reserve Consultation</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
