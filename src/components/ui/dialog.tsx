"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/format";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  title,
  description,
  variant = "modal",
}: {
  className?: string;
  children: React.ReactNode;
  title: string;
  description?: string;
  variant?: "modal" | "sheet";
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="motion-overlay-in fixed inset-0 z-[100] bg-[var(--backdrop)] backdrop-blur-[2px]" />
      <DialogPrimitive.Content
        className={cn(
          "surface-overlay fixed z-[101] bg-[var(--overlay)] text-[var(--ink-12)] border border-[var(--line)] shadow-[var(--shadow-modal)] focus:outline-none overflow-y-auto",
          variant === "sheet"
            ? "motion-sheet-in inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[var(--radius-sheet)] md:inset-y-2 md:right-2 md:left-auto md:w-full md:max-w-[460px] md:max-h-none md:rounded-[var(--radius-container)]"
            : "motion-dialog-in left-1/2 top-1/2 w-[calc(100%-32px)] max-w-[620px] max-h-[calc(100dvh-32px)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-container)]",
          className
        )}
      >
        {variant === "sheet" && (
          <div className="flex justify-center pt-2.5 md:hidden" aria-hidden="true">
            <span className="h-[4px] w-9 rounded-[2px] bg-[var(--ink-7)]" />
          </div>
        )}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
          <div>
            <DialogPrimitive.Title className="text-[length:var(--text-title)] leading-[var(--leading-title)] font-medium text-[var(--ink-12)]">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="mt-1 text-[13px] leading-[18px] text-[var(--ink-11)]">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close
            aria-label="Close panel"
            className="inline-flex size-8 items-center justify-center rounded-[var(--radius-control)] text-[var(--ink-10)] hover:bg-[var(--ink-3)] hover:text-[var(--ink-12)] active:scale-[0.94] transition-[transform,scale,background-color] duration-[var(--dur-hover)]"
          >
            <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </DialogPrimitive.Close>
        </div>
        <div className="p-5">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
