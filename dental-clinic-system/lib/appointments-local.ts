"use client"

/**
 * Armazenamento local de agendamentos (fallback quando Firebase não está configurado).
 * Interface idêntica ao appointments-service.ts para substituição transparente.
 */

import type { Appointment, CreateAppointmentInput } from "./appointments-service"
import { mockAppointments } from "./mock-data"

const STORAGE_KEY = "cgo.appointments"

function load(): Appointment[] {
  if (typeof window === "undefined") return mockAppointments
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAppointments))
      return [...mockAppointments]
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return [...mockAppointments]
    return parsed as Appointment[]
  } catch {
    return [...mockAppointments]
  }
}

function save(appointments: Appointment[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
}

export function localGetAppointments(): Appointment[] {
  return load()
}

export function localGetAppointmentsByDateRange(start: string, end: string): Appointment[] {
  return load().filter((a) => a.date >= start && a.date <= end)
}

export function localCreateAppointment(input: CreateAppointmentInput): string {
  const all = load()
  const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  const appointment: Appointment = {
    ...input,
    id,
    status: input.status ?? "scheduled",
    createdAt: new Date().toISOString(),
  }
  save([appointment, ...all])
  return id
}

export function localUpdateAppointment(
  id: string,
  data: Partial<Omit<Appointment, "id" | "createdAt" | "createdBy">>,
): void {
  const all = load()
  const idx = all.findIndex((a) => a.id === id)
  if (idx === -1) return
  all[idx] = { ...all[idx], ...data }
  save(all)
}

export function localDeleteAppointment(id: string): void {
  save(load().filter((a) => a.id !== id))
}

export function localSubscribeToAppointmentsByDateRange(
  start: string,
  end: string,
  onData: (appointments: Appointment[]) => void,
): () => void {
  onData(localGetAppointmentsByDateRange(start, end))
  return () => {}
}
