"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/format";

export function ClinicAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className="divide-y divide-[var(--line)] border-y border-[var(--line)]"
    >
      {items.map((item, idx) => (
        <AccordionPrimitive.Item key={item.question} value={`faq-${idx}`}>
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
              className={cn(
                "group flex w-full items-center justify-between gap-4 py-4.5 text-left min-h-12",
                "text-[15px] leading-[22px] font-medium text-[var(--ink-12)]",
                "hover:text-[var(--accent-11)] transition-colors duration-[var(--dur-hover)] ease-[var(--ease-out)]"
              )}
            >
              <span>{item.question}</span>
              {/* Bespoke two-stroke Swiss caliper + / - morph */}
              <span
                aria-hidden="true"
                className="relative inline-flex size-4 shrink-0 items-center justify-center text-[var(--ink-10)] group-hover:text-[var(--accent-11)] transition-colors duration-[var(--dur-hover)]"
              >
                <span className="h-[1.5px] w-3 bg-current" />
                <span className="absolute h-3 w-[1.5px] bg-current transition-[transform,opacity] duration-[220ms] ease-[var(--ease-caliper)] group-data-[state=open]:scale-y-0 group-data-[state=open]:opacity-0" />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="accordion-content overflow-hidden">
            <p className="pb-5 pr-8 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--ink-11)]">
              {item.answer}
            </p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
