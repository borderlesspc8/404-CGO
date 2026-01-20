"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MainHeader } from "@/components/main-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  Package,
  FileText,
  Eye,
  Search as SearchIcon,
} from "lucide-react"
import { mockPatients, mockAppointments, mockProfessionals } from "@/lib/mock-data"

interface SearchResult {
  id: string
  type: "paciente" | "agendamento" | "profissional" | "funcao" | "estoque" | "crm"
  title: string
  subtitle?: string
  description?: string
  link: string
  icon: React.ReactNode
  badge?: string
}

const systemFunctions = [
  { id: "dashboard", name: "Dashboard", description: "Entrada, Saída, Inadimplência", link: "/dashboard", icon: <FileText className="w-5 h-5" /> },
  { id: "agenda", name: "Agenda", description: "Agende consultas, remarque e crie alertas", link: "/agenda", icon: <Calendar className="w-5 h-5" /> },
  { id: "pacientes", name: "Pacientes", description: "Cadastro de pacientes e ficha de procedimentos", link: "/pacientes", icon: <Users className="w-5 h-5" /> },
  { id: "financeiro", name: "Financeiro", description: "Caixa, Conta Corrente, Fluxo de caixa", link: "/financeiro", icon: <DollarSign className="w-5 h-5" /> },
  { id: "crm", name: "CRM", description: "Controle de Campanhas, Funil de Leads", link: "/crm", icon: <MessageSquare className="w-5 h-5" /> },
  { id: "estoque", name: "Estoque", description: "Adicionar, Quantidade, Relatórios", link: "/estoque", icon: <Package className="w-5 h-5" /> },
  { id: "analytics", name: "Relatórios", description: "Análise de dados e métricas", link: "/dashboard/analytics", icon: <FileText className="w-5 h-5" /> },
]

export default function SearchClient() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      performSearch(query)
    } else {
      setResults([])
      setLoading(false)
    }
  }, [query])

  const performSearch = (searchQuery: string) => {
    setLoading(true)
    const lowerQuery = searchQuery.toLowerCase()
    const foundResults: SearchResult[] = []

    mockPatients.forEach((patient) => {
      const fullName = `${patient.name} ${patient.lastName}`.toLowerCase()
      if (
        fullName.includes(lowerQuery) ||
        patient.phone.includes(lowerQuery) ||
        patient.email.toLowerCase().includes(lowerQuery) ||
        patient.cpf.includes(lowerQuery)
      ) {
        foundResults.push({
          id: patient.id,
          type: "paciente",
          title: `${patient.name} ${patient.lastName}`,
          subtitle: patient.phone,
          description: patient.email,
          link: `/pacientes/${patient.id}`,
          icon: <Users className="w-5 h-5" />,
          badge: patient.status === "active" ? "Ativo" : "Inativo",
        })
      }
    })

    mockAppointments.forEach((appointment) => {
      const patient = mockPatients.find((p) => p.id === appointment.patientId)
      const professional = mockProfessionals.find((p) => p.id === appointment.professionalId)
      
      if (patient) {
        const fullName = `${patient.name} ${patient.lastName}`.toLowerCase()
        const professionalName = professional?.name.toLowerCase() || ""
        
        if (
          fullName.includes(lowerQuery) ||
          professionalName.includes(lowerQuery) ||
          appointment.type.toLowerCase().includes(lowerQuery) ||
          appointment.date.includes(lowerQuery)
        ) {
          foundResults.push({
            id: appointment.id,
            type: "agendamento",
            title: `Agendamento - ${patient.name} ${patient.lastName}`,
            subtitle: `${appointment.date} às ${appointment.startTime}`,
            description: `${appointment.type} - ${professional?.name || "Profissional não encontrado"}`,
            link: "/agenda",
            icon: <Calendar className="w-5 h-5" />,
            badge: appointment.status === "confirmed" ? "Confirmado" : 
                   appointment.status === "completed" ? "Concluído" : 
                   appointment.status === "cancelled" ? "Cancelado" : "Agendado",
          })
        }
      }
    })

    mockProfessionals.forEach((professional) => {
      if (professional.name.toLowerCase().includes(lowerQuery)) {
        foundResults.push({
          id: professional.id,
          type: "profissional",
          title: professional.name,
          subtitle: "Profissional",
          description: `Especialidade: ${professional.specialtyId}`,
          link: "/agenda",
          icon: <Users className="w-5 h-5" />,
        })
      }
    })

    systemFunctions.forEach((func) => {
      if (
        func.name.toLowerCase().includes(lowerQuery) ||
        func.description.toLowerCase().includes(lowerQuery)
      ) {
        foundResults.push({
          id: func.id,
          type: "funcao",
          title: func.name,
          subtitle: "Função do Sistema",
          description: func.description,
          link: func.link,
          icon: func.icon,
        })
      }
    })

    const mockStock = [
      { id: "1", name: "Resina Composta A2", category: "Restauração", quantity: 45 },
      { id: "2", name: "Anestésico Articaína", category: "Medicamentos", quantity: 5 },
      { id: "3", name: "Fio Dental Fluorado", category: "Higiene", quantity: 120 },
    ]

    mockStock.forEach((item) => {
      if (
        item.name.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
      ) {
        foundResults.push({
          id: item.id,
          type: "estoque",
          title: item.name,
          subtitle: item.category,
          description: `Quantidade: ${item.quantity} unidades`,
          link: "/estoque",
          icon: <Package className="w-5 h-5" />,
        })
      }
    })

    const mockLeads = [
      { id: "1", name: "João Silva", email: "joao@email.com", source: "Google Ads" },
      { id: "2", name: "Maria Santos", email: "maria@email.com", source: "Instagram" },
    ]

    mockLeads.forEach((lead) => {
      if (
        lead.name.toLowerCase().includes(lowerQuery) ||
        lead.email.toLowerCase().includes(lowerQuery)
      ) {
        foundResults.push({
          id: lead.id,
          type: "crm",
          title: lead.name,
          subtitle: "Lead - CRM",
          description: `${lead.email} - Origem: ${lead.source}`,
          link: "/crm",
          icon: <MessageSquare className="w-5 h-5" />,
        })
      }
    })

    setResults(foundResults)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#5b4b8a] rounded-full text-white">
              <SearchIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#5b4b8a]">Resultados da Busca</h1>
              <p className="text-sm text-muted-foreground">Termo: {query || "(vazio)"}</p>
            </div>
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Buscando resultados...</p>
              </CardContent>
            </Card>
          ) : results.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result) => (
                <Card key={`${result.type}-${result.id}`} className="hover:shadow-lg transition">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-[#5b4b8a]/10 text-[#5b4b8a]">
                        {result.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{result.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                      </div>
                    </div>
                    {result.badge && <Badge>{result.badge}</Badge>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.description && (
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                    )}
                    <Button asChild className="w-full bg-[#5b4b8a] hover:bg-[#4a3c7a]">
                      <Link href={result.link} className="flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        Ver detalhes
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
