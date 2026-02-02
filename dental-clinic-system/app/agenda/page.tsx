"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { NewAppointmentDialog } from "@/components/new-appointment-dialog"
import { OnlineBooking } from "@/components/online-booking"
import { WaitingList } from "@/components/waiting-list"
import { AppSidebar } from "@/components/app-sidebar"
import { mockPatients, mockProfessionals, mockSpecialties } from "@/lib/mock-data"
import { useAppointments } from "@/hooks/use-appointments"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, CalendarIcon, Settings, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ptBR } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { AppointmentStatusBadge } from "@/components/appointment-status-badge"
import { toast } from "@/components/ui/use-toast"

export default function AgendaPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 17))
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>(mockProfessionals.map((p) => p.id))
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [waitingList, setWaitingList] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("calendar")
  const [calendarOpen, setCalendarOpen] = useState(false)

  const getWeekDates = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    const sunday = new Date(d)
    sunday.setDate(diff)
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(sunday)
      dayDate.setDate(sunday.getDate() + i)
      weekDates.push(dayDate)
    }
    return weekDates
  }

  const weekDates = getWeekDates(new Date(currentDate))

  const formatDateKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

  const dateRangeStart = formatDateKey(viewMode === "day" ? currentDate : weekDates[0])
  const dateRangeEnd = formatDateKey(viewMode === "day" ? currentDate : weekDates[6])
  const {
    appointments: appointmentsFromFirebase,
    loading: appointmentsLoading,
    error: appointmentsError,
    refetch: refetchAppointments,
  } = useAppointments(dateRangeStart, dateRangeEnd)

  const datesToShow = viewMode === "day" ? [currentDate] : weekDates

  const appointmentMatchesDate = (aptDate: string, d: Date) => aptDate === formatDateKey(d)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  const toggleProfessional = (professionalId: string) => {
    setSelectedProfessionals((prev) =>
      prev.includes(professionalId) ? prev.filter((id) => id !== professionalId) : [...prev, professionalId],
    )
  }

  const filteredProfessionals = mockProfessionals.filter((prof) => selectedProfessionals.includes(prof.id))

  const timeSlots: string[] = []
  for (let hour = 10; hour <= 15; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`)
    if (hour < 15) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:15`)
      timeSlots.push(`${hour.toString().padStart(2, "0")}:30`)
      timeSlots.push(`${hour.toString().padStart(2, "0")}:45`)
    }
  }

  const dayNames = ["D", "S", "T", "Q", "Q", "S", "S"]
  const fullDayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

  const formatDateForDisplay = (date: Date) => {
    return `${fullDayNames[date.getDay()]}, ${date.getDate()} de ${
      ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][date.getMonth()]
    } ${date.getFullYear()}`
  }

  const appointment = appointmentsFromFirebase.find((a) => a.id === selectedAppointment)
  const appointmentPatient = appointment ? mockPatients.find((p) => p.id === appointment.patientId) : null
  const appointmentProfessional = appointment ? mockProfessionals.find((p) => p.id === appointment.professionalId) : null

  const handleOnlineBookingComplete = (booking: any) => {
    console.log("Nova reserva online:", booking)
  }

  const handleAddToWaitingList = (entry: any) => {
    setWaitingList((prev) => [...prev, entry])
  }

  const handleRemoveFromWaitingList = (entryId: string) => {
    setWaitingList((prev) => prev.filter((entry) => entry.id !== entryId))
  }

  const handleConvertToAppointment = (entry: any) => {
    handleRemoveFromWaitingList(entry.id)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MainHeader />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="flex flex-col h-full w-full max-w-full px-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col w-full">
              <div className="bg-white border-b border-gray-200">
                <div className="px-6 py-4">
                  <h1 className="text-2xl font-bold text-[#50348F]">Agenda</h1>
                </div>
                <TabsList className="mx-6 mb-4">
                  <TabsTrigger value="calendar">Calendário</TabsTrigger>
                  <TabsTrigger value="online">Agendamento Online</TabsTrigger>
                  <TabsTrigger value="waiting">Lista de Espera</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="calendar" className="mt-0 p-0">
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h2 className="text-sm font-semibold text-[#50348F]">Correia Andradina</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentDate((prev) => {
                            const d = new Date(prev)
                            d.setDate(d.getDate() - (viewMode === "day" ? 1 : 7))
                            return d
                          })
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium text-[#50348F] min-w-[200px] text-center">
                        {viewMode === "day"
                          ? formatDateForDisplay(currentDate)
                          : `${formatDateForDisplay(weekDates[0])} — ${formatDateForDisplay(weekDates[6])}`}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentDate((prev) => {
                            const d = new Date(prev)
                            d.setDate(d.getDate() + (viewMode === "day" ? 1 : 7))
                            return d
                          })
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold"
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
                        className={viewMode === "day" ? "bg-[#50348F] text-white" : ""}
                      >
                        Dia
                      </Button>
                      <Button
                        variant={viewMode === "week" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("week")}
                        className={viewMode === "week" ? "bg-[#50348F] text-white" : ""}
                      >
                        Semana
                      </Button>
                    </div>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Ir para data">
                          <CalendarIcon className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={currentDate}
                          onSelect={(date) => {
                            if (date) {
                              setCurrentDate(date)
                              setCalendarOpen(false)
                            }
                          }}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Configurações"
                      onClick={() => toast({ title: "Configurações", description: "Configurações do calendário em breve." })}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto relative">
                  {appointmentsError && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm z-20">
                      {appointmentsError}
                    </div>
                  )}
                  {appointmentsLoading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                      <div className="text-[#50348F] font-medium">Carregando consultas...</div>
                    </div>
                  )}
                  <div className={viewMode === "day" ? "min-w-[1100px]" : "min-w-[1340px]"}>
                    <div
                      className={`grid border-b border-gray-300 bg-white sticky top-0 z-10 ${
                        viewMode === "day"
                          ? "grid-cols-[80px_repeat(7,minmax(140px,1fr))]"
                          : "grid-cols-[minmax(360px,380px)_repeat(7,minmax(140px,1fr))]"
                      }`}
                    >
                      <div className="border-r border-gray-300 p-3 flex flex-col gap-1 min-w-0">
                        {viewMode === "day" ? (
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="text-gray-500 font-medium text-xs">{dayNames[currentDate.getDay()]}</span>
                            <span className="text-lg font-bold text-[#50348F]">{currentDate.getDate()}</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-7 gap-2 text-center text-xs">
                            {weekDates.map((date, idx) => (
                              <div key={idx} className="flex flex-col items-center justify-center gap-1 min-w-[44px]">
                                <span className="text-gray-500 font-medium shrink-0">{dayNames[idx]}</span>
                                <button
                                  type="button"
                                  onClick={() => setCurrentDate(new Date(date))}
                                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                                    date.toDateString() === currentDate.toDateString()
                                      ? "bg-[#50348F] text-white font-bold"
                                      : "hover:bg-gray-100"
                                  }`}
                                >
                                  {date.getDate()}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {filteredProfessionals.slice(0, 7).map((professional) => (
                        <div key={professional.id} className="border-r border-gray-300 p-3 min-w-0">
                          <p
                            className="text-sm font-semibold truncate text-center"
                            style={{ color: professional.color }}
                            title={professional.name}
                          >
                            {professional.name}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="relative">
                      {timeSlots.map((time) => (
                        <div
                          key={time}
                          className={`grid border-b border-gray-200 ${
                            viewMode === "day"
                              ? "grid-cols-[80px_repeat(7,minmax(140px,1fr))]"
                              : "grid-cols-[minmax(360px,380px)_repeat(7,minmax(140px,1fr))]"
                          }`}
                        >
                          <div className="border-r border-gray-300 p-2 text-xs text-gray-500 text-right pr-2">
                            {time}
                          </div>
                          {filteredProfessionals.slice(0, 7).map((professional) => {
                            const appointmentsHere = appointmentsFromFirebase.filter(
                              (apt) =>
                                apt.professionalId === professional.id &&
                                apt.startTime === time &&
                                datesToShow.some((d) => appointmentMatchesDate(apt.date, d)),
                            )
                            return (
                              <div
                                key={professional.id}
                                className="border-r border-gray-300 min-h-[60px] min-w-0 relative"
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
              </TabsContent>

              <TabsContent value="online" className="mt-0 p-6">
                <OnlineBooking
                  professionals={mockProfessionals.map((p) => ({
                    id: p.id,
                    name: p.name,
                    specialty: mockSpecialties.find((s) => s.id === p.specialtyId)?.name ?? "Geral",
                  }))}
                  onBookingComplete={handleOnlineBookingComplete}
                />
              </TabsContent>

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
        <MainFooter />
      </div>

      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#50348F]">Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {appointment && appointmentPatient && appointmentProfessional && (
            <div className="space-y-4">
              <div className="bg-[#50348F]/10 rounded-lg p-4">
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
                  <span className="font-semibold text-[#50348F]">Profissional:</span> {appointmentProfessional.name}
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-[#50348F]">Prontuário:</span>{" "}
                  {appointmentPatient.name.toUpperCase()} {appointmentPatient.lastName.toUpperCase()} (
                  {appointmentPatient.id})
                </p>
                <p className="text-sm flex items-center gap-2">
                  <span className="font-semibold text-[#50348F]">Telefone:</span> {appointmentPatient.phone}
                  <span className="text-green-600">✓</span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-[#50348F]">Horário:</span> {appointment.startTime} -{" "}
                  {appointment.endTime}
                  <Button variant="ghost" size="sm" className="ml-2">
                    ✏️
                  </Button>
                  <Button variant="ghost" size="sm">
                    🕐
                  </Button>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-[#50348F]">Check-in:</span> Confirmado pela secretária
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-[#50348F]">Procedimentos:</span> {appointment.type}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#50348F] mb-2">Marcadores</p>
                <div className="text-sm text-gray-600">Selecionar marcadores...</div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#50348F] mb-2">Obs:</p>
                <p className="text-sm bg-gray-50 p-3 rounded">{appointment.notes || "Sem observações"}</p>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" className="bg-transparent border-[#50348F] text-[#50348F]">
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

      <NewAppointmentDialog
        open={showNewAppointment}
        onOpenChange={setShowNewAppointment}
        selectedDate={currentDate}
        onAppointmentCreated={refetchAppointments}
      />
    </div>
  )
}
