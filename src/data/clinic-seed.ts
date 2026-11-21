import type {
  Appointment,
  Clinician,
  ReadinessConcern,
  Treatment,
} from "@/types/clinic";
import { calculateAgeFromDOB, getOffsetDateISO } from "@/lib/format";

export const CLINIC_INFO = {
  name: "Aurel Dental & Aesthetics",
  address: "28 Jalan Telawi 3, Bangsar, 59100 Kuala Lumpur",
  phone: "+60 3 2284 7190",
  email: "concierge@aureldental.my",
  hoursLabel: "Tue to Sun, 09:30 to 20:00",
};

export const TIME_SLOT_GROUPS = [
  {
    label: "Morning",
    slots: ["09:30", "10:30", "11:30"],
  },
  {
    label: "Afternoon",
    slots: ["14:00", "15:15", "16:30"],
  },
  {
    label: "Evening",
    slots: ["18:00", "19:00"],
  },
] as const;

export const TREATMENTS: Treatment[] = [
  {
    id: "tr-diagnostic",
    slug: "comprehensive-diagnostic-hygiene",
    category: "restorative",
    categoryLabel: "Restorative Architecture",
    title: "Comprehensive Diagnostic & Guided Hygiene",
    summary:
      "Full 3D intraoral scan, periodontal charting, low-dose digital imaging, and gentle airflow biofilm therapy in one unhurried suite session.",
    durationMinutes: 60,
    priceFromRM: 320,
    priceToRM: 460,
    downtimeLabel: "None, resume dining after 30 minutes",
    recommendedStarter: true,
    prepChecklist: [
      "Brush normally two hours prior without abrasive whitening paste",
      "Bring any recent nightguard or retainer for fit verification",
      "List current supplements or blood-thinning medications",
    ],
    aftercareNote:
      "Avoid staining beverages such as dark coffee or turmeric for four hours after mineral polish.",
  },
  {
    id: "tr-ceramic-inlay",
    slug: "biomimetic-ceramic-inlay",
    category: "restorative",
    categoryLabel: "Restorative Architecture",
    title: "Biomimetic Ceramic Inlay Restoration",
    summary:
      "Conservative tooth-preserving ceramic restoration crafted to match natural enamel translucency and distribute chewing forces evenly.",
    durationMinutes: 90,
    priceFromRM: 1850,
    priceToRM: 2450,
    downtimeLabel: "Mild local numbness for 2 hours",
    prepChecklist: [
      "Eat a light meal before arriving so post-visit numbness is comfortable",
      "Notify your clinician if you experience cold sensitivity in that quadrant",
      "Plan a quiet afternoon if you prefer not to speak extensively while numb",
    ],
    aftercareNote:
      "Chew gently on the opposite side until sensation returns completely.",
  },
  {
    id: "tr-implant-consult",
    slug: "guided-implant-planning",
    category: "restorative",
    categoryLabel: "Restorative Architecture",
    title: "Guided Implant & Bite Planning",
    summary:
      "CBCT bone volume mapping and prosthetic wax-up review to design a predictable, natural-emergence single or multi-tooth replacement.",
    durationMinutes: 60,
    priceFromRM: 450,
    priceToRM: 680,
    downtimeLabel: "None for diagnostic planning session",
    prepChecklist: [
      "Remove facial jewelry or metallic hairpins before CBCT scanning",
      "Bring prior dental radiographs if taken within the past 12 months",
      "Share any history of sinus sensitivity or bone medication",
    ],
    aftercareNote:
      "You receive a printed anatomical report and staged surgical timeline before leaving.",
  },
  {
    id: "tr-smile-trial",
    slug: "digital-smile-trial",
    category: "smile-design",
    categoryLabel: "Porcelain & Smile Design",
    title: "Digital Smile Architecture & Mock-Up Trial",
    summary:
      "Facial-proportion photography and reversible chairside mock-up allowing you to preview tooth length, contour, and speech before committing.",
    durationMinutes: 75,
    priceFromRM: 580,
    priceToRM: 780,
    downtimeLabel: "Zero downtime, reversible trial composite",
    recommendedStarter: true,
    prepChecklist: [
      "Come with minimal lip balm so natural lip drape at rest is visible",
      "Note two or three subtle changes you wish to see or preserve",
      "Allow 75 minutes for studio photography and trial sculpting",
    ],
    aftercareNote:
      "You leave with high-resolution preview portraits and a written enamel preservation plan.",
  },
  {
    id: "tr-veneers",
    slug: "handcrafted-porcelain-veneers",
    category: "smile-design",
    categoryLabel: "Porcelain & Smile Design",
    title: "Ultra-Thin Handcrafted Porcelain Veneers",
    summary:
      "Minimally prepared feldspathic and lithium disilicate veneers layered by master ceramists to preserve natural surface texture and edge translucency.",
    durationMinutes: 90,
    priceFromRM: 2900,
    priceToRM: 3600,
    downtimeLabel: "24 hours mild gum adjustment per stage",
    prepChecklist: [
      "Complete baseline hygiene within four weeks prior to shade matching",
      "Avoid whitening strips for 10 days before final shade calibration",
      "Confirm your preferred natural shade warmth with Dr. Elena Vance",
    ],
    aftercareNote:
      "Wear your custom protective nightguard while sleeping to safeguard porcelain margins.",
  },
  {
    id: "tr-aligners",
    slug: "clear-aligner-assessment",
    category: "smile-design",
    categoryLabel: "Porcelain & Smile Design",
    title: "Clear Aligner & Arch Balance Assessment",
    summary:
      "Optical bite simulation and staged orthodontic movement analysis for crowded incisors, spacing, or relapse after childhood braces.",
    durationMinutes: 45,
    priceFromRM: 260,
    priceToRM: 390,
    downtimeLabel: "None",
    prepChecklist: [
      "Bring previous orthodontic retainers even if they no longer fit",
      "Brush prior to optical arch scanning",
      "Note any clicking or tightness in your jaw joint",
    ],
    aftercareNote:
      "Digital movement simulation is shared within 48 hours for calm review at home.",
  },
  {
    id: "tr-masseter",
    slug: "masseter-tension-harmony",
    category: "facial-aesthetics",
    categoryLabel: "Facial & Jawline Aesthetics",
    title: "Masseter Tension & Lower-Face Harmony",
    summary:
      "Targeted therapeutic neuromodulation to ease nighttime clenching, protect enamel from micro-fractures, and soften an overworked jawline.",
    durationMinutes: 45,
    priceFromRM: 1450,
    priceToRM: 1950,
    downtimeLabel: "No downtime, avoid lying flat for 4 hours",
    recommendedStarter: true,
    prepChecklist: [
      "Avoid aspirin, fish oil, or high-dose vitamin E for 48 hours if medically cleared",
      "Arrive with clean skin over the lower cheeks and jawline",
      "Inform Dr. Claire Lin of any upcoming dental procedures within two weeks",
    ],
    aftercareNote:
      "Avoid vigorous facial massage or high-heat saunas for 24 hours; peak relief builds over two weeks.",
  },
  {
    id: "tr-brightening",
    slug: "medical-enamel-brightening",
    category: "facial-aesthetics",
    categoryLabel: "Facial & Jawline Aesthetics",
    title: "Desensitizing Medical-Grade Enamel Brightening",
    summary:
      "Buffered pH clinical brightening paired with nano-hydroxyapatite conditioning to lift deep intrinsic staining without post-visit zingers.",
    durationMinutes: 60,
    priceFromRM: 1150,
    priceToRM: 1480,
    downtimeLabel: "48 hours white-diet care",
    prepChecklist: [
      "Flag any exposed root surfaces or cold sensitivity beforehand",
      "Eat before your appointment as dark foods are paused immediately after",
      "Use sensitivity toothpaste for three nights leading up to the visit",
    ],
    aftercareNote:
      "Follow a light-colored diet (water, rice, poultry, milk) for 48 hours while enamel pores re-seal.",
  },
  {
    id: "tr-perioral",
    slug: "perioral-hydration-support",
    category: "facial-aesthetics",
    categoryLabel: "Facial & Jawline Aesthetics",
    title: "Perioral & Lip Support Micro-Hydration",
    summary:
      "Restorative hyaluronic micro-droplet support around the vermilion border and marionette folds to restore balanced dental frame proportion.",
    durationMinutes: 45,
    priceFromRM: 1650,
    priceToRM: 2250,
    downtimeLabel: "24 to 48 hours mild localized swelling",
    prepChecklist: [
      "Schedule at least 10 days before major social photography or travel",
      "Pause alcohol 24 hours prior to minimize pinpoint bruising",
      "Share any history of cold sores so gentle prophylaxis can be arranged",
    ],
    aftercareNote:
      "Apply a clean cool compress intermittently for the first evening and avoid heavy pressure on the lips.",
  },
];

export const CLINICIANS: Clinician[] = [
  {
    id: "doc-elena",
    name: "Dr. Elena Vance",
    shortName: "Dr. Elena",
    role: "Clinical Director, Restorative & Porcelain Design",
    credentials: "BDS (Malaya), MClinDent Prosthodontics",
    focusAreas: [
      "Ultra-thin porcelain veneers",
      "Digital smile trials",
      "Biomimetic ceramic inlays",
    ],
    bio: "Fourteen years focused on conservative enamel preservation and handcrafted ceramic symmetry, pairing optical facial proportions with quiet chairside pacing.",
    avatarUrl: "/images/dr-elena-vance.jpg",
    suiteName: "Suite 01, North Light",
  },
  {
    id: "doc-farhan",
    name: "Dr. Farhan Idris",
    shortName: "Dr. Farhan",
    role: "Lead Prosthodontist & Implant Architect",
    credentials: "DDS (UKM), Fellow ITI Implantology",
    focusAreas: [
      "Guided implant planning",
      "Bite rehabilitation",
      "Comprehensive diagnostics",
    ],
    bio: "Specializes in 3D-guided implant placement and full-arch bite balance, prioritizing structural longevity and clear step-by-step clinical communication.",
    avatarUrl: "/images/dr-farhan-idris.jpg",
    suiteName: "Suite 02, Timber Courtyard",
  },
  {
    id: "doc-claire",
    name: "Dr. Claire Lin",
    shortName: "Dr. Claire",
    role: "Oral Harmony & Facial Aesthetics Clinician",
    credentials: "BDS (Singapore), PgDip Aesthetic Medicine",
    focusAreas: [
      "Masseter tension therapy",
      "Perioral support",
      "Medical enamel brightening",
    ],
    bio: "Bridges dentofacial anatomy and therapeutic aesthetics to relieve TMJ clenching strain and refine perioral balance with subtle, natural movement.",
    avatarUrl: "/images/dr-claire-lin.jpg",
    suiteName: "Suite 03, Garden Terrace",
  },
];

export const READINESS_CONCERNS: ReadinessConcern[] = [
  {
    id: "concern-chips",
    label: "Worn edges, chips, or uneven smile line",
    clinicalContext:
      "Micro-wear and edge chipping often reflect subtle bite interference rather than surface weakness alone. Previewing length in trial composite prevents over-preparation.",
    suggestedTreatmentId: "tr-smile-trial",
    estimatedFeeRange: "RM 580 to RM 780 (diagnostic mock-up)",
    expectedDowntime: "Zero downtime, reversible chairside trial",
    prepSteps: [
      "Avoid whitening strips for 7 days prior so baseline enamel tone reads accurately",
      "Notice whether you clench during focused work or sleep",
      "Bring two photos where you felt your smile looked most relaxed",
    ],
    suitabilityNote:
      "Ideal first step before deciding between minimal edge bonding and porcelain veneers.",
  },
  {
    id: "concern-sensitivity",
    label: "Cold sensitivity, old fillings, or overdue hygiene",
    clinicalContext:
      "Persistent sensitivity around older composite margins or gumlines responds best to gentle airflow cleaning and microscopic margin assessment before any drilling.",
    suggestedTreatmentId: "tr-diagnostic",
    estimatedFeeRange: "RM 320 to RM 460",
    expectedDowntime: "None, resume dining after 30 minutes",
    prepSteps: [
      "Note which specific tooth reacts to cold water or sweet foods",
      "Bring your existing nightguard or retainer for ultrasonic cleaning and check",
      "Allow 60 uninterrupted minutes for imaging and guided hygiene",
    ],
    suitabilityNote:
      "Recommended for all new patients establishing a calm clinical baseline.",
  },
  {
    id: "concern-jaw",
    label: "Morning jaw tightness, clenching, or wide lower face",
    clinicalContext:
      "Overactive masseter muscles generate heavy nocturnal bite forces that flatten molars and widen the lower third. Targeted relaxation eases strain within 14 days.",
    suggestedTreatmentId: "tr-masseter",
    estimatedFeeRange: "RM 1,450 to RM 1,950",
    expectedDowntime: "None, stay upright for 4 hours post-visit",
    prepSteps: [
      "Pause non-essential fish oil or aspirin 48 hours prior if cleared by your physician",
      "Arrive without heavy foundation along the lower jawline",
      "Mention if you already wear an occlusal splint at night",
    ],
    suitabilityNote:
      "Often paired with bite calibration when enamel wear facets are present.",
  },
  {
    id: "concern-color",
    label: "Deep staining or dull tone without sensitivity",
    clinicalContext:
      "Aggressive peroxide gels dehydrate enamel tubules and trigger sharp nerve sensitivity. Buffered brightening paired with mineral conditioning lifts shade safely.",
    suggestedTreatmentId: "tr-brightening",
    estimatedFeeRange: "RM 1,150 to RM 1,480",
    expectedDowntime: "48 hours light-colored diet window",
    prepSteps: [
      "Use a potassium-nitrate toothpaste for three nights ahead of your session",
      "Schedule after any planned restorative work on front teeth",
      "Eat a full meal before arriving as staining drinks wait 48 hours",
    ],
    suitabilityNote:
      "Includes take-home mineral serum to stabilize brightness and calm nerve endings.",
  },
];

export const CLINIC_FAQ = [
  {
    question: "How long should I set aside for a first visit at Aurel?",
    answer:
      "Initial diagnostic and aesthetic consultations are scheduled for 60 to 75 minutes. We book one patient per clinician suite at a time so X-rays, intraoral scanning, and treatment fee breakdowns happen without rushing.",
  },
  {
    question: "Are the listed RM ranges inclusive of imaging and consultation?",
    answer:
      "Diagnostic visits include digital X-rays, 3D optical scanning, and a written treatment plan. Complex procedures such as ceramic inlays or porcelain veneers are quoted as transparent ranges beforehand, with exact itemized fees confirmed before treatment begins.",
  },
  {
    question: "What happens if I need to reschedule or cancel my reserved slot?",
    answer:
      "You can adjust or cancel an appointment directly through your confirmation reference code or by calling our Bangsar concierge at least 24 hours prior with no rescheduling penalty.",
  },
  {
    question: "Can dental and facial aesthetic assessments be combined in one visit?",
    answer:
      "Yes. Dr. Elena Vance and Dr. Claire Lin regularly co-consult when patients are balancing tooth proportion with lip support or masseter tension relief.",
  },
];

export function createSeedAppointments(baseDate: Date = new Date()): Appointment[] {
  const today = getOffsetDateISO(0, baseDate);
  const tomorrow = getOffsetDateISO(1, baseDate);
  const day2 = getOffsetDateISO(2, baseDate);
  const day3 = getOffsetDateISO(3, baseDate);

  const raw: Omit<Appointment, "patientAge">[] = [
    {
      id: "apt-101",
      referenceCode: "AUR-4081",
      patientName: "Amina Razak",
      dateOfBirth: "1993-04-12",
      phone: "+60 12 384 9120",
      email: "amina.razak@example.my",
      treatmentId: "tr-diagnostic",
      clinicianId: "doc-farhan",
      dateISO: today,
      timeSlot: "09:30",
      status: "Completed",
      isFirstVisit: true,
      notes: "Cold sensitivity on upper left premolar. Prefers quiet explanation before X-ray.",
      createdAt: `${getOffsetDateISO(-3, baseDate)}T09:14:00Z`,
      updatedAt: `${today}T10:35:00Z`,
    },
    {
      id: "apt-102",
      referenceCode: "AUR-4082",
      patientName: "Daniel Tan Wei Ming",
      dateOfBirth: "1986-11-03",
      phone: "+60 16 709 4418",
      email: "daniel.tan@example.my",
      treatmentId: "tr-smile-trial",
      clinicianId: "doc-elena",
      dateISO: today,
      timeSlot: "10:30",
      status: "In Consultation",
      isFirstVisit: false,
      notes: "Reviewing incisal edge length trial prior to 4-unit veneer case.",
      createdAt: `${getOffsetDateISO(-5, baseDate)}T14:20:00Z`,
      updatedAt: `${today}T10:32:00Z`,
    },
    {
      id: "apt-103",
      referenceCode: "AUR-4083",
      patientName: "Priya Nair",
      dateOfBirth: "1997-08-21",
      phone: "+60 19 221 8874",
      email: "priya.nair@example.my",
      treatmentId: "tr-masseter",
      clinicianId: "doc-claire",
      dateISO: today,
      timeSlot: "11:30",
      status: "Checked In",
      isFirstVisit: true,
      notes: "Reports morning jaw soreness and worn canine tips. No allergies.",
      createdAt: `${getOffsetDateISO(-2, baseDate)}T16:05:00Z`,
      updatedAt: `${today}T11:18:00Z`,
    },
    {
      id: "apt-104",
      referenceCode: "AUR-4084",
      patientName: "Marcus Lim",
      dateOfBirth: "1979-02-19",
      phone: "+60 12 615 3390",
      email: "marcus.lim@example.my",
      treatmentId: "tr-implant-consult",
      clinicianId: "doc-farhan",
      dateISO: today,
      timeSlot: "14:00",
      status: "Confirmed",
      isFirstVisit: true,
      notes: "Missing lower right first molar extracted 2 years ago. Bringing old OPG.",
      createdAt: `${getOffsetDateISO(-1, baseDate)}T11:40:00Z`,
      updatedAt: `${getOffsetDateISO(-1, baseDate)}T11:40:00Z`,
    },
    {
      id: "apt-105",
      referenceCode: "AUR-4085",
      patientName: "Nurul Huda Ismail",
      dateOfBirth: "1991-06-29",
      phone: "+60 13 940 1125",
      email: "nurul.huda@example.my",
      treatmentId: "tr-brightening",
      clinicianId: "doc-claire",
      dateISO: today,
      timeSlot: "15:15",
      status: "Confirmed",
      isFirstVisit: false,
      notes: "Pre-wedding brightening session. Requested desensitizing serum.",
      createdAt: `${getOffsetDateISO(-4, baseDate)}T08:50:00Z`,
      updatedAt: `${getOffsetDateISO(-4, baseDate)}T08:50:00Z`,
    },
    {
      id: "apt-106",
      referenceCode: "AUR-4086",
      patientName: "Hannah Chong",
      dateOfBirth: "2001-09-14",
      phone: "+60 17 442 6671",
      email: "hannah.chong@example.my",
      treatmentId: "tr-aligners",
      clinicianId: "doc-elena",
      dateISO: today,
      timeSlot: "18:00",
      status: "Confirmed",
      isFirstVisit: true,
      notes: "Lower incisor crowding relapse after stopping retainer three years ago.",
      createdAt: `${getOffsetDateISO(-2, baseDate)}T19:10:00Z`,
      updatedAt: `${getOffsetDateISO(-2, baseDate)}T19:10:00Z`,
    },
    {
      id: "apt-107",
      referenceCode: "AUR-4087",
      patientName: "Reza Hakim",
      dateOfBirth: "1964-12-08",
      phone: "+60 12 204 7781",
      email: "reza.hakim@example.my",
      treatmentId: "tr-ceramic-inlay",
      clinicianId: "doc-elena",
      dateISO: tomorrow,
      timeSlot: "09:30",
      status: "Confirmed",
      isFirstVisit: false,
      notes: "Replacing cracked amalgam on tooth 36. Controlled hypertension, takes amlodipine.",
      createdAt: `${getOffsetDateISO(-6, baseDate)}T10:15:00Z`,
      updatedAt: `${getOffsetDateISO(-6, baseDate)}T10:15:00Z`,
    },
    {
      id: "apt-108",
      referenceCode: "AUR-4088",
      patientName: "Mei Ling Tan",
      dateOfBirth: "1989-07-05",
      phone: "+60 16 551 0934",
      email: "meiling.tan@example.my",
      treatmentId: "tr-perioral",
      clinicianId: "doc-claire",
      dateISO: tomorrow,
      timeSlot: "14:00",
      status: "Confirmed",
      isFirstVisit: false,
      notes: "Follow-up hydration balance check. Mild bruising history, requested cool pack.",
      createdAt: `${getOffsetDateISO(-3, baseDate)}T13:25:00Z`,
      updatedAt: `${getOffsetDateISO(-3, baseDate)}T13:25:00Z`,
    },
    {
      id: "apt-109",
      referenceCode: "AUR-4089",
      patientName: "Kenneth Ng",
      dateOfBirth: "1982-03-27",
      phone: "+60 12 889 1204",
      email: "kenneth.ng@example.my",
      treatmentId: "tr-diagnostic",
      clinicianId: "doc-farhan",
      dateISO: day2,
      timeSlot: "11:30",
      status: "Cancelled",
      isFirstVisit: true,
      notes: "Rescheduling for next week due to Singapore work travel.",
      cancellationReason: "Patient requested travel reschedule 36 hours prior.",
      createdAt: `${getOffsetDateISO(-4, baseDate)}T15:00:00Z`,
      updatedAt: `${getOffsetDateISO(-1, baseDate)}T09:10:00Z`,
    },
    {
      id: "apt-110",
      referenceCode: "AUR-4090",
      patientName: "Siti Khadijah Yusof",
      dateOfBirth: "1995-10-16",
      phone: "+60 19 672 3011",
      email: "siti.khadijah@example.my",
      treatmentId: "tr-veneers",
      clinicianId: "doc-elena",
      dateISO: day3,
      timeSlot: "10:30",
      status: "Confirmed",
      isFirstVisit: false,
      notes: "Final ceramic bonding for upper six teeth after shade verification.",
      createdAt: `${getOffsetDateISO(-7, baseDate)}T12:00:00Z`,
      updatedAt: `${getOffsetDateISO(-7, baseDate)}T12:00:00Z`,
    },
  ];

  return raw.map((item) => ({
    ...item,
    patientAge: calculateAgeFromDOB(item.dateOfBirth, baseDate),
  }));
}
