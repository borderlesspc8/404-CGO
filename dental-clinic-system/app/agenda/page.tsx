"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"

import { NewAppointmentDialog } from "@/components/new-appointment-dialog"
import { OnlineBooking } from "@/components/online-booking"
import { WaitingList } from "@/components/waiting-list"
import { AppSidebar } from "@/components/app-sidebar"
import { mockPatients, mockProfessionals, mockSpecialties } from "@/lib/mock-data"
import { useAppointments } from "@/hooks/use-appointments"
import { updateAppointment, deleteAppointment, type Appointment } from "@/lib/appointments-service"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, CalendarIcon, Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ptBR } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { AppointmentStatusBadge } from "@/components/appointment-status-badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

const SLOT_HEIGHT = 64

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const MONTH_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

const STATUS_LABELS: Record<Appointment["status"], string> = {
  scheduled: "Agendado",
  confirmed: "Confirmado",
  completed: "Atendido",
  cancelled: "Cancelado",
  noshow: "Faltou",
}

const STATUS_COLORS: Record<Appointment["status"], string> = {
  scheduled: "bg-gray-500 text-white border-gray-500",
  confirmed: "bg-blue-500 text-white border-blue-500",
  completed: "bg-green-500 text-white border-green-500",
  cancelled: "bg-red-500 text-white border-red-500",
  noshow: "bg-orange-500 text-white border-orange-500",
}

function formatDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function getWeekDates(date: Date): Date[] {
  const d = new Date(date)
  const sunday = new Date(d)
  sunday.setDate(d.getDate() - d.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(sunday)
    dd.setDate(sunday.getDate() + i)
    return dd
  })
}

function buildTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 7; h <= 20; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`)
    if (h < 20) {
      slots.push(`${String(h).padStart(2, "0")}:15`)
      slots.push(`${String(h).padStart(2, "0")}:30`)
      slots.push(`${String(h).padStart(2, "0")}:45`)
    }
  }
  return slots
}

const TIME_SLOTS = buildTimeSlots()

export default function AgendaPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>(
    mockProfessionals.map((p) => p.id),
  )
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<{ date?: Date; time?: string; professionalId?: string }>({})
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [waitingList, setWaitingList] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("calendar")
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [nowTime, setNowTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNowTime(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const weekDates = getWeekDates(currentDate)
  const dateRangeStart = formatDateKey(viewMode === "day" ? currentDate : weekDates[0])
  const dateRangeEnd = formatDateKey(viewMode === "day" ? currentDate : weekDates[6])

  const { appointments, loading, error } = useAppointments(dateRangeStart, dateRangeEnd)

  const filteredProfessionals = mockProfessionals.filter((p) => selectedProfessionals.includes(p.id))

  const today = new Date()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/")
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) return null

  // Derived data for detail dialog
  const selectedAppointment = appointments.find((a) => a.id === selectedAppointmentId) ?? null
  const selectedPatient = selectedAppointment
    ? mockPatients.find((p) => p.id === selectedAppointment.patientId)
    : null
  const selectedProfessional = selectedAppointment
    ? mockProfessionals.find((p) => p.id === selectedAppointment.professionalId)
    : null

  const nowOffsetPx = (() => {
    const h = nowTime.getHours()
    const m = nowTime.getMinutes()
    const totalMin = h * 60 + m
    const startMin = 7 * 60
    if (totalMin < startMin || totalMin > 20 * 60) return null
    return ((totalMin - startMin) / 15) * SLOT_HEIGHT
  })()

  function navigate(dir: -1 | 1) {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + dir * (viewMode === "day" ? 1 : 7))
      return d
    })
  }

  function openNewForm(date: Date, time?: string, professionalId?: string) {
    setFormData({ date, time, professionalId })
    setAppointmentToEdit(null)
    setShowForm(true)
  }

  function openEditForm(apt: Appointment) {
    setAppointmentToEdit(apt)
    setFormData({})
    setSelectedAppointmentId(null)
    setConfirmDelete(false)
    setShowForm(true)
  }

  async function handleStatusUpdate(status: Appointment["status"]) {
    if (!selectedAppointmentId) return
    setUpdatingStatus(true)
    try {
      await updateAppointment(selectedAppointmentId, { status })
      toast({ title: "Status atualizado", description: `Marcado como ${STATUS_LABELS[status]}.` })
    } catch {
      toast({ title: "Erro", description: "Falha ao atualizar status.", variant: "destructive" })
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleDelete() {
    if (!selectedAppointmentId) return
    try {
      await deleteAppointment(selectedAppointmentId)
      setSelectedAppointmentId(null)
      setConfirmDelete(false)
      toast({ title: "Excluído", description: "Agendamento removido." })
    } catch {
      toast({ title: "Erro", description: "Falha ao excluir.", variant: "destructive" })
    }
  }

  function toggleProfessional(id: string) {
    setSelectedProfessionals((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function weekRangeLabel() {
    const s = weekDates[0]
    const e = weekDates[6]
    if (s.getMonth() === e.getMonth())
      return `${s.getDate()}–${e.getDate()} ${MONTH_SHORT[s.getMonth()]} ${s.getFullYear()}`
    return `${s.getDate()} ${MONTH_SHORT[s.getMonth()]} – ${e.getDate()} ${MONTH_SHORT[e.getMonth()]} ${e.getFullYear()}`
  }

  // Today's stats for the left panel
  const todayKey = formatDateKey(today)
  const todayApts = appointments.filter(
    (a) => a.date === todayKey && selectedProfessionals.includes(a.professionalId),
  )

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MainHeader />
        <main className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            {/* Page header + tabs */}
            <div className="bg-white border-b border-gray-200 shrink-0">
              <div className="px-6 pt-4 pb-1">
                <h1 className="text-2xl font-bold text-[#50348F]">Agenda</h1>
              </div>
              <TabsList className="mx-6 mb-0">
                <TabsTrigger value="calendar">Calendário</TabsTrigger>
                <TabsTrigger value="online">Agendamento Online</TabsTrigger>
                <TabsTrigger value="waiting">Lista de Espera</TabsTrigger>
              </TabsList>
            </div>

            {/* ── CALENDAR TAB ── */}
            <TabsContent value="calendar" className="mt-0 flex-1 flex flex-col min-h-0 p-0">
              {/* Toolbar */}
              <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
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
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-semibold text-[#50348F] min-w-45 select-none">
                    {viewMode === "week"
                      ? weekRangeLabel()
                      : `${DAY_NAMES[currentDate.getDay()]}, ${currentDate.getDate()} ${MONTH_SHORT[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold h-8 text-sm px-3"
                    onClick={() => openNewForm(currentDate)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Novo Agendamento
                  </Button>

                  <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
                    {(["day", "week"] as const).map((mode) => (
                      <Button
                        key={mode}
                        size="sm"
                        onClick={() => setViewMode(mode)}
                        className={`h-6 px-3 text-xs rounded-md ${
                          viewMode === mode
                            ? "bg-[#50348F] text-white shadow-sm hover:bg-[#50348F]"
                            : "bg-transparent text-gray-600 hover:bg-transparent shadow-none"
                        }`}
                      >
                        {mode === "day" ? "Dia" : "Semana"}
                      </Button>
                    ))}
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
                        onSelect={(d) => {
                          if (d) {
                            setCurrentDate(d)
                            setCalendarOpen(false)
                          }
                        }}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Body: left panel + calendar grid */}
              <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* Left panel */}
                <div className="w-36 shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
                  <div className="p-3 space-y-4">
                    {/* Professional filters */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          Profissionais
                        </p>
                        <button
                          className="text-[10px] text-[#50348F] font-medium hover:underline"
                          onClick={() =>
                            setSelectedProfessionals(
                              selectedProfessionals.length === mockProfessionals.length
                                ? []
                                : mockProfessionals.map((p) => p.id),
                            )
                          }
                        >
                          {selectedProfessionals.length === mockProfessionals.length ? "Nenhum" : "Todos"}
                        </button>
                      </div>
                      <div className="space-y-0.5">
                        {mockProfessionals.map((prof) => {
                          const active = selectedProfessionals.includes(prof.id)
                          return (
                            <button
                              key={prof.id}
                              onClick={() => toggleProfessional(prof.id)}
                              className="w-full flex items-center gap-2 px-1.5 py-1 rounded hover:bg-gray-50 text-left transition-colors"
                            >
                              <span
                                className="w-3 h-3 rounded-sm shrink-0 border-2 transition-all"
                                style={{
                                  backgroundColor: active ? prof.color : "transparent",
                                  borderColor: prof.color,
                                }}
                              />
                              <span
                                className="text-[11px] truncate leading-tight transition-colors"
                                style={{ color: active ? prof.color : "#9ca3af" }}
                              >
                                {prof.name}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Today stats */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Hoje
                      </p>
                      <div className="space-y-1.5">
                        {[
                          { label: "Total", value: todayApts.length, color: "text-[#50348F]" },
                          {
                            label: "Confirmados",
                            value: todayApts.filter((a) => a.status === "confirmed").length,
                            color: "text-blue-600",
                          },
                          {
                            label: "Atendidos",
                            value: todayApts.filter((a) => a.status === "completed").length,
                            color: "text-green-600",
                          },
                          {
                            label: "Cancelados",
                            value: todayApts.filter((a) => a.status === "cancelled").length,
                            color: "text-red-600",
                          },
                        ].map(({ label, value, color }) => (
                          <div key={label} className="flex justify-between items-center">
                            <span className="text-[11px] text-gray-500">{label}</span>
                            <span className={`text-xs font-bold ${color}`}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar grid */}
                <div className="flex-1 overflow-auto relative">
                  {error && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm z-20 shadow">
                      {error}
                    </div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                      <span className="text-[#50348F] text-sm font-medium animate-pulse">
                        Carregando...
                      </span>
                    </div>
                  )}

                  {/* ── WEEK VIEW ── */}
                  {viewMode === "week" && (
                    <div style={{ minWidth: 720 }}>
                      {/* Header row */}
                      <div
                        className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "60px repeat(7, minmax(130px, 1fr))",
                        }}
                      >
                        <div className="border-r border-gray-200 py-2" />
                        {weekDates.map((date, idx) => {
                          const isToday = date.toDateString() === today.toDateString()
                          const aptCount = appointments.filter(
                            (a) =>
                              a.date === formatDateKey(date) &&
                              selectedProfessionals.includes(a.professionalId),
                          ).length
                          return (
                            <div
                              key={idx}
                              className={`border-r border-gray-200 py-2 px-1 flex flex-col items-center gap-1 ${isToday ? "bg-[#50348F]/5" : ""}`}
                            >
                              <span className={`text-[11px] font-bold uppercase tracking-wide ${isToday ? "text-[#50348F]" : "text-gray-400"}`}>
                                {DAY_NAMES[date.getDay()]}
                              </span>
                              <button
                                onClick={() => {
                                  setCurrentDate(new Date(date))
                                  setViewMode("day")
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                  isToday
                                    ? "bg-[#50348F] text-white shadow-md"
                                    : "hover:bg-gray-100 text-gray-700"
                                }`}
                              >
                                {date.getDate()}
                              </button>
                              {aptCount > 0 ? (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isToday ? "bg-[#50348F] text-white" : "bg-[#50348F]/10 text-[#50348F]"}`}>
                                  {aptCount}
                                </span>
                              ) : (
                                <span className="h-5" />
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Time rows */}
                      <div className="bg-white relative">
                        {nowOffsetPx !== null && (() => {
                          const todayIdx = weekDates.findIndex((d) => d.toDateString() === today.toDateString())
                          if (todayIdx === -1) return null
                          const colWidth = `${100 / 7}%`
                          return (
                            <div
                              className="absolute z-20 pointer-events-none flex items-center"
                              style={{
                                top: nowOffsetPx,
                                left: `calc(52px + ${todayIdx} * ${colWidth})`,
                                width: colWidth,
                              }}
                            >
                              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                              <div className="flex-1 h-px bg-red-500 opacity-80" />
                            </div>
                          )
                        })()}
                        {TIME_SLOTS.map((time) => {
                          const isHour = time.endsWith(":00")
                          return (
                            <div
                              key={time}
                              className={isHour ? "border-t border-gray-200" : "border-t border-gray-100"}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "60px repeat(7, minmax(130px, 1fr))",
                                height: SLOT_HEIGHT,
                              }}
                            >
                              <div className="border-r border-gray-200 flex items-start justify-end pr-1.5 pt-0.5">
                                {isHour && (
                                  <span className="text-[11px] font-medium text-gray-500 tabular-nums">
                                    {time}
                                  </span>
                                )}
                              </div>
                              {weekDates.map((date, idx) => {
                                const dayKey = formatDateKey(date)
                                const aptsHere = appointments.filter(
                                  (a) =>
                                    a.date === dayKey &&
                                    a.startTime === time &&
                                    selectedProfessionals.includes(a.professionalId),
                                )
                                return (
                                  <div
                                    key={idx}
                                    className="border-r border-gray-200 relative cursor-pointer group"
                                    style={{ height: SLOT_HEIGHT }}
                                    onClick={() => openNewForm(new Date(date), time)}
                                  >
                                    <div className="absolute inset-0 group-hover:bg-[#50348F]/5 transition-colors pointer-events-none" />
                                    {aptsHere.map((apt, aptIdx) => {
                                      const prof = mockProfessionals.find(
                                        (p) => p.id === apt.professionalId,
                                      )
                                      const patient = mockPatients.find((p) => p.id === apt.patientId)
                                      const startMin =
                                        parseInt(apt.startTime.split(":")[0]) * 60 +
                                        parseInt(apt.startTime.split(":")[1])
                                      const endMin =
                                        parseInt(apt.endTime.split(":")[0]) * 60 +
                                        parseInt(apt.endTime.split(":")[1])
                                      const durationSlots = (endMin - startMin) / 15
                                      const n = aptsHere.length
                                      return (
                                        <button
                                          key={apt.id}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedAppointmentId(apt.id)
                                            setConfirmDelete(false)
                                          }}
                                          className="absolute rounded px-1.5 py-1 text-left overflow-hidden hover:brightness-90 z-10 shadow-sm transition-all"
                                          style={{
                                            backgroundColor: prof?.color ?? "#6366f1",
                                            color: "white",
                                            height: durationSlots * SLOT_HEIGHT - 2,
                                            top: 1,
                                            left: `${(aptIdx / n) * 100}%`,
                                            width: `${(1 / n) * 100}%`,
                                          }}
                                        >
                                          <div className="font-semibold truncate text-xs leading-tight">
                                            {patient
                                              ? `${patient.name} ${patient.lastName}`
                                              : "Paciente"}
                                          </div>
                                          {durationSlots >= 2 && (
                                            <div className="text-[11px] opacity-85 leading-tight mt-0.5">
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
                  )}

                  {/* ── DAY VIEW ── */}
                  {viewMode === "day" && (
                    <div style={{ minWidth: 600 }}>
                      {/* Header row */}
                      <div
                        className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm"
                        style={{
                          display: "grid",
                          gridTemplateColumns: `60px repeat(${filteredProfessionals.length || 1}, minmax(150px, 1fr))`,
                        }}
                      >
                        <div className="border-r border-gray-200 py-2" />
                        {filteredProfessionals.map((prof) => (
                          <div
                            key={prof.id}
                            className="border-r border-gray-200 px-2 py-3 flex flex-col items-center justify-center gap-1 min-w-0"
                            style={{ borderTop: `3px solid ${prof.color}` }}
                          >
                            <span
                              className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: prof.color }}
                            >
                              {prof.name.charAt(0)}
                            </span>
                            <span
                              className="text-xs font-semibold text-center leading-tight line-clamp-2"
                              style={{ color: prof.color }}
                              title={prof.name}
                            >
                              {prof.name}
                            </span>
                          </div>
                        ))}
                        {filteredProfessionals.length === 0 && (
                          <div className="border-r border-gray-200 px-2 py-2.5 flex items-center justify-center">
                            <span className="text-xs text-gray-400">
                              Nenhum profissional selecionado
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Time rows */}
                      <div className="bg-white relative">
                        {nowOffsetPx !== null && currentDate.toDateString() === today.toDateString() && (
                          <div
                            className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
                            style={{ top: nowOffsetPx }}
                          >
                            <span className="w-2 h-2 rounded-full bg-red-500 ml-15 shrink-0" />
                            <div className="flex-1 h-px bg-red-500 opacity-80" />
                          </div>
                        )}
                        {TIME_SLOTS.map((time) => {
                          const isHour = time.endsWith(":00")
                          return (
                            <div
                              key={time}
                              className={isHour ? "border-t border-gray-200" : "border-t border-gray-100"}
                              style={{
                                display: "grid",
                                gridTemplateColumns: `60px repeat(${filteredProfessionals.length || 1}, minmax(150px, 1fr))`,
                                height: SLOT_HEIGHT,
                              }}
                            >
                              <div className="border-r border-gray-200 flex items-start justify-end pr-1.5 pt-0.5">
                                {isHour && (
                                  <span className="text-[11px] font-medium text-gray-500 tabular-nums">
                                    {time}
                                  </span>
                                )}
                              </div>
                              {filteredProfessionals.map((prof) => {
                                const dayKey = formatDateKey(currentDate)
                                const aptsHere = appointments.filter(
                                  (a) =>
                                    a.professionalId === prof.id &&
                                    a.date === dayKey &&
                                    a.startTime === time,
                                )
                                return (
                                  <div
                                    key={prof.id}
                                    className="border-r border-gray-200 relative cursor-pointer group"
                                    style={{
                                      height: SLOT_HEIGHT,
                                      backgroundColor: isHour
                                        ? `${prof.color}08`
                                        : `${prof.color}04`,
                                    }}
                                    onClick={() => openNewForm(currentDate, time, prof.id)}
                                  >
                                    <div className="absolute inset-0 group-hover:bg-[#50348F]/5 transition-colors pointer-events-none" />
                                    {aptsHere.map((apt) => {
                                      const patient = mockPatients.find((p) => p.id === apt.patientId)
                                      const startMin =
                                        parseInt(apt.startTime.split(":")[0]) * 60 +
                                        parseInt(apt.startTime.split(":")[1])
                                      const endMin =
                                        parseInt(apt.endTime.split(":")[0]) * 60 +
                                        parseInt(apt.endTime.split(":")[1])
                                      const durationSlots = (endMin - startMin) / 15
                                      return (
                                        <button
                                          key={apt.id}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedAppointmentId(apt.id)
                                            setConfirmDelete(false)
                                          }}
                                          className="absolute left-0.5 right-0.5 rounded px-2 py-1 text-left overflow-hidden hover:brightness-90 z-10 shadow-sm transition-all"
                                          style={{
                                            backgroundColor: prof.color,
                                            color: "white",
                                            height: durationSlots * SLOT_HEIGHT - 2,
                                            top: 1,
                                          }}
                                        >
                                          <div className="font-semibold truncate text-sm leading-tight">
                                            {patient
                                              ? `${patient.name} ${patient.lastName}`
                                              : "Paciente"}
                                          </div>
                                          {durationSlots >= 2 && (
                                            <div className="text-xs opacity-85 leading-tight mt-0.5">
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
                  )}
                </div>
              </div>
            </TabsContent>

            {/* ── ONLINE BOOKING TAB ── */}
            <TabsContent value="online" className="mt-0 p-6">
              <OnlineBooking
                professionals={mockProfessionals.map((p) => ({
                  id: p.id,
                  name: p.name,
                  specialty: mockSpecialties.find((s) => s.id === p.specialtyId)?.name ?? "Geral",
                }))}
                onBookingComplete={(booking) => console.log("Reserva online:", booking)}
              />
            </TabsContent>

            {/* ── WAITING LIST TAB ── */}
            <TabsContent value="waiting" className="mt-0 p-6">
              <WaitingList
                entries={waitingList}
                onAddEntry={(entry) => setWaitingList((prev) => [...prev, entry])}
                onRemoveEntry={(id) => setWaitingList((prev) => prev.filter((e) => e.id !== id))}
                onConvertToAppointment={(entry) =>
                  setWaitingList((prev) => prev.filter((e) => e.id !== entry.id))
                }
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* ── APPOINTMENT DETAIL DIALOG ── */}
      <Dialog
        open={!!selectedAppointmentId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAppointmentId(null)
            setConfirmDelete(false)
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#50348F] flex items-center gap-2 flex-wrap">
              Detalhes do Agendamento
              {selectedAppointment && (
                <AppointmentStatusBadge status={selectedAppointment.status} />
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              {/* Info block */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                {[
                  {
                    label: "Paciente",
                    value: selectedPatient
                      ? `${selectedPatient.name} ${selectedPatient.lastName}`
                      : "Paciente não encontrado",
                  },
                  ...(selectedPatient
                    ? [{ label: "Telefone", value: selectedPatient.phone }]
                    : []),
                  {
                    label: "Profissional",
                    value: selectedProfessional?.name ?? "—",
                    dot: selectedProfessional?.color,
                  },
                  {
                    label: "Data",
                    value: (() => {
                      const [y, m, d] = selectedAppointment.date.split("-")
                      return `${d}/${m}/${y} · ${selectedAppointment.startTime}–${selectedAppointment.endTime}`
                    })(),
                  },
                  { label: "Procedimento", value: selectedAppointment.type },
                ].map(({ label, value, dot }) => (
                  <div key={label} className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-gray-400 w-24 shrink-0 pt-0.5">
                      {label}
                    </span>
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      {dot && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: dot }}
                        />
                      )}
                      <span className="text-sm text-gray-800">{value}</span>
                    </div>
                  </div>
                ))}
                {selectedAppointment.notes && (
                  <div className="flex items-start gap-2 pt-1 border-t border-gray-200">
                    <span className="text-xs font-semibold text-gray-400 w-24 shrink-0 pt-0.5">
                      Observações
                    </span>
                    <p className="text-sm text-gray-600 flex-1">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              {!confirmDelete && (
                <>
                  {/* Status buttons */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Atualizar Status</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        [
                          "scheduled",
                          "confirmed",
                          "completed",
                          "cancelled",
                          "noshow",
                        ] as Appointment["status"][]
                      ).map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          disabled={updatingStatus}
                          onClick={() => handleStatusUpdate(s)}
                          className={`h-7 text-xs border ${
                            selectedAppointment.status === s
                              ? STATUS_COLORS[s]
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {STATUS_LABELS[s]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Action buttons */}
                  <div className="flex gap-2 justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setConfirmDelete(true)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Excluir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#50348F] border-[#50348F]/30 hover:bg-[#50348F]/5"
                      onClick={() => openEditForm(selectedAppointment)}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1.5" />
                      Editar
                    </Button>
                  </div>
                </>
              )}

              {confirmDelete && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-3">
                  <p className="text-sm text-red-700 font-medium">
                    Confirmar exclusão deste agendamento?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleDelete}
                    >
                      Confirmar Exclusão
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── CREATE / EDIT FORM DIALOG ── */}
      <NewAppointmentDialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open)
          if (!open) setAppointmentToEdit(null)
        }}
        selectedDate={formData.date ?? currentDate}
        selectedTime={formData.time}
        selectedProfessionalId={formData.professionalId}
        appointmentToEdit={appointmentToEdit ?? undefined}
        appointments={appointments}
        onAppointmentCreated={() => {}}
      />
    </div>
  )
}
