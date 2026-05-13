import type { NextApiRequest, NextApiResponse } from "next"
import type { UserRole } from "@/lib/mock-data"
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin"

type EmployeeResponse = {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

async function verifyAdmin(req: NextApiRequest) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) return null

  const auth = getAdminAuth()
  const db = getAdminDb()
  if (!auth || !db) return null

  try {
    const token = authHeader.slice(7)
    const decoded = await auth.verifyIdToken(token)
    const profile = await db.collection("users").doc(decoded.uid).get()
    if (!profile.exists || profile.data()?.role !== "admin") return null
    return decoded
  } catch {
    return null
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminUser = await verifyAdmin(req)
  if (!adminUser) {
    return res.status(401).json({ error: "Acesso não autorizado." })
  }

  const auth = getAdminAuth()
  const db = getAdminDb()
  if (!auth || !db) {
    return res.status(503).json({ error: "Firebase Admin não configurado no servidor." })
  }

  if (req.method === "GET") {
    try {
      const snapshot = await db.collection("users").get()
      const employees: EmployeeResponse[] = snapshot.docs
        .map((doc) => {
          const data = doc.data()
          return {
            id: data.id ?? doc.id,
            name: data.name ?? "Funcionário",
            email: data.email ?? "",
            role: (data.role as UserRole) ?? "professional",
            createdAt:
              typeof data.createdAt?.toDate === "function"
                ? data.createdAt.toDate().toISOString()
                : typeof data.createdAt === "string"
                  ? data.createdAt
                  : new Date(0).toISOString(),
          }
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

      return res.status(200).json({ employees })
    } catch {
      return res.status(500).json({ error: "Não foi possível listar os funcionários." })
    }
  }

  if (req.method === "POST") {
    const { name, email, password, role } = req.body as {
      name?: string
      email?: string
      password?: string
      role?: UserRole
    }

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." })
    }

    const normalizedEmail = normalizeEmail(email)
    const employeeRole: UserRole = role === "admin" ? "admin" : "professional"

    try {
      const created = await auth.createUser({
        email: normalizedEmail,
        password,
        displayName: name.trim(),
        disabled: false,
      })

      const employeeId = `emp-${Date.now()}`
      const createdAt = new Date().toISOString()

      await db.collection("users").doc(created.uid).set(
        {
          id: employeeId,
          firebaseUid: created.uid,
          name: name.trim(),
          email: normalizedEmail,
          role: employeeRole,
          avatar: employeeRole === "admin" ? "/admin-user-interface.png" : "/dentist-visit.png",
          createdAt,
          createdBy: adminUser.uid,
        },
        { merge: true },
      )

      return res.status(201).json({
        employee: {
          id: employeeId,
          name: name.trim(),
          email: normalizedEmail,
          role: employeeRole,
          createdAt,
        },
      })
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : ""
      if (code === "auth/email-already-exists") {
        return res.status(409).json({ error: "Já existe um usuário com este e-mail." })
      }
      if (code === "auth/invalid-email") {
        return res.status(400).json({ error: "E-mail inválido." })
      }
      if (code === "auth/weak-password") {
        return res.status(400).json({ error: "Senha muito fraca." })
      }
      return res.status(500).json({ error: "Não foi possível criar o funcionário." })
    }
  }

  return res.status(405).json({ error: "Method not allowed" })
}
