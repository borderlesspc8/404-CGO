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
import { createAppointment, updateAppointment, checkConflict, type Appointment } from "@/lib/appointments-service"
import { toast } from "@/components/ui/use-toast"

interface NewAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: Date
  selectedTime?: string
  selectedProfessionalId?: string
  defaultPatientId?: string
  appointmentToEdit?: Appointment
  appointments?: Appointment[]
  onAppointmentCreated?: () => void
}

const PROCEDURES = [
  "Avaliação",
  "Consulta",
  "Limpeza",
  "Extração",
  "Restauração",
  "Canal",
  "Implante",
  "Ortodontia",
  "Clareamento",
  "Prótese",
  "Cirurgia",
  "Outro",
]

export function NewAppointmentDialog({
  open,
  onOpenChange,
  selectedDate,
  selectedTime,
  selectedProfessionalId,
  defaultPatientId,
  appointmentToEdit,
  appointments = [],
  onAppointmentCreated,
}: NewAppointmentDialogProps) {
  const { user } = useAuth()
  const isEditMode = !!appointmentToEdit

  const [patientId, setPatientId] = useState("")
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [isNewPatient, setIsNewPatient] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredPatients, setFilteredPatients] = useState(mockPatients)
  const [professionalId, setProfessionalId] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [type, setType] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  const toDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

  useEffect(() => {
    if (!open) return

    if (isEditMode && appointmentToEdit) {
      const patient = mockPatients.find((p) => p.id === appointmentToEdit.patientId)
      setPatientId(appointmentToEdit.patientId)
      setPatientName(patient ? `${patient.name} ${patient.lastName}` : appointmentToEdit.patientId)
      setPatientEmail(patient?.email ?? "")
      setPatientPhone(patient?.phone ?? "")
      setIsNewPatient(false)
      setProfessionalId(appointmentToEdit.professionalId)
      setDate(appointmentToEdit.date)
      setStartTime(appointmentToEdit.startTime)
      setEndTime(appointmentToEdit.endTime)
      setType(appointmentToEdit.type)
      setNotes(appointmentToEdit.notes ?? "")
    } else {
      const defaultPatient = defaultPatientId
        ? mockPatients.find((p) => p.id === defaultPatientId)
        : undefined
      setPatientId(defaultPatient?.id ?? "")
      setPatientName(defaultPatient ? `${defaultPatient.name} ${defaultPatient.lastName}` : "")
      setPatientEmail(defaultPatient?.email ?? "")
      setPatientPhone(defaultPatient?.phone ?? "")
      setIsNewPatient(false)
      setProfessionalId(selectedProfessionalId ?? "")
      setDate(selectedDate ? toDateStr(selectedDate) : "")
      setStartTime(selectedTime ?? "")
      setEndTime("")
      setType("")
      setNotes("")
    }
    setShowSuggestions(false)
    setFilteredPatients(mockPatients)
  }, [open, isEditMode, appointmentToEdit, defaultPatientId, selectedDate, selectedProfessionalId, selectedTime])

  const handlePatientNameChange = (value: string) => {
    setPatientName(value)
    setPatientId("")
    setShowSuggestions(true)
    if (value.trim() === "") {
      setFilteredPatients(mockPatients)
      setIsNewPatient(false)
    } else {
      const matches = mockPatients.filter((p) =>
        `${p.name} ${p.lastName}`.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredPatients(matches)
      setIsNewPatient(matches.length === 0)
    }
  }

  const handleSelectPatient = (patient: (typeof mockPatients)[0]) => {
    setPatientId(patient.id)
    setPatientName(`${patient.name} ${patient.lastName}`)
    setPatientEmail(patient.email ?? "")
    setPatientPhone(patient.phone ?? "")
    setIsNewPatient(false)
    setShowSuggestions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!patientName.trim() || !professionalId || !date || !startTime || !endTime || !type) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" })
      return
    }

    if (startTime >= endTime) {
      toast({ title: "Erro", description: "O horário de fim deve ser após o horário de início.", variant: "destructive" })
      return
    }

    // Conflict detection
    if (appointments.length > 0) {
      const conflict = checkConflict(
        appointments,
        professionalId,
        date,
        startTime,
        endTime,
        appointmentToEdit?.id,
      )
      if (conflict) {
        const conflictPatient = mockPatients.find((p) => p.id === conflict.patientId)
        const profName = mockProfessionals.find((p) => p.id === professionalId)?.name ?? "Profissional"
        toast({
          title: "Conflito de horário",
          description: `${profName} já tem agendamento de ${conflict.startTime}–${conflict.endTime} com ${
            conflictPatient ? `${conflictPatient.name} ${conflictPatient.lastName}` : "outro paciente"
          }.`,
          variant: "destructive",
        })
        return
      }
    }

    const finalPatientId = patientId || `new_${Date.now()}`
    setSaving(true)

    try {
      if (isEditMode && appointmentToEdit) {
        await updateAppointment(appointmentToEdit.id, {
          patientId: finalPatientId,
          professionalId,
          date,
          startTime,
          endTime,
          type,
          notes: notes || undefined,
        })
        toast({ title: "Sucesso", description: "Agendamento atualizado com sucesso!" })
      } else {
        await createAppointment({
          patientId: finalPatientId,
          professionalId,
          date,
          startTime,
          endTime,
          type,
          notes: notes || undefined,
          createdBy: user?.name ?? "Usuário",
        })
        toast({ title: "Sucesso", description: "Agendamento criado com sucesso!" })
      }
      onOpenChange(false)
      onAppointmentCreated?.()
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Falha ao salvar agendamento.",
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
          <DialogTitle className="text-[#50348F] text-xl">
            {isEditMode ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Patient field */}
            <div className="space-y-2">
              <Label htmlFor="patient" className="text-[#50348F] font-semibold">
                Paciente <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="patient"
                  type="text"
                  value={patientName}
                  onChange={(e) => handlePatientNameChange(e.target.value)}
                  onFocus={() => patientName && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Digite o nome do paciente"
                  className="border-[#50348F]/30"
                  autoComplete="off"
                />
                {showSuggestions && patientName && filteredPatients.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 border border-[#50348F]/30 rounded-md max-h-48 overflow-y-auto bg-white z-50 shadow-lg">
                    {filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onMouseDown={() => handleSelectPatient(patient)}
                        className="w-full text-left px-3 py-2 hover:bg-[#50348F]/5 border-b border-[#50348F]/10 last:border-b-0"
                      >
                        <div className="font-medium text-sm">
                          {patient.name} {patient.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{patient.email}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {isNewPatient && (
                <div className="rounded-md bg-blue-50 p-2 space-y-2">
                  <p className="text-xs text-blue-700 font-medium">Novo paciente</p>
                  <Input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="Email (opcional)"
                    className="border-[#50348F]/30 text-xs h-8"
                  />
                  <Input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="Telefone (opcional)"
                    className="border-[#50348F]/30 text-xs h-8"
                  />
                </div>
              )}
              {patientId && !isNewPatient && (
                <p className="text-xs text-green-600">✓ Paciente selecionado (ID: {patientId})</p>
              )}
            </div>

            {/* Professional field */}
            <div className="space-y-2">
              <Label htmlFor="professional" className="text-[#50348F] font-semibold">
                Profissional <span className="text-red-500">*</span>
              </Label>
              <Select value={professionalId} onValueChange={setProfessionalId}>
                <SelectTrigger id="professional" className="border-[#50348F]/30">
                  <SelectValue placeholder="Selecione o profissional" />
                </SelectTrigger>
                <SelectContent>
                  {mockProfessionals.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: prof.color }}
                        />
                        {prof.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and times */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-[#50348F] font-semibold">
                Data <span className="text-red-500">*</span>
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
                Início <span className="text-red-500">*</span>
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
                Fim <span className="text-red-500">*</span>
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

          {/* Procedure type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-[#50348F] font-semibold">
              Procedimento <span className="text-red-500">*</span>
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type" className="border-[#50348F]/30">
                <SelectValue placeholder="Selecione o procedimento" />
              </SelectTrigger>
              <SelectContent>
                {PROCEDURES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {type === "Outro" && (
              <Input
                value={type === "Outro" ? "" : type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Descreva o procedimento"
                className="border-[#50348F]/30 mt-2"
              />
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#50348F] font-semibold">
              Observações
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre o agendamento"
              className="border-[#50348F]/30 min-h-20"
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
              {saving ? "Salvando..." : isEditMode ? "Salvar Alterações" : "Criar Agendamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
