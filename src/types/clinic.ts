export type TreatmentCategory =
  | "restorative"
  | "smile-design"
  | "facial-aesthetics";

export interface Treatment {
  id: string;
  slug: string;
  category: TreatmentCategory;
  categoryLabel: string;
  title: string;
  summary: string;
  durationMinutes: number;
  priceFromRM: number;
  priceToRM: number;
  downtimeLabel: string;
  recommendedStarter?: boolean;
  prepChecklist: string[];
  aftercareNote: string;
}

export interface Clinician {
  id: string;
  name: string;
  shortName: string;
  role: string;
  credentials: string;
  focusAreas: string[];
  bio: string;
  avatarUrl: string;
  suiteName: string;
}

export type AppointmentStatus =
  | "Confirmed"
  | "Checked In"
  | "In Consultation"
  | "Completed"
  | "Cancelled";

export interface Appointment {
  id: string;
  referenceCode: string;
  patientName: string;
  patientAge: number;
  dateOfBirth: string;
  phone: string;
  email: string;
  treatmentId: string;
  clinicianId: string;
  dateISO: string;
  timeSlot: string;
  status: AppointmentStatus;
  isFirstVisit: boolean;
  notes: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadinessConcern {
  id: string;
  label: string;
  clinicalContext: string;
  suggestedTreatmentId: string;
  estimatedFeeRange: string;
  expectedDowntime: string;
  prepSteps: string[];
  suitabilityNote: string;
}

export interface NewBookingInput {
  patientName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  treatmentId: string;
  clinicianId: string;
  dateISO: string;
  timeSlot: string;
  isFirstVisit: boolean;
  notes: string;
}
