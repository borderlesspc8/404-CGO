"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { AppSidebar } from "@/components/app-sidebar"
import { mockPatients } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Users, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function PacientesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  const filtered = mockPatients.filter((p) =>
    `${p.name} ${p.lastName} ${p.email} ${p.phone} ${p.id}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MainHeader />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#50348F]">Pacientes</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {filtered.length} paciente{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Novo Paciente
              </Button>
            </div>

            {/* Search bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Buscar por nome, e-mail, telefone ou ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white border-gray-200 focus-visible:ring-[#50348F]/30 focus-visible:border-[#50348F]"
              />
            </div>

            {/* Empty state */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <Users className="w-12 h-12 mb-3 opacity-30" />
                <p className="font-medium text-gray-500">Nenhum paciente encontrado</p>
                <p className="text-sm mt-1">Tente buscar por outro nome ou ID</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((patient) => (
                  <Link key={patient.id} href={`/pacientes/${patient.id}`}>
                    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#50348F]/40 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-14 h-14 border-2 border-[#50348F]/20 group-hover:border-[#50348F]/50 transition-colors shrink-0">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-[#50348F]/10 text-[#50348F] font-bold text-lg">
                            {patient.name.charAt(0)}
                            {patient.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-[#50348F] truncate text-sm">
                              {patient.name} {patient.lastName}
                            </h3>
                            <Badge
                              className={`shrink-0 text-[10px] px-1.5 h-4 ${
                                patient.status === "active"
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-red-100 text-red-600 hover:bg-red-100"
                              }`}
                            >
                              {patient.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">#{patient.id}</p>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate">
                              <Phone className="w-3 h-3 shrink-0" />
                              {patient.phone}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate">
                              <Mail className="w-3 h-3 shrink-0" />
                              {patient.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
        <MainFooter />
      </div>
    </div>
  )
}
