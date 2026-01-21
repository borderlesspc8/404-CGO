"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  Clock,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  Trash2,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface WaitingListEntry {
  id: string
  patientName: string
  phone: string
  email?: string
  service: string
  preferredDates: string[]
  priority: "normal" | "urgent"
  addedAt: Date
  notes?: string
}

interface WaitingListProps {
  entries: WaitingListEntry[]
  onAddEntry: (entry: Omit<WaitingListEntry, "id" | "addedAt">) => void
  onRemoveEntry: (id: string) => void
  onConvertToAppointment: (entry: WaitingListEntry) => void
}

export function WaitingList({
  entries,
  onAddEntry,
  onRemoveEntry,
  onConvertToAppointment,
}: WaitingListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    email: "",
    service: "",
    priority: "normal" as "normal" | "urgent",
    notes: "",
  })

  const handleSubmit = () => {
    if (!formData.patientName || !formData.phone || !formData.service) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, telefone e serviço",
        variant: "destructive",
      })
      return
    }

    onAddEntry({
      ...formData,
      preferredDates: [],
    })

    toast({
      title: "Adicionado à fila de espera",
      description: `${formData.patientName} foi adicionado à lista`,
    })

    setFormData({
      patientName: "",
      phone: "",
      email: "",
      service: "",
      priority: "normal",
      notes: "",
    })
    setIsAddDialogOpen(false)
  }

  const sortedEntries = [...entries].sort((a, b) => {
    // Urgente primeiro
    if (a.priority === "urgent" && b.priority !== "urgent") return -1
    if (a.priority !== "urgent" && b.priority === "urgent") return 1
    // Depois por data de adição
    return a.addedAt.getTime() - b.addedAt.getTime()
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fila de Espera</h2>
          <p className="text-sm text-muted-foreground">
            {entries.length} paciente(s) aguardando
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Adicionar à Fila
        </Button>
      </div>

      {sortedEntries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum paciente na fila de espera</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posição</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Aguardando</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.map((entry, index) => {
                const daysWaiting = Math.floor(
                  (new Date().getTime() - entry.addedAt.getTime()) / (1000 * 60 * 60 * 24)
                )

                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{entry.patientName}</p>
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          <span>{entry.phone}</span>
                        </div>
                        {entry.email && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{entry.email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{entry.service}</TableCell>
                    <TableCell>
                      <Badge
                        variant={entry.priority === "urgent" ? "destructive" : "secondary"}
                      >
                        {entry.priority === "urgent" ? "Urgente" : "Normal"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {daysWaiting === 0 ? (
                          <span>Hoje</span>
                        ) : (
                          <span>{daysWaiting} dia(s)</span>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(entry.addedAt, "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onConvertToAppointment(entry)}
                          className="gap-1"
                        >
                          <ArrowRight className="h-3 w-3" />
                          Agendar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveEntry(entry.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Dialog para adicionar à fila */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar à Fila de Espera</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Nome do Paciente *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) =>
                  setFormData({ ...formData, patientName: e.target.value })
                }
                placeholder="Nome completo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service">Serviço *</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) =>
                    setFormData({ ...formData, service: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consulta">Consulta</SelectItem>
                    <SelectItem value="Limpeza">Limpeza</SelectItem>
                    <SelectItem value="Clareamento">Clareamento</SelectItem>
                    <SelectItem value="Implante">Implante</SelectItem>
                    <SelectItem value="Ortodontia">Ortodontia</SelectItem>
                    <SelectItem value="Emergência">Emergência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "normal" | "urgent") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Informações adicionais..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
