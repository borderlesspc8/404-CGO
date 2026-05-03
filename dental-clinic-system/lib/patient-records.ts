"use client"

/**
 * Armazenamento localStorage para dados clínicos por paciente:
 * procedimentos, pagamentos e anamnese.
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Procedure {
  id: string
  name: string
  professional: string
  date: string
  value: number
  status: "scheduled" | "in_progress" | "completed"
}

export interface Payment {
  id: string
  date: string
  desc: string
  method: string
  value: number
  status: "paid" | "pending"
}

export interface AnamneseAnswer {
  question: string
  answer: string
}

export interface AnamneseGroup {
  group: string
  items: AnamneseAnswer[]
}

export interface PatientRecords {
  procedures: Procedure[]
  payments: Payment[]
  anamnese: AnamneseGroup[]
  updatedAt: string
}

// ─── Anamnese padrão ─────────────────────────────────────────────────────────

const DEFAULT_ANAMNESE: AnamneseGroup[] = [
  {
    group: "Condições de Saúde",
    items: [
      { question: "É diabético(a)?", answer: "" },
      { question: "Tem hipertensão?", answer: "" },
      { question: "Tem problemas cardíacos?", answer: "" },
      { question: "Tem alergia a algum medicamento?", answer: "" },
      { question: "Está grávida ou amamentando?", answer: "" },
      { question: "Faz uso contínuo de algum medicamento?", answer: "" },
    ],
  },
  {
    group: "Saúde Bucal",
    items: [
      { question: "Tem sensibilidade dental?", answer: "" },
      { question: "Range os dentes (bruxismo)?", answer: "" },
      { question: "Tem sangramento nas gengivas?", answer: "" },
      { question: "Já realizou tratamento ortodôntico?", answer: "" },
      { question: "Tem medo de dentista?", answer: "" },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function key(patientId: string) {
  return `cgo.patient_records.${patientId}`
}

export function getPatientRecords(patientId: string): PatientRecords {
  if (typeof window === "undefined") return empty()
  try {
    const raw = window.localStorage.getItem(key(patientId))
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as PatientRecords
    return {
      procedures: parsed.procedures ?? [],
      payments: parsed.payments ?? [],
      anamnese: parsed.anamnese?.length ? parsed.anamnese : DEFAULT_ANAMNESE,
      updatedAt: parsed.updatedAt ?? "",
    }
  } catch {
    return empty()
  }
}

export function savePatientRecords(patientId: string, records: PatientRecords) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(
    key(patientId),
    JSON.stringify({ ...records, updatedAt: new Date().toISOString() }),
  )
}

function empty(): PatientRecords {
  return { procedures: [], payments: [], anamnese: DEFAULT_ANAMNESE, updatedAt: "" }
}

// ─── Utilitários ─────────────────────────────────────────────────────────────

export function calcTotals(procedures: Procedure[], payments: Payment[]) {
  const totalValue = procedures.reduce((s, p) => s + p.value, 0)
  const paidValue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.value, 0)
  return { totalValue, paidValue, remaining: totalValue - paidValue }
}

export function fmtBRL(value: number) {
  return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
}
