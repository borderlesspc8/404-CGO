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
import { localGetAppointments } from "@/lib/appointments-local"
import { mockProfessionals, type Appointment, type Patient } from "@/lib/mock-data"
import {
  getPatientRecords,
  savePatientRecords,
  calcTotals,
  fmtBRL,
  type Procedure,
  type Payment,
  type AnamneseGroup,
} from "@/lib/patient-records"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  AlertCircle,
  Calendar,
  Camera,
  ChevronLeft,
  Check,
  FileText,
  Home,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  Printer,
  Upload,
  UserRound,
} from "lucide-react"

const PROCEDURE_STATUS_LABELS = { scheduled: "Agendado", in_progress: "Em andamento", completed: "Concluído" }
const PROCEDURE_STATUS_STYLES = {
  scheduled: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
}
const APPOINTMENT_STATUS_LABELS: Record<Appointment["status"], string> = {
  scheduled: "Agendado", confirmed: "Confirmado", completed: "Atendido", cancelled: "Cancelado", noshow: "Faltou",
}
const APPOINTMENT_STATUS_STYLES: Record<Appointment["status"], string> = {
  scheduled: "bg-gray-100 text-gray-700", confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700", cancelled: "bg-red-100 text-red-700", noshow: "bg-orange-100 text-orange-700",
}
const PAYMENT_METHODS = ["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "PIX", "Boleto", "Transferência"]
const PROCEDURE_NAMES = [
  "Avaliação", "Consulta", "Limpeza e Profilaxia", "Extração", "Restauração",
  "Tratamento de Canal", "Implante", "Ortodontia", "Clareamento", "Prótese", "Cirurgia",
]

export default function PatientDetailPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const patientId = params?.id ? String(params.id) : ""

  const [patient, setPatient] = useState<Patient | null>(null)
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [anamnese, setAnamnese] = useState<AnamneseGroup[]>([])
  const [editingAnamnese, setEditingAnamnese] = useState(false)
  const [draftAnamnese, setDraftAnamnese] = useState<AnamneseGroup[]>([])
  const [showProcedureDialog, setShowProcedureDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [procForm, setProcForm] = useState({ name: "", professional: "", date: "", value: "", status: "scheduled" as Procedure["status"] })
  const [payForm, setPayForm] = useState({ date: "", desc: "", method: "PIX", value: "", status: "pending" as Payment["status"] })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.push("/"); return }
    if (isAuthenticated && patientId) {
      const p = findStoredPatient(patientId) ?? null
      setPatient(p)
      if (p) {
        const records = getPatientRecords(patientId)
        setProcedures(records.procedures)
        setPayments(records.payments)
        setAnamnese(records.anamnese)
      }
    }
  }, [isLoading, isAuthenticated, router, patientId])

  const patientAppointments = useMemo(
    () => patient
      ? localGetAppointments()
          .filter((a) => a.patientId === patient.id)
          .sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`))
      : [],
    [patient],
  )

  function persistRecords(next: { procedures?: Procedure[]; payments?: Payment[]; anamnese?: AnamneseGroup[] }) {
    if (!patient) return
    const current = getPatientRecords(patientId)
    savePatientRecords(patientId, { ...current, ...next })
  }

  function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !patient) return
    const reader = new FileReader()
    reader.onload = () => {
      const avatar = String(reader.result)
      const next = { ...patient, avatar }
      saveStoredPatients(getStoredPatients().map((p) => (p.id === patient.id ? next : p)))
      setPatient(next)
      toast({ title: "Foto atualizada" })
    }
    reader.readAsDataURL(file)
  }

  function handlePrint() { window.print() }

  function handleWhatsApp() {
    if (!patient?.phone) return
    const digits = patient.phone.replace(/\D/g, "")
    const number = digits.startsWith("55") ? digits : `55${digits}`
    window.open(`https://wa.me/${number}`, "_blank")
  }

  // ── Procedimentos ──────────────────────────────────────────────────────────
  function addProcedure() {
    if (!procForm.name || !procForm.date || !procForm.value) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" }); return
    }
    const proc: Procedure = {
      id: `proc_${Date.now()}`,
      name: procForm.name,
      professional: procForm.professional,
      date: procForm.date,
      value: Number(procForm.value),
      status: procForm.status,
    }
    const next = [proc, ...procedures]
    setProcedures(next)
    persistRecords({ procedures: next })
    setShowProcedureDialog(false)
    setProcForm({ name: "", professional: "", date: "", value: "", status: "scheduled" })
    toast({ title: "Procedimento adicionado" })
  }

  // ── Pagamentos ─────────────────────────────────────────────────────────────
  function addPayment() {
    if (!payForm.date || !payForm.desc || !payForm.value) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" }); return
    }
    const pay: Payment = {
      id: `pay_${Date.now()}`,
      date: payForm.date,
      desc: payForm.desc,
      method: payForm.method,
      value: Number(payForm.value),
      status: payForm.status,
    }
    const next = [...payments, pay]
    setPayments(next)
    persistRecords({ payments: next })
    setShowPaymentDialog(false)
    setPayForm({ date: "", desc: "", method: "PIX", value: "", status: "pending" })
    toast({ title: "Pagamento registrado" })
  }

  // ── Anamnese ───────────────────────────────────────────────────────────────
  function startEditAnamnese() { setDraftAnamnese(JSON.parse(JSON.stringify(anamnese))); setEditingAnamnese(true) }
  function saveAnamnese() {
    setAnamnese(draftAnamnese)
    persistRecords({ anamnese: draftAnamnese })
    setEditingAnamnese(false)
    toast({ title: "Anamnese salva" })
  }
  function setDraftAnswer(gi: number, ii: number, value: string) {
    const d = JSON.parse(JSON.stringify(draftAnamnese)) as AnamneseGroup[]
    d[gi].items[ii].answer = value
    setDraftAnamnese(d)
  }

  if (isLoading || !isAuthenticated) return null

  if (!patient) {
    return (
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <MainHeader />
          <main className="flex-1 bg-gray-50 overflow-auto">
            <div className="max-w-3xl mx-auto px-6 py-12 text-center">
              <UserRound className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h1 className="text-xl font-bold text-[#50348F]">Paciente não encontrado</h1>
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

  const fullName = `${patient.name} ${patient.lastName}`
  const initials = `${patient.name.charAt(0)}${patient.lastName.charAt(0)}`
  const addressLine = [patient.address.street, patient.address.number, patient.address.complement, patient.address.neighborhood].filter(Boolean).join(", ")
  const cityLine = [patient.address.city, patient.address.state, patient.address.zipCode].filter(Boolean).join(" - ")
  const { totalValue, paidValue, remaining } = calcTotals(procedures, payments)

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
              <ChevronLeft className="w-4 h-4" /> Voltar para Pacientes
            </button>

            {/* Header do paciente */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 mb-5 print:hidden">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-[#50348F]/20 shrink-0">
                      <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-[#50348F]/10 text-[#50348F] text-2xl font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <Label htmlFor="patient-avatar" className="absolute -right-2 -bottom-2 h-9 w-9 rounded-full bg-[#50348F] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#5D40A2]" title="Atualizar foto">
                      <Camera className="w-4 h-4" />
                    </Label>
                    <Input id="patient-avatar" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
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
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" />{patient.phone || "Não informado"}</span>
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{patient.email || "Sem e-mail"}</span>
                      <span className="flex items-center gap-1.5"><Home className="w-3.5 h-3.5 text-gray-400" />{cityLine || "Endereço não informado"}</span>
                    </div>
                    {patient.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />{patient.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="icon" className="text-[#50348F] border-[#50348F]/30 hover:bg-[#50348F]/5" title="Agendar consulta" onClick={() => router.push("/agenda")}>
                    <Calendar className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-[#50348F] border-[#50348F]/30 hover:bg-[#50348F]/5" title="Imprimir ficha" onClick={handlePrint}>
                    <Printer className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" title="Enviar WhatsApp" onClick={handleWhatsApp}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold ml-1" onClick={() => router.push("/pacientes")}>
                    <Plus className="w-4 h-4 mr-2" /> Novo Paciente
                  </Button>
                </div>
              </div>
            </section>

            {/* Tabs */}
            <PatientTabs
              cadastroContent={
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-[#50348F] px-6 py-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Cadastro e Perfil</h2>
                      <p className="text-white/70 text-sm">Dados pessoais, contato e endereço</p>
                    </div>
                    <Upload className="w-5 h-5 text-white/80" />
                  </div>
                  <div className="p-6 space-y-6">
                    <InfoSection title="Dados pessoais" items={[
                      ["Nome", patient.name], ["Sobrenome", patient.lastName], ["CPF", patient.cpf],
                      ["RG", patient.rg], ["Data de nascimento", formatDate(patient.birthDate)],
                      ["Sexo", patient.gender], ["Estado civil", patient.civilStatus], ["Como conheceu", patient.howKnew],
                    ]} />
                    <Separator />
                    <InfoSection title="Contato e endereço" items={[
                      ["Telefone", patient.phone], ["E-mail", patient.email],
                      ["Endereço", addressLine], ["Cidade/UF/CEP", cityLine],
                    ]} />
                  </div>
                </div>
              }

              procedimentosContent={
                <div className="space-y-4">
                  {/* Resumo financeiro */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Total Aprovado", value: fmtBRL(totalValue), sub: `${procedures.length} procedimento(s)`, bg: "bg-[#50348F]" },
                      { label: "Total Pago", value: fmtBRL(paidValue), sub: `${payments.filter(p => p.status === "paid").length} pagamento(s)`, bg: "bg-green-600" },
                      { label: "A Receber", value: fmtBRL(remaining), sub: "saldo devedor", bg: "bg-orange-500" },
                    ].map(({ label, value, sub, bg }) => (
                      <div key={label} className={`rounded-xl px-5 py-4 text-white ${bg}`}>
                        <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">{label}</p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                        <p className="text-xs opacity-70 mt-0.5">{sub}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <h2 className="font-semibold text-[#50348F]">Plano de Tratamento</h2>
                      <Button size="sm" className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold text-xs h-8" onClick={() => setShowProcedureDialog(true)}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
                      </Button>
                    </div>
                    {procedures.length === 0 ? (
                      <div className="py-14 text-center text-gray-400 text-sm">Nenhum procedimento cadastrado</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              {["Procedimento", "Profissional", "Data", "Valor", "Status"].map((h) => (
                                <th key={h} className={`py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wide ${h === "Valor" ? "text-right" : "text-left"}`}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {procedures.map((proc) => (
                              <tr key={proc.id} className="hover:bg-gray-50">
                                <td className="px-5 py-3.5 font-medium text-gray-800">{proc.name}</td>
                                <td className="px-5 py-3.5 text-gray-500">{proc.professional || "—"}</td>
                                <td className="px-5 py-3.5 text-gray-500">{formatDate(proc.date)}</td>
                                <td className="px-5 py-3.5 text-right font-semibold text-gray-800">{fmtBRL(proc.value)}</td>
                                <td className="px-5 py-3.5">
                                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${PROCEDURE_STATUS_STYLES[proc.status]}`}>
                                    {PROCEDURE_STATUS_LABELS[proc.status]}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              }

              financeiroContent={
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Total do Tratamento", value: fmtBRL(totalValue), sub: `${procedures.length} procedimento(s)`, color: "text-[#50348F]", bg: "bg-[#50348F]/5 border-[#50348F]/20" },
                      { label: "Total Pago", value: fmtBRL(paidValue), sub: `${payments.filter(p => p.status === "paid").length} pagamento(s) confirmado(s)`, color: "text-green-700", bg: "bg-green-50 border-green-200" },
                      { label: "Saldo Devedor", value: fmtBRL(remaining), sub: `${payments.filter(p => p.status === "pending").length} parcela(s) pendente(s)`, color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
                    ].map(({ label, value, sub, color, bg }) => (
                      <div key={label} className={`rounded-xl border px-5 py-4 ${bg}`}>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{label}</p>
                        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <h2 className="font-semibold text-[#50348F]">Histórico de Pagamentos</h2>
                      <Button size="sm" className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold text-xs h-8" onClick={() => setShowPaymentDialog(true)}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Lançar Pagamento
                      </Button>
                    </div>
                    {payments.length === 0 ? (
                      <div className="py-14 text-center text-gray-400 text-sm">Nenhum pagamento registrado</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              {["Data", "Descrição", "Forma", "Valor", "Status"].map((h) => (
                                <th key={h} className={`py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wide ${h === "Valor" ? "text-right" : "text-left"}`}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {payments.map((pay) => (
                              <tr key={pay.id} className="hover:bg-gray-50">
                                <td className="px-5 py-3.5 text-gray-500">{formatDate(pay.date)}</td>
                                <td className="px-5 py-3.5 font-medium text-gray-800">{pay.desc}</td>
                                <td className="px-5 py-3.5 text-gray-500">{pay.method}</td>
                                <td className="px-5 py-3.5 text-right font-semibold text-gray-800">{fmtBRL(pay.value)}</td>
                                <td className="px-5 py-3.5">
                                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${pay.status === "paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                                    {pay.status === "paid" ? "Pago" : "Pendente"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t-2 border-gray-200 bg-gray-50">
                              <td colSpan={3} className="px-5 py-3 text-sm font-bold text-gray-600">Total</td>
                              <td className="px-5 py-3 text-right font-bold text-[#50348F]">{fmtBRL(payments.reduce((s, p) => s + p.value, 0))}</td>
                              <td />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              }

              fotosContent={
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-[#50348F] mb-4">Fotos</h2>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24 border-4 border-[#50348F]/15">
                      <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-[#50348F]/10 text-[#50348F] text-2xl font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Foto de perfil</p>
                      <p className="text-sm text-gray-500 mt-1">Use o botão da câmera no cabeçalho para trocar a foto.</p>
                    </div>
                  </div>
                </div>
              }

              contratosContent={
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#50348F]">Contratos e Documentos</h2>
                    <Button size="sm" className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold text-xs h-8">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Novo Contrato
                    </Button>
                  </div>
                  <div className="p-5 space-y-3">
                    {[
                      { name: "Contrato de Tratamento", date: patient.registeredAt, signed: true },
                      { name: "Termo de Consentimento Informado", date: patient.registeredAt, signed: true },
                      { name: "Autorização de Uso de Imagem", date: patient.registeredAt, signed: false },
                    ].map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#50348F]/10 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-[#50348F]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                            <p className="text-xs text-gray-400">Emitido em {formatDate(doc.date)}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${doc.signed ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                          {doc.signed ? "Assinado" : "Pendente"}
                        </span>
                      </div>
                    ))}
                  </div>
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
                            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#50348F]/30 transition-colors">
                              <div className="flex justify-between items-start gap-4">
                                <div className="min-w-0">
                                  <p className="font-semibold text-[#50348F] text-sm">{professional?.name ?? "Profissional não informado"}</p>
                                  <p className="text-sm text-gray-500 mt-0.5">{formatDate(appointment.date)} — {appointment.startTime} até {appointment.endTime}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{appointment.type}</p>
                                </div>
                                <Badge className={`${APPOINTMENT_STATUS_STYLES[appointment.status]} hover:${APPOINTMENT_STATUS_STYLES[appointment.status]} shrink-0`}>
                                  {APPOINTMENT_STATUS_LABELS[appointment.status]}
                                </Badge>
                              </div>
                              {appointment.notes && (
                                <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">{appointment.notes}</p>
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
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                      <h2 className="font-semibold text-[#50348F]">Anamnese</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Questionário de saúde do paciente</p>
                    </div>
                    {editingAnamnese ? (
                      <Button size="sm" className="bg-[#50348F] hover:bg-[#50348F]/90 text-white text-xs h-8" onClick={saveAnamnese}>
                        <Check className="w-3.5 h-3.5 mr-1" /> Salvar
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="border-[#50348F]/30 text-[#50348F] text-xs h-8" onClick={startEditAnamnese}>
                        <Pencil className="w-3.5 h-3.5 mr-1" /> Editar
                      </Button>
                    )}
                  </div>
                  <div className="p-6 space-y-8">
                    {(editingAnamnese ? draftAnamnese : anamnese).map((group, gi) => (
                      <div key={group.group}>
                        <h3 className="text-sm font-bold text-[#50348F] mb-3">{group.group}</h3>
                        <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                          {group.items.map(({ question, answer }, ii) => (
                            <div key={question} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                              <p className="text-sm text-gray-600 flex-1 pr-4">{question}</p>
                              {editingAnamnese ? (
                                <Select value={draftAnamnese[gi].items[ii].answer} onValueChange={(v) => setDraftAnswer(gi, ii, v)}>
                                  <SelectTrigger className="w-36 h-8 text-sm border-[#50348F]/30">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {["Sim", "Não", "N/A"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className={`text-sm font-semibold shrink-0 ${answer === "Sim" ? "text-orange-600" : answer === "Não" ? "text-green-600" : "text-gray-400"}`}>
                                  {answer || "Não preenchido"}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }
            />
          </div>
        </main>
        <MainFooter />
      </div>

      {/* Dialog: Novo Procedimento */}
      <Dialog open={showProcedureDialog} onOpenChange={setShowProcedureDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-[#50348F]">Adicionar Procedimento</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-500">Procedimento *</Label>
              <Select value={procForm.name} onValueChange={(v) => setProcForm({ ...procForm, name: v })}>
                <SelectTrigger className="border-[#50348F]/30"><SelectValue placeholder="Selecione o procedimento" /></SelectTrigger>
                <SelectContent>{PROCEDURE_NAMES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-500">Profissional</Label>
              <Input value={procForm.professional} onChange={(e) => setProcForm({ ...procForm, professional: e.target.value })} placeholder="Nome do profissional" className="border-[#50348F]/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-500">Data *</Label>
                <Input type="date" value={procForm.date} onChange={(e) => setProcForm({ ...procForm, date: e.target.value })} className="border-[#50348F]/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-500">Valor (R$) *</Label>
                <Input type="number" min="0" step="0.01" value={procForm.value} onChange={(e) => setProcForm({ ...procForm, value: e.target.value })} placeholder="0,00" className="border-[#50348F]/30" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-500">Status</Label>
              <Select value={procForm.status} onValueChange={(v) => setProcForm({ ...procForm, status: v as Procedure["status"] })}>
                <SelectTrigger className="border-[#50348F]/30"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="in_progress">Em andamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProcedureDialog(false)}>Cancelar</Button>
            <Button className="bg-[#50348F] hover:bg-[#50348F]/90 text-white" onClick={addProcedure}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Lançar Pagamento */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-[#50348F]">Lançar Pagamento</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-500">Data *</Label>
                <Input type="date" value={payForm.date} onChange={(e) => setPayForm({ ...payForm, date: e.target.value })} className="border-[#50348F]/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-500">Valor (R$) *</Label>
                <Input type="number" min="0" step="0.01" value={payForm.value} onChange={(e) => setPayForm({ ...payForm, value: e.target.value })} placeholder="0,00" className="border-[#50348F]/30" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-500">Descrição *</Label>
              <Input value={payForm.desc} onChange={(e) => setPayForm({ ...payForm, desc: e.target.value })} placeholder="Ex: Parcela 1/10 - Aparelho" className="border-[#50348F]/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-500">Forma de Pagamento</Label>
                <Select value={payForm.method} onValueChange={(v) => setPayForm({ ...payForm, method: v })}>
                  <SelectTrigger className="border-[#50348F]/30"><SelectValue /></SelectTrigger>
                  <SelectContent>{PAYMENT_METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-500">Status</Label>
                <Select value={payForm.status} onValueChange={(v) => setPayForm({ ...payForm, status: v as Payment["status"] })}>
                  <SelectTrigger className="border-[#50348F]/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancelar</Button>
            <Button className="bg-[#50348F] hover:bg-[#50348F]/90 text-white" onClick={addPayment}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            <p className="text-sm font-medium text-gray-800 truncate">{value || "Não informado"}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function formatDate(value?: string) {
  if (!value) return ""
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}
