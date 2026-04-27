"use client"

import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, ClipboardList, DollarSign, Camera, FileText, CalendarDays, Heart } from "lucide-react"

interface PatientTabsProps {
  cadastroContent: React.ReactNode
  procedimentosContent: React.ReactNode
  financeiroContent: React.ReactNode
  fotosContent: React.ReactNode
  contratosContent: React.ReactNode
  agendamentosContent: React.ReactNode
  anamneseContent: React.ReactNode
}

const tabs = [
  { value: "cadastro",      label: "Cadastro",       icon: User },
  { value: "procedimentos", label: "Procedimentos",  icon: ClipboardList },
  { value: "financeiro",    label: "Financeiro",     icon: DollarSign },
  { value: "fotos",         label: "Fotos",          icon: Camera },
  { value: "contratos",     label: "Contratos",      icon: FileText },
  { value: "agendamentos",  label: "Agendamentos",   icon: CalendarDays },
  { value: "anamnese",      label: "Anamnese",       icon: Heart },
]

export function PatientTabs({
  cadastroContent,
  procedimentosContent,
  financeiroContent,
  fotosContent,
  contratosContent,
  agendamentosContent,
  anamneseContent,
}: PatientTabsProps) {
  const contentMap: Record<string, React.ReactNode> = {
    cadastro: cadastroContent,
    procedimentos: procedimentosContent,
    financeiro: financeiroContent,
    fotos: fotosContent,
    contratos: contratosContent,
    agendamentos: agendamentosContent,
    anamnese: anamneseContent,
  }

  return (
    <Tabs defaultValue="cadastro" className="w-full">
      <TabsList className="flex w-full bg-transparent gap-1.5 h-auto flex-wrap">
        {tabs.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="flex items-center gap-1.5 bg-[#50348F]/10 text-[#50348F] border border-[#50348F]/20
              data-[state=active]:bg-[#50348F] data-[state=active]:text-white data-[state=active]:border-[#50348F]
              data-[state=active]:shadow-sm rounded-lg px-3 py-2 text-sm font-medium transition-all
              hover:bg-[#50348F]/20"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ value }) => (
        <TabsContent key={value} value={value} className="mt-4">
          {contentMap[value]}
        </TabsContent>
      ))}
    </Tabs>
  )
}
