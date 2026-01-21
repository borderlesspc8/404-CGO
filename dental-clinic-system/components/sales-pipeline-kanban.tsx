"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Eye,
  Edit2,
  ArrowRight,
} from "lucide-react"
import { SalesOpportunity } from "@/components/reports-table"

interface SalesPipelineKanbanProps {
  opportunities: SalesOpportunity[]
  onViewDetails: (id: string) => void
  onEdit: (id: string) => void
  onMoveStage: (id: string, newStatus: string) => void
}

const stages = [
  { id: "Aberta", label: "Nova", color: "bg-blue-500" },
  { id: "Em Andamento", label: "Em Andamento", color: "bg-yellow-500" },
  { id: "Fechada", label: "Fechada", color: "bg-green-500" },
  { id: "Perdida", label: "Perdida", color: "bg-red-500" },
]

export function SalesPipelineKanban({
  opportunities,
  onViewDetails,
  onEdit,
  onMoveStage,
}: SalesPipelineKanbanProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const getOpportunitiesByStage = (status: string) => {
    return opportunities.filter((opp) => opp.status === status)
  }

  const calculateStageValue = (status: string) => {
    return getOpportunitiesByStage(status).reduce(
      (sum, opp) => sum + opp.value,
      0
    )
  }

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedItem) {
      onMoveStage(draggedItem, newStatus)
      setDraggedItem(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stages.map((stage) => {
        const stageOpps = getOpportunitiesByStage(stage.id)
        const stageValue = calculateStageValue(stage.id)

        return (
          <div
            key={stage.id}
            className="flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className={`${stage.color} text-white p-3 rounded-t-lg`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold">{stage.label}</h3>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {stageOpps.length}
                </Badge>
              </div>
              <p className="text-sm opacity-90">
                R$ {stageValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex-1 bg-gray-50 p-2 rounded-b-lg min-h-[400px] space-y-2">
              {stageOpps.map((opp) => (
                <Card
                  key={opp.id}
                  draggable
                  onDragStart={() => handleDragStart(opp.id)}
                  className="cursor-move hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">
                            {opp.patient}
                          </h4>
                          <p className="text-xs text-gray-500">{opp.type}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {opp.probability}%
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium">
                          R$ {opp.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {opp.email && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{opp.email}</span>
                        </div>
                      )}

                      {opp.phone && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{opp.phone}</span>
                        </div>
                      )}

                      {opp.nextAction && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 p-1 rounded">
                          <Calendar className="h-3 w-3" />
                          <span className="truncate">{opp.nextAction}</span>
                        </div>
                      )}

                      <div className="flex gap-1 pt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs flex-1"
                          onClick={() => onViewDetails(opp.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs flex-1"
                          onClick={() => onEdit(opp.id)}
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {stageOpps.length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <p className="text-sm">Nenhuma oportunidade</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
