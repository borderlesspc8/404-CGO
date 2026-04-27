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

const SLOT_HEIGHT = 28 // px per 15-minute slot

export default function AgendaPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 17))
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>(mockProfessionals.map((p) => p.id))
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [newAppointmentData, setNewAppointmentData] = useState<{ date?: Date; time?: string; professionalId?: string }>({})
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
  for (let hour = 7; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`)
    if (hour < 20) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:15`)
      timeSlots.push(`${hour.toString().padStart(2, "0")}:30`)
      timeSlots.push(`${hour.toString().padStart(2, "0")}:45`)
    }
  }

  const dayNames = ["D", "S", "T", "Q", "Q", "S", "S"]
  const fullDayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
  const monthNamesShort = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

  const formatShortDate = (date: Date) =>
    `${fullDayNames[date.getDay()]}, ${date.getDate()} ${monthNamesShort[date.getMonth()]} ${date.getFullYear()}`

  const formatWeekRange = (start: Date, end: Date) => {
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}–${end.getDate()} ${monthNamesShort[start.getMonth()]} ${start.getFullYear()}`
    }
    return `${start.getDate()} ${monthNamesShort[start.getMonth()]} – ${end.getDate()} ${monthNamesShort[end.getMonth()]} ${end.getFullYear()}`
  }

  const today = new Date()
  const isHourSlot = (time: string) => time.endsWith(":00")

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

  const gridCols =
    viewMode === "day"
      ? "grid-cols-[72px_repeat(7,minmax(120px,1fr))]"
      : "grid-cols-[minmax(280px,320px)_repeat(7,minmax(120px,1fr))]"

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MainHeader />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="flex flex-col h-full w-full max-w-full px-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col w-full">
              {/* Page header */}
              <div className="bg-white border-b border-gray-200">
                <div className="px-6 pt-4 pb-1">
                  <h1 className="text-2xl font-bold text-[#50348F]">Agenda</h1>
                </div>
                <TabsList className="mx-6 mb-0">
                  <TabsTrigger value="calendar">Calendário</TabsTrigger>
                  <TabsTrigger value="online">Agendamento Online</TabsTrigger>
                  <TabsTrigger value="waiting">Lista de Espera</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="calendar" className="mt-0 p-0 flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#50348F] hidden lg:block mr-1">Correia Andradina</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setCurrentDate((prev) => {
                          const d = new Date(prev)
                          d.setDate(d.getDate() - (viewMode === "day" ? 1 : 7))
                          return d
                        })
                      }
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2.5 text-xs font-semibold text-[#50348F] border border-gray-200 hover:bg-[#50348F]/5"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Hoje
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setCurrentDate((prev) => {
                          const d = new Date(prev)
                          d.setDate(d.getDate() + (viewMode === "day" ? 1 : 7))
                          return d
                        })
                      }
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-semibold text-[#50348F] min-w-[140px] select-none">
                      {viewMode === "day"
                        ? formatShortDate(currentDate)
                        : formatWeekRange(weekDates[0], weekDates[6])}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold h-8 text-sm px-3"
                      onClick={() => setShowNewAppointment(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Novo Agendamento
                    </Button>
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
                      <Button
                        variant={viewMode === "day" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("day")}
                        className={`h-6 px-3 text-xs ${viewMode === "day" ? "bg-[#50348F] text-white shadow-sm" : "text-gray-600"}`}
                      >
                        Dia
                      </Button>
                      <Button
                        variant={viewMode === "week" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("week")}
                        className={`h-6 px-3 text-xs ${viewMode === "week" ? "bg-[#50348F] text-white shadow-sm" : "text-gray-600"}`}
                      >
                        Semana
                      </Button>
                    </div>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Ir para data">
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
                      className="h-8 w-8"
                      aria-label="Configurações"
                      onClick={() =>
                        toast({ title: "Configurações", description: "Configurações do calendário em breve." })
                      }
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Calendar grid */}
                <div className="flex-1 overflow-auto relative">
                  {appointmentsError && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm z-20 shadow">
                      {appointmentsError}
                    </div>
                  )}
                  {appointmentsLoading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                      <div className="text-[#50348F] font-medium text-sm">Carregando consultas...</div>
                    </div>
                  )}
                  <div className={viewMode === "day" ? "min-w-[900px]" : "min-w-[1200px]"}>
                    {/* Column headers — sticky */}
                    <div className={`grid border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm ${gridCols}`}>
                      <div className="border-r border-gray-200 p-2 flex items-center justify-center min-w-0">
                        {viewMode === "day" ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                              {dayNames[currentDate.getDay()]}
                            </span>
                            <span
                              className={`text-base font-bold w-8 h-8 flex items-center justify-center rounded-full ${
                                formatDateKey(currentDate) === formatDateKey(today)
                                  ? "bg-[#50348F] text-white"
                                  : "text-[#50348F]"
                              }`}
                            >
                              {currentDate.getDate()}
                            </span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-7 gap-1 w-full text-center">
                            {weekDates.map((date, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                                  {dayNames[idx]}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCurrentDate(new Date(date))}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                                    date.toDateString() === currentDate.toDateString()
                                      ? "bg-[#50348F] text-white"
                                      : date.toDateString() === today.toDateString()
                                      ? "border border-[#50348F] text-[#50348F]"
                                      : "hover:bg-gray-100 text-gray-700"
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
                        <div
                          key={professional.id}
                          className="border-r border-gray-200 px-2 py-2.5 min-w-0 flex items-center justify-center gap-1.5"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: professional.color }}
                          />
                          <p
                            className="text-xs font-semibold truncate"
                            style={{ color: professional.color }}
                            title={professional.name}
                          >
                            {professional.name}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Time slots */}
                    <div className="relative bg-white">
                      {timeSlots.map((time) => {
                        const isHour = isHourSlot(time)
                        return (
                          <div
                            key={time}
                            className={`grid ${gridCols} ${
                              isHour ? "border-t border-gray-200" : "border-t border-gray-100"
                            }`}
                            style={{ height: `${SLOT_HEIGHT}px` }}
                          >
                            <div className="border-r border-gray-200 flex items-start justify-end pr-2 pt-0.5 shrink-0">
                              {isHour && (
                                <span className="text-[10px] font-medium text-gray-400 leading-none tabular-nums">
                                  {time}
                                </span>
                              )}
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
                                  className="border-r border-gray-200 relative cursor-pointer group"
                                  style={{
                                    height: `${SLOT_HEIGHT}px`,
                                    backgroundColor: isHour
                                      ? `${professional.color}07`
                                      : `${professional.color}03`,
                                  }}
                                  onClick={() => {
                                    setShowNewAppointment(true)
                                    setNewAppointmentData({
                                      date: datesToShow.length === 1 ? datesToShow[0] : new Date(),
                                      time,
                                      professionalId: professional.id,
                                    })
                                  }}
                                >
                                  <div className="absolute inset-0 group-hover:bg-[#50348F]/5 transition-colors pointer-events-none" />
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
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedAppointment(apt.id)
                                        }}
                                        className="absolute left-0.5 right-0.5 rounded-md px-1.5 py-0.5 text-left overflow-hidden hover:brightness-90 transition-all z-10 shadow-sm"
                                        style={{
                                          backgroundColor: professional.color,
                                          color: "white",
                                          height: `${durationSlots * SLOT_HEIGHT - 2}px`,
                                          top: "1px",
                                        }}
                                      >
                                        <div className="font-semibold truncate text-[10px] leading-tight">
                                          {patient ? `${patient.name} ${patient.lastName}` : "Paciente"}
                                        </div>
                                        {durationSlots >= 3 && (
                                          <div className="text-[9px] opacity-80 leading-tight">
                                            {apt.startTime}–{apt.endTime}
                                          </div>
                                        )}
                                      </button>
                                    )
                                  })}
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
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
                  <span className="font-semibold text-[#50348F]">Horário:</span> {appointment.startTime} –{" "}
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
        selectedDate={newAppointmentData.date || currentDate}
        selectedTime={newAppointmentData.time}
        selectedProfessionalId={newAppointmentData.professionalId}
        onAppointmentCreated={refetchAppointments}
      />
    </div>
  )
}
