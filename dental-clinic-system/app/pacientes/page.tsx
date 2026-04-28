"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { AppSidebar } from "@/components/app-sidebar"
import { createStoredPatient, getStoredPatients, type PatientFormInput } from "@/lib/patients-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Camera, Home, Mail, Phone, Plus, Search, Upload, Users } from "lucide-react"
import type { Patient } from "@/lib/mock-data"

const emptyForm: PatientFormInput = {
  name: "",
  lastName: "",
  cpf: "",
  rg: "",
  birthDate: "",
  gender: "",
  civilStatus: "",
  howKnew: "",
  phone: "",
  email: "",
  address: {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  },
  avatar: "",
  notes: "",
}

export default function PacientesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [patients, setPatients] = useState<Patient[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<PatientFormInput>(emptyForm)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      setPatients(getStoredPatients())
    }
  }, [isAuthenticated])

  const filtered = useMemo(
    () =>
      patients.filter((p) =>
        `${p.name} ${p.lastName} ${p.email} ${p.phone} ${p.id} ${p.cpf}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [patients, search],
  )

  if (isLoading || !isAuthenticated) {
    return null
  }

  function updateForm<K extends keyof PatientFormInput>(key: K, value: PatientFormInput[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateAddress(key: keyof PatientFormInput["address"], value: string) {
    setForm((current) => ({
      ...current,
      address: { ...current.address, [key]: value },
    }))
  }

  function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      updateForm("avatar", String(reader.result))
    }
    reader.readAsDataURL(file)
  }

  function handleCreatePatient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.name.trim() || !form.lastName.trim() || !form.phone.trim()) {
      toast({
        title: "Campos obrigatorios",
        description: "Informe nome, sobrenome e telefone do paciente.",
        variant: "destructive",
      })
      return
    }

    const patient = createStoredPatient({
      ...form,
      name: form.name.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      cpf: form.cpf.trim(),
      rg: form.rg.trim(),
    })

    setPatients(getStoredPatients())
    setDialogOpen(false)
    setForm(emptyForm)
    toast({ title: "Paciente cadastrado", description: `${patient.name} foi adicionado ao cadastro.` })
    router.push(`/pacientes/${patient.id}`)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MainHeader />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#50348F]">Pacientes</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {filtered.length} paciente{filtered.length !== 1 ? "s" : ""} encontrado
                  {filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Paciente
              </Button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Buscar por nome, CPF, e-mail, telefone ou ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white border-gray-200 focus-visible:ring-[#50348F]/30 focus-visible:border-[#50348F]"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <Users className="w-12 h-12 mb-3 opacity-30" />
                <p className="font-medium text-gray-500">Nenhum paciente encontrado</p>
                <p className="text-sm mt-1">Tente buscar por outro nome ou cadastre um novo paciente</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((patient) => (
                  <Link key={patient.id} href={`/pacientes/${patient.id}`}>
                    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#50348F]/40 hover:shadow-md transition-all cursor-pointer group h-full">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-14 h-14 border-2 border-[#50348F]/20 group-hover:border-[#50348F]/50 transition-colors shrink-0">
                          <AvatarImage src={patient.avatar || "/placeholder.svg"} />
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
                              {patient.phone || "Sem telefone"}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate">
                              <Mail className="w-3 h-3 shrink-0" />
                              {patient.email || "Sem e-mail"}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate">
                              <Home className="w-3 h-3 shrink-0" />
                              {[patient.address.city, patient.address.state].filter(Boolean).join(" - ") ||
                                "Endereco nao informado"}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#50348F] text-xl">Cadastro de Paciente</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreatePatient} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex flex-col items-center gap-3 sm:w-40 shrink-0">
                <Avatar className="w-28 h-28 border-4 border-[#50348F]/15">
                  <AvatarImage src={form.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-[#50348F]/10 text-[#50348F] text-2xl font-bold">
                    <Camera className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="avatar"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-[#50348F]/30 px-3 py-2 text-sm font-semibold text-[#50348F] hover:bg-[#50348F]/5 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Foto
                </Label>
                <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>

              <div className="flex-1 space-y-5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#50348F] mb-3">Dados pessoais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Nome" required>
                      <Input value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
                    </Field>
                    <Field label="Sobrenome" required>
                      <Input value={form.lastName} onChange={(e) => updateForm("lastName", e.target.value)} />
                    </Field>
                    <Field label="Telefone" required>
                      <Input value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} />
                    </Field>
                    <Field label="E-mail">
                      <Input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} />
                    </Field>
                    <Field label="CPF">
                      <Input value={form.cpf} onChange={(e) => updateForm("cpf", e.target.value)} />
                    </Field>
                    <Field label="RG">
                      <Input value={form.rg} onChange={(e) => updateForm("rg", e.target.value)} />
                    </Field>
                    <Field label="Data de nascimento">
                      <Input type="date" value={form.birthDate} onChange={(e) => updateForm("birthDate", e.target.value)} />
                    </Field>
                    <Field label="Sexo">
                      <Input value={form.gender} onChange={(e) => updateForm("gender", e.target.value)} />
                    </Field>
                    <Field label="Estado civil">
                      <Input value={form.civilStatus} onChange={(e) => updateForm("civilStatus", e.target.value)} />
                    </Field>
                    <Field label="Como conheceu">
                      <Input value={form.howKnew} onChange={(e) => updateForm("howKnew", e.target.value)} />
                    </Field>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#50348F] mb-3">Endereco simplificado</h3>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <Field label="CEP" className="md:col-span-2">
                      <Input value={form.address.zipCode} onChange={(e) => updateAddress("zipCode", e.target.value)} />
                    </Field>
                    <Field label="Rua" className="md:col-span-3">
                      <Input value={form.address.street} onChange={(e) => updateAddress("street", e.target.value)} />
                    </Field>
                    <Field label="Numero" className="md:col-span-1">
                      <Input value={form.address.number} onChange={(e) => updateAddress("number", e.target.value)} />
                    </Field>
                    <Field label="Complemento" className="md:col-span-2">
                      <Input value={form.address.complement} onChange={(e) => updateAddress("complement", e.target.value)} />
                    </Field>
                    <Field label="Bairro" className="md:col-span-2">
                      <Input value={form.address.neighborhood} onChange={(e) => updateAddress("neighborhood", e.target.value)} />
                    </Field>
                    <Field label="Cidade" className="md:col-span-1">
                      <Input value={form.address.city} onChange={(e) => updateAddress("city", e.target.value)} />
                    </Field>
                    <Field label="UF" className="md:col-span-1">
                      <Input maxLength={2} value={form.address.state} onChange={(e) => updateAddress("state", e.target.value.toUpperCase())} />
                    </Field>
                  </div>
                </div>

                <Field label="Observacoes">
                  <Textarea
                    value={form.notes}
                    onChange={(e) => updateForm("notes", e.target.value)}
                    className="min-h-20"
                  />
                </Field>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#B8AF39] hover:bg-[#F7E70F] text-[#50348F] font-semibold">
                Cadastrar Paciente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-[#50348F] font-semibold text-sm">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      {children}
    </div>
  )
}
