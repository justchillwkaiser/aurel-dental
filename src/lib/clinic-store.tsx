"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  CLINICIANS,
  TREATMENTS,
  createSeedAppointments,
} from "@/data/clinic-seed";
import {
  calculateAgeFromDOB,
  generateReferenceCode,
  getOffsetDateISO,
} from "@/lib/format";
import type {
  Appointment,
  AppointmentStatus,
  Clinician,
  NewBookingInput,
  Treatment,
} from "@/types/clinic";

const STORAGE_KEY = "aurel_dental_clinic_state_v1";
const CHANNEL_NAME = "aurel_dental_clinic_sync_v1";
const LOCAL_CHANGE_EVENT = "aurel-appointments-change";

const EMPTY_APPOINTMENTS: Appointment[] = [];
let cachedRaw: string | null = null;
let cachedParsed: Appointment[] = EMPTY_APPOINTMENTS;

function readAppointmentsSnapshot(): Appointment[] {
  if (typeof window === "undefined") return EMPTY_APPOINTMENTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw && cachedParsed !== EMPTY_APPOINTMENTS) {
      return cachedParsed;
    }
    if (raw) {
      const parsed = JSON.parse(raw) as Appointment[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedRaw = raw;
        cachedParsed = parsed;
        return parsed;
      }
    }
    const seeded = createSeedAppointments(new Date());
    const serialized = JSON.stringify(seeded);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedParsed = seeded;
    return seeded;
  } catch {
    if (cachedParsed === EMPTY_APPOINTMENTS) {
      cachedParsed = createSeedAppointments(new Date());
    }
    return cachedParsed;
  }
}

function subscribeAppointments(callback: () => void) {
  const onChange = () => callback();
  window.addEventListener("storage", onChange);
  window.addEventListener(LOCAL_CHANGE_EVENT, onChange);

  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = () => {
      cachedRaw = null;
      callback();
    };
  }

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LOCAL_CHANGE_EVENT, onChange);
    channel?.close();
  };
}

function subscribeHydration() {
  return () => {};
}

interface ClinicStoreContextValue {
  appointments: Appointment[];
  treatments: Treatment[];
  clinicians: Clinician[];
  isHydrated: boolean;
  todayISO: string;
  simulateNetworkError: boolean;
  setSimulateNetworkError: (value: boolean) => void;
  isSlotReserved: (
    clinicianId: string,
    dateISO: string,
    timeSlot: string,
    excludeAppointmentId?: string
  ) => boolean;
  createAppointment: (input: NewBookingInput) => Promise<Appointment>;
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus,
    cancellationReason?: string
  ) => Promise<Appointment>;
  rescheduleAppointment: (
    id: string,
    dateISO: string,
    timeSlot: string,
    clinicianId?: string
  ) => Promise<Appointment>;
  resetDemoData: () => void;
  findByReference: (referenceCode: string) => Appointment | undefined;
}

const ClinicStoreContext = createContext<ClinicStoreContextValue | null>(null);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ClinicStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const appointments = useSyncExternalStore(
    subscribeAppointments,
    readAppointmentsSnapshot,
    () => EMPTY_APPOINTMENTS
  );
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false
  );
  const todayISO = useSyncExternalStore(
    subscribeHydration,
    () => getOffsetDateISO(0),
    () => ""
  );
  const [simulateNetworkError, setSimulateNetworkError] = useState(false);

  const persistAppointments = useCallback((next: Appointment[]) => {
    const serialized = JSON.stringify(next);
    cachedRaw = serialized;
    cachedParsed = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, serialized);
      if ("BroadcastChannel" in window) {
        const channel = new BroadcastChannel(CHANNEL_NAME);
        channel.postMessage({ type: "SYNC_APPOINTMENTS" });
        channel.close();
      }
    } catch {
      // Storage may be unavailable in restricted contexts; in-memory cache stays active.
    }
    window.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
  }, []);

  const isSlotReserved = useCallback(
    (
      clinicianId: string,
      dateISO: string,
      timeSlot: string,
      excludeAppointmentId?: string
    ) => {
      return appointments.some(
        (apt) =>
          apt.id !== excludeAppointmentId &&
          apt.clinicianId === clinicianId &&
          apt.dateISO === dateISO &&
          apt.timeSlot === timeSlot &&
          apt.status !== "Cancelled"
      );
    },
    [appointments]
  );

  const createAppointment = useCallback(
    async (input: NewBookingInput): Promise<Appointment> => {
      await delay(320);

      if (simulateNetworkError) {
        throw new Error(
          "Clinic scheduling server did not respond in time. Your form details are preserved; please try again."
        );
      }

      if (isSlotReserved(input.clinicianId, input.dateISO, input.timeSlot)) {
        throw new Error(
          "That suite time was just reserved by another patient. Please pick another open slot."
        );
      }

      const nowISO = new Date().toISOString();
      let code = generateReferenceCode();
      while (appointments.some((a) => a.referenceCode === code)) {
        code = generateReferenceCode();
      }

      const created: Appointment = {
        id: `apt-${Date.now()}`,
        referenceCode: code,
        patientName: input.patientName.trim(),
        patientAge: calculateAgeFromDOB(input.dateOfBirth),
        dateOfBirth: input.dateOfBirth,
        phone: input.phone.trim(),
        email: input.email.trim(),
        treatmentId: input.treatmentId,
        clinicianId: input.clinicianId,
        dateISO: input.dateISO,
        timeSlot: input.timeSlot,
        status: "Confirmed",
        isFirstVisit: input.isFirstVisit,
        notes: input.notes.trim(),
        createdAt: nowISO,
        updatedAt: nowISO,
      };

      const next = [created, ...appointments];
      persistAppointments(next);
      return created;
    },
    [appointments, isSlotReserved, persistAppointments, simulateNetworkError]
  );

  const updateAppointmentStatus = useCallback(
    async (
      id: string,
      status: AppointmentStatus,
      cancellationReason?: string
    ): Promise<Appointment> => {
      await delay(220);

      if (simulateNetworkError) {
        throw new Error(
          "Unable to update patient status due to a temporary connection issue. Retry when ready."
        );
      }

      let updatedItem: Appointment | undefined;
      const nowISO = new Date().toISOString();
      const next = appointments.map((apt) => {
        if (apt.id !== id) return apt;
        updatedItem = {
          ...apt,
          status,
          cancellationReason:
            status === "Cancelled"
              ? cancellationReason?.trim() || "Cancelled by request."
              : undefined,
          updatedAt: nowISO,
        };
        return updatedItem;
      });

      if (!updatedItem) {
        throw new Error("Appointment record could not be located.");
      }

      persistAppointments(next);
      return updatedItem;
    },
    [appointments, persistAppointments, simulateNetworkError]
  );

  const rescheduleAppointment = useCallback(
    async (
      id: string,
      dateISO: string,
      timeSlot: string,
      clinicianId?: string
    ): Promise<Appointment> => {
      await delay(260);

      if (simulateNetworkError) {
        throw new Error(
          "Reschedule request failed because the connection timed out. Please try again."
        );
      }

      const target = appointments.find((a) => a.id === id);
      if (!target) {
        throw new Error("Appointment record could not be located.");
      }

      const nextClinicianId = clinicianId ?? target.clinicianId;
      if (isSlotReserved(nextClinicianId, dateISO, timeSlot, id)) {
        throw new Error(
          "The selected suite slot is already occupied. Choose another time."
        );
      }

      const nowISO = new Date().toISOString();
      let updatedItem: Appointment | undefined;
      const next = appointments.map((apt) => {
        if (apt.id !== id) return apt;
        updatedItem = {
          ...apt,
          clinicianId: nextClinicianId,
          dateISO,
          timeSlot,
          status: apt.status === "Cancelled" ? "Confirmed" : apt.status,
          cancellationReason: undefined,
          updatedAt: nowISO,
        };
        return updatedItem;
      });

      if (!updatedItem) {
        throw new Error("Appointment update failed.");
      }

      persistAppointments(next);
      return updatedItem;
    },
    [appointments, isSlotReserved, persistAppointments, simulateNetworkError]
  );

  const resetDemoData = useCallback(() => {
    const fresh = createSeedAppointments(new Date());
    setSimulateNetworkError(false);
    persistAppointments(fresh);
  }, [persistAppointments]);

  const findByReference = useCallback(
    (referenceCode: string) => {
      const normalized = referenceCode.trim().toUpperCase();
      return appointments.find(
        (a) => a.referenceCode.toUpperCase() === normalized
      );
    },
    [appointments]
  );

  const value = useMemo<ClinicStoreContextValue>(
    () => ({
      appointments,
      treatments: TREATMENTS,
      clinicians: CLINICIANS,
      isHydrated,
      todayISO,
      simulateNetworkError,
      setSimulateNetworkError,
      isSlotReserved,
      createAppointment,
      updateAppointmentStatus,
      rescheduleAppointment,
      resetDemoData,
      findByReference,
    }),
    [
      appointments,
      createAppointment,
      findByReference,
      isHydrated,
      isSlotReserved,
      rescheduleAppointment,
      resetDemoData,
      simulateNetworkError,
      todayISO,
      updateAppointmentStatus,
    ]
  );

  return (
    <ClinicStoreContext.Provider value={value}>
      {children}
    </ClinicStoreContext.Provider>
  );
}

export function useClinicStore(): ClinicStoreContextValue {
  const ctx = useContext(ClinicStoreContext);
  if (!ctx) {
    throw new Error("useClinicStore must be used inside ClinicStoreProvider.");
  }
  return ctx;
}
