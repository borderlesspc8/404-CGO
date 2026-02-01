"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet,
  Calendar,
  Plus,
  Search,
  Filter
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Mock data para demonstração
const initialTransactions = [
  {
    id: "1",
    date: "2026-01-13",
    description: "Consulta - Ana Paula Silva",
    type: "receita",
    value: 350.00,
    status: "pago",
    category: "Consulta"
  },
  {
    id: "2",
    date: "2026-01-12",
    description: "Material Odontológico",
    type: "despesa",
    value: 850.00,
    status: "pago",
    category: "Materiais"
  },
  {
    id: "3",
    date: "2026-01-11",
    description: "Tratamento Ortodôntico - Marcio Rodrigo",
    type: "receita",
    value: 1200.00,
    status: "pendente",
    category: "Ortodontia"
  },
  {
    id: "4",
    date: "2026-01-10",
    description: "Aluguel Clínica",
    type: "despesa",
    value: 3500.00,
    status: "pago",
    category: "Fixo"
  },
  {
    id: "5",
    date: "2026-01-09",
    description: "Implante - João Santos",
    type: "receita",
    value: 4500.00,
    status: "aprovado",
    category: "Implantodontia"
  },
]

export default function FinanceiroPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState(initialTransactions)
  const [showReceitaDialog, setShowReceitaDialog] = useState(false)
  const [showDespesaDialog, setShowDespesaDialog] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({
    description: "",
    value: "",
    date: new Date().toISOString().split('T')[0],
    category: "",
    status: "pendente",
    notes: ""
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  const resetForm = () => {
    setFormData({
      description: "",
      value: "",
      date: new Date().toISOString().split('T')[0],
      category: "",
      status: "pendente",
      notes: ""
    })
  }

  const handleAddReceita = () => {
    if (!formData.description || !formData.value) return
    
    const newTransaction = {
      id: (transactions.length + 1).toString(),
      date: formData.date,
      description: formData.description,
      type: "receita" as const,
      value: parseFloat(formData.value),
      status: formData.status as "pago" | "pendente" | "aprovado",
      category: formData.category || "Outros"
    }
    
    setTransactions([newTransaction, ...transactions])
    setShowReceitaDialog(false)
    resetForm()
  }

  const handleAddDespesa = () => {
    if (!formData.description || !formData.value) return
    
    const newTransaction = {
      id: (transactions.length + 1).toString(),
      date: formData.date,
      description: formData.description,
      type: "despesa" as const,
      value: parseFloat(formData.value),
      status: formData.status as "pago" | "pendente" | "aprovado",
      category: formData.category || "Outros"
    }
    
    setTransactions([newTransaction, ...transactions])
    setShowDespesaDialog(false)
    resetForm()
  }

  // Cálculos de resumo
  const totalReceitas = transactions
    .filter(t => t.type === "receita")
    .reduce((sum, t) => sum + t.value, 0)
  
  const totalDespesas = transactions
    .filter(t => t.type === "despesa")
    .reduce((sum, t) => sum + t.value, 0)
  
  const saldo = totalReceitas - totalDespesas

  const receitasPendentes = transactions
    .filter(t => t.type === "receita" && t.status === "pendente")
    .reduce((sum, t) => sum + t.value, 0)

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <MainHeader />

      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#50348F]">Financeiro</h1>
            <div className="flex gap-3">
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => setShowDespesaDialog(true)}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Nova Despesa
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setShowReceitaDialog(true)}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Nova Receita
              </Button>
            </div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Receitas do Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  Despesas do Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-500">
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#50348F]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#50348F]" />
                  Saldo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-500" />
                  A Receber
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-500">
                  R$ {receitasPendentes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs de Conteúdo */}
          <Tabs defaultValue="movimentacoes" className="space-y-6">
            <TabsList className="bg-white">
              <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
              <TabsTrigger value="caixa">Caixa</TabsTrigger>
              <TabsTrigger value="contas-receber">Contas a Receber</TabsTrigger>
              <TabsTrigger value="contas-pagar">Contas a Pagar</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="movimentacoes" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Movimentações Recentes</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Buscar transação..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                transaction.type === "receita" 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {transaction.type === "receita" ? "Receita" : "Despesa"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                transaction.status === "pago"
                                  ? "bg-blue-100 text-blue-700"
                                  : transaction.status === "pendente"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-purple-100 text-purple-700"
                              }
                            >
                              {transaction.status === "pago" ? "Pago" : 
                               transaction.status === "pendente" ? "Pendente" : "Aprovado"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            <span className={transaction.type === "receita" ? "text-green-600" : "text-red-500"}>
                              {transaction.type === "receita" ? "+" : "-"} R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="caixa">
              <Card>
                <CardHeader>
                  <CardTitle>Controle de Caixa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Funcionalidade de controle de caixa em desenvolvimento...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contas-receber">
              <Card>
                <CardHeader>
                  <CardTitle>Contas a Receber</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Lista de contas a receber em desenvolvimento...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contas-pagar">
              <Card>
                <CardHeader>
                  <CardTitle>Contas a Pagar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Lista de contas a pagar em desenvolvimento...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="relatorios">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Financeiros</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Relatórios financeiros em desenvolvimento...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialog Nova Receita */}
      <Dialog open={showReceitaDialog} onOpenChange={setShowReceitaDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Nova Receita
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="receita-description">Descrição *</Label>
              <Input
                id="receita-description"
                placeholder="Ex: Consulta - Nome do Paciente"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receita-value">Valor (R$) *</Label>
                <Input
                  id="receita-value"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receita-date">Data</Label>
                <Input
                  id="receita-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receita-category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consulta">Consulta</SelectItem>
                    <SelectItem value="Ortodontia">Ortodontia</SelectItem>
                    <SelectItem value="Implantodontia">Implantodontia</SelectItem>
                    <SelectItem value="Endodontia">Endodontia</SelectItem>
                    <SelectItem value="Prótese">Prótese</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receita-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receita-notes">Observações</Label>
              <Textarea
                id="receita-notes"
                placeholder="Informações adicionais..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowReceitaDialog(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAddReceita}
            >
              Adicionar Receita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Nova Despesa */}
      <Dialog open={showDespesaDialog} onOpenChange={setShowDespesaDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Nova Despesa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="despesa-description">Descrição *</Label>
              <Input
                id="despesa-description"
                placeholder="Ex: Aluguel, Material, Fornecedor"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="despesa-value">Valor (R$) *</Label>
                <Input
                  id="despesa-value"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="despesa-date">Data</Label>
                <Input
                  id="despesa-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="despesa-category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Materiais">Materiais</SelectItem>
                    <SelectItem value="Fixo">Despesas Fixas</SelectItem>
                    <SelectItem value="Salários">Salários</SelectItem>
                    <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="despesa-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="despesa-notes">Observações</Label>
              <Textarea
                id="despesa-notes"
                placeholder="Informações adicionais..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDespesaDialog(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleAddDespesa}
            >
              Adicionar Despesa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MainFooter />
    </div>
  )
}
