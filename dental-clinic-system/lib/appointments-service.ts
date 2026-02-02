/**
 * Serviço de consultas (appointments) - Firestore
 */

import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
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

const APPOINTMENTS_COLLECTION = "appointments"

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

  const snap = await getDocs(
    query(collection(db, APPOINTMENTS_COLLECTION), orderBy("date")),
  )

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
      collection(db, APPOINTMENTS_COLLECTION),
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

  const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
    ...input,
    status: input.status ?? "scheduled",
    createdAt: serverTimestamp(),
  })

  return docRef.id
}
