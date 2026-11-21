import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRM(amount: number): string {
  return `RM ${amount.toLocaleString("en-MY")}`;
}

export function formatRMRange(from: number, to: number): string {
  if (from === to) return formatRM(from);
  return `RM ${from.toLocaleString("en-MY")} to RM ${to.toLocaleString("en-MY")}`;
}

export function calculateAgeFromDOB(
  dobISO: string,
  referenceDate?: Date
): number {
  if (!dobISO) return 0;
  const ref = referenceDate ?? new Date();
  const parts = dobISO.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return 0;

  const [year, month, day] = parts;
  let age = ref.getFullYear() - year;
  const monthDiff = ref.getMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < day)) {
    age -= 1;
  }
  return Math.max(0, age);
}

export function getOffsetDateISO(
  offsetDays: number,
  baseDate: Date = new Date()
): string {
  const d = new Date(baseDate);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDisplayDate(dateISO: string): string {
  const parts = dateISO.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return dateISO;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return new Intl.DateTimeFormat("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatShortDay(dateISO: string): {
  weekday: string;
  dayNum: string;
  month: string;
} {
  const parts = dateISO.split("-").map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return {
    weekday: new Intl.DateTimeFormat("en-MY", { weekday: "short" }).format(d),
    dayNum: String(d.getDate()).padStart(2, "0"),
    month: new Intl.DateTimeFormat("en-MY", { month: "short" }).format(d),
  };
}

export function generateReferenceCode(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `AUR-${digits}`;
}

export function buildICSContent(params: {
  referenceCode: string;
  title: string;
  clinicianName: string;
  dateISO: string;
  timeSlot: string;
  durationMinutes: number;
  patientName: string;
}): string {
  const [year, month, day] = params.dateISO.split("-").map(Number);
  const [hour, minute] = params.timeSlot.split(":").map(Number);
  const start = new Date(year, month - 1, day, hour, minute, 0);
  const end = new Date(start.getTime() + params.durationMinutes * 60000);

  const toICSDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(
      d.getHours()
    )}${pad(d.getMinutes())}00`;
  };

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aurel Dental & Aesthetics//Appointment//EN",
    "BEGIN:VEVENT",
    `UID:${params.referenceCode}@aureldental.my`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${params.title} (${params.referenceCode})`,
    `DESCRIPTION:Appointment for ${params.patientName} with ${params.clinicianName}. Please arrive 10 minutes prior to your scheduled suite time.`,
    "LOCATION:Aurel Dental & Aesthetics, 28 Jalan Telawi 3, Bangsar, 59100 Kuala Lumpur",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
