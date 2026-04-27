"use client"

import { useState, useEffect } from "react"
import {
  subscribeToAppointmentsByDateRange,
  getAppointments,
  type Appointment,
} from "@/lib/appointments-service"

export function useAppointments(startDate?: string, endDate?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    if (!startDate || !endDate) {
      getAppointments()
        .then((data) => { setAppointments(data); setLoading(false) })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Erro ao carregar consultas")
          setLoading(false)
        })
      return
    }

    const unsubscribe = subscribeToAppointmentsByDateRange(
      startDate,
      endDate,
      (data) => { setAppointments(data); setLoading(false) },
      (err) => { setError(err.message); setLoading(false) },
    )

    return unsubscribe
  }, [startDate, endDate])

  return { appointments, loading, error, refetch: () => {} }
}
