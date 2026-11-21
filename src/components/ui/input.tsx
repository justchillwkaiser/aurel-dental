import * as React from "react";
import { cn } from "@/lib/format";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "tactile-field w-full h-[var(--control-h)] rounded-[var(--radius-control)] border border-[var(--line)]",
        "bg-[var(--panel)] px-3 text-[length:var(--text-field)] leading-[var(--leading-body)] text-[var(--ink-12)]",
        "placeholder:text-[var(--ink-9)]",
        "transition-[background-color,border-color,box-shadow] duration-[var(--dur-hover)] ease-[var(--ease-out)]",
        "focus:bg-[var(--raised)] focus-visible:border-[var(--focus-ring)] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[var(--focus-ring)]",
        "disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "tactile-field w-full min-h-[88px] rounded-[var(--radius-control)] border border-[var(--line)]",
        "bg-[var(--panel)] px-3 py-2.5 text-[length:var(--text-field)] leading-[var(--leading-body)] text-[var(--ink-12)]",
        "placeholder:text-[var(--ink-9)] resize-y",
        "transition-[background-color,border-color,box-shadow] duration-[var(--dur-hover)] ease-[var(--ease-out)]",
        "focus:bg-[var(--raised)] focus-visible:border-[var(--focus-ring)] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[var(--focus-ring)]",
        "disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
