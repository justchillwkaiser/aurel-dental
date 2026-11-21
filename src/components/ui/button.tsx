import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/format";

const buttonVariants = cva(
  [
    "group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "tracking-[var(--tracking-label)] text-[length:var(--text-body)] leading-none",
    "transition-[transform,scale,background-color,border-color,color,opacity] duration-[var(--dur-hover)] ease-[var(--ease-out)]",
    "active:scale-[0.975] disabled:pointer-events-none disabled:opacity-55 disabled:active:scale-100",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--primary-bg)] text-[var(--primary-fg)] shadow-[var(--shadow-primary)]",
          "hover:bg-[var(--primary-hover)]",
          "dark:disabled:opacity-100 dark:disabled:bg-[var(--ink-4)] dark:disabled:text-[var(--ink-8)] dark:disabled:shadow-none",
        ].join(" "),
        secondary: [
          "bg-[var(--raised)] text-[var(--ink-12)] border border-[var(--line)]",
          "hover:bg-[var(--panel)] hover:border-[var(--ink-8)]",
          "dark:bg-[var(--ink-3)] dark:hover:bg-[var(--ink-4)]",
        ].join(" "),
        pill: [
          "bg-[var(--panel)] text-[var(--ink-12)] border border-[var(--line)]",
          "hover:bg-[var(--raised)] hover:border-[var(--ink-8)]",
          "dark:bg-[var(--ink-3)] dark:hover:bg-[var(--ink-4)]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[var(--ink-11)]",
          "hover:bg-[var(--panel)] hover:text-[var(--ink-12)]",
        ].join(" "),
        destructiveTrigger: [
          "bg-[var(--raised)] text-[var(--red-11)] border border-[var(--red-6)]",
          "hover:bg-[var(--red-3)]",
          "dark:bg-[var(--ink-3)] dark:hover:bg-[var(--red-3)]",
        ].join(" "),
        destructiveConfirm: [
          "bg-[var(--red-9)] text-[var(--red-contrast)] border border-[var(--red-9)]",
          "hover:bg-[var(--red-10)]",
        ].join(" "),
      },
      size: {
        default: "h-[var(--control-h)] rounded-[var(--radius-control)] px-4",
        compact: "h-[var(--control-h-compact)] rounded-[var(--radius-control)] px-3",
        pill: "h-[var(--control-h-pill)] pointer-coarse:h-9 rounded-[var(--radius-control)] px-3 text-[length:var(--text-meta)]",
        icon: "size-[var(--control-h)] rounded-[var(--radius-control)] p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
