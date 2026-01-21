"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
import {
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Bell,
  Send,
  Clock,
} from "lucide-react"

interface Automation {
  id: string
  name: string
  trigger: string
  action: string
  enabled: boolean
  lastRun?: Date
  runCount: number
}

interface FollowUpProps {
  leadId: string
  leadName: string
  leadEmail?: string
  leadPhone: string
  onScheduleFollowUp: (data: any) => void
}

export function AutomationManager() {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: "1",
      name: "Boas-vindas a novos leads",
      trigger: "Novo lead criado",
      action: "Enviar email de boas-vindas",
      enabled: true,
      runCount: 15,
      lastRun: new Date(2026, 0, 20),
    },
    {
      id: "2",
      name: "Follow-up 3 dias",
      trigger: "Lead sem contato há 3 dias",
      action: "Enviar lembrete por email",
      enabled: true,
      runCount: 8,
      lastRun: new Date(2026, 0, 19),
    },
    {
      id: "3",
      name: "Aniversário de pacientes",
      trigger: "Aniversário do paciente",
      action: "Enviar SMS de parabéns + cupom",
      enabled: false,
      runCount: 0,
    },
    {
      id: "4",
      name: "Lembrete de retorno",
      trigger: "6 meses após última consulta",
      action: "Enviar email + SMS de retorno",
      enabled: true,
      runCount: 12,
      lastRun: new Date(2026, 0, 18),
    },
  ])

  const toggleAutomation = (id: string) => {
    setAutomations(
      automations.map((auto) =>
        auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
      )
    )
    toast({
      title: "Automação atualizada",
      description: "Status alterado com sucesso",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Automações Ativas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {automations.map((auto) => (
          <div
            key={auto.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm">{auto.name}</h4>
                <Badge variant={auto.enabled ? "default" : "secondary"}>
                  {auto.enabled ? "Ativa" : "Pausada"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Quando:</strong> {auto.trigger}
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Então:</strong> {auto.action}
              </p>
              {auto.lastRun && (
                <p className="text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Última execução: {auto.lastRun.toLocaleDateString()} ({auto.runCount}x)
                </p>
              )}
            </div>
            <Button
              size="sm"
              variant={auto.enabled ? "outline" : "default"}
              onClick={() => toggleAutomation(auto.id)}
            >
              {auto.enabled ? "Pausar" : "Ativar"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function FollowUpScheduler({
  leadId,
  leadName,
  leadEmail,
  leadPhone,
  onScheduleFollowUp,
}: FollowUpProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: "email",
    date: "",
    time: "",
    message: "",
    subject: "",
  })

  const handleSubmit = () => {
    if (!formData.date || !formData.time || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha data, hora e mensagem",
        variant: "destructive",
      })
      return
    }

    onScheduleFollowUp({
      leadId,
      ...formData,
      scheduledFor: new Date(`${formData.date}T${formData.time}`),
    })

    toast({
      title: "Follow-up agendado",
      description: `${formData.type === "email" ? "Email" : "SMS"} será enviado em ${formData.date} às ${formData.time}`,
    })

    setFormData({
      type: "email",
      date: "",
      time: "",
      message: "",
      subject: "",
    })
    setIsOpen(false)
  }

  const templates = {
    email: [
      {
        name: "Primeiro contato",
        subject: "Olá! Vamos conversar sobre seu tratamento?",
        message: `Olá ${leadName},\n\nVi que você demonstrou interesse em nossos serviços. Gostaria de agendar uma conversa para entender melhor suas necessidades?\n\nFico à disposição!\n\nAtenciosamente,\nClínica Odontológica`,
      },
      {
        name: "Follow-up",
        subject: "Retomando nossa conversa",
        message: `Olá ${leadName},\n\nTudo bem? Gostaria de saber se ainda tem interesse no tratamento que conversamos.\n\nEstou disponível para tirar qualquer dúvida!\n\nAtenciosamente,\nClínica Odontológica`,
      },
    ],
    sms: [
      {
        name: "Lembrete simples",
        message: `Olá ${leadName}! Ainda tem interesse em agendar uma consulta? Responda SIM e entraremos em contato.`,
      },
      {
        name: "Promoção",
        message: `${leadName}, temos uma promoção especial esse mês! Entre em contato: ${leadPhone}`,
      },
    ],
  }

  const applyTemplate = (template: any) => {
    setFormData({
      ...formData,
      subject: template.subject || "",
      message: template.message,
    })
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        Agendar Follow-up
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agendar Follow-up - {leadName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </SelectItem>
                    <SelectItem value="sms">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        SMS
                      </div>
                    </SelectItem>
                    <SelectItem value="whatsapp">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        WhatsApp
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Hora</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Templates */}
            <div className="space-y-2">
              <Label>Templates</Label>
              <div className="flex gap-2 flex-wrap">
                {(formData.type === "email"
                  ? templates.email
                  : templates.sms
                ).map((template, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => applyTemplate(template)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            {formData.type === "email" && (
              <div className="space-y-2">
                <Label>Assunto</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Assunto do email"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Mensagem</Label>
              <Textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Digite sua mensagem..."
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Caracteres: {formData.message.length}
                {formData.type === "sms" && " / 160 (SMS)"}
              </p>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Preview</h4>
              {formData.type === "email" && formData.subject && (
                <p className="text-sm font-semibold mb-1">
                  Assunto: {formData.subject}
                </p>
              )}
              <p className="text-sm whitespace-pre-wrap">
                {formData.message || "Sua mensagem aparecerá aqui..."}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              Agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
