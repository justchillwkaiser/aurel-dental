import Link from "next/link";
import { CLINIC_INFO } from "@/data/clinic-seed";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--line)] bg-[#151513] text-[#F3F1EC] dark:border-[#2A2A25]">
      <div className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Studio Anchor */}
          <div className="space-y-4 max-w-md">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#6DB49F]">
              Bangsar · Kuala Lumpur
            </p>
            <p className="font-serif text-[26px] leading-[32px] tracking-[-0.015em] text-[#FFFFFF]">
              {CLINIC_INFO.name}
            </p>
            <p className="text-[14px] leading-[22px] text-[#B8B4AC]">
              Restorative dentistry, handcrafted porcelain design, and conservative
              facial aesthetics delivered in private one-patient-at-a-time suites.
            </p>
          </div>

          {/* Patient Care Directory */}
          <div className="space-y-3 text-[14px] leading-[22px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#8E8A82]">
              Patient Care
            </p>
            <ul className="space-y-1 sm:space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center sm:min-h-8 text-[#DCD9D0] hover:text-[#FFFFFF] underline-offset-4 hover:underline transition-colors duration-150"
                >
                  Clinic Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/treatments"
                  className="inline-flex min-h-11 items-center sm:min-h-8 text-[#DCD9D0] hover:text-[#FFFFFF] underline-offset-4 hover:underline transition-colors duration-150"
                >
                  Treatments & Fee Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="inline-flex min-h-11 items-center sm:min-h-8 text-[#DCD9D0] hover:text-[#FFFFFF] underline-offset-4 hover:underline transition-colors duration-150"
                >
                  Reserve Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/book#lookup"
                  className="inline-flex min-h-11 items-center sm:min-h-8 text-[#DCD9D0] hover:text-[#FFFFFF] underline-offset-4 hover:underline transition-colors duration-150"
                >
                  Find Existing Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinic Operations (Staff Portal separated from patient navbar) */}
          <div className="space-y-3 text-[14px] leading-[22px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#8E8A82]">
              Clinic Operations
            </p>
            <ul className="space-y-1 sm:space-y-2.5">
              <li>
                <Link
                  href="/dashboard"
                  className="inline-flex min-h-11 items-center gap-2 sm:min-h-8 text-[#F3F1EC] hover:text-[#6DB49F] underline-offset-4 hover:underline transition-colors duration-150"
                >
                  <span
                    className="size-1.5 rounded-full bg-[#6DB49F]"
                    aria-hidden="true"
                  />
                  <span>Doctor & Staff Portal</span>
                </Link>
              </li>
            </ul>
            <p className="pt-2 text-[12px] leading-[18px] text-[#8E8A82]">
              Internal schedule roster, patient intake inspection, and walk-in suite assignment.
            </p>
          </div>

          {/* Address & Hours */}
          <div className="space-y-2.5 text-[14px] leading-[22px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#8E8A82]">
              Suite & Hours
            </p>
            <p className="text-[#F3F1EC]">{CLINIC_INFO.address}</p>
            <p className="text-[#B8B4AC]">{CLINIC_INFO.hoursLabel}</p>
            <p className="font-mono text-[13px] text-[#DCD9D0] tabular-nums">
              {CLINIC_INFO.phone}
            </p>
            <p className="text-[13px] text-[#B8B4AC]">{CLINIC_INFO.email}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-[#2A2A25] pt-6 text-[12px] text-[#8E8A82] sm:flex-row sm:items-center sm:justify-between">
          <p>Aurel Dental & Aesthetics · Bangsar Concept Showcase.</p>
          <p>Simulated RM fee schedules synced live with Staff Portal in-browser.</p>
        </div>
      </div>
    </footer>
  );
}
