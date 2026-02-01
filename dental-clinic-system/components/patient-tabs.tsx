"use client"

import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PatientTabsProps {
  cadastroContent: React.ReactNode
  procedimentosContent: React.ReactNode
  financeiroContent: React.ReactNode
  fotosContent: React.ReactNode
  contratosContent: React.ReactNode
  agendamentosContent: React.ReactNode
  anamneseContent: React.ReactNode
}

export function PatientTabs({
  cadastroContent,
  procedimentosContent,
  financeiroContent,
  fotosContent,
  contratosContent,
  agendamentosContent,
  anamneseContent,
}: PatientTabsProps) {
  return (
    <Tabs defaultValue="cadastro" className="w-full">
      <TabsList className="grid w-full grid-cols-7 bg-transparent gap-2">
        <TabsTrigger
          value="cadastro"
          className="bg-[#50348F] text-white data-[state=active]:bg-[#B8AF39] data-[state=active]:text-[#50348F] rounded-full font-semibold"
        >
          Cadastro
        </TabsTrigger>
        <TabsTrigger
          value="procedimentos"
          className="bg-[#50348F] text-white data-[state=active]:bg-[#B8AF39] data-[state=active]:text-[#50348F] rounded-full font-semibold"
        >
          Procedimentos
        </TabsTrigger>
        <TabsTrigger
          value="financeiro"
          className="bg-[#50348F] text-white data-[state=active]:bg-[#B8AF39] data-[state=active]:text-[#50348F] rounded-full font-semibold"
        >
          Financeiro
        </TabsTrigger>
        <TabsTrigger
          value="fotos"
          className="bg-[#50348F] text-white data-[state=active]:bg-[#B8AF39] data-[state=active]:text-[#50348F] rounded-full font-semibold"
        >
          Fotos
        </TabsTrigger>
        <TabsTrigger
          value="contratos"
          className="bg-[#50348F] text-white data-[state=active]:bg-[#B8AF39] data-[state=active]:text-[#50348F] rounded-full font-semibold"
        >
          Contratos
        </TabsTrigger>
        <TabsTrigger
          value="agendamentos"
          className="bg-[#50348F] text-white data-[state=active]:bg-[#B8AF39] data-[state=active]:text-[#50348F] rounded-full font-semibold"
        >
          Agendamentos
        </TabsTrigger>
        <TabsTrigger
          value="anamnese"
          className="bg-[#50348F] text-white data-[state=active]:bg-[#B8AF39] data-[state=active]:text-[#50348F] rounded-full font-semibold"
        >
          Anamnese
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cadastro">{cadastroContent}</TabsContent>
      <TabsContent value="procedimentos">{procedimentosContent}</TabsContent>
      <TabsContent value="financeiro">{financeiroContent}</TabsContent>
      <TabsContent value="fotos">{fotosContent}</TabsContent>
      <TabsContent value="contratos">{contratosContent}</TabsContent>
      <TabsContent value="agendamentos">{agendamentosContent}</TabsContent>
      <TabsContent value="anamnese">{anamneseContent}</TabsContent>
    </Tabs>
  )
}
