"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { AppSidebar } from "@/components/app-sidebar"
import { NewAppointmentDialog } from "@/components/new-appointment-dialog"
import { mockPatients, mockAppointments, mockProfessionals } from "@/lib/mock-data"
import { AppointmentStatusBadge } from "@/components/appointment-status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Camera,
  Plus,
  Pencil,
  Check,
  ChevronRight,
  AlertCircle,
} from "lucide-react"

const SECTIONS = [
  { id: "cadastro", label: "Cadastro" },
  { id: "procedimentos", label: "Procedimentos" },
  { id: "financeiro", label: "Financeiro" },
  { id: "fotos", label: "Fotos" },
  { id: "contratos", label: "Contratos" },
  { id: "agendamentos", label: "Agendamentos" },
  { id: "anamnese", label: "Anamnese" },
]

const MOCK_PROCEDURES = [
  {
    id: "1",
    name: "Avaliação Ortodôntica",
    professional: "Alaor Pasian Júnior",
    date: "15/10/2025",
    value: 250.0,
    status: "completed",
  },
  {
    id: "2",
    name: "Aparelho Metálico Completo",
    professional: "Alaor Pasian Júnior",
    date: "01/11/2025",
    value: 4800.0,
    status: "in_progress",
  },
  {
    id: "3",
    name: "Limpeza e Profilaxia",
    professional: "Bruna Acialdi Previatto",
    date: "17/11/2025",
    value: 180.0,
    status: "scheduled",
  },
]

const MOCK_PAYMENTS = [
  { id: "1", date: "10/01/2025", desc: "Entrada – Aparelho", method: "Cartão", value: 1200.0, status: "paid" },
  { id: "2", date: "10/02/2025", desc: "Parcela 1/10", method: "Boleto", value: 360.0, status: "paid" },
  { id: "3", date: "10/03/2025", desc: "Parcela 2/10", method: "Boleto", value: 360.0, status: "paid" },
  { id: "4", date: "10/04/2025", desc: "Parcela 3/10", method: "Boleto", value: 360.0, status: "pending" },
]

const ANAMNESE_GROUPS = [
  {
    group: "Condições de Saúde",
    items: [
      { q: "É diabético(a)?", a: "Não" },
      { q: "Tem hipertensão?", a: "Não" },
      { q: "Tem problemas cardíacos?", a: "Não" },
      { q: "Tem alergia a algum medicamento?", a: "Não" },
      { q: "Está grávida ou amamentando?", a: "N/A" },
      { q: "Faz uso contínuo de algum medicamento?", a: "Não" },
    ],
  },
  {
    group: "Saúde Bucal",
    items: [
      { q: "Tem sensibilidade dental?", a: "Sim" },
      { q: "Range os dentes (bruxismo)?", a: "Não" },
      { q: "Tem sangramento nas gengivas?", a: "Não" },
      { q: "Já realizou tratamento ortodôntico?", a: "Sim – 6 meses com aparelho metálico" },
    ],
  },
]

function fmt(v: number) {
  return `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
}

export default function PerfilPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("cadastro")
  const [editMode, setEditMode] = useState(false)
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)
  const [cpfChecked, setCpfChecked] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/")
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) return null

  const patient = mockPatients[0]
  const patientAppointments = mockAppointments.filter((a) => a.patientId === patient.id)
  const initials = `${patient.name[0]}${patient.lastName[0]}`
  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear()

  const totalValue = MOCK_PROCEDURES.reduce((s, p) => s + p.value, 0)
  const paidValue = MOCK_PAYMENTS.filter((p) => p.status === "paid").reduce((s, p) => s + p.value, 0)
  const remaining = totalValue - paidValue

  function handleConsultCpf() {
    setCpfChecked(true)
    toast({
      title: "CPF consultado",
      description: `CPF ${patient.cpf} sem restricoes registradas.`,
    })
  }

  function handleReturnAlert() {
    setActiveTab("agendamentos")
    toast({
      title: "Alerta de retorno",
      description: "Historico de agendamentos aberto para definir o proximo retorno.",
    })
  }

  function handleSchedule() {
    setActiveTab("agendamentos")
    setShowAppointmentDialog(true)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MainHeader />

        <main className="flex-1 bg-gray-50 overflow-auto flex flex-col">
          {/* ── Sticky patient header ── */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm shrink-0">
            <div className="max-w-6xl mx-auto px-6">
              {/* Row: avatar + info + actions */}
              <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 shrink-0">
                    <AvatarFallback className="bg-[#50348F]/10 text-[#50348F] font-bold text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-lg font-bold text-[#50348F]">
                        {patient.name.toUpperCase()} {patient.lastName.toUpperCase()}
                      </h1>
                      <span className="text-sm text-gray-400 font-normal">#{patient.id}</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-semibold">
                        Ativo
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {patient.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {patient.email}
                      </span>
                      <span>
                        {age} anos · {patient.gender} · {patient.civilStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#50348F]/30 text-[#50348F] text-xs h-8"
                    onClick={handleConsultCpf}
                  >
                    {cpfChecked ? "CPF consultado" : "Consultar CPF"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-200 bg-yellow-50 text-yellow-800 text-xs h-8"
                    onClick={handleReturnAlert}
                  >
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Alerta de retorno
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold text-xs h-8"
                    onClick={handleSchedule}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Agendar
                  </Button>
                </div>
              </div>

              {/* Tab navigation */}
              <div className="flex gap-0 overflow-x-auto">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveTab(s.id)}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                      activeTab === s.id
                        ? "border-[#50348F] text-[#50348F]"
                        : "border-transparent text-gray-500 hover:text-[#50348F] hover:border-gray-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section content ── */}
          <div className="max-w-6xl mx-auto w-full px-6 py-6 space-y-5 flex-1">
            {/* ═══ CADASTRO ═══ */}
            {activeTab === "cadastro" && (
              <div className="space-y-5">
                {/* Personal data */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#50348F]">Dados Pessoais</h2>
                    <Button
                      size="sm"
                      onClick={() => setEditMode(!editMode)}
                      className={
                        editMode
                          ? "bg-[#50348F] hover:bg-[#50348F]/90 text-white text-xs h-8"
                          : "border border-[#50348F]/30 bg-white text-[#50348F] hover:bg-[#50348F]/5 text-xs h-8"
                      }
                    >
                      {editMode ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1" /> Salvar
                        </>
                      ) : (
                        <>
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Editar
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-5">
                    {[
                      { label: "Nome", value: patient.name },
                      { label: "Sobrenome", value: patient.lastName },
                      { label: "CPF", value: patient.cpf },
                      { label: "RG", value: patient.rg },
                      { label: "Data de Nascimento", value: patient.birthDate },
                      { label: "Gênero", value: patient.gender },
                      { label: "Estado Civil", value: patient.civilStatus },
                      { label: "Como nos Conheceu", value: patient.howKnew },
                      { label: "Nº Prontuário", value: `#${patient.id}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="space-y-1">
                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {label}
                        </Label>
                        {editMode ? (
                          <Input defaultValue={value} className="h-8 text-sm border-[#50348F]/30" />
                        ) : (
                          <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact + Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                      <Phone className="w-4 h-4 text-[#50348F]" />
                      <h2 className="font-semibold text-[#50348F]">Contato</h2>
                    </div>
                    <div className="p-6 space-y-4">
                      {[
                        { label: "Celular", value: patient.phone },
                        { label: "Email", value: patient.email },
                        { label: "Fone Fixo", value: "" },
                        { label: "Outros Telefones", value: "" },
                      ].map(({ label, value }) => (
                        <div key={label} className="space-y-1">
                          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {label}
                          </Label>
                          {editMode ? (
                            <Input defaultValue={value} className="h-8 text-sm border-[#50348F]/30" />
                          ) : (
                            <p className="text-sm font-medium text-gray-800">
                              {value || <span className="text-gray-300">Não informado</span>}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                      <MapPin className="w-4 h-4 text-[#50348F]" />
                      <h2 className="font-semibold text-[#50348F]">Endereço</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-4">
                      {[
                        { label: "CEP", value: patient.address.zipCode },
                        { label: "Cidade", value: patient.address.city },
                        { label: "Estado", value: patient.address.state },
                        { label: "Logradouro", value: patient.address.street },
                        { label: "Número", value: patient.address.number },
                        { label: "Bairro", value: patient.address.neighborhood },
                        { label: "Complemento", value: patient.address.complement ?? "" },
                      ].map(({ label, value }) => (
                        <div key={label} className="space-y-1">
                          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {label}
                          </Label>
                          {editMode ? (
                            <Input defaultValue={value} className="h-8 text-sm border-[#50348F]/30" />
                          ) : (
                            <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {patient.notes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                        Observações
                      </p>
                      <p className="text-sm text-amber-900">{patient.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══ PROCEDIMENTOS ═══ */}
            {activeTab === "procedimentos" && (
              <div className="space-y-5">
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Aprovado", value: fmt(totalValue), sub: `${MOCK_PROCEDURES.length} procedimentos`, bg: "bg-[#50348F]", text: "text-white" },
                    { label: "Total Pago", value: fmt(paidValue), sub: `${MOCK_PAYMENTS.filter((p) => p.status === "paid").length} pagamentos`, bg: "bg-green-600", text: "text-white" },
                    { label: "A Receber", value: fmt(remaining), sub: "saldo devedor", bg: "bg-orange-500", text: "text-white" },
                  ].map(({ label, value, sub, bg, text }) => (
                    <div key={label} className={`rounded-2xl px-6 py-5 shadow-sm ${bg} ${text}`}>
                      <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">{label}</p>
                      <p className="text-2xl font-bold mt-1">{value}</p>
                      <p className="text-xs opacity-70 mt-0.5">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Procedures table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#50348F]">Plano de Tratamento</h2>
                    <Button
                      size="sm"
                      className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold text-xs h-8"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {["Procedimento", "Profissional", "Data", "Valor", "Status"].map((h) => (
                            <th
                              key={h}
                              className={`py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wide ${h === "Valor" ? "text-right" : "text-left"}`}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {MOCK_PROCEDURES.map((proc) => (
                          <tr key={proc.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-gray-800">{proc.name}</td>
                            <td className="px-5 py-3.5 text-gray-500">{proc.professional}</td>
                            <td className="px-5 py-3.5 text-gray-500">{proc.date}</td>
                            <td className="px-5 py-3.5 text-right font-semibold text-gray-800">
                              {fmt(proc.value)}
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  proc.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : proc.status === "in_progress"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {proc.status === "completed"
                                  ? "Concluído"
                                  : proc.status === "in_progress"
                                    ? "Em andamento"
                                    : "Agendado"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ FINANCEIRO ═══ */}
            {activeTab === "financeiro" && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Total do Tratamento",
                      value: fmt(totalValue),
                      sub: `${MOCK_PROCEDURES.length} procedimentos`,
                      color: "text-[#50348F]",
                      bg: "bg-[#50348F]/5 border-[#50348F]/20",
                    },
                    {
                      label: "Total Pago",
                      value: fmt(paidValue),
                      sub: `${MOCK_PAYMENTS.filter((p) => p.status === "paid").length} pagamentos confirmados`,
                      color: "text-green-700",
                      bg: "bg-green-50 border-green-200",
                    },
                    {
                      label: "Saldo Devedor",
                      value: fmt(remaining),
                      sub: `${MOCK_PAYMENTS.filter((p) => p.status === "pending").length} parcela pendente`,
                      color: "text-orange-700",
                      bg: "bg-orange-50 border-orange-200",
                    },
                  ].map(({ label, value, sub, color, bg }) => (
                    <div key={label} className={`rounded-2xl border px-6 py-5 ${bg}`}>
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{label}</p>
                      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#50348F]">Histórico de Pagamentos</h2>
                    <Button
                      size="sm"
                      className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold text-xs h-8"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Lançar Pagamento
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {["Data", "Descrição", "Forma", "Valor", "Status"].map((h) => (
                            <th
                              key={h}
                              className={`py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wide ${h === "Valor" ? "text-right" : "text-left"}`}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {MOCK_PAYMENTS.map((pay) => (
                          <tr key={pay.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3.5 text-gray-500">{pay.date}</td>
                            <td className="px-5 py-3.5 font-medium text-gray-800">{pay.desc}</td>
                            <td className="px-5 py-3.5 text-gray-500">{pay.method}</td>
                            <td className="px-5 py-3.5 text-right font-semibold text-gray-800">
                              {fmt(pay.value)}
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  pay.status === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {pay.status === "paid" ? "Pago" : "Pendente"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-200 bg-gray-50">
                          <td colSpan={3} className="px-5 py-3 text-sm font-bold text-gray-600">
                            Total
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-[#50348F]">
                            {fmt(MOCK_PAYMENTS.reduce((s, p) => s + p.value, 0))}
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ FOTOS ═══ */}
            {activeTab === "fotos" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-[#50348F]">Galeria de Fotos</h2>
                  <Button
                    size="sm"
                    className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold text-xs h-8"
                  >
                    <Camera className="w-3.5 h-3.5 mr-1" /> Adicionar Fotos
                  </Button>
                </div>
                <div className="p-8">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold text-gray-400">Nenhuma foto cadastrada</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Arraste arquivos aqui ou clique em "Adicionar Fotos"
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4 border-[#50348F]/30 text-[#50348F] text-xs"
                    >
                      Selecionar arquivos
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ CONTRATOS ═══ */}
            {activeTab === "contratos" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-[#50348F]">Contratos e Documentos</h2>
                  <Button
                    size="sm"
                    className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold text-xs h-8"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Novo Contrato
                  </Button>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    {
                      name: "Contrato de Tratamento Ortodôntico",
                      date: "10/01/2025",
                      signed: true,
                    },
                    { name: "Termo de Consentimento Informado", date: "10/01/2025", signed: true },
                    { name: "Autorização de Uso de Imagem", date: "10/01/2025", signed: false },
                  ].map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#50348F]/8 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-[#50348F]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                          <p className="text-xs text-gray-400">Emitido em {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            doc.signed
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {doc.signed ? "Assinado" : "Pendente"}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#50348F] text-xs h-8 px-3"
                        >
                          Ver <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ AGENDAMENTOS ═══ */}
            {activeTab === "agendamentos" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-[#50348F]">Histórico de Agendamentos</h2>
                  <Button
                    size="sm"
                    className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold text-xs h-8"
                    onClick={handleSchedule}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Agendar
                  </Button>
                </div>

                {patientAppointments.length === 0 ? (
                  <div className="py-20 text-center">
                    <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Nenhum agendamento registrado</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {["Data", "Horário", "Profissional", "Procedimento", "Status"].map((h) => (
                            <th
                              key={h}
                              className="text-left py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wide"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {patientAppointments.map((apt) => {
                          const prof = mockProfessionals.find((p) => p.id === apt.professionalId)
                          const [y, m, d] = apt.date.split("-")
                          return (
                            <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-3.5 text-gray-600">{`${d}/${m}/${y}`}</td>
                              <td className="px-5 py-3.5 text-gray-600 tabular-nums">
                                {apt.startTime}–{apt.endTime}
                              </td>
                              <td className="px-5 py-3.5">
                                {prof ? (
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className="w-2 h-2 rounded-full shrink-0"
                                      style={{ backgroundColor: prof.color }}
                                    />
                                    <span className="text-gray-700">{prof.name}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-5 py-3.5 font-medium text-gray-800">{apt.type}</td>
                              <td className="px-5 py-3.5">
                                <AppointmentStatusBadge status={apt.status} />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ═══ ANAMNESE ═══ */}
            {activeTab === "anamnese" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div>
                    <h2 className="font-semibold text-[#50348F]">Anamnese</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Última atualização: 15/10/2025</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#50348F]/30 text-[#50348F] text-xs h-8"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Editar
                  </Button>
                </div>

                <div className="p-6 space-y-8">
                  {ANAMNESE_GROUPS.map(({ group, items }) => (
                    <div key={group}>
                      <h3 className="text-sm font-bold text-[#50348F] mb-3">{group}</h3>
                      <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                        {items.map(({ q, a }) => (
                          <div
                            key={q}
                            className="flex items-start justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <p className="text-sm text-gray-600 flex-1 pr-6">{q}</p>
                            <span
                              className={`text-sm font-semibold shrink-0 ${
                                a === "Sim"
                                  ? "text-orange-600"
                                  : a === "Não"
                                    ? "text-green-600"
                                    : "text-gray-400"
                              }`}
                            >
                              {a}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <MainFooter />
      </div>

      <NewAppointmentDialog
        open={showAppointmentDialog}
        onOpenChange={setShowAppointmentDialog}
        selectedDate={new Date()}
        defaultPatientId={patient.id}
        appointmentToEdit={undefined}
        appointments={mockAppointments}
        onAppointmentCreated={() => {
          toast({
            title: "Agendamento enviado",
            description: "O novo agendamento foi processado pela agenda.",
          })
        }}
      />
    </div>
  )
}
