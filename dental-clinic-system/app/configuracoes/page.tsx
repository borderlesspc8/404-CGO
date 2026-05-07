"use client"

import { useState, useEffect } from "react"
import { MainHeader } from "@/components/main-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import {
  Moon, Sun, Monitor, Bell, Eye, Palette, Save, Globe,
  Building2, Clock, Check, UserCog, Shield, Trash2,
} from "lucide-react"
import { toast } from "sonner"

const SETTINGS_KEY = "userSettings"
const CLINIC_KEY = "clinicSettings"

interface AppSettings {
  notifications: boolean
  emailNotifications: boolean
  soundEffects: boolean
  compactView: boolean
  autoSave: boolean
  language: string
  fontSize: string
}

interface ClinicSettings {
  name: string
  phone: string
  email: string
  address: string
  openTime: string
  closeTime: string
  workDays: string[]
}

const defaultApp: AppSettings = {
  notifications: true,
  emailNotifications: true,
  soundEffects: false,
  compactView: false,
  autoSave: true,
  language: "pt-BR",
  fontSize: "medium",
}

const defaultClinic: ClinicSettings = {
  name: "Clínica Odontológica Oris",
  phone: "(11) 99999-9999",
  email: "contato@oris.com.br",
  address: "Rua das Flores, 123 - São Paulo/SP",
  openTime: "08:00",
  closeTime: "18:00",
  workDays: ["seg", "ter", "qua", "qui", "sex"],
}

const weekDays = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sáb" },
  { id: "dom", label: "Dom" },
]

const fontSizeMap: Record<string, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
}

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState<AppSettings>(defaultApp)
  const [clinic, setClinic] = useState<ClinicSettings>(defaultClinic)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) setSettings(JSON.parse(stored))
    const storedClinic = localStorage.getItem(CLINIC_KEY)
    if (storedClinic) setClinic(JSON.parse(storedClinic))
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.style.fontSize = fontSizeMap[settings.fontSize] || "16px"
  }, [settings.fontSize, mounted])

  function toggleDay(day: string) {
    setClinic((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day],
    }))
  }

  function handleSave() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    localStorage.setItem(CLINIC_KEY, JSON.stringify(clinic))
    setSaved(true)
    toast.success("Configurações salvas com sucesso!")
    setTimeout(() => setSaved(false), 2500)
  }

  function handleReset() {
    setSettings(defaultApp)
    setClinic(defaultClinic)
    localStorage.removeItem(SETTINGS_KEY)
    localStorage.removeItem(CLINIC_KEY)
    toast.info("Configurações restauradas para o padrão.")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#50348F] rounded-full text-white">
              <UserCog className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#50348F]">Configurações</h1>
              <p className="text-sm text-muted-foreground">Personalize sua experiência no sistema</p>
            </div>
          </div>

          {/* Dados da Clínica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#50348F]">
                <Building2 className="w-5 h-5" />
                Dados da Clínica
              </CardTitle>
              <CardDescription>Informações exibidas em relatórios e documentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Nome da Clínica</Label>
                  <Input value={clinic.name} onChange={(e) => setClinic({ ...clinic, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Telefone</Label>
                  <Input value={clinic.phone} onChange={(e) => setClinic({ ...clinic, phone: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>E-mail</Label>
                  <Input type="email" value={clinic.email} onChange={(e) => setClinic({ ...clinic, email: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Endereço</Label>
                  <Input value={clinic.address} onChange={(e) => setClinic({ ...clinic, address: e.target.value })} />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-[#50348F] font-medium">
                  <Clock className="w-4 h-4" />
                  Horário de Funcionamento
                </Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground w-16">Abertura</Label>
                    <Input type="time" className="w-32" value={clinic.openTime} onChange={(e) => setClinic({ ...clinic, openTime: e.target.value })} />
                  </div>
                  <span className="text-muted-foreground">até</span>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground w-16">Fechamento</Label>
                    <Input type="time" className="w-32" value={clinic.closeTime} onChange={(e) => setClinic({ ...clinic, closeTime: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Dias de atendimento</Label>
                  <div className="flex gap-2 flex-wrap">
                    {weekDays.map((day) => (
                      <button
                        key={day.id}
                        onClick={() => toggleDay(day.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          clinic.workDays.includes(day.id)
                            ? "bg-[#50348F] text-white border-[#50348F]"
                            : "bg-white text-gray-600 border-gray-300 hover:border-[#50348F]"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aparência */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#50348F]">
                <Palette className="w-5 h-5" />
                Aparência
              </CardTitle>
              <CardDescription>Personalize a aparência do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium text-[#50348F]">Tema</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", icon: <Sun className="w-4 h-4" />, label: "Claro" },
                    { value: "dark",  icon: <Moon className="w-4 h-4" />, label: "Escuro" },
                    { value: "system",icon: <Monitor className="w-4 h-4" />, label: "Sistema" },
                  ].map((t) => (
                    <Button
                      key={t.value}
                      variant={theme === t.value ? "default" : "outline"}
                      className={`flex items-center gap-2 justify-center ${theme === t.value ? "bg-[#50348F] hover:bg-[#5D40A2]" : ""}`}
                      onClick={() => setTheme(t.value)}
                    >
                      {t.icon}
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-base font-medium text-[#50348F]">Tamanho da Fonte</Label>
                <Select value={settings.fontSize} onValueChange={(v) => setSettings({ ...settings, fontSize: v })}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequena (14px)</SelectItem>
                    <SelectItem value="medium">Média (16px)</SelectItem>
                    <SelectItem value="large">Grande (18px)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">A alteração é aplicada imediatamente.</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium text-[#50348F]">Visualização Compacta</Label>
                  <p className="text-sm text-muted-foreground">Reduz o espaçamento entre elementos</p>
                </div>
                <Switch
                  checked={settings.compactView}
                  onCheckedChange={(v) => {
                    setSettings({ ...settings, compactView: v })
                    document.body.classList.toggle("compact-view", v)
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#50348F]">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
              <CardDescription>Gerencie como você recebe alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                {
                  key: "notifications" as const,
                  label: "Notificações do Sistema",
                  desc: "Alertas sobre consultas, pagamentos e eventos importantes",
                },
                {
                  key: "emailNotifications" as const,
                  label: "Notificações por E-mail",
                  desc: "Receba atualizações e lembretes via e-mail",
                },
                {
                  key: "soundEffects" as const,
                  label: "Efeitos Sonoros",
                  desc: "Reproduzir sons ao receber notificações",
                },
              ].map((item, i, arr) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium text-[#50348F]">{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={settings[item.key]}
                      onCheckedChange={(v) => setSettings({ ...settings, [item.key]: v })}
                    />
                  </div>
                  {i < arr.length - 1 && <Separator className="mt-5" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Preferências Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#50348F]">
                <Globe className="w-5 h-5" />
                Preferências Gerais
              </CardTitle>
              <CardDescription>Idioma e comportamento do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium text-[#50348F]">Idioma</Label>
                <Select value={settings.language} onValueChange={(v) => setSettings({ ...settings, language: v })}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium text-[#50348F]">Salvamento Automático</Label>
                  <p className="text-sm text-muted-foreground">Salvar alterações de formulários automaticamente</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(v) => setSettings({ ...settings, autoSave: v })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#50348F]">
                <Shield className="w-5 h-5" />
                Segurança e Dados
              </CardTitle>
              <CardDescription>Privacidade e gerenciamento de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium text-[#50348F]">Limpar dados locais</Label>
                  <p className="text-sm text-muted-foreground">Remove cache e configurações salvas no navegador</p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
                  onClick={() => {
                    if (confirm("Tem certeza? Todos os dados locais serão removidos.")) {
                      localStorage.clear()
                      toast.success("Dados locais removidos. Recarregando...")
                      setTimeout(() => window.location.reload(), 1500)
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center pb-6">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
            >
              Restaurar Padrão
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-[#50348F] text-[#50348F] hover:bg-[#50348F]/10"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#50348F] hover:bg-[#5D40A2] text-white flex items-center gap-2 min-w-40"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Salvo!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </div>
          </div>

          </div>{/* /max-w-3xl */}
        </main>
      </div>
    </div>
  )
}
