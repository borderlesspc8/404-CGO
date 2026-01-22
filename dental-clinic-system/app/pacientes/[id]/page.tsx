"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { mockPatients, mockAppointments, mockProfessionals, type Patient } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PatientTabs } from "@/components/patient-tabs"
import { Calendar, Phone, Mail, Printer, Ban, MessageCircle, Plus, AlertTriangle, Eye } from "lucide-react"

export default function PatientDetailPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    const foundPatient = mockPatients.find((p) => p.id === params.id)
    if (foundPatient) {
      setPatient(foundPatient)
    }
  }, [isAuthenticated, router, params.id])

  if (!isAuthenticated || !patient) {
    return null
  }

  const patientAppointments = mockAppointments.filter((a) => a.patientId === patient.id)

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <MainHeader />

      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Patient header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between gap-6">
              {/* Left: Avatar and basic info */}
              <div className="flex items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-[#5b4b8a]">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" />
                  <AvatarFallback className="bg-[#c9b888] text-[#5b4b8a] text-3xl font-bold">
                    {patient.name.charAt(0)}
                    {patient.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-[#5b4b8a]">
                      {patient.name.toUpperCase()} {patient.lastName.toUpperCase()} ({patient.id})
                    </h1>
                    <Badge className="bg-green-500 text-white">Ativo</Badge>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {patient.phone || "Não informado"}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {patient.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {patient.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Action buttons */}
              <div className="flex items-start gap-2">
                <Button variant="outline" size="icon" className="text-[#5b4b8a] bg-transparent">
                  <Calendar className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="text-[#5b4b8a] bg-transparent">
                  <Ban className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="text-[#5b4b8a] bg-transparent">
                  <Printer className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="text-green-600 bg-transparent">
                  <MessageCircle className="w-5 h-5" />
                </Button>
                <Button className="bg-[#c9b888] hover:bg-[#b8a777] text-[#5b4b8a] font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Paciente
                </Button>
              </div>
            </div>

            {/* Quick info buttons */}
            <div className="flex items-center gap-4 mt-6">
              <Button variant="outline" className="border-[#5b4b8a] text-[#5b4b8a] font-semibold bg-transparent">
                Consultar CPF
              </Button>
              <Button variant="outline" className="border-[#5b4b8a] text-[#5b4b8a] font-semibold bg-transparent">
                Sem Registro no SPC/Serasa
                <br />
                <span className="text-xs">última consulta 15/01/2025</span>
              </Button>
              <Button className="bg-[#5b4b8a] hover:bg-[#4a3b6a] text-white font-semibold">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Anamnese
                <br />
                <span className="text-xs">Ver/Inserir</span>
              </Button>
              <Button variant="outline" className="border-[#c9b888] text-[#5b4b8a] font-semibold bg-transparent">
                Alerta de retorno
                <br />
                <span className="text-xs">Criar alerta</span>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-600 bg-transparent">
                <Eye className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <PatientTabs
            cadastroContent={
              <div className="bg-white rounded-lg shadow-md p-8 mt-6">
                <h2 className="text-2xl font-bold text-white bg-[#5b4b8a] rounded-t-lg px-6 py-3 -mx-8 -mt-8 mb-6">
                  Dados Cadastrais
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[#5b4b8a] font-semibold">Nome:</Label>
                    <Input defaultValue={patient.name} className="border-[#5b4b8a]/30" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#5b4b8a] font-semibold">Apelido:</Label>
                    <Input defaultValue={patient.lastName} className="border-[#5b4b8a]/30" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#5b4b8a] font-semibold">CPF:</Label>
                    <Input defaultValue={patient.cpf} className="border-[#5b4b8a]/30" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#5b4b8a] font-semibold">Data de Nascimento:</Label>
                    <Input type="date" defaultValue={patient.birthDate} className="border-[#5b4b8a]/30" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#5b4b8a] font-semibold">Estado Civil:</Label>
                    <Input defaultValue={patient.civilStatus} className="border-[#5b4b8a]/30" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#5b4b8a] font-semibold">Sexo:</Label>
                    <Input defaultValue={patient.gender} className="border-[#5b4b8a]/30" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#5b4b8a] font-semibold">Como Conheceu:</Label>
                    <Input defaultValue={patient.howKnew} className="border-[#5b4b8a]/30" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#5b4b8a] font-semibold">RG:</Label>
                    <Input defaultValue={patient.rg} className="border-[#5b4b8a]/30" />
                  </div>
                </div>

                {/* Navigation buttons at bottom */}
                <div className="flex justify-center gap-4 mt-8">
                  <Button className="bg-[#c9b888] hover:bg-[#b8a777] text-[#5b4b8a] font-semibold px-8 rounded-full">
                    Dados Cadastrais
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#5b4b8a] text-[#5b4b8a] font-semibold px-8 rounded-full bg-transparent"
                  >
                    Contato
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#5b4b8a] text-[#5b4b8a] font-semibold px-8 rounded-full bg-transparent"
                  >
                    Dados Complementares
                  </Button>
                </div>
              </div>
            }
            procedimentosContent={
              <div className="bg-white rounded-lg shadow-md p-8 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-[#5b4b8a] text-white rounded-lg px-6 py-4">
                    <p className="text-sm">Aprovado por Diovana</p>
                    <p className="text-3xl font-bold">R$12.847,75</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#5b4b8a] rounded-lg p-6 text-white space-y-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-lg">Cirurgia</h3>
                        <h3 className="font-bold text-lg">Protocolo</h3>
                        <p className="text-sm">Pedro Henrique Ribeiro Mota</p>
                      </div>
                      <div>
                        <p className="text-sm">Observações</p>
                      </div>
                    </div>
                    <div className="bg-green-700 text-white px-4 py-2 rounded inline-block">
                      <p className="text-sm font-semibold">Aprovado 15/10/2025</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-[#c9b888] rounded-lg p-6">
                      <div className="bg-green-700 text-white rounded p-4">
                        <p className="text-xs">CIRURGIA PROTOCOLO (1X)</p>
                        <p className="text-xs">Oris - Pedro Henrique Ribeiro Mota</p>
                        <p className="text-2xl font-bold mt-2">R$3.015,00</p>
                      </div>
                    </div>

                    <div className="bg-[#5b4b8a] rounded-lg p-6 text-white space-y-4">
                      <div>
                        <h4 className="font-semibold">Clínica:</h4>
                      </div>
                      <div>
                        <h4 className="font-semibold">Orçamento Criado por:</h4>
                      </div>
                      <div>
                        <h4 className="font-semibold">Data:</h4>
                      </div>
                      <div>
                        <h4 className="font-semibold">Observações:</h4>
                      </div>
                      <div>
                        <h4 className="font-semibold">Tabela:</h4>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#c9b888] rounded-lg p-6">
                    <div className="bg-green-700 text-white rounded p-4">
                      <p className="text-xs">PRORTESE PROTOCOLO (1X)</p>
                      <p className="text-xs">Oris - Pedro Henrique Ribeiro Mota</p>
                      <p className="text-2xl font-bold mt-2">R$12.100,00</p>
                    </div>
                  </div>

                  <div className="bg-green-700 text-white rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">Total</p>
                        <p className="text-sm">Particular:</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold">R$12.847,75</p>
                        <p className="text-sm">Boleto, Parcelado</p>
                        <p className="text-sm">Entrada e 24 Parcelas</p>
                        <Badge className="bg-red-500 text-white mt-2">(15% DESCONTO)</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            financeiroContent={
              <div className="bg-white rounded-lg shadow-md p-8 mt-6">
                <p className="text-[#5b4b8a] text-center">Módulo Financeiro em desenvolvimento</p>
              </div>
            }
            fotosContent={
              <div className="bg-white rounded-lg shadow-md p-8 mt-6">
                <p className="text-[#5b4b8a] text-center">Módulo de Fotos em desenvolvimento</p>
              </div>
            }
            contratosContent={
              <div className="bg-white rounded-lg shadow-md p-8 mt-6">
                <p className="text-[#5b4b8a] text-center">Módulo de Contratos em desenvolvimento</p>
              </div>
            }
            agendamentosContent={
              <div className="bg-white rounded-lg shadow-md p-8 mt-6">
                <h2 className="text-xl font-bold text-[#5b4b8a] mb-4">Histórico de Agendamentos</h2>
                <div className="space-y-3">
                  {patientAppointments.map((appointment) => {
                    const professional = mockProfessionals.find((p) => p.id === appointment.professionalId)
                    return (
                      <div key={appointment.id} className="border border-[#5b4b8a]/30 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-[#5b4b8a]">{professional?.name}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(appointment.date).toLocaleDateString("pt-BR")} - {appointment.startTime} às{" "}
                              {appointment.endTime}
                            </p>
                            <p className="text-sm text-gray-600">Tipo: {appointment.type}</p>
                          </div>
                          <Badge
                            className={
                              appointment.status === "confirmed" ? "bg-blue-500 text-white" : "bg-gray-400 text-white"
                            }
                          >
                            {appointment.status === "confirmed" ? "Confirmado" : "Agendado"}
                          </Badge>
                        </div>
                        {appointment.notes && (
                          <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">{appointment.notes}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            }
            anamneseContent={
              <div className="bg-white rounded-lg shadow-md p-8 mt-6">
                <p className="text-[#5b4b8a] text-center">Módulo de Anamnese em desenvolvimento</p>
              </div>
            }
          />
        </div>
      </main>

      <MainFooter />
    </div>
  )
}
