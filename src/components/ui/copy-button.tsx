"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [status, setStatus] = React.useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    // Immediate optimistic tick per tactile-design copy feedback specification.
    setStatus("copied");
    try {
      await navigator.clipboard.writeText(value);
      timerRef.current = window.setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("failed");
      timerRef.current = window.setTimeout(() => setStatus("idle"), 1500);
    }
  };

  return (
    <Button
      type="button"
      variant="pill"
      size="pill"
      onClick={() => void handleCopy()}
      aria-label={
        status === "copied"
          ? `Copied ${value}`
          : status === "failed"
          ? "Copy failed"
          : `${label} ${value}`
      }
      className={className}
    >
      {status === "copied" ? (
        <Check
          className="motion-check-draw size-3.5 text-[var(--accent-11)]"
          strokeWidth={2.4}
          aria-hidden="true"
        />
      ) : (
        <Copy className="size-3.5 text-[var(--ink-10)]" strokeWidth={1.75} aria-hidden="true" />
      )}
      <span>
        {status === "copied"
          ? "Copied"
          : status === "failed"
          ? "Copy failed"
          : label}
      </span>
    </Button>
  );
}
