"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
import { SalesOpportunity } from "@/components/reports-table"

interface EditOpportunityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  opportunity: SalesOpportunity | null
  onSave: (opportunity: SalesOpportunity) => void
}

export function EditOpportunityDialog({
  open,
  onOpenChange,
  opportunity,
  onSave,
}: EditOpportunityDialogProps) {
  const [formData, setFormData] = useState<Partial<SalesOpportunity>>({})

  useEffect(() => {
    if (opportunity) {
      setFormData(opportunity)
    }
  }, [opportunity])

  const handleSubmit = () => {
    if (!formData.patient || !formData.type || !formData.value) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    onSave(formData as SalesOpportunity)
    toast({
      title: "Oportunidade atualizada",
      description: "As alterações foram salvas com sucesso",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Oportunidade</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Nome do Paciente *</Label>
              <Input
                id="patient"
                value={formData.patient || ""}
                onChange={(e) =>
                  setFormData({ ...formData, patient: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Serviço *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Implante">Implante</SelectItem>
                  <SelectItem value="Clareamento">Clareamento</SelectItem>
                  <SelectItem value="Tratamento de Canal">
                    Tratamento de Canal
                  </SelectItem>
                  <SelectItem value="Limpeza">Limpeza</SelectItem>
                  <SelectItem value="Ortodontia">Ortodontia</SelectItem>
                  <SelectItem value="Prótese">Prótese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Valor (R$) *</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value || ""}
                onChange={(e) =>
                  setFormData({ ...formData, value: parseFloat(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability">Probabilidade (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    probability: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aberta">Aberta</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Fechada">Fechada</SelectItem>
                  <SelectItem value="Perdida">Perdida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nextAction">Próxima Ação</Label>
              <Input
                id="nextAction"
                value={formData.nextAction || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nextAction: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextActionDate">Data da Próxima Ação</Label>
              <Input
                id="nextActionDate"
                type="date"
                value={formData.nextActionDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nextActionDate: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
