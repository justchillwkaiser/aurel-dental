"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/format";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  summaryRows?: { label: string; value: string }[];
  confirmLabel: string;
  pendingLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  isPending?: boolean;
  errorMessage?: string | null;
  onConfirm: () => void | Promise<void>;
  children?: React.ReactNode;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  summaryRows,
  confirmLabel,
  pendingLabel = "Processing…",
  cancelLabel = "Cancel",
  destructive = false,
  isPending = false,
  errorMessage = null,
  onConfirm,
  children,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="motion-overlay-in fixed inset-0 z-[100] bg-[var(--backdrop)] backdrop-blur-[2px]" />
        <AlertDialog.Content
          className={cn(
            "motion-dialog-in surface-overlay fixed left-1/2 top-1/2 z-[101] w-[calc(100%-32px)] max-w-[460px] -translate-x-1/2 -translate-y-1/2",
            "rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--overlay)] text-[var(--ink-12)] shadow-[var(--shadow-modal)]",
            "max-h-[calc(100dvh-32px)] overflow-y-auto focus:outline-none"
          )}
        >
          <div className="px-5 pt-5 pb-4">
            <AlertDialog.Title
              className={cn(
                "text-[length:var(--text-title)] leading-[var(--leading-title)] font-medium",
                destructive ? "text-[var(--red-11)]" : "text-[var(--ink-12)]"
              )}
            >
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-1.5 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--ink-11)]">
              {description}
            </AlertDialog.Description>
          </div>

          {(summaryRows?.length || children || errorMessage) && (
            <div className="border-t border-[var(--line)] px-5 py-4 space-y-3">
              {summaryRows && summaryRows.length > 0 && (
                <dl className="rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--panel)] p-3 space-y-2">
                  {summaryRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-4 text-[13px]"
                    >
                      <dt className="text-[var(--ink-10)] shrink-0">
                        {row.label}
                      </dt>
                      <dd className="text-right text-[var(--ink-12)] font-medium tabular-nums">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {children}

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-[var(--radius-control)] border border-[var(--red-6)] bg-[var(--red-3)] px-3 py-2 text-[13px] text-[var(--red-11)]"
                >
                  {errorMessage}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-[var(--line)] p-3 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <AlertDialog.Cancel asChild>
              <Button
                type="button"
                variant="secondary"
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
            <Button
              type="button"
              variant={destructive ? "destructiveConfirm" : "primary"}
              disabled={isPending}
              onClick={() => void onConfirm()}
              className="w-full sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2
                    className="size-3.5 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  <span>{pendingLabel}</span>
                </>
              ) : (
                <span>{confirmLabel}</span>
              )}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
