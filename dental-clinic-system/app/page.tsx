"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Usuário ou senha inválidos")
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with purple background */}
      <header className="bg-[#5b4b8a] py-8 px-6 text-center">
        <h1 className="text-[#c9b888] text-4xl font-bold tracking-wider">PROPAGANDA</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 bg-[#f5f5f5]">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Welcome message */}
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-[#5b4b8a]">Boa Tarde!</h2>
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
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#5b4b8a]/20 focus:border-[#5b4b8a] focus:ring-[#5b4b8a]"
                  required
                />
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
                  onClick={() => alert("Funcionalidade em desenvolvimento")}
                >
                  Esqueci Minha Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#c9b888] py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-[#5b4b8a]" />
            <div>
              <p className="text-[#5b4b8a] font-bold text-lg">CGO</p>
              <p className="text-[#5b4b8a] text-xs">CENTRO GERENCIAL ODONTOLÓGICO</p>
              <p className="text-[#5b4b8a] text-xs font-semibold">SUPORTE PERSONALIZADO</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white tracking-wider">LAPERLE</p>
            <p className="text-[#5b4b8a] text-sm tracking-wide">ODONTOLOGIA</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
