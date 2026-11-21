"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArchitecturalReveal } from "@/components/shared/MotionPrimitives";
import { ProgressiveImage } from "@/components/shared/ProgressiveImage";

export function ParallaxCraftBand() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const layerRef = React.useRef<HTMLDivElement | null>(null);

  // Progressive fallback for browsers without CSS scroll-driven view() timeline support.
  React.useEffect(() => {
    const supportsScrollDriven =
      typeof CSS !== "undefined" &&
      CSS.supports("(animation-timeline: view()) and (animation-range: entry)");
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (supportsScrollDriven || prefersReduced) return;

    const container = containerRef.current;
    const layer = layerRef.current;
    if (!container || !layer) return;

    const updateOffset = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const progress = Math.min(
        1,
        Math.max(0, (vh - rect.top) / (vh + rect.height))
      );
      const translate = (0.5 - progress) * 44;
      layer.style.transform = `translate3d(0, ${translate}px, 0)`;
    };

    let active = false;
    const onScroll = () => {
      if (active) updateOffset();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        active = entries.some((entry) => entry.isIntersecting);
        if (active) {
          updateOffset();
          window.addEventListener("scroll", onScroll, { passive: true });
        } else {
          window.removeEventListener("scroll", onScroll);
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      aria-labelledby="craft-band-heading"
      className="border-y border-[#2A2A25] bg-[#151513] text-[#F3F1EC] overflow-hidden"
    >
      <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <ArchitecturalReveal variant="aperture">
            <div className="relative overflow-hidden rounded-[var(--radius-feature)] border border-[#2A2A25] bg-[#1D1D1A]">
              <div ref={layerRef} className="parallax-layer-slow will-change-transform">
                <ProgressiveImage
                  src="/images/craft-ceramic.jpg"
                  alt="Handcrafted porcelain restorations beside precision clinical mirror on limestone"
                  width={960}
                  height={720}
                  sizes="(max-width: 1024px) 100vw, 580px"
                  skeletonLabel="Atelier Ceramic · Loading"
                  wrapperClassName="aspect-[4/3] w-full bg-[#1D1D1A]"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </ArchitecturalReveal>

          <ArchitecturalReveal variant="rise" delayMs={80} className="space-y-6 max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#6DB49F]">
              02 · Materials & Clinical Pacing
            </p>
            <h2
              id="craft-band-heading"
              className="font-serif text-[30px] leading-[36px] tracking-[-0.02em] text-[#FFFFFF] sm:text-[40px] sm:leading-[46px]"
            >
              Hand-layered porcelain, calibrated to your facial proportion rather than a fixed shade chart.
            </h2>
            <p className="text-[15px] leading-[24px] text-[#C9C5BC]">
              Every restorative and aesthetic plan begins with optical 3D scanning
              and natural daylight shade photography. By reserving 60 to 90 minutes
              per suite appointment, our clinicians explain trade-offs clearly before
              any irreversible step begins.
            </p>

            <div className="grid grid-cols-2 gap-6 border-t border-[#2A2A25] pt-6">
              <div>
                <p className="font-serif text-[28px] leading-[34px] text-[#FFFFFF] tabular-nums">
                  60 to 90 min
                </p>
                <p className="mt-1 text-[13px] text-[#ACA89F]">
                  Dedicated single-suite booking window
                </p>
              </div>
              <div>
                <p className="font-serif text-[28px] leading-[34px] text-[#FFFFFF] tabular-nums">
                  0.3 mm
                </p>
                <p className="mt-1 text-[13px] text-[#ACA89F]">
                  Conservative feldspathic veneer thickness
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                asChild
                variant="secondary"
                className="border-[#3D3D37] bg-[#1D1D1A] text-[#F3F1EC] hover:border-[#6DB49F] hover:bg-[#252521] dark:border-[#3D3D37] dark:bg-[#1D1D1A]"
              >
                <Link href="/treatments" className="gap-1.5">
                  <span>Review Fee & Downtime Table</span>
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </ArchitecturalReveal>
        </div>
      </div>
    </section>
  );
}
