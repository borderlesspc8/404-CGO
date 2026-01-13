"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
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
import { Progress } from "@/components/ui/progress"

// Mock data for analytics
const monthlyData = [
  { month: "Jan", receitas: 45000, despesas: 28000, lucro: 17000 },
  { month: "Fev", receitas: 52000, despesas: 30000, lucro: 22000 },
  { month: "Mar", receitas: 48000, despesas: 29000, lucro: 19000 },
  { month: "Abr", receitas: 61000, despesas: 32000, lucro: 29000 },
  { month: "Mai", receitas: 55000, despesas: 31000, lucro: 24000 },
  { month: "Jun", receitas: 67000, despesas: 35000, lucro: 32000 },
]

const topProcedures = [
  { name: "Ortodontia", quantity: 45, revenue: 54000, growth: 12 },
  { name: "Implante", quantity: 28, revenue: 126000, growth: 8 },
  { name: "Clareamento", quantity: 67, revenue: 33500, growth: -3 },
  { name: "Prótese", quantity: 18, revenue: 54000, growth: 15 },
  { name: "Extração", quantity: 52, revenue: 10400, growth: 5 },
]

const recentPayments = [
  { patient: "Ana Paula Silva", procedure: "Ortodontia", value: 1200, status: "paid", date: "2026-01-13" },
  { patient: "Marcio Rodrigo", procedure: "Implante", value: 4500, status: "pending", date: "2026-01-12" },
  { patient: "Carlos Eduardo", procedure: "Clareamento", value: 800, status: "paid", date: "2026-01-11" },
  { patient: "Maria Santos", procedure: "Prótese", value: 3200, status: "overdue", date: "2026-01-05" },
  { patient: "João Pedro", procedure: "Consulta", value: 350, status: "paid", date: "2026-01-13" },
]

const opportunitiesData = [
  { type: "Leads Novos", count: 23, value: 34500, icon: Users, color: "blue" },
  { type: "Orçamentos Pendentes", count: 12, value: 45600, icon: Clock, color: "orange" },
  { type: "Retornos Agendados", count: 34, value: 28900, icon: Calendar, color: "green" },
  { type: "Inadimplentes", count: 8, value: 12400, icon: AlertCircle, color: "red" },
]

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]
  const receitaGrowth = ((currentMonth.receitas - previousMonth.receitas) / previousMonth.receitas) * 100
  const despesaGrowth = ((currentMonth.despesas - previousMonth.despesas) / previousMonth.despesas) * 100
  const totalPatients = 247
  const activePatients = 189

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <MainHeader />

      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#5b4b8a]">Dashboard & Analytics</h1>
            <p className="text-gray-600 mt-2">Visão geral do desempenho da clínica</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Receita do Mês</CardTitle>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {currentMonth.receitas.toLocaleString('pt-BR')}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    {receitaGrowth.toFixed(1)}% vs mês anterior
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Despesas do Mês</CardTitle>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  R$ {currentMonth.despesas.toLocaleString('pt-BR')}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-500 font-medium">
                    {despesaGrowth.toFixed(1)}% vs mês anterior
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#5b4b8a]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Lucro Líquido</CardTitle>
                  <DollarSign className="w-4 h-4 text-[#5b4b8a]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5b4b8a]">
                  R$ {currentMonth.lucro.toLocaleString('pt-BR')}
                </div>
                <div className="mt-2">
                  <Progress value={(currentMonth.lucro / currentMonth.receitas) * 100} className="h-2" />
                  <span className="text-sm text-gray-600 mt-1 block">
                    {((currentMonth.lucro / currentMonth.receitas) * 100).toFixed(1)}% margem
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Pacientes Ativos</CardTitle>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {activePatients}
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">
                    de {totalPatients} cadastrados
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="revenue">Receitas</TabsTrigger>
              <TabsTrigger value="procedures">Procedimentos</TabsTrigger>
              <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho Mensal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {monthlyData.map((data, index) => (
                        <div key={data.month} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{data.month}/2026</span>
                            <span className="text-gray-600">
                              R$ {data.lucro.toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <Progress 
                            value={(data.lucro / data.receitas) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Payments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamentos Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentPayments.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{payment.patient}</p>
                            <p className="text-xs text-gray-600">{payment.procedure}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              R$ {payment.value.toLocaleString('pt-BR')}
                            </p>
                            <Badge
                              className={
                                payment.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : payment.status === "pending"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {payment.status === "paid" ? "Pago" : 
                               payment.status === "pending" ? "Pendente" : "Atrasado"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Receitas - Últimos 6 Meses</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mês</TableHead>
                        <TableHead className="text-right">Receitas</TableHead>
                        <TableHead className="text-right">Despesas</TableHead>
                        <TableHead className="text-right">Lucro</TableHead>
                        <TableHead className="text-right">Margem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyData.map((data) => (
                        <TableRow key={data.month}>
                          <TableCell className="font-medium">{data.month}/2026</TableCell>
                          <TableCell className="text-right text-green-600 font-semibold">
                            R$ {data.receitas.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right text-red-500 font-semibold">
                            R$ {data.despesas.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right text-[#5b4b8a] font-semibold">
                            R$ {data.lucro.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">
                              {((data.lucro / data.receitas) * 100).toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Procedures Tab */}
            <TabsContent value="procedures" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Procedimentos por Receita</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Procedimento</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Receita Total</TableHead>
                        <TableHead className="text-right">Crescimento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProcedures.map((proc) => (
                        <TableRow key={proc.name}>
                          <TableCell className="font-medium">{proc.name}</TableCell>
                          <TableCell className="text-right">{proc.quantity}</TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            R$ {proc.revenue.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {proc.growth > 0 ? (
                                <ArrowUpRight className="w-4 h-4 text-green-600" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-500" />
                              )}
                              <span className={proc.growth > 0 ? "text-green-600" : "text-red-500"}>
                                {Math.abs(proc.growth)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {opportunitiesData.map((opp) => {
                  const Icon = opp.icon
                  const colorClasses = {
                    blue: "border-l-blue-600 text-blue-600",
                    orange: "border-l-orange-500 text-orange-500",
                    green: "border-l-green-600 text-green-600",
                    red: "border-l-red-500 text-red-500",
                  }
                  
                  return (
                    <Card key={opp.type} className={`border-l-4 ${colorClasses[opp.color as keyof typeof colorClasses]}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-gray-600">
                            {opp.type}
                          </CardTitle>
                          <Icon className={`w-5 h-5 ${colorClasses[opp.color as keyof typeof colorClasses]}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-3xl font-bold">{opp.count}</div>
                          <div className="text-sm text-gray-600">
                            Valor potencial: <span className="font-semibold">R$ {opp.value.toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Funil de Oportunidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Leads (23)</span>
                        <span className="text-gray-600">100%</span>
                      </div>
                      <Progress value={100} className="h-3" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Orçamentos (12)</span>
                        <span className="text-gray-600">52%</span>
                      </div>
                      <Progress value={52} className="h-3" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Agendados (34)</span>
                        <span className="text-gray-600">148%</span>
                      </div>
                      <Progress value={100} className="h-3" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Convertidos (18)</span>
                        <span className="text-gray-600">78%</span>
                      </div>
                      <Progress value={78} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MainFooter />
    </div>
  )
}
