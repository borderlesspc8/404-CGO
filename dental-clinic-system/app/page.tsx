"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { isFirebaseConfigured } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MessageCircle, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [greeting, setGreeting] = useState("Boa Tarde!")
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotSent, setForgotSent] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Get current time in Brasília timezone (UTC-3, or UTC-2 during DST)
    const now = new Date()
    const brasiliaTime = new Date(now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }))
    const hour = brasiliaTime.getHours()

    if (hour >= 0 && hour < 6) {
      setGreeting("Boa Madrugada!")
    } else if (hour >= 6 && hour < 12) {
      setGreeting("Bom dia!")
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Boa tarde!")
    } else {
      setGreeting("Boa noite!")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError(
          isFirebaseConfigured()
            ? "Usuário ou senha inválidos"
            : "E-mail ou senha inválidos.",
        )
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - cores originais */}
      <header className="bg-[#5b4b8a] py-8 px-6 text-center">
        <h1 className="text-[#c9b888] text-4xl font-bold tracking-wider">Oris</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 bg-[#f5f5f5]">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Welcome message */}
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-[#5b4b8a]">{greeting}</h2>
            <p className="text-[#c9b888] text-xl">Seja bem-vindo(a)</p>
          </div>

          {/* Right side - Login form */}
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#5b4b8a] font-semibold">
                  Usuário
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#5b4b8a]/20 focus:border-[#5b4b8a] focus:ring-[#5b4b8a]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#5b4b8a] font-semibold">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#5b4b8a]/20 focus:border-[#5b4b8a] focus:ring-[#5b4b8a] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5b4b8a]/70 hover:text-[#5b4b8a] focus:outline-none"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-[#5b4b8a] data-[state=checked]:bg-[#5b4b8a]"
                />
                <Label htmlFor="remember" className="text-sm text-[#5b4b8a] cursor-pointer font-normal">
                  Lembrar Usuário
                </Label>
              </div>

              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#c9b888] hover:bg-[#b8a777] text-[#5b4b8a] font-bold text-lg py-6"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-[#5b4b8a] text-sm hover:underline"
                  onClick={() => { setShowForgot(true); setForgotSent(false); setForgotEmail("") }}
                >
                  Esqueci Minha Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Dialog Esqueci Minha Senha */}
      <Dialog open={showForgot} onOpenChange={(o) => { setShowForgot(o); if (!o) { setForgotEmail(""); setForgotSent(false) } }}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle className="text-[#5b4b8a]">Recuperar Senha</DialogTitle>
          </DialogHeader>
          {forgotSent ? (
            <div className="text-center py-6">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-green-700 text-lg">Instruções enviadas!</p>
              <p className="text-sm text-gray-500 mt-1">Verifique o e-mail <strong>{forgotEmail}</strong></p>
              <Button className="mt-6 bg-[#5b4b8a] hover:bg-[#4a3a79]" onClick={() => setShowForgot(false)}>
                Fechar
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 pb-2">
                Informe seu e-mail para receber as instruções de recuperação de senha.
              </p>
              <div className="space-y-2">
                <Label className="text-[#5b4b8a] font-semibold">E-mail</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && forgotEmail && setForgotSent(true)}
                  className="border-[#5b4b8a]/20 focus:border-[#5b4b8a]"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setShowForgot(false)}>Cancelar</Button>
                <Button
                  className="bg-[#5b4b8a] hover:bg-[#4a3a79]"
                  onClick={() => setForgotSent(true)}
                  disabled={!forgotEmail.trim()}
                >
                  Enviar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-[#c9b888] py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-[#5b4b8a]" />
            <div>
              <p className="text-[#5b4b8a] font-bold text-lg">Oris Gestão Odontológica Inteligente</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-[#5b4b8a] tracking-wider">Oris</p>
            <p className="text-white text-sm tracking-wide">odontologia</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
