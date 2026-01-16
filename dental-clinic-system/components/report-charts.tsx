"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesOpportunity } from "./reports-table"

interface ReportChartsProps {
  data: SalesOpportunity[]
}

export function ReportCharts({ data }: ReportChartsProps) {
  // Cálculos por tipo
  const typeStats = data.reduce(
    (acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = {
          count: 0,
          value: 0,
          potential: 0,
        }
      }
      acc[item.type].count++
      acc[item.type].value += item.value
      acc[item.type].potential += item.value * (item.probability / 100)
      return acc
    },
    {} as Record<
      string,
      {
        count: number
        value: number
        potential: number
      }
    >
  )

  // Cálculos por status
  const statusStats = data.reduce(
    (acc, item) => {
      if (!acc[item.status]) {
        acc[item.status] = {
          count: 0,
          value: 0,
          potential: 0,
        }
      }
      acc[item.status].count++
      acc[item.status].value += item.value
      acc[item.status].potential += item.value * (item.probability / 100)
      return acc
    },
    {} as Record<
      string,
      {
        count: number
        value: number
        potential: number
      }
    >
  )

  const maxValue = Math.max(
    ...Object.values(typeStats).map((s) => s.potential),
    1
  )

  const statusLabels: Record<string, string> = {
    aberta: "Aberta",
    em_andamento: "Em Andamento",
    fechada: "Fechada",
    perdida: "Perdida",
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Oportunidades por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunidades por Tipo de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(typeStats).map(([type, stats]) => (
              <div key={type} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{type}</span>
                  <span className="text-muted-foreground">
                    {stats.count} oportunidade(s)
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(stats.potential / maxValue) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium min-w-[80px] text-right">
                    {formatCurrency(stats.potential)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Status */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(statusStats).map(([status, stats]) => {
              const statusColors: Record<string, string> = {
                aberta: "bg-blue-500",
                em_andamento: "bg-yellow-500",
                fechada: "bg-green-500",
                perdida: "bg-red-500",
              }

              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {statusLabels[status]}
                    </span>
                    <span className="text-muted-foreground">
                      {stats.count} oportunidade(s)
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${statusColors[status]} h-2 rounded-full transition-all`}
                        style={{
                          width: `${((stats.count / data.length) * 100) || 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium min-w-[80px] text-right">
                      {formatCurrency(stats.potential)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
