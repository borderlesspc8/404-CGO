"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getAppointments,
  getAppointmentsByDateRange,
  type Appointment,
} from "@/lib/appointments-service"

export function useAppointments(startDate?: string, endDate?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let data: Appointment[]
      if (startDate && endDate) {
        data = await getAppointmentsByDateRange(startDate, endDate)
      } else {
        data = await getAppointments()
      }
      setAppointments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar consultas")
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  return { appointments, loading, error, refetch: fetchAppointments }
}
