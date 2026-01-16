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

export default function BuscaPage() {
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

    // Buscar em Pacientes
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

    // Buscar em Agendamentos
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

    // Buscar em Profissionais
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

    // Buscar em Funções do Sistema
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

    // Simular dados de estoque
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

    // Simular dados de CRM
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

  const getTypeColor = (type: string) => {
    const colors = {
      paciente: "bg-blue-100 text-blue-800",
      agendamento: "bg-green-100 text-green-800",
      profissional: "bg-purple-100 text-purple-800",
      funcao: "bg-orange-100 text-orange-800",
      estoque: "bg-pink-100 text-pink-800",
      crm: "bg-yellow-100 text-yellow-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MainHeader />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Search Header */}
            <div className="flex items-center gap-3">
              <SearchIcon className="w-8 h-8 text-[#5b4b8a]" />
              <div>
                <h1 className="text-3xl font-bold text-[#5b4b8a]">Resultados da Busca</h1>
                {query && (
                  <p className="text-gray-600 mt-1">
                    Buscando por: <span className="font-semibold">"{query}"</span>
                  </p>
                )}
              </div>
            </div>

            {/* Results Count */}
            {!loading && query && (
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-gray-700">
                  {results.length === 0 ? (
                    <span className="text-gray-500">Nenhum resultado encontrado</span>
                  ) : (
                    <span>
                      <span className="font-bold text-[#5b4b8a]">{results.length}</span>{" "}
                      {results.length === 1 ? "resultado encontrado" : "resultados encontrados"}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b4b8a]"></div>
              </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
              <div className="space-y-4">
                {results.map((result) => (
                  <Card key={`${result.type}-${result.id}`} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 flex-1">
                          <div className="mt-1 text-[#5b4b8a]">{result.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-[#5b4b8a]">
                                {result.title}
                              </h3>
                              <Badge className={getTypeColor(result.type)}>
                                {result.type}
                              </Badge>
                              {result.badge && (
                                <Badge variant="outline">{result.badge}</Badge>
                              )}
                            </div>
                            {result.subtitle && (
                              <p className="text-sm text-gray-600 mb-1">{result.subtitle}</p>
                            )}
                            {result.description && (
                              <p className="text-sm text-gray-500">{result.description}</p>
                            )}
                          </div>
                        </div>
                        <Link href={result.link}>
                          <Button className="bg-[#5b4b8a] hover:bg-[#4a3a7a]">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !query && (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Digite algo para buscar
                </h3>
                <p className="text-gray-500">
                  Busque por pacientes, agendamentos, profissionais, funções do sistema e mais
                </p>
              </div>
            )}

            {/* No Results State */}
            {!loading && query && results.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-500">
                  Tente buscar com outros termos ou verifique a ortografia
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
