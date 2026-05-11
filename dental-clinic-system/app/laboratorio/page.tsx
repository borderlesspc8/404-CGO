"use client"

import { useState, useEffect } from "react"
import { MainHeader } from "@/components/main-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FlaskConical,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Wrench,
  Building2,
  Phone,
  Search,
  Pencil,
  Trash2,
  AlertTriangle,
  CalendarCheck,
  X,
} from "lucide-react"
import { toast } from "sonner"

// ─── Types ───────────────────────────────────────────────────────────────────

type LabStatus = "aguardando" | "em_producao" | "pronto" | "entregue" | "cancelado"
type EquipmentStatus = "operacional" | "manutencao" | "inativo"

interface LabOrder {
  id: string
  patient: string
  type: string
  lab: string
  requestedAt: string
  expectedAt: string
  status: LabStatus
  notes?: string
  value?: string
}

interface Equipment {
  id: string
  name: string
  category: string
  status: EquipmentStatus
  lastMaintenance: string
}

interface LabPartner {
  id: string
  name: string
  specialty: string
  phone: string
  email?: string
  deliveryDays: number
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const initialOrders: LabOrder[] = [
  { id: "LAB001", patient: "Ana Souza", type: "Coroa de Porcelana", lab: "LabDent SP", requestedAt: "2026-04-28", expectedAt: "2026-05-10", status: "em_producao", notes: "Cor A2", value: "450" },
  { id: "LAB002", patient: "Carlos Lima", type: "Prótese Total Superior", lab: "ProTech Dental", requestedAt: "2026-05-01", expectedAt: "2026-05-15", status: "aguardando", value: "1200" },
  { id: "LAB003", patient: "Mariana Rocha", type: "Faceta de Porcelana (4 unidades)", lab: "LabDent SP", requestedAt: "2026-04-20", expectedAt: "2026-05-05", status: "pronto", notes: "Aguardando retirada", value: "2800" },
  { id: "LAB004", patient: "João Pedro", type: "Placa de Bruxismo", lab: "OrthoLab", requestedAt: "2026-04-15", expectedAt: "2026-04-25", status: "entregue", value: "380" },
  { id: "LAB005", patient: "Fernanda Costa", type: "Ponte de 3 elementos", lab: "LabDent SP", requestedAt: "2026-05-03", expectedAt: "2026-05-18", status: "aguardando", value: "1800" },
]

const initialEquipment: Equipment[] = [
  { id: "EQ01", name: "Articulador Semi-Ajustável", category: "Prótese", status: "operacional", lastMaintenance: "2026-02-10" },
  { id: "EQ02", name: "Plastificadora a Vácuo", category: "Termoplástico", status: "operacional", lastMaintenance: "2026-01-15" },
  { id: "EQ03", name: "Micromotor Elétrico", category: "Acabamento", status: "manutencao", lastMaintenance: "2026-04-20" },
  { id: "EQ04", name: "Vibrador de Gesso", category: "Modelos", status: "operacional", lastMaintenance: "2026-03-05" },
  { id: "EQ05", name: "Fotopolimerizador LED", category: "Resina", status: "operacional", lastMaintenance: "2026-03-22" },
  { id: "EQ06", name: "Autoclave de Bancada", category: "Esterilização", status: "inativo", lastMaintenance: "2025-11-10" },
]

const initialPartners: LabPartner[] = [
  { id: "P1", name: "LabDent SP", specialty: "Próteses e Facetas", phone: "(11) 3333-4444", email: "contato@labdentsp.com.br", deliveryDays: 10 },
  { id: "P2", name: "ProTech Dental", specialty: "Próteses Totais e Parciais", phone: "(11) 4444-5555", email: "atendimento@protech.com.br", deliveryDays: 14 },
  { id: "P3", name: "OrthoLab", specialty: "Aparelhos e Placas Oclusais", phone: "(11) 5555-6666", deliveryDays: 7 },
]

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<LabStatus, { label: string; color: string; icon: React.ReactNode }> = {
  aguardando:  { label: "Aguardando",  color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <Clock className="w-3 h-3" /> },
  em_producao: { label: "Em Produção", color: "bg-blue-100 text-blue-800 border-blue-200",       icon: <Wrench className="w-3 h-3" /> },
  pronto:      { label: "Pronto",      color: "bg-green-100 text-green-800 border-green-200",     icon: <CheckCircle2 className="w-3 h-3" /> },
  entregue:    { label: "Entregue",    color: "bg-gray-100 text-gray-700 border-gray-200",        icon: <Truck className="w-3 h-3" /> },
  cancelado:   { label: "Cancelado",   color: "bg-red-100 text-red-800 border-red-200",           icon: <X className="w-3 h-3" /> },
}

const statusFlow: Record<LabStatus, LabStatus | null> = {
  aguardando: "em_producao",
  em_producao: "pronto",
  pronto: "entregue",
  entregue: null,
  cancelado: null,
}

const equipmentStatusConfig: Record<EquipmentStatus, { label: string; color: string }> = {
  operacional: { label: "Operacional", color: "bg-green-100 text-green-800" },
  manutencao:  { label: "Manutenção",  color: "bg-yellow-100 text-yellow-800" },
  inativo:     { label: "Inativo",     color: "bg-red-100 text-red-800" },
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

const KEYS = {
  orders: "cgo.lab.orders",
  equipment: "cgo.lab.equipment",
  partners: "cgo.lab.partners",
}

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(data))
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—"
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

function isOverdue(expectedAt: string, status: LabStatus) {
  if (status === "entregue" || status === "cancelado") return false
  return new Date(expectedAt) < new Date()
}

function generateOrderId(orders: LabOrder[]) {
  const nums = orders.map((o) => parseInt(o.id.replace("LAB", ""))).filter((n) => !isNaN(n))
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1
  return `LAB${String(next).padStart(3, "0")}`
}

// ─── Empty form defaults ──────────────────────────────────────────────────────

const emptyOrder = (): Omit<LabOrder, "id" | "requestedAt" | "status"> => ({
  patient: "", type: "", lab: "", expectedAt: "", notes: "", value: "",
})

const emptyEquipment = (): Omit<Equipment, "id"> => ({
  name: "", category: "", status: "operacional", lastMaintenance: new Date().toISOString().split("T")[0],
})

const emptyPartner = (): Omit<LabPartner, "id"> => ({
  name: "", specialty: "", phone: "", email: "", deliveryDays: 7,
})

// ─── Component ────────────────────────────────────────────────────────────────

export default function LaboratorioPage() {
  const [orders, setOrders] = useState<LabOrder[]>(initialOrders)
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment)
  const [partners, setPartners] = useState<LabPartner[]>(initialPartners)

  // Load from storage on mount
  useEffect(() => {
    setOrders(loadFromStorage(KEYS.orders, initialOrders))
    setEquipment(loadFromStorage(KEYS.equipment, initialEquipment))
    setPartners(loadFromStorage(KEYS.partners, initialPartners))
  }, [])

  // Persist on change
  useEffect(() => { saveToStorage(KEYS.orders, orders) }, [orders])
  useEffect(() => { saveToStorage(KEYS.equipment, equipment) }, [equipment])
  useEffect(() => { saveToStorage(KEYS.partners, partners) }, [partners])

  // ── Order state ──
  const [orderSearch, setOrderSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<LabStatus | "todos">("todos")
  const [orderDialog, setOrderDialog] = useState(false)
  const [editingOrder, setEditingOrder] = useState<LabOrder | null>(null)
  const [orderForm, setOrderForm] = useState(emptyOrder())
  const [detailOrder, setDetailOrder] = useState<LabOrder | null>(null)

  // ── Equipment state ──
  const [equipDialog, setEquipDialog] = useState(false)
  const [editingEquip, setEditingEquip] = useState<Equipment | null>(null)
  const [equipForm, setEquipForm] = useState(emptyEquipment())

  // ── Partner state ──
  const [partnerDialog, setPartnerDialog] = useState(false)
  const [editingPartner, setEditingPartner] = useState<LabPartner | null>(null)
  const [partnerForm, setPartnerForm] = useState(emptyPartner())

  // ── Summary counts ──
  const counts = {
    aguardando:  orders.filter((o) => o.status === "aguardando").length,
    em_producao: orders.filter((o) => o.status === "em_producao").length,
    pronto:      orders.filter((o) => o.status === "pronto").length,
    entregue:    orders.filter((o) => o.status === "entregue").length,
    atrasados:   orders.filter((o) => isOverdue(o.expectedAt, o.status)).length,
  }

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.patient.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.type.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.lab.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase())
    const matchStatus = statusFilter === "todos" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  // ── Order actions ──

  function openNewOrder() {
    setEditingOrder(null)
    setOrderForm(emptyOrder())
    setOrderDialog(true)
  }

  function openEditOrder(order: LabOrder) {
    setEditingOrder(order)
    setOrderForm({ patient: order.patient, type: order.type, lab: order.lab, expectedAt: order.expectedAt, notes: order.notes ?? "", value: order.value ?? "" })
    setDetailOrder(null)
    setOrderDialog(true)
  }

  function saveOrder() {
    if (!orderForm.patient || !orderForm.type || !orderForm.lab || !orderForm.expectedAt) {
      toast.error("Preencha todos os campos obrigatórios.")
      return
    }
    if (editingOrder) {
      setOrders((prev) => prev.map((o) => o.id === editingOrder.id ? { ...o, ...orderForm } : o))
      toast.success("Pedido atualizado com sucesso.")
    } else {
      const newOrder: LabOrder = {
        id: generateOrderId(orders),
        ...orderForm,
        requestedAt: new Date().toISOString().split("T")[0],
        status: "aguardando",
        notes: orderForm.notes || undefined,
        value: orderForm.value || undefined,
      }
      setOrders((prev) => [newOrder, ...prev])
      toast.success("Pedido criado com sucesso!")
    }
    setOrderDialog(false)
  }

  function advanceStatus(id: string) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const next = statusFlow[o.status]
        if (!next) return o
        toast.success(`Pedido ${id} → ${statusConfig[next].label}`)
        return { ...o, status: next }
      })
    )
  }

  function cancelOrder(id: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "cancelado" } : o))
    setDetailOrder(null)
    toast.success("Pedido cancelado.")
  }

  function deleteOrder(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id))
    setDetailOrder(null)
    toast.success("Pedido excluído.")
  }

  // ── Equipment actions ──

  function openNewEquip() {
    setEditingEquip(null)
    setEquipForm(emptyEquipment())
    setEquipDialog(true)
  }

  function openEditEquip(eq: Equipment) {
    setEditingEquip(eq)
    setEquipForm({ name: eq.name, category: eq.category, status: eq.status, lastMaintenance: eq.lastMaintenance })
    setEquipDialog(true)
  }

  function saveEquipment() {
    if (!equipForm.name || !equipForm.category) {
      toast.error("Preencha nome e categoria.")
      return
    }
    if (editingEquip) {
      setEquipment((prev) => prev.map((e) => e.id === editingEquip.id ? { ...e, ...equipForm } : e))
      toast.success("Equipamento atualizado.")
    } else {
      const id = `EQ${String(equipment.length + 1).padStart(2, "0")}`
      setEquipment((prev) => [...prev, { id, ...equipForm }])
      toast.success("Equipamento adicionado.")
    }
    setEquipDialog(false)
  }

  function deleteEquipment(id: string) {
    setEquipment((prev) => prev.filter((e) => e.id !== id))
    toast.success("Equipamento removido.")
  }

  function registerMaintenance(id: string) {
    const today = new Date().toISOString().split("T")[0]
    setEquipment((prev) =>
      prev.map((e) => e.id === id ? { ...e, lastMaintenance: today, status: "operacional" } : e)
    )
    toast.success("Manutenção registrada. Status → Operacional.")
  }

  // ── Partner actions ──

  function openNewPartner() {
    setEditingPartner(null)
    setPartnerForm(emptyPartner())
    setPartnerDialog(true)
  }

  function openEditPartner(p: LabPartner) {
    setEditingPartner(p)
    setPartnerForm({ name: p.name, specialty: p.specialty, phone: p.phone, email: p.email ?? "", deliveryDays: p.deliveryDays })
    setPartnerDialog(true)
  }

  function savePartner() {
    if (!partnerForm.name || !partnerForm.phone) {
      toast.error("Preencha nome e telefone.")
      return
    }
    if (editingPartner) {
      setPartners((prev) => prev.map((p) => p.id === editingPartner.id ? { ...p, ...partnerForm } : p))
      toast.success("Parceiro atualizado.")
    } else {
      const id = `P${Date.now()}`
      setPartners((prev) => [...prev, { id, ...partnerForm }])
      toast.success("Parceiro adicionado.")
    }
    setPartnerDialog(false)
  }

  function deletePartner(id: string) {
    setPartners((prev) => prev.filter((p) => p.id !== id))
    toast.success("Parceiro removido.")
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Page header */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#50348F] rounded-full text-white">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#50348F]">Laboratório</h1>
                <p className="text-sm text-muted-foreground">Pedidos, equipamentos e parceiros de laboratório</p>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Aguardando",  value: counts.aguardando,  color: "text-yellow-600", bg: "bg-yellow-50",  border: "border-yellow-200" },
                { label: "Em Produção", value: counts.em_producao, color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200" },
                { label: "Prontos",     value: counts.pronto,      color: "text-green-600",  bg: "bg-green-50",   border: "border-green-200" },
                { label: "Entregues",   value: counts.entregue,    color: "text-gray-600",   bg: "bg-gray-50",    border: "border-gray-200" },
                { label: "Atrasados",   value: counts.atrasados,   color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200" },
              ].map((s) => (
                <Card key={s.label} className={`${s.bg} border ${s.border}`}>
                  <CardContent className="p-4 text-center">
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pedidos">
              <TabsList className="bg-white border">
                <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
                <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
                <TabsTrigger value="parceiros">Parceiros</TabsTrigger>
              </TabsList>

              {/* ── PEDIDOS ── */}
              <TabsContent value="pedidos" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <CardTitle className="text-[#50348F]">Pedidos de Laboratório</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input className="pl-9 w-56" placeholder="Buscar..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} />
                        </div>
                        <Button className="bg-[#50348F] hover:bg-[#5D40A2] text-white" onClick={openNewOrder}>
                          <Plus className="w-4 h-4 mr-1" /> Novo
                        </Button>
                      </div>
                    </div>
                    {/* Status filter chips */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {([
                        { key: "todos",       label: "Todos" },
                        { key: "aguardando",  label: "Aguardando" },
                        { key: "em_producao", label: "Em Produção" },
                        { key: "pronto",      label: "Pronto" },
                        { key: "entregue",    label: "Entregue" },
                        { key: "cancelado",   label: "Cancelado" },
                      ] as { key: LabStatus | "todos"; label: string }[]).map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => setStatusFilter(key)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            statusFilter === key
                              ? "bg-[#50348F] text-white border-[#50348F]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#50348F] hover:text-[#50348F]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                            <th className="text-left py-2 pr-3">ID</th>
                            <th className="text-left py-2 pr-3">Paciente</th>
                            <th className="text-left py-2 pr-3">Tipo</th>
                            <th className="text-left py-2 pr-3">Laboratório</th>
                            <th className="text-left py-2 pr-3">Previsão</th>
                            <th className="text-left py-2 pr-3">Status</th>
                            <th className="text-left py-2">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order) => {
                            const s = statusConfig[order.status]
                            const overdue = isOverdue(order.expectedAt, order.status)
                            const canAdvance = order.status !== "entregue" && order.status !== "cancelado"
                            return (
                              <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => setDetailOrder(order)}>
                                <td className="py-3 pr-3 font-mono text-xs text-muted-foreground">{order.id}</td>
                                <td className="py-3 pr-3 font-medium whitespace-nowrap">{order.patient}</td>
                                <td className="py-3 pr-3 text-muted-foreground max-w-40 truncate">{order.type}</td>
                                <td className="py-3 pr-3 whitespace-nowrap">{order.lab}</td>
                                <td className="py-3 pr-3 whitespace-nowrap">
                                  <span className={overdue ? "text-red-600 font-semibold flex items-center gap-1" : ""}>
                                    {overdue && <AlertTriangle className="w-3 h-3" />}
                                    {formatDate(order.expectedAt)}
                                  </span>
                                </td>
                                <td className="py-3 pr-3">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border font-medium ${s.color}`}>
                                    {s.icon} {s.label}
                                  </span>
                                </td>
                                <td className="py-3" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center gap-1">
                                    {canAdvance && (
                                      <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => advanceStatus(order.id)}>
                                        Avançar
                                      </Button>
                                    )}
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-500" onClick={() => openEditOrder(order)}>
                                      <Pencil className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                          {filteredOrders.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-10 text-center text-muted-foreground">
                                Nenhum pedido encontrado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── EQUIPAMENTOS ── */}
              <TabsContent value="equipamentos" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-[#50348F]">
                        <Wrench className="w-5 h-5" />
                        Equipamentos
                      </CardTitle>
                      <Button className="bg-[#50348F] hover:bg-[#5D40A2] text-white" onClick={openNewEquip}>
                        <Plus className="w-4 h-4 mr-1" /> Adicionar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {equipment.map((eq) => {
                        const s = equipmentStatusConfig[eq.status]
                        return (
                          <div key={eq.id} className="flex items-center justify-between py-3 px-4 border rounded-lg hover:bg-muted/20 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{eq.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {eq.category} · Última manutenção: {formatDate(eq.lastMaintenance)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge className={`${s.color} border-0 text-xs whitespace-nowrap`}>{s.label}</Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs px-2 whitespace-nowrap"
                                onClick={() => registerMaintenance(eq.id)}
                                title="Registrar manutenção hoje"
                              >
                                <CalendarCheck className="w-3 h-3 mr-1" />
                                Manutenção
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-500" onClick={() => openEditEquip(eq)}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => deleteEquipment(eq.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                      {equipment.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">Nenhum equipamento cadastrado.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── PARCEIROS ── */}
              <TabsContent value="parceiros" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-[#50348F]">
                        <Building2 className="w-5 h-5" />
                        Parceiros de Laboratório
                      </CardTitle>
                      <Button className="bg-[#50348F] hover:bg-[#5D40A2] text-white" onClick={openNewPartner}>
                        <Plus className="w-4 h-4 mr-1" /> Adicionar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {partners.map((p) => (
                        <div key={p.id} className="border rounded-lg p-4 space-y-2 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between">
                            <p className="font-semibold text-sm">{p.name}</p>
                            <Badge variant="outline" className="text-xs whitespace-nowrap">{p.deliveryDays}d úteis</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{p.specialty}</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-[#50348F]">
                              <Phone className="w-3 h-3" />
                              {p.phone}
                            </div>
                            {p.email && (
                              <p className="text-xs text-muted-foreground pl-4">{p.email}</p>
                            )}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => openEditPartner(p)}>
                              <Pencil className="w-3 h-3 mr-1" /> Editar
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => deletePartner(p.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {partners.length === 0 && (
                        <p className="text-muted-foreground text-center col-span-3 py-8">Nenhum parceiro cadastrado.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* ── Dialog: Detalhes do Pedido ── */}
      <Dialog open={!!detailOrder} onOpenChange={(o) => !o && setDetailOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#50348F]">Pedido {detailOrder?.id}</DialogTitle>
          </DialogHeader>
          {detailOrder && (() => {
            const s = statusConfig[detailOrder.status]
            const overdue = isOverdue(detailOrder.expectedAt, detailOrder.status)
            const canAdvance = detailOrder.status !== "entregue" && detailOrder.status !== "cancelado"
            return (
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
                  {[
                    { label: "Paciente",   value: detailOrder.patient },
                    { label: "Tipo",       value: detailOrder.type },
                    { label: "Laboratório",value: detailOrder.lab },
                    { label: "Solicitado", value: formatDate(detailOrder.requestedAt) },
                    { label: "Previsão",   value: formatDate(detailOrder.expectedAt) },
                    ...(detailOrder.value ? [{ label: "Valor", value: `R$ ${parseFloat(detailOrder.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-2">
                      <span className="text-xs font-semibold text-gray-400 w-24 shrink-0 pt-0.5">{label}</span>
                      <span className="text-sm">{value}</span>
                    </div>
                  ))}
                  {overdue && (
                    <div className="flex items-center gap-1.5 text-red-600 text-xs font-medium pt-1 border-t">
                      <AlertTriangle className="w-3.5 h-3.5" /> Pedido em atraso
                    </div>
                  )}
                  {detailOrder.notes && (
                    <div className="pt-1 border-t text-xs text-muted-foreground">
                      <span className="font-semibold text-gray-500">Obs: </span>{detailOrder.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border font-medium ${s.color}`}>
                    {s.icon} {s.label}
                  </span>
                  {canAdvance && (
                    <Button size="sm" className="bg-[#50348F] hover:bg-[#5D40A2] text-white text-xs h-7"
                      onClick={() => { advanceStatus(detailOrder.id); setDetailOrder((prev) => prev ? { ...prev, status: statusFlow[prev.status] ?? prev.status } : prev) }}>
                      Avançar → {statusConfig[statusFlow[detailOrder.status]!]?.label}
                    </Button>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditOrder(detailOrder)}>
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Editar
                  </Button>
                  {detailOrder.status !== "cancelado" && detailOrder.status !== "entregue" && (
                    <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => cancelOrder(detailOrder.id)}>
                      <X className="w-3.5 h-3.5 mr-1" /> Cancelar
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteOrder(detailOrder.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Criar / Editar Pedido ── */}
      <Dialog open={orderDialog} onOpenChange={setOrderDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#50348F]">{editingOrder ? "Editar Pedido" : "Novo Pedido de Laboratório"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <Label>Paciente *</Label>
              <Input placeholder="Nome do paciente" value={orderForm.patient} onChange={(e) => setOrderForm({ ...orderForm, patient: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Tipo de Peça *</Label>
              <Input placeholder="Ex: Coroa de porcelana, Prótese total..." value={orderForm.type} onChange={(e) => setOrderForm({ ...orderForm, type: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Laboratório *</Label>
                <Select value={orderForm.lab} onValueChange={(v) => setOrderForm({ ...orderForm, lab: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((p) => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Valor (R$)</Label>
                <Input type="number" step="0.01" placeholder="0,00" value={orderForm.value} onChange={(e) => setOrderForm({ ...orderForm, value: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Previsão de Entrega *</Label>
              <Input type="date" value={orderForm.expectedAt} onChange={(e) => setOrderForm({ ...orderForm, expectedAt: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Observações</Label>
              <Textarea placeholder="Cor, tamanho, instruções especiais..." value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} rows={2} />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setOrderDialog(false)}>Cancelar</Button>
            <Button className="bg-[#50348F] hover:bg-[#5D40A2] text-white" onClick={saveOrder}>
              {editingOrder ? "Salvar" : "Criar Pedido"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Criar / Editar Equipamento ── */}
      <Dialog open={equipDialog} onOpenChange={setEquipDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#50348F]">{editingEquip ? "Editar Equipamento" : "Novo Equipamento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <Label>Nome *</Label>
              <Input placeholder="Nome do equipamento" value={equipForm.name} onChange={(e) => setEquipForm({ ...equipForm, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Categoria *</Label>
              <Input placeholder="Ex: Prótese, Esterilização..." value={equipForm.category} onChange={(e) => setEquipForm({ ...equipForm, category: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={equipForm.status} onValueChange={(v) => setEquipForm({ ...equipForm, status: v as EquipmentStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operacional">Operacional</SelectItem>
                  <SelectItem value="manutencao">Em Manutenção</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Última Manutenção</Label>
              <Input type="date" value={equipForm.lastMaintenance} onChange={(e) => setEquipForm({ ...equipForm, lastMaintenance: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setEquipDialog(false)}>Cancelar</Button>
            <Button className="bg-[#50348F] hover:bg-[#5D40A2] text-white" onClick={saveEquipment}>
              {editingEquip ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Criar / Editar Parceiro ── */}
      <Dialog open={partnerDialog} onOpenChange={setPartnerDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#50348F]">{editingPartner ? "Editar Parceiro" : "Novo Parceiro"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <Label>Nome *</Label>
              <Input placeholder="Nome do laboratório" value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Especialidade</Label>
              <Input placeholder="Ex: Próteses e Facetas" value={partnerForm.specialty} onChange={(e) => setPartnerForm({ ...partnerForm, specialty: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Telefone *</Label>
                <Input placeholder="(11) 9999-9999" value={partnerForm.phone} onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Prazo (dias úteis)</Label>
                <Input type="number" min={1} value={partnerForm.deliveryDays} onChange={(e) => setPartnerForm({ ...partnerForm, deliveryDays: parseInt(e.target.value) || 7 })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>E-mail</Label>
              <Input type="email" placeholder="contato@lab.com" value={partnerForm.email} onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setPartnerDialog(false)}>Cancelar</Button>
            <Button className="bg-[#50348F] hover:bg-[#5D40A2] text-white" onClick={savePartner}>
              {editingPartner ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
