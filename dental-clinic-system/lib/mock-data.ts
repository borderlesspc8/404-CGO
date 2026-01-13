// Mock data structure for the dental clinic system

export type UserRole = "admin" | "professional"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  avatar?: string
}

export interface Specialty {
  id: string
  name: string
  color: string
}

export interface Professional {
  id: string
  name: string
  specialtyId: string
  color: string
  userId?: string
}

export interface Patient {
  id: string
  name: string
  lastName: string
  cpf: string
  rg: string
  birthDate: string
  gender: string
  civilStatus: string
  howKnew: string
  phone: string
  email: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  avatar?: string
  status: "active" | "inactive"
  registeredAt: string
  notes?: string
}

export interface Appointment {
  id: string
  patientId: string
  professionalId: string
  date: string
  startTime: string
  endTime: string
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "noshow"
  type: string
  notes?: string
  financialStatus?: "pending" | "paid" | "approved"
  createdBy: string
  createdAt: string
}

export interface Procedure {
  id: string
  name: string
  type: string
  value: number
  professional: string
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Rafael Correia",
    email: "admin@laperle.com",
    password: "admin123",
    role: "admin",
    avatar: "/admin-user-interface.png",
  },
  {
    id: "2",
    name: "Alaor Pasian Júnior",
    email: "alaor@laperle.com",
    password: "prof123",
    role: "professional",
    avatar: "/dentist-visit.png",
  },
]

// Mock Specialties
export const mockSpecialties: Specialty[] = [
  { id: "1", name: "Ortodontia", color: "#10b981" },
  { id: "2", name: "Implantodontia", color: "#3b82f6" },
  { id: "3", name: "Endodontia", color: "#f59e0b" },
  { id: "4", name: "Periodontia", color: "#ec4899" },
  { id: "5", name: "Prótese", color: "#8b5cf6" },
  { id: "6", name: "Cirurgia", color: "#ef4444" },
  { id: "7", name: "Avaliação", color: "#facc15" },
  { id: "8", name: "Consulta Saúde", color: "#14b8a6" },
]

// Mock Professionals
export const mockProfessionals: Professional[] = [
  { id: "1", name: "Alaor Pasian Júnior", specialtyId: "1", color: "#10b981", userId: "2" },
  { id: "2", name: "Alefy Alves Queiroz Sakai", specialtyId: "2", color: "#3b82f6" },
  { id: "3", name: "Avaliação", specialtyId: "7", color: "#facc15" },
  { id: "4", name: "Bruna Acialdi Previatto", specialtyId: "3", color: "#f59e0b" },
  { id: "5", name: "Consulta Saúde", specialtyId: "8", color: "#14b8a6" },
  { id: "6", name: "Felippe Nagamachi Chaves", specialtyId: "4", color: "#ec4899" },
  { id: "7", name: "Irma dos Santos", specialtyId: "5", color: "#8b5cf6" },
  { id: "8", name: "Luiz Eduardo de Oliveira", specialtyId: "6", color: "#ef4444" },
  { id: "9", name: "Luiz Felipe Oliveira Garcia", specialtyId: "1", color: "#0ea5e9" },
  { id: "10", name: "Paloma Alves dos Santos", specialtyId: "2", color: "#d946ef" },
  { id: "11", name: "Panorâmica", specialtyId: "7", color: "#84cc16" },
  { id: "12", name: "Renan Lindolfo dos Santos", specialtyId: "3", color: "#f97316" },
]

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: "5083",
    name: "Marcio Rodrigo",
    lastName: "de Souza",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    birthDate: "1985-03-15",
    gender: "Masculino",
    civilStatus: "Casado",
    howKnew: "Indicação",
    phone: "(18) 90819-4445",
    email: "gbncorretora@gmail.com",
    address: {
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
    },
    status: "active",
    registeredAt: "2024-01-10",
    notes: "Paciente com histórico de tratamento ortodôntico",
  },
  {
    id: "5084",
    name: "Ana Paula",
    lastName: "Silva",
    cpf: "987.654.321-00",
    rg: "98.765.432-1",
    birthDate: "1990-07-22",
    gender: "Feminino",
    civilStatus: "Solteira",
    howKnew: "Redes Sociais",
    phone: "(18) 98765-4321",
    email: "ana.silva@email.com",
    address: {
      street: "Av. Principal",
      number: "456",
      neighborhood: "Jardim América",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
    },
    status: "active",
    registeredAt: "2024-02-15",
  },
]

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "5083",
    professionalId: "1",
    date: "2025-11-17",
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
    type: "Avaliação",
    notes:
      "ELE USA APARELHO A 6 MESES MAS NÃO ESTA VENDO RESULTADO, ELE QUERIA FAZER AVALIAÇÃO PARA TROCAR O APARELHO E VER SE PRECISA DE ALGUM OUTRO TRATAMENTO",
    financialStatus: "approved",
    createdBy: "Secretária",
    createdAt: "2025-11-14T13:56:00",
  },
  {
    id: "2",
    patientId: "5083",
    professionalId: "4",
    date: "2025-11-17",
    startTime: "12:00",
    endTime: "13:00",
    status: "scheduled",
    type: "Consulta Saúde",
    createdBy: "Admin",
    createdAt: "2025-11-14T14:00:00",
  },
  {
    id: "3",
    patientId: "5084",
    professionalId: "2",
    date: "2025-11-17",
    startTime: "10:30",
    endTime: "12:00",
    status: "completed",
    type: "Consulta Saúde",
    createdBy: "Admin",
    createdAt: "2025-11-14T09:00:00",
  },
  {
    id: "4",
    patientId: "5084",
    professionalId: "6",
    date: "2025-11-17",
    startTime: "13:00",
    endTime: "14:00",
    status: "confirmed",
    type: "Avaliação",
    notes: "Paciente com dor no dente",
    createdBy: "Secretária",
    createdAt: "2025-11-15T10:30:00",
  },
]

// Mock Procedures for a patient
export const mockProcedures: Procedure[] = [
  {
    id: "1",
    name: "Cirurgia Protocolo",
    type: "LAPERLE - PEDRO HENRIQUE RIBEIRO MOTA",
    value: 3015.0,
    professional: "Diovana",
  },
  {
    id: "2",
    name: "Prótese Protocolo",
    type: "LAPERLE - PEDRO HENRIQUE RIBEIRO MOTA",
    value: 12100.0,
    professional: "Diovana",
  },
]
