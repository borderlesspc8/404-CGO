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
  Filter,
  FileDown,
  Loader2,
} from "lucide-react"
import { gerarFinanceiroPDF } from "@/lib/financeiro-pdf"
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

const FINANCEIRO_KEY = "cgo.financeiro"
const SALDO_ABERTURA_KEY = "cgo.financeiro.saldoAbertura"

function loadTransactions() {
  if (typeof window === "undefined") return initialTransactions
  try {
    const raw = window.localStorage.getItem(FINANCEIRO_KEY)
    if (!raw) return initialTransactions
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialTransactions
  } catch {
    return initialTransactions
  }
}

function loadSaldoAbertura(): number {
  if (typeof window === "undefined") return 5000
  try {
    const raw = window.localStorage.getItem(SALDO_ABERTURA_KEY)
    if (!raw) return 5000
    const parsed = parseFloat(raw)
    return isNaN(parsed) ? 5000 : parsed
  } catch {
    return 5000
  }
}

export default function FinanceiroPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState(initialTransactions)
  const [showReceitaDialog, setShowReceitaDialog] = useState(false)
  const [showDespesaDialog, setShowDespesaDialog] = useState(false)
  const [saldoAbertura, setSaldoAbertura] = useState(5000)
  const [exportingPDF, setExportingPDF] = useState(false)

  useEffect(() => {
    setTransactions(loadTransactions())
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(FINANCEIRO_KEY, JSON.stringify(transactions))
    }
  }, [transactions])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SALDO_ABERTURA_KEY, String(saldoAbertura))
    }
  }, [saldoAbertura])
  useEffect(() => {
    setSaldoAbertura(loadSaldoAbertura())
  }, [])

  const todayKey = new Date().toISOString().split("T")[0]
  const todayTransactions = transactions.filter((t) => t.date === todayKey)
  const entradasHoje = todayTransactions.filter((t) => t.type === "receita").reduce((s, t) => s + t.value, 0)
  const saidasHoje = todayTransactions.filter((t) => t.type === "despesa").reduce((s, t) => s + t.value, 0)
  const saldoFechamento = saldoAbertura + entradasHoje - saidasHoje

  const contasReceber = transactions.filter((t) => t.type === "receita" && t.status !== "pago")
  const contasPagar = transactions.filter((t) => t.type === "despesa" && t.status !== "pago")

  const handleMarkAsPaid = (id: string) => {
    setTransactions((prev) => prev.map((t) => t.id === id ? { ...t, status: "pago" } : t))
  }

  const categoryTotals = (() => {
    const map: Record<string, { receita: number; despesa: number }> = {}
    transactions.forEach((t) => {
      if (!map[t.category]) map[t.category] = { receita: 0, despesa: 0 }
      map[t.category][t.type as "receita" | "despesa"] += t.value
    })
    return Object.entries(map).map(([cat, vals]) => ({ cat, ...vals, net: vals.receita - vals.despesa }))
  })()
  
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
      id: `txn_${Date.now()}`,
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
      id: `txn_${Date.now()}`,
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
                variant="outline"
                disabled={exportingPDF}
                onClick={() => {
                  setExportingPDF(true)
                  setTimeout(() => {
                    try { gerarFinanceiroPDF(transactions, saldoAbertura) }
                    finally { setExportingPDF(false) }
                  }, 50)
                }}
              >
                {exportingPDF
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando...</>
                  : <><FileDown className="w-4 h-4 mr-2" /> Exportar PDF</>
                }
              </Button>
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

            {/* ── CAIXA ── */}
            <TabsContent value="caixa" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-[#50348F]" />
                      Controle de Caixa — {new Date().toLocaleDateString("pt-BR")}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm whitespace-nowrap">Saldo de abertura:</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={saldoAbertura}
                        onChange={(e) => setSaldoAbertura(parseFloat(e.target.value) || 0)}
                        className="w-36 h-8 text-sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Abertura", value: saldoAbertura, color: "text-gray-700", bg: "bg-gray-50" },
                      { label: "Entradas", value: entradasHoje, color: "text-green-600", bg: "bg-green-50" },
                      { label: "Saídas", value: saidasHoje, color: "text-red-500", bg: "bg-red-50" },
                      { label: "Fechamento", value: saldoFechamento, color: saldoFechamento >= 0 ? "text-[#50348F]" : "text-red-600", bg: saldoFechamento >= 0 ? "bg-[#50348F]/5" : "bg-red-50" },
                    ].map(({ label, value, color, bg }) => (
                      <div key={label} className={`${bg} rounded-lg p-4 text-center`}>
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className={`text-xl font-bold ${color}`}>R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                      </div>
                    ))}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-400 py-8">Nenhuma movimentação hoje</TableCell>
                        </TableRow>
                      ) : todayTransactions.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell>{t.description}</TableCell>
                          <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                          <TableCell>
                            <Badge className={t.type === "receita" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                              {t.type === "receita" ? "Entrada" : "Saída"}
                            </Badge>
                          </TableCell>
                          <TableCell className={`text-right font-semibold ${t.type === "receita" ? "text-green-600" : "text-red-500"}`}>
                            {t.type === "receita" ? "+" : "−"} R$ {t.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── CONTAS A RECEBER ── */}
            <TabsContent value="contas-receber" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Contas a Receber
                    <Badge className="bg-orange-100 text-orange-700 ml-2">{contasReceber.length} pendente{contasReceber.length !== 1 ? "s" : ""}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contasReceber.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">Nenhuma conta a receber pendente</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contasReceber.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell className="text-sm">{new Date(t.date).toLocaleDateString("pt-BR")}</TableCell>
                            <TableCell>{t.description}</TableCell>
                            <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                            <TableCell>
                              <Badge className="bg-orange-100 text-orange-700">
                                {t.status === "pendente" ? "Pendente" : "Aprovado"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold text-green-600">
                              R$ {t.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" className="h-7 text-xs text-green-700 border-green-300 hover:bg-green-50" onClick={() => handleMarkAsPaid(t.id)}>
                                Recebido
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                    <span className="text-gray-500">Total pendente:</span>
                    <span className="font-bold text-green-600">
                      R$ {contasReceber.reduce((s, t) => s + t.value, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── CONTAS A PAGAR ── */}
            <TabsContent value="contas-pagar" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    Contas a Pagar
                    <Badge className="bg-red-100 text-red-700 ml-2">{contasPagar.length} pendente{contasPagar.length !== 1 ? "s" : ""}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contasPagar.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">Nenhuma conta a pagar pendente</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contasPagar.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell className="text-sm">{new Date(t.date).toLocaleDateString("pt-BR")}</TableCell>
                            <TableCell>{t.description}</TableCell>
                            <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                            <TableCell>
                              <Badge className="bg-orange-100 text-orange-700">
                                {t.status === "pendente" ? "Pendente" : "Aprovado"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold text-red-500">
                              R$ {t.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" className="h-7 text-xs text-red-700 border-red-300 hover:bg-red-50" onClick={() => handleMarkAsPaid(t.id)}>
                                Pago
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                    <span className="text-gray-500">Total pendente:</span>
                    <span className="font-bold text-red-500">
                      R$ {contasPagar.reduce((s, t) => s + t.value, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── RELATÓRIOS ── */}
            <TabsContent value="relatorios" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Total de Receitas", value: totalReceitas, color: "text-green-600", bar: "bg-green-500" },
                  { label: "Total de Despesas", value: totalDespesas, color: "text-red-500", bar: "bg-red-400" },
                  { label: "Resultado Líquido", value: saldo, color: saldo >= 0 ? "text-[#50348F]" : "text-red-600", bar: saldo >= 0 ? "bg-[#50348F]" : "bg-red-500" },
                ].map(({ label, value, color }) => (
                  <Card key={label}>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500 mb-1">{label}</p>
                      <p className={`text-2xl font-bold ${color}`}>R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader><CardTitle>Receitas × Despesas por Categoria</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryTotals.map(({ cat, receita, despesa }) => {
                      const max = Math.max(receita, despesa, 1)
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{cat}</span>
                            <span className="text-gray-500 text-xs">
                              <span className="text-green-600">+R${receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                              {despesa > 0 && <span className="text-red-500 ml-2">−R${despesa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>}
                            </span>
                          </div>
                          <div className="flex gap-1 h-3">
                            <div className="bg-green-500 rounded-l" style={{ width: `${(receita / max) * 100}%`, minWidth: receita > 0 ? 4 : 0 }} />
                            <div className="bg-red-400 rounded-r" style={{ width: `${(despesa / max) * 100}%`, minWidth: despesa > 0 ? 4 : 0 }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Distribuição de Receitas por Categoria</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-right">Receitas</TableHead>
                        <TableHead className="text-right">Despesas</TableHead>
                        <TableHead className="text-right">Resultado</TableHead>
                        <TableHead className="text-right">% do Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryTotals.map(({ cat, receita, despesa, net }) => (
                        <TableRow key={cat}>
                          <TableCell><Badge variant="outline">{cat}</Badge></TableCell>
                          <TableCell className="text-right text-green-600 font-medium">
                            {receita > 0 ? `R$ ${receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
                          </TableCell>
                          <TableCell className="text-right text-red-500 font-medium">
                            {despesa > 0 ? `R$ ${despesa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
                          </TableCell>
                          <TableCell className={`text-right font-bold ${net >= 0 ? "text-green-600" : "text-red-500"}`}>
                            R$ {net.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right text-gray-500">
                            {totalReceitas > 0 ? `${((receita / totalReceitas) * 100).toFixed(1)}%` : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialog Nova Receita */}
      <Dialog open={showReceitaDialog} onOpenChange={setShowReceitaDialog}>
        <DialogContent className="sm:max-w-125">
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
        <DialogContent className="sm:max-w-125">
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
