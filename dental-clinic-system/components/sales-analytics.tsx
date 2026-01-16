"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesOpportunity } from "./reports-table"
import { TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react"

interface SalesAnalyticsProps {
  data: SalesOpportunity[]
}

export function SalesAnalytics({ data }: SalesAnalyticsProps) {
  if (data.length === 0) {
    return null
  }

  // Taxa de conversão
  const closedCount = data.filter((item) => item.status === "fechada").length
  const conversionRate = (closedCount / data.length) * 100

  // Valor médio por oportunidade
  const averageValue = data.reduce((sum, item) => sum + item.value, 0) / data.length

  // Probabilidade média
  const averageProbability =
    data.reduce((sum, item) => sum + item.probability, 0) / data.length

  // Valor potencial por status
  const statusValues = data.reduce(
    (acc, item) => {
      const key = item.status
      const potential = item.value * (item.probability / 100)
      acc[key] = (acc[key] || 0) + potential
      return acc
    },
    {} as Record<string, number>
  )

  const potentialByType = data.reduce(
    (acc, item) => {
      const potential = item.value * (item.probability / 100)
      acc[item.type] = (acc[item.type] || 0) + potential
      return acc
    },
    {} as Record<string, number>
  )

  // Top tipo de serviço
  const topType = Object.entries(potentialByType).sort(([, a], [, b]) => b - a)[0]

  // Oportunidades por status
  const openOpportunities = data.filter((item) => item.status === "aberta").length
  const inProgressOpportunities = data.filter((item) => item.status === "em_andamento").length
  const lostOpportunities = data.filter((item) => item.status === "perdida").length

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Taxa de Conversão */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {closedCount} de {data.length} oportunidades
          </p>
        </CardContent>
      </Card>

      {/* Valor Médio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(averageValue)}</div>
          <p className="text-xs text-muted-foreground">
            Por oportunidade
          </p>
        </CardContent>
      </Card>

      {/* Probabilidade Média */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Probabilidade Média</CardTitle>
          <Target className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageProbability.toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground">
            Média geral de conversão
          </p>
        </CardContent>
      </Card>

      {/* Em Risco */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Risco</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lostOpportunities}</div>
          <p className="text-xs text-muted-foreground">
            Oportunidades perdidas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
