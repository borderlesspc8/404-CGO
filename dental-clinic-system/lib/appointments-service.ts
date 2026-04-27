/**
 * Serviço de consultas (appointments) - Firestore
 */

import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore"
import { getDb } from "@/lib/firebase"

export interface Appointment {
  id: string
  patientId: string
  professionalId: string
  date: string
  startTime: string
  endTime: string
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "noshow"
  type: string
  notes?: string
  financialStatus?: "pending" | "paid" | "approved"
  createdBy: string
  createdAt: string
}

const COL = "appointments"

function fromFirestore(docData: DocumentData, id: string): Appointment {
  const data = docData as Record<string, unknown>
  const createdAt = data.createdAt
  return {
    id,
    patientId: String(data.patientId ?? ""),
    professionalId: String(data.professionalId ?? ""),
    date: String(data.date ?? ""),
    startTime: String(data.startTime ?? ""),
    endTime: String(data.endTime ?? ""),
    status: (data.status as Appointment["status"]) ?? "scheduled",
    type: String(data.type ?? ""),
    notes: data.notes ? String(data.notes) : undefined,
    financialStatus: data.financialStatus as Appointment["financialStatus"] | undefined,
    createdBy: String(data.createdBy ?? ""),
    createdAt:
      createdAt && typeof (createdAt as { toDate?: () => Date }).toDate === "function"
        ? (createdAt as { toDate: () => Date }).toDate().toISOString()
        : typeof createdAt === "string"
          ? createdAt
          : new Date().toISOString(),
  }
}

export async function getAppointments(): Promise<Appointment[]> {
  const db = getDb()
  if (!db) return []
  const snap = await getDocs(query(collection(db, COL), orderBy("date")))
  return snap.docs.map((d) => fromFirestore(d.data(), d.id))
}

export async function getAppointmentsByDateRange(
  startDate: string,
  endDate: string,
): Promise<Appointment[]> {
  const db = getDb()
  if (!db) return []
  const snap = await getDocs(
    query(
      collection(db, COL),
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date"),
    ),
  )
  return snap.docs.map((d) => fromFirestore(d.data(), d.id))
}

export interface CreateAppointmentInput {
  patientId: string
  professionalId: string
  date: string
  startTime: string
  endTime: string
  type: string
  notes?: string
  status?: Appointment["status"]
  createdBy: string
}

export async function createAppointment(input: CreateAppointmentInput): Promise<string> {
  const db = getDb()
  if (!db) throw new Error("Firebase não inicializado")
  const docRef = await addDoc(collection(db, COL), {
    ...input,
    status: input.status ?? "scheduled",
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateAppointment(
  id: string,
  data: Partial<Omit<Appointment, "id" | "createdAt" | "createdBy">>,
): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firebase não inicializado")
  await updateDoc(doc(db, COL, id), data)
}

export async function deleteAppointment(id: string): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firebase não inicializado")
  await deleteDoc(doc(db, COL, id))
}

export function subscribeToAppointmentsByDateRange(
  startDate: string,
  endDate: string,
  onData: (appointments: Appointment[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const db = getDb()
  if (!db) {
    onData([])
    return () => {}
  }
  return onSnapshot(
    query(
      collection(db, COL),
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date"),
    ),
    (snap) => onData(snap.docs.map((d) => fromFirestore(d.data(), d.id))),
    (err) => onError?.(err),
  )
}

export function checkConflict(
  appointments: Appointment[],
  professionalId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeId?: string,
): Appointment | null {
  return (
    appointments.find((apt) => {
      if (apt.id === excludeId) return false
      if (apt.professionalId !== professionalId) return false
      if (apt.date !== date) return false
      if (apt.status === "cancelled" || apt.status === "noshow") return false
      return startTime < apt.endTime && endTime > apt.startTime
    }) ?? null
  )
}
