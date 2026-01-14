"use client"

import React, { useState } from "react"
import { MainHeader } from "@/components/main-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Phone, Mail, MapPin } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  source: string
  status: "novo" | "em-contato" | "qualificado" | "proposta" | "convertido"
  createdAt: string
}

interface Campaign {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  leads: number
  status: "ativa" | "pausada" | "finalizada"
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-8888",
    source: "Google Ads",
    status: "novo",
    createdAt: "2026-01-10",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "(11) 98888-7777",
    source: "Instagram",
    status: "em-contato",
    createdAt: "2026-01-12",
  },
]

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Promoção de Implantes",
    description: "Campanha de implantes dentários com desconto",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    leads: 15,
    status: "ativa",
  },
  {
    id: "2",
    name: "Limpeza Preventiva",
    description: "Promoção de limpeza e prevenção",
    startDate: "2025-12-01",
    endDate: "2025-12-31",
    leads: 8,
    status: "finalizada",
  },
]

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
  })

  const getStatusColor = (status: string) => {
    const colors = {
      novo: "bg-blue-100 text-blue-800",
      "em-contato": "bg-yellow-100 text-yellow-800",
      qualificado: "bg-purple-100 text-purple-800",
      proposta: "bg-orange-100 text-orange-800",
      convertido: "bg-green-100 text-green-800",
      ativa: "bg-green-100 text-green-800",
      pausada: "bg-yellow-100 text-yellow-800",
      finalizada: "bg-gray-100 text-gray-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleAddLead = () => {
    if (newLead.name && newLead.email && newLead.phone) {
      const lead: Lead = {
        id: Math.random().toString(),
        ...newLead,
        status: "novo",
        createdAt: new Date().toISOString().split("T")[0],
      }
      setLeads([...leads, lead])
      setNewLead({ name: "", email: "", phone: "", source: "" })
    }
  }

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter((lead) => lead.id !== id))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MainHeader title="CRM - Gestão de Relacionamento" />
        <main className="flex-1 overflow-auto p-8">
          <Tabs defaultValue="leads" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
              <TabsTrigger value="relatorio">Relatório</TabsTrigger>
            </TabsList>

            {/* Leads Tab */}
            <TabsContent value="leads" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#5b4b8a]">Leads</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#5b4b8a] hover:bg-[#4a3a7a]">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Lead
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Lead</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome</Label>
                        <Input
                          placeholder="Nome do lead"
                          value={newLead.name}
                          onChange={(e) =>
                            setNewLead({ ...newLead, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          value={newLead.email}
                          onChange={(e) =>
                            setNewLead({ ...newLead, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Telefone</Label>
                        <Input
                          placeholder="(11) 99999-9999"
                          value={newLead.phone}
                          onChange={(e) =>
                            setNewLead({ ...newLead, phone: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Origem</Label>
                        <Input
                          placeholder="Ex: Google Ads, Instagram"
                          value={newLead.source}
                          onChange={(e) =>
                            setNewLead({ ...newLead, source: e.target.value })
                          }
                        />
                      </div>
                      <Button
                        onClick={handleAddLead}
                        className="w-full bg-[#5b4b8a] hover:bg-[#4a3a7a]"
                      >
                        Adicionar Lead
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="bg-white rounded-lg shadow">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {lead.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {lead.phone}
                          </div>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{lead.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteLead(lead.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Campanhas Tab */}
            <TabsContent value="campanhas" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#5b4b8a]">Campanhas</h2>
                <Button className="bg-[#5b4b8a] hover:bg-[#4a3a7a]">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Campanha
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-[#5b4b8a]">
                            {campaign.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-2">
                            {campaign.description}
                          </p>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Início</p>
                          <p className="font-semibold">{campaign.startDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Fim</p>
                          <p className="font-semibold">{campaign.endDate}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-xs text-gray-600">Leads Gerados</p>
                        <p className="text-2xl font-bold text-[#5b4b8a]">
                          {campaign.leads}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Relatório Tab */}
            <TabsContent value="relatorio" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#5b4b8a]">Relatórios</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total de Leads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#5b4b8a]">
                      {leads.length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Campanhas Ativas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {campaigns.filter((c) => c.status === "ativa").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Taxa de Conversão
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {leads.length > 0
                        ? Math.round(
                            (leads.filter((l) => l.status === "convertido").length /
                              leads.length) *
                              100
                          )
                        : 0}
                      %
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Leads Qualificados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {leads.filter((l) =>
                        ["qualificado", "proposta", "convertido"].includes(
                          l.status
                        )
                      ).length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
