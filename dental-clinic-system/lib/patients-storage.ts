"use client"

import { mockPatients, type Patient } from "@/lib/mock-data"

export type PatientFormInput = {
  name: string
  lastName: string
  cpf: string
  rg: string
  birthDate: string
  gender: string
  civilStatus: string
  howKnew: string
  phone: string
  email: string
  address: Patient["address"]
  avatar?: string
  notes?: string
}

const STORAGE_KEY = "cgo.patients"

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage
}

function normalizePatients(value: unknown): Patient[] {
  if (!Array.isArray(value)) return []
  return value.filter((patient): patient is Patient => {
    return (
      !!patient &&
      typeof patient === "object" &&
      "id" in patient &&
      "name" in patient &&
      "lastName" in patient
    )
  })
}

export function getStoredPatients(): Patient[] {
  if (!canUseStorage()) return mockPatients

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPatients))
      return mockPatients
    }
    const stored = normalizePatients(JSON.parse(raw))
    const merged = [
      ...stored,
      ...mockPatients.filter((mock) => !stored.some((patient) => patient.id === mock.id)),
    ]
    if (merged.length !== stored.length) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    }
    return merged
  } catch {
    return mockPatients
  }
}

export function saveStoredPatients(patients: Patient[]) {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(patients))
}

export function createStoredPatient(input: PatientFormInput): Patient {
  const patients = getStoredPatients()
  const maxId = patients.reduce((max, patient) => {
    const numericId = Number.parseInt(patient.id, 10)
    return Number.isFinite(numericId) ? Math.max(max, numericId) : max
  }, 5084)

  const patient: Patient = {
    ...input,
    id: String(maxId + 1),
    status: "active",
    registeredAt: new Date().toISOString().slice(0, 10),
  }

  saveStoredPatients([patient, ...patients])
  return patient
}

export function findStoredPatient(id: string): Patient | undefined {
  return getStoredPatients().find((patient) => patient.id === id)
}
