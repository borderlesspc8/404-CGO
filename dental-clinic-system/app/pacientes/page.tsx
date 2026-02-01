"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { mockPatients } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function PacientesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <MainHeader />

      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#50348F]">Pacientes</h1>
            <Button className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPatients.map((patient) => (
              <Link key={patient.id} href={`/pacientes/${patient.id}`}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-2 border-[#50348F]">
                      <AvatarImage src="/placeholder.svg?height=64&width=64" />
                      <AvatarFallback className="bg-[#B8AF39] text-[#50348F] font-bold">
                        {patient.name.charAt(0)}
                        {patient.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-[#50348F]">
                          {patient.name} {patient.lastName}
                        </h3>
                        <Badge className={patient.status === "active" ? "bg-green-500" : "bg-red-500"}>
                          {patient.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">ID: {patient.id}</p>
                      <p className="text-sm text-gray-600">{patient.phone}</p>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  )
}
