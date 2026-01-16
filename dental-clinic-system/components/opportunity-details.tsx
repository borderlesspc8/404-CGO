"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesOpportunity } from "./reports-table"

interface OpportunityDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  opportunity: SalesOpportunity | null
}

const statusLabels: Record<string, string> = {
  aberta: "Aberta",
  em_andamento: "Em Andamento",
  fechada: "Fechada",
  perdida: "Perdida",
}

const statusColors: Record<string, string> = {
  aberta: "bg-blue-100 text-blue-800",
  em_andamento: "bg-yellow-100 text-yellow-800",
  fechada: "bg-green-100 text-green-800",
  perdida: "bg-red-100 text-red-800",
}

export function OpportunityDetails({
  open,
  onOpenChange,
  opportunity,
}: OpportunityDetailsProps) {
  if (!opportunity) return null

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Oportunidade</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Paciente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{opportunity.patient}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{opportunity.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{opportunity.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data do Cadastro</p>
                  <p className="font-medium">{formatDate(opportunity.date)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Oportunidade */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Oportunidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Serviço</p>
                  <p className="font-medium">{opportunity.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusColors[opportunity.status]}>
                    {statusLabels[opportunity.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Estimado</p>
                  <p className="font-bold text-lg text-green-600">
                    {formatCurrency(opportunity.value)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Probabilidade de Fechamento</p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2 relative">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${opportunity.probability}%`,
                        }}
                      />
                    </div>
                    <span className="font-medium">{opportunity.probability}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{opportunity.description}</p>
            </CardContent>
          </Card>

          {/* Próxima Ação */}
          {opportunity.nextAction && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Próxima Ação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Ação</p>
                  <p className="font-medium">{opportunity.nextAction}</p>
                </div>
                {opportunity.nextActionDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data Programada</p>
                    <p className="font-medium">
                      {formatDate(opportunity.nextActionDate)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Valor Esperado */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Potencial (com probabilidade)</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(opportunity.value * (opportunity.probability / 100))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Valor Base</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(opportunity.value)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
