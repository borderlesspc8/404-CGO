"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { CalendarSidebar } from "@/components/calendar-sidebar"
import { NewAppointmentDialog } from "@/components/new-appointment-dialog"
import { OnlineBooking } from "@/components/online-booking"
import { WaitingList } from "@/components/waiting-list"
import { AppSidebar } from "@/components/app-sidebar"
import { mockAppointments, mockPatients, mockProfessionals } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, CalendarIcon, Settings, Plus, Globe, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AppointmentStatusBadge } from "@/components/appointment-status-badge"
import { toast } from "@/components/ui/use-toast"

export default function AgendaPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 17)) // November 17, 2025
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>(mockProfessionals.map((p) => p.id))
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [waitingList, setWaitingList] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("calendar")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const toggleProfessional = (professionalId: string) => {
    setSelectedProfessionals((prev) =>
      prev.includes(professionalId) ? prev.filter((id) => id !== professionalId) : [...prev, professionalId],
    )
  }

  const filteredProfessionals = mockProfessionals.filter((prof) => selectedProfessionals.includes(prof.id))

  // Generate time slots from 10:00 to 15:00
  const timeSlots = []
  for (let hour = 10; hour <= 15; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`)
    if (hour < 15) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:15`)
      timeSlots.push(`${hour.toString().padStart(2, "0")}:30`)
      timeSlots.push(`${hour.toString().padStart(2, "0")}:45`)
    }
  }

  // Get week dates
  const getWeekDates = (date: Date) => {
    const day = date.getDay()
    const diff = date.getDate() - day
    const sunday = new Date(date.setDate(diff))
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday)
      d.setDate(sunday.getDate() + i)
      weekDates.push(d)
    }
    return weekDates
  }

  const weekDates = getWeekDates(new Date(currentDate))

  const dayNames = ["D", "S", "T", "Q", "Q", "S", "S"]
  const fullDayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

  const formatDateForDisplay = (date: Date) => {
    return `${fullDayNames[date.getDay()]}, ${date.getDate()} de ${
      [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ][date.getMonth()]
    } ${date.getFullYear()}`
  }

  const appointment = mockAppointments.find((a) => a.id === selectedAppointment)
  const appointmentPatient = appointment ? mockPatients.find((p) => p.id === appointment.patientId) : null
  const appointmentProfessional = appointment
    ? mockProfessionals.find((p) => p.id === appointment.professionalId)
    : null

  const handleOnlineBookingComplete = (booking: any) => {
    console.log("Nova reserva online:", booking)
    // Aqui você integraria com seu backend
  }

  const handleAddToWaitingList = (entry: any) => {
    setWaitingList((prev) => [...prev, entry]);
    console.log("Novo na lista de espera:", entry)
    // Aqui você integraria com seu backend
  }

  const handleRemoveFromWaitingList = (entryId: string) => {
    setWaitingList((prev) => prev.filter((entry) => entry.id !== entryId));
    console.log("Removido da lista de espera:", entryId);
    // Aqui você integraria com seu backend
  }

  const handleConvertToAppointment = (entry: any) => {
    // Exemplo: converter entrada da lista de espera em agendamento
    // Aqui você pode adicionar lógica para criar um novo agendamento
    handleRemoveFromWaitingList(entry.id);
    console.log("Convertido para agendamento:", entry);
    // Aqui você integraria com seu backend
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <MainHeader />
        <main className="flex-1 bg-gray-50">
          <div className="flex flex-col h-full w-full max-w-full px-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col w-full">
              <div className="bg-white border-b border-gray-200">
                <div className="px-6 py-4">
                  <h1 className="text-2xl font-bold text-[#5b4b8a]">Agenda</h1>
                </div>
                <TabsList className="mx-6 mb-4">
                  <TabsTrigger value="calendar">Calendário</TabsTrigger>
                  <TabsTrigger value="online">Agendamento Online</TabsTrigger>
                  <TabsTrigger value="waiting">Lista de Espera</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="calendar" className="mt-0 p-0">
                {/* Calendar header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h2 className="text-sm font-semibold text-[#5b4b8a]">Correia Andradina</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium text-[#5b4b8a] min-w-[200px] text-center">
                        {formatDateForDisplay(currentDate)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-[#c9b888] hover:bg-[#b8a777] text-[#5b4b8a] font-semibold"
                      onClick={() => setShowNewAppointment(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Agendamento
                    </Button>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <Button
                        variant={viewMode === "day" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("day")}
                        className={viewMode === "day" ? "bg-[#5b4b8a] text-white" : ""}
                      >
                        Dia
                      </Button>
                      <Button
                        variant={viewMode === "week" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("week")}
                        className={viewMode === "week" ? "bg-[#5b4b8a] text-white" : ""}
                      >
                        Semana
                      </Button>
                    </div>
                    <Button variant="outline" size="icon">
                      <CalendarIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Calendar grid */}
                <div className="flex-1 overflow-auto">
                  <div className="min-w-[1200px]">
                    {/* Column headers - professionals */}
                    <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-300 bg-white sticky top-0 z-10">
                      <div className="border-r border-gray-300 p-2">
                        {/* Week navigator */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                          {weekDates.map((date, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <span className="text-gray-500">{dayNames[idx]}</span>
                              <button
                                onClick={() => setCurrentDate(date)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  date.toDateString() === currentDate.toDateString()
                                    ? "bg-[#5b4b8a] text-white font-bold"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                {date.getDate()}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-7">
                        {filteredProfessionals.slice(0, 7).map((professional) => (
                          <div
                            key={professional.id}
                            className="border-r border-gray-300 p-2 text-sm font-semibold"
                            style={{ color: professional.color }}
                          >
                            {professional.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time slots and appointments */}
                    <div className="relative">
                      {timeSlots.map((time) => (
                        <div key={time} className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-200">
                          <div className="border-r border-gray-300 p-2 text-xs text-gray-500 text-right pr-2">{time}</div>
                          {filteredProfessionals.slice(0, 7).map((professional) => {
                            // Find appointments for this professional at this time
                            const appointmentsHere = mockAppointments.filter(
                              (apt) => apt.professionalId === professional.id && apt.startTime === time,
                            )

                            return (
                              <div
                                key={professional.id}
                                className="border-r border-gray-300 min-h-[60px] relative"
                                style={{ backgroundColor: `${professional.color}05` }}
                              >
                                {appointmentsHere.map((apt) => {
                                  const patient = mockPatients.find((p) => p.id === apt.patientId)
                                  const startMinutes =
                                    Number.parseInt(apt.startTime.split(":")[0]) * 60 +
                                    Number.parseInt(apt.startTime.split(":")[1])
                                  const endMinutes =
                                    Number.parseInt(apt.endTime.split(":")[0]) * 60 +
                                    Number.parseInt(apt.endTime.split(":")[1])
                                  const durationSlots = (endMinutes - startMinutes) / 15

                                  return (
                                    <button
                                      key={apt.id}
                                      onClick={() => setSelectedAppointment(apt.id)}
                                      className="absolute left-1 right-1 rounded px-2 py-1 text-xs text-left overflow-hidden hover:ring-2 hover:ring-offset-1"
                                      style={{
                                        backgroundColor: professional.color,
                                        color: "white",
                                        height: `${durationSlots * 60 - 4}px`,
                                        top: "2px",
                                      }}
                                    >
                                      <div className="font-semibold truncate">
                                        {patient ? `${patient.name} ${patient.lastName}` : "Paciente"}
                                      </div>
                                      <div className="text-[10px] opacity-90">
                                        {apt.startTime} - {apt.endTime}
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              {/* Time slots and appointments */}
              <div className="relative">
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-200">
                    <div className="border-r border-gray-300 p-2 text-xs text-gray-500 text-right pr-2">{time}</div>
                    {filteredProfessionals.slice(0, 7).map((professional) => {
                      // Find appointments for this professional at this time
                      const appointmentsHere = mockAppointments.filter(
                        (apt) => apt.professionalId === professional.id && apt.startTime === time,
                      )

                      return (
                        <div
                          key={professional.id}
                          className="border-r border-gray-300 min-h-[60px] relative"
                          style={{ backgroundColor: `${professional.color}05` }}
                        >
                          {appointmentsHere.map((apt) => {
                            const patient = mockPatients.find((p) => p.id === apt.patientId)
                            const startMinutes =
                              Number.parseInt(apt.startTime.split(":")[0]) * 60 +
                              Number.parseInt(apt.startTime.split(":")[1])
                            const endMinutes =
                              Number.parseInt(apt.endTime.split(":")[0]) * 60 +
                              Number.parseInt(apt.endTime.split(":")[1])
                            const durationSlots = (endMinutes - startMinutes) / 15

                            return (
                              <button
                                key={apt.id}
                                onClick={() => setSelectedAppointment(apt.id)}
                                className="absolute left-1 right-1 rounded px-2 py-1 text-xs text-left overflow-hidden hover:ring-2 hover:ring-offset-1"
                                style={{
                                  backgroundColor: professional.color,
                                  color: "white",
                                  height: `${durationSlots * 60 - 4}px`,
                                  top: "2px",
                                }}
                              >
                                <div className="font-semibold truncate">
                                  {patient ? `${patient.name} ${patient.lastName}` : "Paciente"}
                                </div>
                                <div className="text-[10px] opacity-90">
                                  {apt.startTime} - {apt.endTime}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
              </TabsContent>

              {/* Agendamento Online Tab */}
              <TabsContent value="online" className="mt-0 p-6">
                <OnlineBooking
                  professionals={mockProfessionals}
                  onBookingComplete={handleOnlineBookingComplete}
                />
              </TabsContent>

              {/* Fila de Espera Tab */}
              <TabsContent value="waiting" className="mt-0 p-6">
                <WaitingList
                  entries={waitingList}
                  onAddEntry={handleAddToWaitingList}
                  onRemoveEntry={handleRemoveFromWaitingList}
                  onConvertToAppointment={handleConvertToAppointment}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#5b4b8a]">Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {appointment && appointmentPatient && appointmentProfessional && (
            <div className="space-y-4">
              <div className="bg-[#5b4b8a]/10 rounded-lg p-4">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="font-semibold">Status:</span>
                  <AppointmentStatusBadge status={appointment.status} />
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Agendado em:</span>{" "}
                  {new Date(appointment.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold text-[#5b4b8a]">Profissional:</span> {appointmentProfessional.name}
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-[#5b4b8a]">Prontuário:</span>{" "}
                  {appointmentPatient.name.toUpperCase()} {appointmentPatient.lastName.toUpperCase()} (
                  {appointmentPatient.id})
                </p>
                <p className="text-sm flex items-center gap-2">
                  <span className="font-semibold text-[#5b4b8a]">Telefone:</span> {appointmentPatient.phone}
                  <span className="text-green-600">✓</span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-[#5b4b8a]">Horário:</span> {appointment.startTime} -{" "}
                  {appointment.endTime}
                  <Button variant="ghost" size="sm" className="ml-2">
                    ✏️
                  </Button>
                  <Button variant="ghost" size="sm">
                    🕐
                  </Button>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-[#5b4b8a]">Check-in:</span> Confirmado pela secretária
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-[#5b4b8a]">Procedimentos:</span> {appointment.type}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#5b4b8a] mb-2">Marcadores</p>
                <div className="text-sm text-gray-600">Selecionar marcadores...</div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#5b4b8a] mb-2">Obs:</p>
                <p className="text-sm bg-gray-50 p-3 rounded">{appointment.notes || "Sem observações"}</p>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" className="bg-transparent border-[#5b4b8a] text-[#5b4b8a]">
                  💰 Financeiro OK
                </Button>
                <Button variant="outline" className="bg-green-600 text-white border-none hover:bg-green-700">
                  Compromisso
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Appointment Dialog */}
      <NewAppointmentDialog open={showNewAppointment} onOpenChange={setShowNewAppointment} selectedDate={currentDate} />

      <MainFooter />
    </div>
  )
}
