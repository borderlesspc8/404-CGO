"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockProfessionals, mockPatients } from "@/lib/mock-data"

interface NewAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: Date
  selectedTime?: string
  selectedProfessionalId?: string
}

export function NewAppointmentDialog({
  open,
  onOpenChange,
  selectedDate,
  selectedTime,
  selectedProfessionalId,
}: NewAppointmentDialogProps) {
  const [patientId, setPatientId] = useState("")
  const [professionalId, setProfessionalId] = useState(selectedProfessionalId || "")
  const [date, setDate] = useState(selectedDate?.toISOString().split("T")[0] || "")
  const [startTime, setStartTime] = useState(selectedTime || "")
  const [endTime, setEndTime] = useState("")
  const [type, setType] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle appointment creation
    console.log({
      patientId,
      professionalId,
      date,
      startTime,
      endTime,
      type,
      notes,
    })
    onOpenChange(false)
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
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger id="patient" className="border-[#50348F]/30">
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} {patient.lastName} ({patient.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="submit" className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold">
              Criar Agendamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
