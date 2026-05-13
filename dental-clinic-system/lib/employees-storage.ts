import type { UserRole } from "@/lib/mock-data"
import { loadFromStorage } from "@/lib/utils"

export const EMPLOYEES_STORAGE_KEY = "cgo.employees"

export interface StoredEmployee {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: string
}

export interface EmployeeSummary {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function getStoredEmployees(): StoredEmployee[] {
  return loadFromStorage<StoredEmployee[]>(EMPLOYEES_STORAGE_KEY, [])
}

export function saveStoredEmployees(employees: StoredEmployee[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees))
}

export function findStoredEmployeeByEmail(email: string): StoredEmployee | undefined {
  const normalized = normalizeEmail(email)
  return getStoredEmployees().find((employee) => normalizeEmail(employee.email) === normalized)
}

export function addStoredEmployee(input: {
  name: string
  email: string
  password: string
  role?: UserRole
}): EmployeeSummary {
  const email = normalizeEmail(input.email)
  if (findStoredEmployeeByEmail(email)) {
    throw new Error("Já existe um funcionário com este e-mail.")
  }

  const employee: StoredEmployee = {
    id: `emp-${Date.now()}`,
    name: input.name.trim(),
    email,
    password: input.password,
    role: input.role ?? "professional",
    createdAt: new Date().toISOString(),
  }

  const employees = getStoredEmployees()
  employees.unshift(employee)
  saveStoredEmployees(employees)

  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    createdAt: employee.createdAt,
  }
}

export function listStoredEmployeeSummaries(): EmployeeSummary[] {
  return getStoredEmployees().map(({ id, name, email, role, createdAt }) => ({
    id,
    name,
    email,
    role,
    createdAt,
  }))
}
