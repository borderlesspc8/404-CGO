"use client"

import { useState } from "react"
import { MainHeader } from "@/components/main-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "lucide-react"
import { toast } from "sonner"

type LabStatus = "aguardando" | "em_producao" | "pronto" | "entregue" | "cancelado"

interface LabOrder {
  id: string
  patient: string
  type: string
  lab: string
  requestedAt: string
  expectedAt: string
  status: LabStatus
  notes?: string
}

interface Equipment {
  id: string
  name: string
  category: string
  status: "operacional" | "manutencao" | "inativo"
  lastMaintenance: string
}

interface LabPartner {
  id: string
  name: string
  specialty: string
  phone: string
  deliveryDays: number
}

const initialOrders: LabOrder[] = [
  { id: "LAB001", patient: "Ana Souza", type: "Coroa de Porcelana", lab: "LabDent SP", requestedAt: "2026-04-28", expectedAt: "2026-05-10", status: "em_producao", notes: "Cor A2" },
  { id: "LAB002", patient: "Carlos Lima", type: "Prótese Total Superior", lab: "ProTech Dental", requestedAt: "2026-05-01", expectedAt: "2026-05-15", status: "aguardando" },
  { id: "LAB003", patient: "Mariana Rocha", type: "Faceta de Porcelana (4 unidades)", lab: "LabDent SP", requestedAt: "2026-04-20", expectedAt: "2026-05-05", status: "pronto", notes: "Aguardando retirada" },
  { id: "LAB004", patient: "João Pedro", type: "Placa de Bruxismo", lab: "OrthoLab", requestedAt: "2026-04-15", expectedAt: "2026-04-25", status: "entregue" },
  { id: "LAB005", patient: "Fernanda Costa", type: "Ponte de 3 elementos", lab: "LabDent SP", requestedAt: "2026-05-03", expectedAt: "2026-05-18", status: "aguardando" },
]

const initialEquipment: Equipment[] = [
  { id: "EQ01", name: "Articulador Semi-Ajustável", category: "Prótese", status: "operacional", lastMaintenance: "2026-02-10" },
  { id: "EQ02", name: "Plastificadora a Vácuo", category: "Termoplástico", status: "operacional", lastMaintenance: "2026-01-15" },
  { id: "EQ03", name: "Micromotor Elétrico", category: "Acabamento", status: "manutencao", lastMaintenance: "2026-04-20" },
  { id: "EQ04", name: "Vibrador de Gesso", category: "Modelos", status: "operacional", lastMaintenance: "2026-03-05" },
  { id: "EQ05", name: "Fotopolimerizador LED", category: "Resina", status: "operacional", lastMaintenance: "2026-03-22" },
  { id: "EQ06", name: "Autoclave de Bancada", category: "Esterilização", status: "inativo", lastMaintenance: "2025-11-10" },
]

const labPartners: LabPartner[] = [
  { id: "P1", name: "LabDent SP", specialty: "Próteses e Facetas", phone: "(11) 3333-4444", deliveryDays: 10 },
  { id: "P2", name: "ProTech Dental", specialty: "Próteses Totais e Parciais", phone: "(11) 4444-5555", deliveryDays: 14 },
  { id: "P3", name: "OrthoLab", specialty: "Aparelhos e Placas Oclusais", phone: "(11) 5555-6666", deliveryDays: 7 },
]

const statusConfig: Record<LabStatus, { label: string; color: string; icon: React.ReactNode }> = {
  aguardando:   { label: "Aguardando", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <Clock className="w-3 h-3" /> },
  em_producao:  { label: "Em Produção", color: "bg-blue-100 text-blue-800 border-blue-200",   icon: <Wrench className="w-3 h-3" /> },
  pronto:       { label: "Pronto",     color: "bg-green-100 text-green-800 border-green-200",  icon: <CheckCircle2 className="w-3 h-3" /> },
  entregue:     { label: "Entregue",   color: "bg-gray-100 text-gray-700 border-gray-200",     icon: <Truck className="w-3 h-3" /> },
  cancelado:    { label: "Cancelado",  color: "bg-red-100 text-red-800 border-red-200",        icon: <AlertCircle className="w-3 h-3" /> },
}

const equipmentStatusConfig = {
  operacional: { label: "Operacional", color: "bg-green-100 text-green-800" },
  manutencao:  { label: "Manutenção",  color: "bg-yellow-100 text-yellow-800" },
  inativo:     { label: "Inativo",     color: "bg-red-100 text-red-800" },
}

export default function LaboratorioPage() {
  const [orders, setOrders] = useState<LabOrder[]>(initialOrders)
  const [search, setSearch] = useState("")
  const [newOrderOpen, setNewOrderOpen] = useState(false)
  const [newOrder, setNewOrder] = useState({ patient: "", type: "", lab: "", expectedAt: "", notes: "" })

  const filtered = orders.filter(
    (o) =>
      o.patient.toLowerCase().includes(search.toLowerCase()) ||
      o.type.toLowerCase().includes(search.toLowerCase()) ||
      o.lab.toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    aguardando: orders.filter((o) => o.status === "aguardando").length,
    em_producao: orders.filter((o) => o.status === "em_producao").length,
    pronto: orders.filter((o) => o.status === "pronto").length,
    entregue: orders.filter((o) => o.status === "entregue").length,
  }

  function addOrder() {
    if (!newOrder.patient || !newOrder.type || !newOrder.lab || !newOrder.expectedAt) {
      toast.error("Preencha todos os campos obrigatórios.")
      return
    }
    const order: LabOrder = {
      id: `LAB${String(orders.length + 1).padStart(3, "0")}`,
      patient: newOrder.patient,
      type: newOrder.type,
      lab: newOrder.lab,
      requestedAt: new Date().toISOString().split("T")[0],
      expectedAt: newOrder.expectedAt,
      status: "aguardando",
      notes: newOrder.notes || undefined,
    }
    setOrders((prev) => [order, ...prev])
    setNewOrder({ patient: "", type: "", lab: "", expectedAt: "", notes: "" })
    setNewOrderOpen(false)
    toast.success("Pedido de laboratório criado com sucesso!")
  }

  function advanceStatus(id: string) {
    const flow: Record<LabStatus, LabStatus | null> = {
      aguardando: "em_producao",
      em_producao: "pronto",
      pronto: "entregue",
      entregue: null,
      cancelado: null,
    }
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const next = flow[o.status]
        if (!next) return o
        toast.success(`Pedido ${id} atualizado para "${statusConfig[next].label}"`)
        return { ...o, status: next }
      })
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#50348F] rounded-full text-white">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#50348F]">Laboratório</h1>
                <p className="text-sm text-muted-foreground">Pedidos, equipamentos e parceiros de laboratório</p>
              </div>
            </div>
            <Dialog open={newOrderOpen} onOpenChange={setNewOrderOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#50348F] hover:bg-[#5D40A2] text-white flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Pedido
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-[#50348F]">Novo Pedido de Laboratório</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label>Paciente *</Label>
                    <Input placeholder="Nome do paciente" value={newOrder.patient} onChange={(e) => setNewOrder({ ...newOrder, patient: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Tipo de Peça *</Label>
                    <Input placeholder="Ex: Coroa de porcelana, Prótese total..." value={newOrder.type} onChange={(e) => setNewOrder({ ...newOrder, type: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Laboratório *</Label>
                    <select
                      className="w-full border border-input rounded-md px-3 py-2 text-sm"
                      value={newOrder.lab}
                      onChange={(e) => setNewOrder({ ...newOrder, lab: e.target.value })}
                    >
                      <option value="">Selecione o laboratório</option>
                      {labPartners.map((p) => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Previsão de Entrega *</Label>
                    <Input type="date" value={newOrder.expectedAt} onChange={(e) => setNewOrder({ ...newOrder, expectedAt: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Observações</Label>
                    <Input placeholder="Cor, tamanho, instruções especiais..." value={newOrder.notes} onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })} />
                  </div>
                  <Button className="w-full bg-[#50348F] hover:bg-[#5D40A2] text-white" onClick={addOrder}>
                    Criar Pedido
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Aguardando", value: counts.aguardando, color: "text-yellow-600", bg: "bg-yellow-50" },
              { label: "Em Produção", value: counts.em_producao, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Prontos", value: counts.pronto, color: "text-green-600", bg: "bg-green-50" },
              { label: "Entregues", value: counts.entregue, color: "text-gray-600", bg: "bg-gray-50" },
            ].map((stat) => (
              <Card key={stat.label} className={stat.bg}>
                <CardContent className="p-4 text-center">
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#50348F]">Pedidos de Laboratório</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Buscar pedido..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-2 pr-4">ID</th>
                      <th className="text-left py-2 pr-4">Paciente</th>
                      <th className="text-left py-2 pr-4">Tipo</th>
                      <th className="text-left py-2 pr-4">Laboratório</th>
                      <th className="text-left py-2 pr-4">Previsão</th>
                      <th className="text-left py-2 pr-4">Status</th>
                      <th className="text-left py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order) => {
                      const s = statusConfig[order.status]
                      const canAdvance = order.status !== "entregue" && order.status !== "cancelado"
                      return (
                        <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{order.id}</td>
                          <td className="py-3 pr-4 font-medium">{order.patient}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{order.type}</td>
                          <td className="py-3 pr-4">{order.lab}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{order.expectedAt}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border font-medium ${s.color}`}>
                              {s.icon} {s.label}
                            </span>
                          </td>
                          <td className="py-3">
                            {canAdvance && (
                              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => advanceStatus(order.id)}>
                                Avançar
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted-foreground">Nenhum pedido encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Equipment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#50348F]">
                  <Wrench className="w-5 h-5" />
                  Equipamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {initialEquipment.map((eq) => {
                  const s = equipmentStatusConfig[eq.status]
                  return (
                    <div key={eq.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium text-sm">{eq.name}</p>
                        <p className="text-xs text-muted-foreground">{eq.category} · Manutenção: {eq.lastMaintenance}</p>
                      </div>
                      <Badge className={`${s.color} border-0 text-xs`}>{s.label}</Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Partners */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#50348F]">
                  <Building2 className="w-5 h-5" />
                  Parceiros de Laboratório
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {labPartners.map((p) => (
                  <div key={p.id} className="border rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{p.name}</p>
                      <Badge variant="outline" className="text-xs">{p.deliveryDays} dias úteis</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.specialty}</p>
                    <div className="flex items-center gap-1 text-xs text-[#50348F]">
                      <Phone className="w-3 h-3" />
                      {p.phone}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          </div>{/* /max-w-5xl */}
        </main>
      </div>
    </div>
  )
}
