"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Edit2, Trash2 } from "lucide-react"

export interface SalesOpportunity {
  id: string
  date: string
  patient: string
  email: string
  phone: string
  type: string
  description: string
  value: number
  status: "aberta" | "em_andamento" | "fechada" | "perdida"
  probability: number
  nextAction?: string
  nextActionDate?: string
}

interface ReportsTableProps {
  data: SalesOpportunity[]
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const statusColors: Record<string, string> = {
  aberta: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  em_andamento: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  fechada: "bg-green-100 text-green-800 hover:bg-green-100",
  perdida: "bg-red-100 text-red-800 hover:bg-red-100",
}

const statusLabels: Record<string, string> = {
  aberta: "Aberta",
  em_andamento: "Em Andamento",
  fechada: "Fechada",
  perdida: "Perdida",
}

export function ReportsTable({
  data,
  onView,
  onEdit,
  onDelete,
}: ReportsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Oportunidades de Venda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Probabilidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Próx. Ação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhuma oportunidade encontrada
                  </TableCell>
                </TableRow>
              ) : (
                data.map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell className="font-medium">
                      {formatDate(opportunity.date)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{opportunity.patient}</div>
                        <div className="text-sm text-muted-foreground">
                          {opportunity.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{opportunity.type}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {opportunity.description}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(opportunity.value)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2 relative">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${opportunity.probability}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm">{opportunity.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={statusColors[opportunity.status]}
                        variant="outline"
                      >
                        {statusLabels[opportunity.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {opportunity.nextActionDate ? (
                        <div>
                          <div>{opportunity.nextAction}</div>
                          <div className="text-muted-foreground">
                            {formatDate(opportunity.nextActionDate)}
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(opportunity.id)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(opportunity.id)}
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(opportunity.id)}
                            title="Deletar"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
