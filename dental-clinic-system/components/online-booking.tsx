"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  XCircle,
  Bell,
  MessageSquare,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface OnlineBookingProps {
  professionals: Array<{ id: string; name: string; specialty: string }>
  onBookingComplete: (booking: OnlineBookingData) => void | Promise<void>
}

export interface OnlineBookingData {
  id: string
  date: Date
  time: string
  professionalId: string
  patient: {
    name: string
    email: string
    phone: string
    service: string
    notes: string
    notifyEmail: boolean
    notifySms: boolean
  }
  status: "pending"
  createdAt: Date
}

const availableSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
]

export function OnlineBooking({ professionals, onBookingComplete }: OnlineBookingProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedProfessional, setSelectedProfessional] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    notes: "",
    notifyEmail: true,
    notifySms: false,
  })

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedProfessional || !patientData.name || !patientData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    const booking: OnlineBookingData = {
      id: `booking-${Date.now()}`,
      date: selectedDate,
      time: selectedTime,
      professionalId: selectedProfessional,
      patient: patientData,
      status: "pending",
      createdAt: new Date(),
    }

    setSaving(true)
    await onBookingComplete(booking)
    setSaving(false)
    
    toast({
      title: "Agendamento realizado!",
      description: `Consulta marcada para ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })} às ${selectedTime}`,
    })

    // Reset form
    setStep(1)
    setSelectedDate(undefined)
    setSelectedTime("")
    setSelectedProfessional("")
    setPatientData({
      name: "",
      email: "",
      phone: "",
      service: "",
      notes: "",
      notifyEmail: true,
      notifySms: false,
    })
  }

  const isDateAvailable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today && date.getDay() !== 0 // Não domingo
  }

  return (
    <div className="space-y-6">
      {/* Indicador de Passos */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= num
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > num ? <CheckCircle className="h-5 w-5" /> : num}
            </div>
            {num < 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step > num ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Passo 1: Selecionar Data e Hora */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Selecione a Data e Horário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => !isDateAvailable(date)}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horários Disponíveis
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? "default" : "outline"}
                      onClick={() => setSelectedTime(slot)}
                      disabled={!selectedDate}
                      className="w-full"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedDate || !selectedTime}
              >
                Próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Passo 2: Selecionar Profissional */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Selecione o Profissional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {professionals.map((prof) => (
                <Card
                  key={prof.id}
                  className={`cursor-pointer transition-all ${
                    selectedProfessional === prof.id
                      ? "border-primary border-2"
                      : "hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedProfessional(prof.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{prof.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {prof.specialty}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedProfessional}
              >
                Próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Passo 3: Dados do Paciente */}
      {step === 3 && (  
        <Card>
          <CardHeader>
            <CardTitle>Dados do Paciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={patientData.name}
                  onChange={(e) =>
                    setPatientData({ ...patientData, name: e.target.value })
                  }
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={patientData.phone}
                  onChange={(e) =>
                    setPatientData({ ...patientData, phone: e.target.value })
                  }
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={patientData.email}
                  onChange={(e) =>
                    setPatientData({ ...patientData, email: e.target.value })
                  }
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Tipo de Serviço</Label>
                <Select
                  value={patientData.service}
                  onValueChange={(value) =>
                    setPatientData({ ...patientData, service: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulta">Consulta</SelectItem>
                    <SelectItem value="limpeza">Limpeza</SelectItem>
                    <SelectItem value="clareamento">Clareamento</SelectItem>
                    <SelectItem value="implante">Implante</SelectItem>
                    <SelectItem value="ortodontia">Ortodontia</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={patientData.notes}
                onChange={(e) =>
                  setPatientData({ ...patientData, notes: e.target.value })
                }
                placeholder="Alguma informação adicional..."
                rows={3}
              />
            </div>

            <div className="space-y-3 border-t pt-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Confirmações e Lembretes
              </h4>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notifyEmail"
                  checked={patientData.notifyEmail}
                  onChange={(e) =>
                    setPatientData({
                      ...patientData,
                      notifyEmail: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="notifyEmail" className="cursor-pointer flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Receber confirmação por e-mail
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notifySms"
                  checked={patientData.notifySms}
                  onChange={(e) =>
                    setPatientData({
                      ...patientData,
                      notifySms: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="notifySms" className="cursor-pointer flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Receber lembrete por SMS (1 dia antes)
                </Label>
              </div>
            </div>

            {/* Resumo */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold">Resumo do Agendamento</h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Data:</strong>{" "}
                  {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                </p>
                <p>
                  <strong>Horário:</strong> {selectedTime}
                </p>
                <p>
                  <strong>Profissional:</strong>{" "}
                  {professionals.find((p) => p.id === selectedProfessional)?.name}
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Voltar
              </Button>
              <Button onClick={handleSubmit} disabled={saving} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                {saving ? "Confirmando..." : "Confirmar Agendamento"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
