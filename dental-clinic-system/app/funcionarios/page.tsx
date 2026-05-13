"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase"
import {
  addStoredEmployee,
  listStoredEmployeeSummaries,
  type EmployeeSummary,
} from "@/lib/employees-storage"
import type { UserRole } from "@/lib/mock-data"
import { Eye, EyeOff, Loader2, UserPlus, Users } from "lucide-react"
import { toast } from "sonner"

const roleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  professional: "Profissional",
}

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "professional" as UserRole,
}

async function getAuthToken(): Promise<string | null> {
  const auth = getFirebaseAuth()
  if (!auth?.currentUser) return null
  return auth.currentUser.getIdToken()
}

export default function FuncionariosPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [employees, setEmployees] = useState<EmployeeSummary[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard")
    }
  }, [isLoading, user, router])

  async function loadEmployees() {
    setLoadingEmployees(true)

    try {
      if (isFirebaseConfigured()) {
        const token = await getAuthToken()
        if (!token) {
          setEmployees([])
          return
        }

        const response = await fetch("/api/employees", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error ?? "Não foi possível carregar os funcionários.")
        }

        setEmployees(data.employees ?? [])
        return
      }

      setEmployees(listStoredEmployeeSummaries())
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao carregar funcionários.")
    } finally {
      setLoadingEmployees(false)
    }
  }

  useEffect(() => {
    if (user?.role === "admin") {
      void loadEmployees()
    }
  }, [user?.role])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error("Preencha nome, e-mail e senha.")
      return
    }

    if (form.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem.")
      return
    }

    setSubmitting(true)

    try {
      if (isFirebaseConfigured()) {
        const token = await getAuthToken()
        if (!token) {
          throw new Error("Sessão expirada. Faça login novamente.")
        }

        const response = await fetch("/api/employees", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          }),
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error ?? "Não foi possível cadastrar o funcionário.")
        }

        setEmployees((current) => [data.employee, ...current])
      } else {
        const employee = addStoredEmployee({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        })
        setEmployees((current) => [employee, ...current])
      }

      setForm(emptyForm)
      toast.success("Funcionário cadastrado. Ele já pode entrar com e-mail e senha.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cadastrar funcionário.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!mounted || isLoading || !user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#50348F] rounded-full text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#50348F]">Funcionários</h1>
                <p className="text-sm text-muted-foreground">
                  Cadastre acessos para a equipe entrar com e-mail e senha.
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#50348F]">
                  <UserPlus className="w-5 h-5" />
                  Novo funcionário
                </CardTitle>
                <CardDescription>
                  O acesso é criado imediatamente e pode ser usado na tela de login.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="employee-name">Nome completo</Label>
                    <Input
                      id="employee-name"
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Ex.: Ana Souza"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-email">E-mail</Label>
                    <Input
                      id="employee-email"
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder="funcionario@clinica.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Perfil</Label>
                    <Select
                      value={form.role}
                      onValueChange={(value: UserRole) => setForm((current) => ({ ...current, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Profissional</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="employee-password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, password: event.target.value }))
                        }
                        placeholder="Mínimo de 6 caracteres"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword((current) => !current)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-confirm-password">Confirmar senha</Label>
                    <Input
                      id="employee-confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, confirmPassword: event.target.value }))
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Button type="submit" disabled={submitting} className="bg-[#50348F] hover:bg-[#50348F]/90">
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        "Cadastrar funcionário"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#50348F]">Equipe cadastrada</CardTitle>
                <CardDescription>
                  {isFirebaseConfigured()
                    ? "Contas criadas no Firebase Auth."
                    : "Contas salvas localmente para o modo demonstração."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEmployees ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando funcionários...
                  </div>
                ) : employees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum funcionário cadastrado ainda.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead>Cadastro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{roleLabels[employee.role]}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(employee.createdAt).toLocaleDateString("pt-BR")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
