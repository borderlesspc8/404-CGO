"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockProfessionals, mockPatients } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { createAppointment } from "@/lib/appointments-service"
import { toast } from "@/components/ui/use-toast"

interface NewAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: Date
  selectedTime?: string
  selectedProfessionalId?: string
  onAppointmentCreated?: () => void
}

export function NewAppointmentDialog({
  open,
  onOpenChange,
  selectedDate,
  selectedTime,
  selectedProfessionalId,
  onAppointmentCreated,
}: NewAppointmentDialogProps) {
  const { user } = useAuth()
  const [patientId, setPatientId] = useState("")
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [isNewPatient, setIsNewPatient] = useState(false)
  const [filteredPatients, setFilteredPatients] = useState(mockPatients)
  const [professionalId, setProfessionalId] = useState(selectedProfessionalId || "")
  const toDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  const [date, setDate] = useState(selectedDate ? toDateStr(selectedDate) : "")
  const [startTime, setStartTime] = useState(selectedTime || "")
  const [endTime, setEndTime] = useState("")
  const [type, setType] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      if (selectedDate) setDate(toDateStr(selectedDate))
      if (selectedProfessionalId) setProfessionalId(selectedProfessionalId)
      if (selectedTime) setStartTime(selectedTime)
    }
  }, [open, selectedDate, selectedProfessionalId, selectedTime])

  const handlePatientNameChange = (value: string) => {
    setPatientName(value)
    setPatientId("")
    
    if (value.trim() === "") {
      setFilteredPatients(mockPatients)
      setIsNewPatient(false)
    } else {
      const matches = mockPatients.filter(
        (p) => `${p.name} ${p.lastName}`.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredPatients(matches)
      setIsNewPatient(matches.length === 0)
    }
  }

  const handleSelectPatient = (patient: typeof mockPatients[0]) => {
    setPatientId(patient.id)
    setPatientName(`${patient.name} ${patient.lastName}`)
    setPatientEmail(patient.email || "")
    setPatientPhone(patient.phone || "")
    setIsNewPatient(false)
    setFilteredPatients(mockPatients)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!patientName.trim() || !professionalId || !date || !startTime || !endTime || !type) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" })
      return
    }

    // If new patient, we'll use the name and email as the patient ID temp
    const finalPatientId = patientId || `new_${Date.now()}`

    setSaving(true)
    try {
      await createAppointment({
        patientId: finalPatientId,
        professionalId,
        date,
        startTime,
        endTime,
        type,
        notes: notes || undefined,
        createdBy: user?.name || "Usuário",
      })
      toast({ title: "Sucesso", description: "Agendamento criado com sucesso!" })
      onOpenChange(false)
      setPatientId("")
      setPatientName("")
      setPatientEmail("")
      setPatientPhone("")
      setIsNewPatient(false)
      setProfessionalId(selectedProfessionalId || "")
      setDate(selectedDate ? toDateStr(selectedDate) : "")
      setStartTime(selectedTime || "")
      setEndTime("")
      setType("")
      setNotes("")
      onAppointmentCreated?.()
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Falha ao criar agendamento.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#50348F] text-xl">Novo Agendamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient" className="text-[#50348F] font-semibold">
                Paciente
              </Label>
              <Input
                id="patient"
                type="text"
                value={patientName}
                onChange={(e) => handlePatientNameChange(e.target.value)}
                placeholder="Digite o nome do paciente"
                className="border-[#50348F]/30"
                autoComplete="off"
              />
              {patientName && filteredPatients.length > 0 && (
                <div className="border border-[#50348F]/30 rounded-md max-h-48 overflow-y-auto bg-white">
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => handleSelectPatient(patient)}
                      className="w-full text-left px-3 py-2 hover:bg-[#50348F]/5 border-b border-[#50348F]/10 last:border-b-0"
                    >
                      <div className="font-medium text-sm">{patient.name} {patient.lastName}</div>
                      <div className="text-xs text-gray-500">{patient.email}</div>
                    </button>
                  ))}
                </div>
              )}
              {isNewPatient && (
                <div className="rounded-md bg-blue-50 p-2">
                  <p className="text-xs text-blue-700">
                    ✓ Novo paciente será cadastrado com este nome
                  </p>
                  {patientEmail && (
                    <Input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="Email (opcional)"
                      className="border-[#50348F]/30 mt-2 text-xs"
                    />
                  )}
                  {patientPhone && (
                    <Input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="Telefone (opcional)"
                      className="border-[#50348F]/30 mt-2 text-xs"
                    />
                  )}
                  {!patientEmail && (
                    <Input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="Email (opcional)"
                      className="border-[#50348F]/30 mt-2 text-xs"
                    />
                  )}
                  {!patientPhone && (
                    <Input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="Telefone (opcional)"
                      className="border-[#50348F]/30 mt-2 text-xs"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="professional" className="text-[#50348F] font-semibold">
                Profissional
              </Label>
              <Select value={professionalId} onValueChange={setProfessionalId}>
                <SelectTrigger id="professional" className="border-[#50348F]/30">
                  <SelectValue placeholder="Selecione o profissional" />
                </SelectTrigger>
                <SelectContent>
                  {mockProfessionals.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-[#50348F] font-semibold">
                Data
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-[#50348F]/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-[#50348F] font-semibold">
                Horário Início
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border-[#50348F]/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-[#50348F] font-semibold">
                Horário Fim
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border-[#50348F]/30"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-[#50348F] font-semibold">
              Tipo de Procedimento
            </Label>
            <Input
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Ex: Avaliação, Limpeza, Consulta"
              className="border-[#50348F]/30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#50348F] font-semibold">
              Observações
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre o agendamento"
              className="border-[#50348F]/30 min-h-[100px]"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold"
            >
              {saving ? "Salvando..." : "Criar Agendamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
