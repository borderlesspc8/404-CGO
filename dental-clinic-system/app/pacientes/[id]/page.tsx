"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { AppSidebar } from "@/components/app-sidebar"
import { PatientTabs } from "@/components/patient-tabs"
import { findStoredPatient, getStoredPatients, saveStoredPatients } from "@/lib/patients-storage"
import { mockAppointments, mockProfessionals, type Appointment, type Patient } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Calendar,
  Camera,
  ChevronLeft,
  Home,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Printer,
  Upload,
  UserRound,
} from "lucide-react"

const STATUS_LABELS: Record<Appointment["status"], string> = {
  scheduled: "Agendado",
  confirmed: "Confirmado",
  completed: "Atendido",
  cancelled: "Cancelado",
  noshow: "Faltou",
}

const STATUS_STYLES: Record<Appointment["status"], string> = {
  scheduled: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  confirmed: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  completed: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
  noshow: "bg-orange-100 text-orange-700 hover:bg-orange-100",
}

export default function PatientDetailPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const patientId = params?.id ? String(params.id) : ""
  const [patient, setPatient] = useState<Patient | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
      return
    }

    if (isAuthenticated && patientId) {
      setPatient(findStoredPatient(patientId) ?? null)
    }
  }, [isLoading, isAuthenticated, router, patientId])

  const patientAppointments = useMemo(
    () =>
      patient
        ? mockAppointments
            .filter((appointment) => appointment.patientId === patient.id)
            .sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`))
        : [],
    [patient],
  )

  if (isLoading || !isAuthenticated) {
    return null
  }

  if (!patient) {
    return (
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <MainHeader />
          <main className="flex-1 bg-gray-50 overflow-auto">
            <div className="max-w-3xl mx-auto px-6 py-12 text-center">
              <UserRound className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h1 className="text-xl font-bold text-[#50348F]">Paciente nao encontrado</h1>
              <Button className="mt-5" variant="outline" onClick={() => router.push("/pacientes")}>
                Voltar para Pacientes
              </Button>
            </div>
          </main>
          <MainFooter />
        </div>
      </div>
    )
  }

  function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !patient) return

    const reader = new FileReader()
    reader.onload = () => {
      const avatar = String(reader.result)
      const nextPatient = { ...patient, avatar }
      const nextPatients = getStoredPatients().map((item) => (item.id === patient.id ? nextPatient : item))
      saveStoredPatients(nextPatients)
      setPatient(nextPatient)
      toast({ title: "Foto atualizada", description: "O avatar do paciente foi salvo no perfil." })
    }
    reader.readAsDataURL(file)
  }

  const fullName = `${patient.name} ${patient.lastName}`
  const initials = `${patient.name.charAt(0)}${patient.lastName.charAt(0)}`
  const addressLine = [
    patient.address.street,
    patient.address.number,
    patient.address.complement,
    patient.address.neighborhood,
  ]
    .filter(Boolean)
    .join(", ")
  const cityLine = [patient.address.city, patient.address.state, patient.address.zipCode].filter(Boolean).join(" - ")

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MainHeader />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <button
              onClick={() => router.push("/pacientes")}
              className="flex items-center gap-1.5 text-sm text-[#50348F] hover:text-[#50348F]/70 mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar para Pacientes
            </button>

            <section className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-[#50348F]/20 shrink-0">
                      <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-[#50348F]/10 text-[#50348F] text-2xl font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <Label
                      htmlFor="patient-avatar"
                      className="absolute -right-2 -bottom-2 h-9 w-9 rounded-full bg-[#50348F] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#5D40A2]"
                      title="Atualizar foto"
                    >
                      <Camera className="w-4 h-4" />
                    </Label>
                    <Input
                      id="patient-avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-3 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-xl font-bold text-[#50348F] uppercase">{fullName}</h1>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-medium">
                        {patient.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                      <span className="text-sm text-gray-400">#{patient.id}</span>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {patient.phone || "Nao informado"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {patient.email || "Sem e-mail"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-gray-400" />
                        {cityLine || "Endereco nao informado"}
                      </span>
                    </div>

                    {patient.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                        {patient.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-[#50348F] border-[#50348F]/30 hover:bg-[#50348F]/5"
                    title="Agendar consulta"
                    onClick={() => router.push("/agenda")}
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-[#50348F] border-[#50348F]/30 hover:bg-[#50348F]/5"
                    title="Imprimir ficha"
                  >
                    <Printer className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    title="Enviar WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold ml-1"
                    onClick={() => router.push("/pacientes")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Paciente
                  </Button>
                </div>
              </div>
            </section>

            <PatientTabs
              cadastroContent={
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-[#50348F] px-6 py-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Cadastro e Perfil</h2>
                      <p className="text-white/70 text-sm">Dados pessoais, contato e endereco simplificado</p>
                    </div>
                    <Upload className="w-5 h-5 text-white/80" />
                  </div>
                  <div className="p-6 space-y-6">
                    <InfoSection
                      title="Dados pessoais"
                      items={[
                        ["Nome", patient.name],
                        ["Sobrenome", patient.lastName],
                        ["CPF", patient.cpf],
                        ["RG", patient.rg],
                        ["Data de nascimento", formatDate(patient.birthDate)],
                        ["Sexo", patient.gender],
                        ["Estado civil", patient.civilStatus],
                        ["Como conheceu", patient.howKnew],
                      ]}
                    />
                    <Separator />
                    <InfoSection
                      title="Contato e endereco"
                      items={[
                        ["Telefone", patient.phone],
                        ["E-mail", patient.email],
                        ["Endereco", addressLine],
                        ["Cidade/UF/CEP", cityLine],
                      ]}
                    />
                  </div>
                </div>
              }
              procedimentosContent={<Placeholder title="Procedimentos" text="Ficha de procedimentos do paciente." />}
              financeiroContent={<Placeholder title="Financeiro" text="Resumo financeiro do paciente." />}
              fotosContent={
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-[#50348F] mb-4">Fotos</h2>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24 border-4 border-[#50348F]/15">
                      <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-[#50348F]/10 text-[#50348F] text-2xl font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Foto de perfil</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Use o botao sobre o avatar do cabecalho para trocar a foto.
                      </p>
                    </div>
                  </div>
                </div>
              }
              contratosContent={<Placeholder title="Contratos" text="Contratos vinculados ao paciente." />}
              agendamentosContent={
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-[#50348F] px-6 py-4">
                    <h2 className="text-lg font-bold text-white">Historico de Agendamentos</h2>
                  </div>
                  <div className="p-6">
                    {patientAppointments.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">Nenhum agendamento encontrado</p>
                    ) : (
                      <div className="space-y-3">
                        {patientAppointments.map((appointment) => {
                          const professional = mockProfessionals.find((p) => p.id === appointment.professionalId)
                          return (
                            <div
                              key={appointment.id}
                              className="border border-gray-200 rounded-lg p-4 hover:border-[#50348F]/30 transition-colors"
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="min-w-0">
                                  <p className="font-semibold text-[#50348F] text-sm">
                                    {professional?.name ?? "Profissional nao informado"}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-0.5">
                                    {formatDate(appointment.date)} - {appointment.startTime} ate {appointment.endTime}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">{appointment.type}</p>
                                </div>
                                <Badge className={`${STATUS_STYLES[appointment.status]} shrink-0`}>
                                  {STATUS_LABELS[appointment.status]}
                                </Badge>
                              </div>
                              {appointment.notes && (
                                <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                  {appointment.notes}
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              }
              anamneseContent={<Placeholder title="Anamnese" text="Anamnese e alertas clinicos do paciente." />}
            />
          </div>
        </main>
        <MainFooter />
      </div>
    </div>
  )
}

function InfoSection({ title, items }: { title: string; items: [string, string | undefined][] }) {
  return (
    <section>
      <h3 className="text-sm font-bold uppercase tracking-wide text-[#50348F] mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 min-w-0">
            <p className="text-xs font-semibold text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-medium text-gray-800 truncate">{value || "Nao informado"}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Placeholder({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <h2 className="text-lg font-bold text-[#50348F]">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{text}</p>
    </div>
  )
}

function formatDate(value?: string) {
  if (!value) return ""
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}
