import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StaffDashboard } from "@/components/dashboard/StaffDashboard";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Doctor & Staff Portal",
  description:
    "Clinical schedule console showing live patient bookings, ages, procedures, intake notes, and suite statuses.",
};

export default function DashboardPage() {
  return (
    <div>
      {/* Dedicated Dark Operations Header Strip (Separated from public patient flows) */}
      <section className="border-b border-[#2A2A25] bg-[#151513] text-[#F3F1EC]">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#6DB49F]">
                <span
                  className="size-1.5 rounded-full bg-[#6DB49F]"
                  aria-hidden="true"
                />
                Bangsar Clinic Operations Console
              </p>
              <h1 className="font-serif text-[32px] leading-[38px] tracking-[-0.02em] text-[#FFFFFF] sm:text-[38px] sm:leading-[44px]">
                Doctor & Staff Schedule Portal
              </h1>
              <p className="max-w-xl text-[14px] leading-[22px] text-[#B8B4AC]">
                Inspect incoming patient reservations, ages, clinical sensitivities,
                and suite check-ins synced live from patient bookings.
              </p>
            </div>

            <Button
              asChild
              variant="secondary"
              className="border-[#3D3D37] bg-[#1D1D1A] text-[#F3F1EC] hover:border-[#6DB49F] hover:bg-[#252521] dark:border-[#3D3D37] dark:bg-[#1D1D1A]"
            >
              <Link href="/book" className="gap-1.5">
                <span>Open Patient Booking</span>
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <StaffDashboard />
      </div>
    </div>
  );
}
