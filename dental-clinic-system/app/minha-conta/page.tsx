"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { mockProfessionals, mockSpecialties } from "@/lib/mock-data"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { AppSidebar } from "@/components/app-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Mail, ShieldCheck, Stethoscope, UserRound } from "lucide-react"

const roleLabels = {
  admin: "Administrador",
  professional: "Profissional",
}

export default function MinhaContaPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated || !user) return null

  const professional = mockProfessionals.find(
    (item) => item.userId === user.id || item.name.toLowerCase() === user.name.toLowerCase(),
  )
  const specialty = professional
    ? mockSpecialties.find((item) => item.id === professional.specialtyId)
    : undefined
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()

  function handleLogout() {
    logout()
    router.push("/")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MainHeader />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-5 min-w-0">
                  <Avatar className="w-20 h-20 border-4 border-[#50348F]/15">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-[#50348F]/10 text-[#50348F] text-xl font-bold">
                      {initials || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold text-[#50348F] truncate">{user.name}</h1>
                      <Badge className="bg-[#50348F] text-white hover:bg-[#50348F]">
                        {roleLabels[user.role]}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Sair da conta
                </Button>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#50348F]" />
                    Acesso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#50348F]">{roleLabels[user.role]}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {user.role === "admin"
                      ? "Acesso administrativo ao sistema."
                      : "Acesso operacional de profissional."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#50348F]" />
                    Vínculo clínico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-[#50348F]">
                    {professional?.name ?? "Sem profissional vinculado"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {specialty?.name ?? "Usuário administrativo ou vínculo ainda não configurado."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-[#50348F]" />
                    Agenda
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold"
                    onClick={() => router.push("/agenda")}
                  >
                    Abrir agenda
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#50348F] flex items-center gap-2">
                  <UserRound className="w-5 h-5" />
                  Dados da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Nome" value={user.name} />
                <Separator />
                <InfoRow label="E-mail de login" value={user.email} />
                <Separator />
                <InfoRow label="Perfil de acesso" value={roleLabels[user.role]} />
                <Separator />
                <InfoRow label="ID interno" value={user.id} />
              </CardContent>
            </Card>
          </div>
        </main>
        <MainFooter />
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <p className="text-sm font-semibold text-gray-400">{label}</p>
      <p className="sm:col-span-2 text-sm font-medium text-gray-800">{value}</p>
    </div>
  )
}
