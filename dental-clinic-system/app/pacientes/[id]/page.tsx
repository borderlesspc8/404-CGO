"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { AppSidebar } from "@/components/app-sidebar"
import { mockPatients, mockAppointments, mockProfessionals, type Patient } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PatientTabs } from "@/components/patient-tabs"
import {
  Calendar,
  Phone,
  Mail,
  Printer,
  Ban,
  MessageCircle,
  Plus,
  AlertTriangle,
  Eye,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react"

export default function PatientDetailPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
      return
    }
    const found = mockPatients.find((p) => p.id === params.id)
    if (found) setPatient(found)
  }, [isLoading, isAuthenticated, router, params.id])

  if (isLoading || !isAuthenticated || !patient) {
    return null
  }

  const patientAppointments = mockAppointments.filter((a) => a.patientId === patient.id)

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MainHeader />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">

            {/* Breadcrumb */}
            <button
              onClick={() => router.push("/pacientes")}
              className="flex items-center gap-1.5 text-sm text-[#50348F] hover:text-[#50348F]/70 mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar para Pacientes
            </button>

            {/* Patient header card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
              <div className="flex items-start justify-between gap-6">

                {/* Avatar + info */}
                <div className="flex items-start gap-5">
                  <Avatar className="w-24 h-24 border-4 border-[#50348F]/20 shrink-0">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-[#50348F]/10 text-[#50348F] text-2xl font-bold">
                      {patient.name.charAt(0)}
                      {patient.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-xl font-bold text-[#50348F]">
                        {patient.name.toUpperCase()} {patient.lastName.toUpperCase()}
                      </h1>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-medium">
                        Ativo
                      </Badge>
                      <span className="text-sm text-gray-400">#{patient.id}</span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {patient.phone || "Não informado"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {patient.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-[#50348F] border-[#50348F]/30 hover:bg-[#50348F]/5"
                    title="Agendar consulta"
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    title="Bloquear paciente"
                  >
                    <Ban className="w-4 h-4" />
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

              {/* Quick info strip */}
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#50348F]/30 text-[#50348F] hover:bg-[#50348F]/5 font-medium"
                >
                  Consultar CPF
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-medium gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sem restrição SPC/Serasa</span>
                  <span className="text-xs font-normal text-emerald-600/70">· 15/01/2025</span>
                </Button>

                <Button
                  size="sm"
                  className="bg-[#50348F] hover:bg-[#5D40A2] text-white font-medium gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Anamnese
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#B8AF39] text-[#50348F] hover:bg-[#B8AF39]/10 font-medium"
                >
                  Alerta de Retorno
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-500 hover:bg-gray-50"
                  title="Visualizar"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <PatientTabs
              cadastroContent={
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-[#50348F] px-6 py-4">
                    <h2 className="text-lg font-bold text-white">Dados Cadastrais</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-[#50348F] font-semibold text-sm">Nome</Label>
                        <Input defaultValue={patient.name} className="border-gray-200 focus-visible:border-[#50348F]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[#50348F] font-semibold text-sm">Sobrenome</Label>
                        <Input defaultValue={patient.lastName} className="border-gray-200 focus-visible:border-[#50348F]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[#50348F] font-semibold text-sm">CPF</Label>
                        <Input defaultValue={patient.cpf} className="border-gray-200 focus-visible:border-[#50348F]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[#50348F] font-semibold text-sm">Data de Nascimento</Label>
                        <Input type="date" defaultValue={patient.birthDate} className="border-gray-200 focus-visible:border-[#50348F]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[#50348F] font-semibold text-sm">Estado Civil</Label>
                        <Input defaultValue={patient.civilStatus} className="border-gray-200 focus-visible:border-[#50348F]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[#50348F] font-semibold text-sm">Sexo</Label>
                        <Input defaultValue={patient.gender} className="border-gray-200 focus-visible:border-[#50348F]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[#50348F] font-semibold text-sm">Como Conheceu</Label>
                        <Input defaultValue={patient.howKnew} className="border-gray-200 focus-visible:border-[#50348F]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[#50348F] font-semibold text-sm">RG</Label>
                        <Input defaultValue={patient.rg} className="border-gray-200 focus-visible:border-[#50348F]" />
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 mt-8 pt-6 border-t border-gray-100">
                      <Button className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold px-6 rounded-full">
                        Dados Cadastrais
                      </Button>
                      <Button variant="outline" className="border-[#50348F]/30 text-[#50348F] font-semibold px-6 rounded-full hover:bg-[#50348F]/5">
                        Contato
                      </Button>
                      <Button variant="outline" className="border-[#50348F]/30 text-[#50348F] font-semibold px-6 rounded-full hover:bg-[#50348F]/5">
                        Dados Complementares
                      </Button>
                    </div>
                  </div>
                </div>
              }

              procedimentosContent={
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-[#50348F] px-6 py-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Orçamentos</h2>
                      <p className="text-white/60 text-sm">1 orçamento ativo</p>
                    </div>
                    <Button className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Orçamento
                    </Button>
                  </div>

                  <div className="p-6">
                    {/* Budget card */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Budget header */}
                      <div className="bg-[#50348F]/8 border-b border-gray-100 px-5 py-4 flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                              Aprovado · 15/10/2025
                            </Badge>
                          </div>
                          <h3 className="font-bold text-[#50348F] text-base">Protocolo Cirúrgico Completo</h3>
                          <p className="text-sm text-gray-500">Dr. Pedro Henrique Ribeiro Mota · Aprovado por Diovana</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-gray-400 mb-0.5">Total com desconto</p>
                          <p className="text-2xl font-bold text-[#50348F]">R$12.847,75</p>
                          <Badge className="bg-red-100 text-red-600 hover:bg-red-100 text-xs mt-1">15% de desconto</Badge>
                        </div>
                      </div>

                      {/* Procedures */}
                      <div className="divide-y divide-gray-100">
                        <div className="px-5 py-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">Cirurgia Protocolo (1x)</p>
                            <p className="text-xs text-gray-400 mt-0.5">Oris · Dr. Pedro Henrique Ribeiro Mota</p>
                          </div>
                          <p className="font-bold text-[#50348F]">R$3.015,00</p>
                        </div>
                        <div className="px-5 py-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">Prótese Protocolo (1x)</p>
                            <p className="text-xs text-gray-400 mt-0.5">Oris · Dr. Pedro Henrique Ribeiro Mota</p>
                          </div>
                          <p className="font-bold text-[#50348F]">R$12.100,00</p>
                        </div>
                      </div>

                      {/* Financial summary */}
                      <div className="bg-gray-50 px-5 py-4 flex items-center justify-between border-t border-gray-100">
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><span className="font-semibold">Forma de pagamento:</span> Boleto Parcelado</p>
                          <p><span className="font-semibold">Parcelas:</span> Entrada + 24x</p>
                          <p><span className="font-semibold">Tabela:</span> Particular</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 mb-0.5">Valor original</p>
                          <p className="text-sm text-gray-400 line-through">R$15.115,00</p>
                          <p className="text-xl font-bold text-emerald-600">R$12.847,75</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }

              financeiroContent={
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-[#50348F] font-medium">Módulo Financeiro em desenvolvimento</p>
                </div>
              }

              fotosContent={
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-[#50348F] font-medium">Módulo de Fotos em desenvolvimento</p>
                </div>
              }

              contratosContent={
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-[#50348F] font-medium">Módulo de Contratos em desenvolvimento</p>
                </div>
              }

              agendamentosContent={
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-[#50348F] px-6 py-4">
                    <h2 className="text-lg font-bold text-white">Histórico de Agendamentos</h2>
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
                                  <p className="font-semibold text-[#50348F] text-sm">{professional?.name}</p>
                                  <p className="text-sm text-gray-500 mt-0.5">
                                    {new Date(appointment.date).toLocaleDateString("pt-BR")} · {appointment.startTime} – {appointment.endTime}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">{appointment.type}</p>
                                </div>
                                <Badge
                                  className={
                                    appointment.status === "confirmed"
                                      ? "bg-blue-100 text-blue-700 hover:bg-blue-100 shrink-0"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-100 shrink-0"
                                  }
                                >
                                  {appointment.status === "confirmed" ? "Confirmado" : "Agendado"}
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

              anamneseContent={
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-[#50348F] font-medium">Módulo de Anamnese em desenvolvimento</p>
                </div>
              }
            />
          </div>
        </main>
        <MainFooter />
      </div>
    </div>
  )
}
