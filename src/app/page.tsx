import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CLINICIANS, CLINIC_FAQ, CLINIC_INFO } from "@/data/clinic-seed";
import { Button } from "@/components/ui/button";
import { ClinicAccordion } from "@/components/ui/accordion";
import { DisciplineIndex } from "@/components/landing/DisciplineIndex";
import { ParallaxCraftBand } from "@/components/landing/ParallaxCraftBand";
import { ReadinessGuide } from "@/components/landing/ReadinessGuide";
import { ArchitecturalReveal, CaliperRule } from "@/components/shared/MotionPrimitives";
import { ProgressiveImage } from "@/components/shared/ProgressiveImage";

export default function HomePage() {
  return (
    <div>
      {/* 1. Full-Bleed Architectural Hero with Aperture & Baseline Rise */}
      <section className="relative border-b border-[var(--line)] bg-[#0C0C0B] text-[#FFFFFF]">
        <div className="relative min-h-[540px] lg:min-h-[640px] overflow-hidden">
          <div className="motion-hero-aperture absolute inset-0">
            <ProgressiveImage
              src="/images/hero-suite.jpg"
              alt="Sunlit minimalist dental suite at Aurel Dental & Aesthetics in Bangsar"
              fill
              preload
              fetchPriority="high"
              decoding="sync"
              quality={75}
              sizes="(max-width: 768px) 100vw, 1440px"
              skipFadeOnPriority
              wrapperClassName="bg-[#0C0C0B]"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(96deg,rgba(12,12,11,0.88)_0%,rgba(12,12,11,0.62)_48%,rgba(12,12,11,0.22)_100%)]"
            />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[540px] lg:min-h-[640px] max-w-[1320px] flex-col justify-end px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
            <div className="max-w-2xl space-y-6">
              <div className="overflow-hidden">
                <p className="motion-mask-rise-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[#6DB49F]">
                  Three-Suite Practice · Jalan Telawi 3, Bangsar
                </p>
              </div>

              <div className="overflow-hidden">
                <h1 className="motion-mask-rise-2 font-sans text-[38px] font-medium leading-[1.06] tracking-[-0.03em] text-[#FFFFFF] sm:text-[54px]">
                  Restorative dentistry & facial aesthetics, paced without haste.
                </h1>
              </div>

              <div className="overflow-hidden">
                <p className="motion-mask-rise-3 text-[16px] leading-[26px] text-[#E4E0D7] max-w-xl">
                  Aurel Dental & Aesthetics combines biomimetic tooth preservation,
                  bespoke porcelain craft, and therapeutic facial balancing under
                  itemized RM care plans before any treatment begins.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <Button
                  asChild
                  className="h-11 bg-[#FFFFFF] px-5 text-[#151513] hover:bg-[#F3F1EC] shadow-none"
                >
                  <Link href="/book" className="gap-1.5">
                    <span>Reserve a Consultation</span>
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="h-11 border-[#FFFFFF]/30 bg-[#151513]/60 px-5 text-[#FFFFFF] backdrop-blur-sm hover:border-[#FFFFFF]/60 hover:bg-[#151513]/85 dark:border-[#FFFFFF]/30 dark:bg-[#151513]/60"
                >
                  <a href="#readiness-guide">Check Care Readiness</a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hairline-Ruled 3-Column Clinical Proof Strip */}
        <div className="bg-[var(--ground)] text-[var(--ink-12)]">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
            <dl className="grid divide-y divide-[var(--line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="py-5 sm:pr-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                  01 · Clinic Hours
                </dt>
                <dd className="mt-1.5 text-[14px] font-medium text-[var(--ink-12)]">
                  {CLINIC_INFO.hoursLabel}
                </dd>
              </div>
              <div className="py-5 sm:px-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                  02 · Suite Pacing
                </dt>
                <dd className="mt-1.5 text-[14px] font-medium text-[var(--ink-12)]">
                  One patient per suite, 60 to 90 min
                </dd>
              </div>
              <div className="py-5 sm:pl-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                  03 · Diagnostic First
                </dt>
                <dd className="mt-1.5 text-[14px] font-medium text-[var(--ink-12)]">
                  3D optical scan & written RM plan
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 2. Numbered Clinical Discipline Index */}
      <DisciplineIndex />

      {/* 3. Scroll-Driven Obsidian Craft Band */}
      <ParallaxCraftBand />

      {/* 4. Interactive Reciprocity Readiness & Recovery Guide */}
      <ReadinessGuide />

      {/* 5. Uncarded 3:4 Clinician Portraits */}
      <section aria-labelledby="clinicians-heading" className="bg-[var(--ground)]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <ArchitecturalReveal variant="rise" className="max-w-2xl pb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent-11)]">
              04 · Attending Clinicians
            </p>
            <h2
              id="clinicians-heading"
              className="mt-2 font-serif text-[30px] leading-[36px] tracking-[-0.02em] text-[var(--ink-12)] sm:text-[38px] sm:leading-[44px]"
            >
              Three specialist perspectives collaborating inside one quiet house.
            </h2>
          </ArchitecturalReveal>

          <CaliperRule strong />

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {CLINICIANS.map((doc, idx) => (
              <ArchitecturalReveal
                key={doc.id}
                variant="aperture"
                delayMs={idx * 70}
                className="flex flex-col"
              >
                <article className="flex flex-1 flex-col">
                  <div className="overflow-hidden rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--panel)]">
                    <ProgressiveImage
                      src={doc.avatarUrl}
                      alt={`${doc.name}, ${doc.role}`}
                      width={600}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      skeletonLabel={`${doc.suiteName} · Loading portrait`}
                      wrapperClassName="aspect-[3/4] w-full"
                      className="h-full w-full object-cover transition-[transform,opacity] duration-500 ease-[var(--ease-caliper)] hover:scale-[1.025]"
                    />
                  </div>
                  <div className="mt-5 flex flex-1 flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between gap-2 border-b border-[var(--line)] pb-2.5">
                        <h3 className="font-serif text-[22px] leading-[28px] text-[var(--ink-12)]">
                          {doc.name}
                        </h3>
                        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
                          {doc.suiteName}
                        </span>
                      </div>
                      <p className="text-[13px] font-medium text-[var(--accent-11)]">
                        {doc.role}
                      </p>
                      <p className="font-mono text-[11px] text-[var(--ink-9)]">
                        {doc.credentials}
                      </p>
                      <p className="pt-1 text-[14px] leading-[22px] text-[var(--ink-11)]">
                        {doc.bio}
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button asChild variant="secondary" className="w-full sm:w-auto">
                        <Link href={`/book?clinician=${doc.id}`}>
                          Book with {doc.shortName}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </ArchitecturalReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Patient Questions & Reservation Lookup Ledger */}
      <section
        aria-labelledby="faq-heading"
        className="mx-auto max-w-[1320px] px-4 pt-4 pb-8 sm:px-6 lg:px-10"
      >
        <CaliperRule />
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-9)]">
              05 · Before You Visit
            </p>
            <h2
              id="faq-heading"
              className="mt-2 mb-6 font-serif text-[28px] leading-[34px] tracking-[-0.02em] text-[var(--ink-12)] sm:text-[32px] sm:leading-[38px]"
            >
              Common questions about appointments and RM fees
            </h2>
            <ClinicAccordion items={CLINIC_FAQ} />
          </div>

          <aside className="rounded-[var(--radius-container)] border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-7 space-y-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--accent-11)]">
                Reservation Lookup
              </p>
              <h3 className="mt-1.5 font-serif text-[22px] leading-[28px] text-[var(--ink-12)]">
                Need to view, check in, or cancel an existing booking?
              </h3>
              <p className="mt-2 text-[14px] leading-[22px] text-[var(--ink-11)]">
                Enter your reference code (such as{" "}
                <span className="font-mono text-[13px] text-[var(--ink-12)]">
                  AUR-4084
                </span>
                ) on the reservation page to inspect your clinician suite and visit preparation.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button asChild variant="primary" className="w-full sm:flex-1">
                <Link href="/book#lookup">Find Reservation</Link>
              </Button>
              <Button asChild variant="secondary" className="w-full sm:flex-1">
                <Link href="/dashboard">Open Staff Portal</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
