"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import Link from "next/link"

interface ModuleCardProps {
  title: string
  description: string
  href: string
  color?: string
}

function ModuleCard({ title, description, href, color = "#5b4b8a" }: ModuleCardProps) {
  return (
    <Link href={href}>
      <div
        className="relative aspect-square rounded-full flex items-center justify-center p-8 text-center cursor-pointer transition-transform hover:scale-105 border-4 border-white shadow-lg"
        style={{ backgroundColor: color }}
      >
        <div className="space-y-2">
          <h3 className="text-white font-bold text-xl">{title}</h3>
          <p className="text-white text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <MainHeader />

      <main className="flex-1 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome message */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-semibold text-[#5b4b8a]">Olá, {user?.name}!</h1>
          </div>

          {/* Module grid - 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <ModuleCard
              title="Agenda"
              description="Agende consultas, remarque e crie alertas de retorno para pacientes."
              href="/agenda"
              color="#5b4b8a"
            />
            <ModuleCard
              title="Cadastro"
              description="Cadastro de pacientes, ficha de procedimentos, financeiro, contratos e outros"
              href="/pacientes"
              color="#5b4b8a"
            />
            <ModuleCard
              title="Financeiro"
              description="Caixa, Conta Corrente, Fluxo de caixa, contas a receber, contas a pagar e outros"
              href="/financeiro"
              color="#5b4b8a"
            />
            <ModuleCard
              title="Dashboard"
              description="Entrada, Saída, Inadimplência, Parcelamentos, Oportunidade e outros"
              href="/dashboard/analytics"
              color="#5b4b8a"
            />
          </div>

          {/* Module grid - 4 columns (second row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ModuleCard
              title="CRM"
              description="Controle de Campanhas, Funil de Leads, Agendamemntos, Desmarque, opção de relatório e outros"
              href="/crm"
              color="#5b4b8a"
            />
            <ModuleCard
              title="Estoque"
              description="Adicionar, Quantidade, Reatórios e outros"
              href="/estoque"
              color="#5b4b8a"
            />
            <ModuleCard
              title="Relatórios"
              description="Caixa, Pagamentos, Comissões, Contas a Pagar, Fluxo Financeiro, Inadimplentees, Oportunidades e outros"
              href="/relatorios"
              color="#5b4b8a"
            />
            <ModuleCard
              title="Dental"
              description="E-commerce com os melhores valores para otimizar seus lucros"
              href="/dental"
              color="#5b4b8a"
            />
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  )
}
