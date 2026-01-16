"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SalesOpportunity } from "./reports-table"
import { InventoryItem, serviceInventoryMap, initialInventory } from "@/lib/inventory-data"
import { AlertTriangle, TrendingUp, ShoppingCart, Lightbulb } from "lucide-react"

interface RecommendationEngineProps {
  opportunities: SalesOpportunity[]
  inventory?: InventoryItem[]
}

interface Recommendation {
  id: string
  type: "critical" | "warning" | "opportunity"
  title: string
  description: string
  item: string
  requiredFor: string[]
  currentStock: number
  needed: number
  value: number
}

export function RecommendationEngine({
  opportunities,
  inventory = initialInventory,
}: RecommendationEngineProps) {
  const recommendations: Recommendation[] = []
  const inventoryMap = new Map(inventory.map((item) => [item.name, item]))

  // Análise 1: Itens com falta de estoque
  inventory.forEach((item) => {
    if (item.quantity < item.minStock) {
      const shortageAmount = item.minStock - item.quantity
      const relatedOpportunities = opportunities.filter((opp) => {
        const requiredItems = serviceInventoryMap[opp.type.toLowerCase()] || []
        return requiredItems.includes(item.name)
      })

      if (relatedOpportunities.length > 0) {
        recommendations.push({
          id: `stock-${item.id}`,
          type: item.quantity <= 2 ? "critical" : "warning",
          title: `${item.name} - Estoque Baixo`,
          description: `Você tem ${item.quantity} unidade(s) mas o mínimo é ${item.minStock}. Tem ${relatedOpportunities.length} oportunidade(s) aguardando este material.`,
          item: item.name,
          requiredFor: relatedOpportunities.map((o) => o.patient),
          currentStock: item.quantity,
          needed: shortageAmount,
          value: item.unitPrice * shortageAmount,
        })
      }
    }
  })

  // Análise 2: Materiais faltando para oportunidades abertas
  const openOpportunities = opportunities.filter((opp) => opp.status === "aberta")

  openOpportunities.forEach((opportunity) => {
    const requiredItems = serviceInventoryMap[opportunity.type.toLowerCase()] || []
    const missingItems: string[] = []

    requiredItems.forEach((item) => {
      const inventoryItem = inventoryMap.get(item)
      if (!inventoryItem || inventoryItem.quantity <= 2) {
        missingItems.push(item)
      }
    })

    if (missingItems.length > 0) {
      const missingValue = missingItems.reduce((sum, itemName) => {
        const item = inventoryMap.get(itemName)
        return sum + (item?.unitPrice || 0)
      }, 0)

      recommendations.push({
        id: `opor-${opportunity.id}`,
        type: "critical",
        title: `Faltam Materiais para ${opportunity.patient}`,
        description: `Para realizar o serviço de ${opportunity.type} (R$ ${opportunity.value.toFixed(2)}), você precisa de: ${missingItems.join(", ")}`,
        item: missingItems.join(", "),
        requiredFor: [opportunity.patient],
        currentStock: 0,
        needed: missingItems.length,
        value: missingValue,
      })
    }
  })

  // Análise 3: Oportunidades de venda baseado em estoque disponível
  const itemsWithGoodStock = inventory.filter((item) => item.quantity > item.minStock * 2)

  itemsWithGoodStock.forEach((item) => {
    const serviceTypes = Object.entries(serviceInventoryMap)
      .filter(([_, items]) => items.includes(item.name))
      .map(([type]) => type)

    if (serviceTypes.length > 0) {
      const potentialRevenue = item.unitPrice * item.quantity * 2 // Estimativa conservadora

      recommendations.push({
        id: `opp-${item.id}`,
        type: "opportunity",
        title: `Oportunidade: Promover ${serviceTypes[0].toUpperCase()}`,
        description: `Você tem ${item.quantity} unidades de "${item.name}" em estoque. Considere promover serviços de ${serviceTypes.join(", ")} para aumentar vendas.`,
        item: item.name,
        requiredFor: serviceTypes,
        currentStock: item.quantity,
        needed: 0,
        value: potentialRevenue,
      })
    }
  })

  const criticalCount = recommendations.filter((r) => r.type === "critical").length
  const warningCount = recommendations.filter((r) => r.type === "warning").length
  const opportunityCount = recommendations.filter((r) => r.type === "opportunity").length

  const colors: Record<string, string> = {
    critical: "border-red-500 bg-red-50",
    warning: "border-yellow-500 bg-yellow-50",
    opportunity: "border-green-500 bg-green-50",
  }

  const icons: Record<string, any> = {
    critical: AlertTriangle,
    warning: AlertTriangle,
    opportunity: Lightbulb,
  }

  return (
    <div className="space-y-6">
      {/* Resumo de Recomendações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900">
              Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-red-700">Ações imediatas necessárias</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">
              Aviso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <p className="text-xs text-yellow-700">Estoque baixo</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              Oportunidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{opportunityCount}</div>
            <p className="text-xs text-green-700">Para promover</p>
          </CardContent>
        </Card>
      </div>

      {/* Recomendações Detalhadas */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              ✅ Tudo está em ordem! Seu estoque está equilibrado com as oportunidades.
            </CardContent>
          </Card>
        ) : (
          recommendations.map((rec) => {
            const Icon = icons[rec.type]
            return (
              <Card key={rec.id} className={`${colors[rec.type]} border-2`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon
                        className={`h-5 w-5 mt-1 flex-shrink-0 ${
                          rec.type === "critical"
                            ? "text-red-600"
                            : rec.type === "warning"
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      />
                      <div>
                        <CardTitle className="text-base">{rec.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        rec.type === "critical"
                          ? "bg-red-600"
                          : rec.type === "warning"
                            ? "bg-yellow-600"
                            : "bg-green-600"
                      }
                    >
                      {rec.type === "critical"
                        ? "CRÍTICO"
                        : rec.type === "warning"
                          ? "AVISO"
                          : "OPORTUNIDADE"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Material</p>
                      <p className="font-medium text-sm">{rec.item.substring(0, 20)}...</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Estoque Atual</p>
                      <p className="font-semibold text-sm">{rec.currentStock}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Necessário</p>
                      <p className="font-semibold text-sm text-orange-600">
                        {rec.needed}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Valor</p>
                      <p className="font-semibold text-sm">
                        R$ {rec.value.toFixed(0)}
                      </p>
                    </div>
                  </div>

                  {rec.requiredFor.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">
                        Necessário para:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {rec.requiredFor.map((name, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Resumo de Ações */}
      {criticalCount > 0 && (
        <Alert className="border-red-300 bg-red-50">
          <ShoppingCart className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Ação Imediata Necessária:</strong> Você tem {criticalCount} itens
            críticos que precisam ser reabastecidos para não perder{" "}
            {criticalCount === 1 ? "uma oportunidade" : `${criticalCount} oportunidades`}.
            Valor estimado de reabastecimento:{" "}
            <strong>
              R${" "}
              {recommendations
                .filter((r) => r.type === "critical")
                .reduce((sum, r) => sum + r.value, 0)
                .toFixed(0)}
            </strong>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
