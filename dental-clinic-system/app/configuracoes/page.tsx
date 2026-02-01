"use client"

import { useState, useEffect } from "react"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, Bell, Eye, Palette, Save, Globe } from "lucide-react"

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    soundEffects: false,
    compactView: false,
    autoSave: true,
    language: "pt-BR",
    fontSize: "medium",
  })

  useEffect(() => {
    setMounted(true)
    // Carregar configurações salvas do localStorage
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings))
    alert("Configurações salvas com sucesso!")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fc] to-[#e8e5f5]">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#50348F] mb-2">Configurações</h1>
          <p className="text-[#50348F]">Personalize sua experiência no sistema</p>
        </div>

        <div className="space-y-6">
          {/* Aparência */}
          <Card className="border-[#e5e2f5] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#50348F]">
                <Palette className="w-5 h-5" />
                Aparência
              </CardTitle>
              <CardDescription>Personalize a aparência do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="theme" className="text-base font-medium text-[#50348F]">
                  Tema
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className={`flex items-center gap-2 justify-center ${
                      theme === "light" ? "bg-[#50348F] hover:bg-[#5D40A2]" : ""
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="w-4 h-4" />
                    Claro
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className={`flex items-center gap-2 justify-center ${
                      theme === "dark" ? "bg-[#50348F] hover:bg-[#5D40A2]" : ""
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="w-4 h-4" />
                    Escuro
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className={`flex items-center gap-2 justify-center ${
                      theme === "system" ? "bg-[#50348F] hover:bg-[#5D40A2]" : ""
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="w-4 h-4" />
                    Sistema
                  </Button>
                </div>
              </div>

              <Separator className="bg-[#e5e2f5]" />

              <div className="space-y-3">
                <Label htmlFor="fontSize" className="text-base font-medium text-[#50348F]">
                  Tamanho da Fonte
                </Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value) => setSettings({ ...settings, fontSize: value })}
                >
                  <SelectTrigger className="border-[#e5e2f5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequena</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="compact-view" className="text-base font-medium text-[#50348F]">
                    Visualização Compacta
                  </Label>
                  <p className="text-sm text-[#50348F]">Reduz o espaçamento entre elementos</p>
                </div>
                <Switch
                  id="compact-view"
                  checked={settings.compactView}
                  onCheckedChange={(checked) => setSettings({ ...settings, compactView: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card className="border-[#e5e2f5] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#50348F]">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
              <CardDescription>Gerencie como você recebe notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications" className="text-base font-medium text-[#50348F]">
                    Notificações do Sistema
                  </Label>
                  <p className="text-sm text-[#50348F]">Receba alertas sobre eventos importantes</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                />
              </div>

              <Separator className="bg-[#e5e2f5]" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications" className="text-base font-medium text-[#50348F]">
                    Notificações por E-mail
                  </Label>
                  <p className="text-sm text-[#50348F]">Receba atualizações via e-mail</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <Separator className="bg-[#e5e2f5]" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sound-effects" className="text-base font-medium text-[#50348F]">
                    Efeitos Sonoros
                  </Label>
                  <p className="text-sm text-[#50348F]">Reproduzir sons ao receber notificações</p>
                </div>
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => setSettings({ ...settings, soundEffects: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferências Gerais */}
          <Card className="border-[#e5e2f5] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#50348F]">
                <Globe className="w-5 h-5" />
                Preferências Gerais
              </CardTitle>
              <CardDescription>Configure preferências do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="language" className="text-base font-medium text-[#50348F]">
                  Idioma
                </Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings({ ...settings, language: value })}
                >
                  <SelectTrigger className="border-[#e5e2f5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-[#e5e2f5]" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-save" className="text-base font-medium text-[#50348F]">
                    Salvamento Automático
                  </Label>
                  <p className="text-sm text-[#50348F]">Salvar alterações automaticamente</p>
                </div>
                <Switch
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botão Salvar */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-[#50348F] text-[#50348F] hover:bg-[#50348F]/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#50348F] hover:bg-[#5D40A2] text-white flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
