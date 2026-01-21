"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, DollarSign, Target, CheckCircle, LayoutGrid, LayoutList } from "lucide-react"
import {
  ReportsFilter,
  FilterState,
} from "@/components/reports-filter"
import {
  ReportsTable,
  SalesOpportunity,
} from "@/components/reports-table"
import { ReportsActions } from "@/components/reports-actions"
import { OpportunityDetails } from "@/components/opportunity-details"
import { ReportCharts } from "@/components/report-charts"
import { SalesAnalytics } from "@/components/sales-analytics"
import { EditOpportunityDialog } from "@/components/edit-opportunity-dialog"
import { SalesPipelineKanban } from "@/components/sales-pipeline-kanban"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// Mock data com oportunidades de venda
const mockOpportunities: SalesOpportunity[] = [
  {
    id: "1",
    date: "2026-01-10",
    patient: "Ana Paula Silva",
    email: "ana.silva@email.com",
    phone: "(11) 98765-4321",
    type: "Implante",
    description: "Implante dentário - dente 36",
    value: 3500.00,
    status: "aberta",
    probability: 75,
    nextAction: "Consulta de avaliação",
    nextActionDate: "2026-01-20",
  },
  {
    id: "2",
    date: "2026-01-09",
    patient: "Carlos Roberto Mendes",
    email: "carlos.mendes@email.com",
    phone: "(11) 98765-4322",
    type: "Clareamento",
    description: "Clareamento dental profissional",
    value: 800.00,
    status: "em_andamento",
    probability: 90,
    nextAction: "Primeira sessão",
    nextActionDate: "2026-01-18",
  },
  {
    id: "3",
    date: "2026-01-08",
    patient: "Maria Santos Costa",
    email: "maria.santos@email.com",
    phone: "(11) 98765-4323",
    type: "Tratamento",
    description: "Tratamento de canal - dentes 11, 12",
    value: 1200.00,
    status: "fechada",
    probability: 100,
    nextAction: "Acompanhamento",
    nextActionDate: "2026-02-08",
  },
  {
    id: "4",
    date: "2026-01-07",
    patient: "João Silva Pereira",
    email: "joao.pereira@email.com",
    phone: "(11) 98765-4324",
    type: "Ortodontia",
    description: "Alinhadores dentários - full case",
    value: 5000.00,
    status: "em_andamento",
    probability: 85,
    nextAction: "Moldagem digital",
    nextActionDate: "2026-01-22",
  },
  {
    id: "5",
    date: "2026-01-06",
    patient: "Patricia Oliveira",
    email: "patricia.oliveira@email.com",
    phone: "(11) 98765-4325",
    type: "Periodontia",
    description: "Limpeza profunda - raspagem radicular",
    value: 450.00,
    status: "perdida",
    probability: 20,
    nextAction: "Contato de acompanhamento",
    nextActionDate: "2026-01-25",
  },
  {
    id: "6",
    date: "2026-01-05",
    patient: "Roberto Alves",
    email: "roberto.alves@email.com",
    phone: "(11) 98765-4326",
    type: "Limpeza",
    description: "Limpeza e profilaxia",
    value: 250.00,
    status: "fechada",
    probability: 100,
    nextAction: "Próxima revisão",
    nextActionDate: "2026-04-05",
  },
  {
    id: "7",
    date: "2026-01-04",
    patient: "Fernanda Costa Silva",
    email: "fernanda.costa@email.com",
    phone: "(11) 98765-4327",
    type: "Implante",
    description: "Implante dentário - dente 26",
    value: 3500.00,
    status: "aberta",
    probability: 60,
    nextAction: "Orçamento enviado",
    nextActionDate: "2026-01-21",
  },
  {
    id: "8",
    date: "2026-01-03",
    patient: "Lucas Martins",
    email: "lucas.martins@email.com",
    phone: "(11) 98765-4328",
    type: "Tratamento",
    description: "Restauração - dente 22",
    value: 350.00,
    status: "fechada",
    probability: 100,
    nextAction: "-",
  },
  {
    id: "9",
    date: "2026-01-02",
    patient: "Juliana Pires",
    email: "juliana.pires@email.com",
    phone: "(11) 98765-4329",
    type: "Clareamento",
    description: "Clareamento dental + moldeira",
    value: 1200.00,
    status: "aberta",
    probability: 70,
    nextAction: "Enviar orçamento",
    nextActionDate: "2026-01-16",
  },
  {
    id: "10",
    date: "2026-01-01",
    patient: "Ricardo Gomes",
    email: "ricardo.gomes@email.com",
    phone: "(11) 98765-4330",
    type: "Ortodontia",
    description: "Aparelho fixo convencional",
    value: 4500.00,
    status: "em_andamento",
    probability: 80,
    nextAction: "Ativação do aparelho",
    nextActionDate: "2026-01-30",
  },
]

export default function RelatoriosPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>(mockOpportunities)
  const [filteredData, setFilteredData] = useState<SalesOpportunity[]>(mockOpportunities)
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    type: "todos",
    status: "todos",
    dateFrom: "",
    dateTo: "",
    minValue: "",
    maxValue: "",
  })
  const [selectedOpportunity, setSelectedOpportunity] = useState<SalesOpportunity | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editOpportunityOpen, setEditOpportunityOpen] = useState(false)
  const [editingOpportunity, setEditingOpportunity] = useState<SalesOpportunity | null>(null)
  const [newOpportunityOpen, setNewOpportunityOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table")
  const [formData, setFormData] = useState({
    patient: "",
    email: "",
    phone: "",
    type: "tratamento",
    description: "",
    value: "",
    probability: "50",
    nextAction: "",
    nextActionDate: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  // Aplicar filtros
  useEffect(() => {
    let result = opportunities

    // Filtro de busca
    if (filters.searchTerm) {
      result = result.filter(
        (item) =>
          item.patient.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    // Filtro de tipo
    if (filters.type !== "todos") {
      result = result.filter((item) => item.type === filters.type)
    }

    // Filtro de status
    if (filters.status !== "todos") {
      result = result.filter((item) => item.status === filters.status)
    }

    // Filtro de data inicial
    if (filters.dateFrom) {
      result = result.filter((item) => new Date(item.date) >= new Date(filters.dateFrom))
    }

    // Filtro de data final
    if (filters.dateTo) {
      result = result.filter((item) => new Date(item.date) <= new Date(filters.dateTo))
    }

    // Filtro de valor mínimo
    if (filters.minValue) {
      result = result.filter((item) => item.value >= parseFloat(filters.minValue))
    }

    // Filtro de valor máximo
    if (filters.maxValue) {
      result = result.filter((item) => item.value <= parseFloat(filters.maxValue))
    }

    setFilteredData(result)
  }, [filters, opportunities])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleViewOpportunity = (id: string) => {
    const opportunity = opportunities.find((item) => item.id === id)
    if (opportunity) {
      setSelectedOpportunity(opportunity)
      setDetailsOpen(true)
    }
  }

  const handleEditOpportunity = (id: string) => {
    const opportunity = opportunities.find((item) => item.id === id)
    if (opportunity) {
      setEditingOpportunity(opportunity)
      setEditOpportunityOpen(true)
    }
  }

  const handleSaveOpportunity = (updatedOpportunity: SalesOpportunity) => {
    setOpportunities(
      opportunities.map((opp) =>
        opp.id === updatedOpportunity.id ? updatedOpportunity : opp
      )
    )
  }

  const handleMoveStage = (id: string, newStatus: string) => {
    setOpportunities(
      opportunities.map((opp) =>
        opp.id === id ? { ...opp, status: newStatus as any } : opp
      )
    )
    toast({
      title: "Status atualizado",
      description: `Oportunidade movida para ${newStatus}`,
    })
  }

  const handleDeleteOpportunity = (id: string) => {
    setOpportunities(opportunities.filter((item) => item.id !== id))
  }

  const handleAddOpportunity = () => {
    if (!formData.patient || !formData.email || !formData.value) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    const newOpportunity: SalesOpportunity = {
      id: (Math.max(...opportunities.map((o) => parseInt(o.id))) + 1).toString(),
      date: new Date().toISOString().split("T")[0],
      patient: formData.patient,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      description: formData.description,
      value: parseFloat(formData.value),
      status: "aberta",
      probability: parseInt(formData.probability),
      nextAction: formData.nextAction,
      nextActionDate: formData.nextActionDate,
    }

    setOpportunities([newOpportunity, ...opportunities])
    setNewOpportunityOpen(false)
    setFormData({
      patient: "",
      email: "",
      phone: "",
      type: "tratamento",
      description: "",
      value: "",
      probability: "50",
      nextAction: "",
      nextActionDate: "",
    })
  }

  // Cálculos para o resumo
  const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0)
  const totalPotential = filteredData.reduce(
    (sum, item) => sum + item.value * (item.probability / 100),
    0
  )
  const closedValue = filteredData
    .filter((item) => item.status === "fechada")
    .reduce((sum, item) => sum + item.value, 0)
  const openCount = filteredData.filter((item) => item.status === "aberta").length

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />

      <main className="flex-1 container mx-auto py-6 px-4">
        {/* Título da página */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Relatórios de Oportunidades</h1>
          <Button onClick={() => setNewOpportunityOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Oportunidade
          </Button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalValue)}
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredData.length} oportunidade(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Potencial</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalPotential)}
              </div>
              <p className="text-xs text-muted-foreground">
                Com probabilidade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Oportunidades Abertas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openCount}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando conversão
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturado</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(closedValue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Oportunidades fechadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Análises de Vendas */}
        <SalesAnalytics data={filteredData} />

        {/* Filtros */}
        <ReportsFilter filters={filters} onFilterChange={handleFilterChange} />

        {/* Gráficos */}
        <ReportCharts data={filteredData} />

        {/* Ações e Modo de Visualização */}
        <div className="flex items-center justify-between mb-4">
          <ReportsActions data={opportunities} filteredData={filteredData} filters={filters} />
          
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-auto">
            <TabsList>
              <TabsTrigger value="table" className="gap-2">
                <LayoutList className="h-4 w-4" />
                Tabela
              </TabsTrigger>
              <TabsTrigger value="kanban" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                Pipeline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tabela ou Kanban */}
        {viewMode === "table" ? (
          <div id="reports-table-print">
            <ReportsTable
              data={filteredData}
              onView={handleViewOpportunity}
              onEdit={handleEditOpportunity}
              onDelete={handleDeleteOpportunity}
            />
          </div>
        ) : (
          <SalesPipelineKanban
            opportunities={filteredData}
            onViewDetails={handleViewOpportunity}
            onEdit={handleEditOpportunity}
            onMoveStage={handleMoveStage}
          />
        )}
      </main>

      {/* Dialog de detalhes */}
      <OpportunityDetails
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        opportunity={selectedOpportunity}
      />

      {/* Dialog de edição */}
      <EditOpportunityDialog
        open={editOpportunityOpen}
        onOpenChange={setEditOpportunityOpen}
        opportunity={editingOpportunity}
        onSave={handleSaveOpportunity}
      />

      {/* Dialog de nova oportunidade */}
      <Dialog open={newOpportunityOpen} onOpenChange={setNewOpportunityOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Oportunidade</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Paciente *</Label>
                <Input
                  id="patient"
                  value={formData.patient}
                  onChange={(e) =>
                    setFormData({ ...formData, patient: e.target.value })
                  }
                  placeholder="Nome do paciente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(11) 9xxxx-xxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Serviço</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tratamento">Tratamento</SelectItem>
                    <SelectItem value="limpeza">Limpeza</SelectItem>
                    <SelectItem value="implante">Implante</SelectItem>
                    <SelectItem value="clareamento">Clareamento</SelectItem>
                    <SelectItem value="ortodoncia">Ortodontia</SelectItem>
                    <SelectItem value="periodontia">Periodontia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva a oportunidade"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Valor *</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="probability">Probabilidade (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) =>
                    setFormData({ ...formData, probability: e.target.value })
                  }
                  placeholder="50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nextAction">Próxima Ação</Label>
                <Input
                  id="nextAction"
                  value={formData.nextAction}
                  onChange={(e) =>
                    setFormData({ ...formData, nextAction: e.target.value })
                  }
                  placeholder="Descrição da ação"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextActionDate">Data da Próxima Ação</Label>
                <Input
                  id="nextActionDate"
                  type="date"
                  value={formData.nextActionDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextActionDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewOpportunityOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddOpportunity}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MainFooter />

      {/* Estilos de impressão */}
      <style jsx>{`
        @media print {
          body {
            background: white;
          }

          main {
            padding: 0;
          }

          .no-print {
            display: none;
          }

          #reports-table-print {
            page-break-inside: avoid;
          }

          table {
            page-break-inside: avoid;
          }

          tr {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  )
}
