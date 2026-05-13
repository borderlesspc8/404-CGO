"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { getDb, getFirebaseAuth } from "@/lib/firebase"
import { findStoredEmployeeByEmail } from "@/lib/employees-storage"
import { mockUsers, type User, type UserRole } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_COOKIE = "auth-token"
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

function setAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

function roleFromEmail(email: string): UserRole {
  return email.includes("admin") ? "admin" : "professional"
}

function profileFromFirebaseUser(firebaseUser: FirebaseUser): User {
  const knownUser = mockUsers.find((item) => item.email === firebaseUser.email)
  return {
    id: knownUser?.id ?? firebaseUser.uid,
    firebaseUid: firebaseUser.uid,
    name: knownUser?.name ?? firebaseUser.displayName ?? firebaseUser.email ?? "Usuário",
    email: firebaseUser.email ?? knownUser?.email ?? "",
    role: knownUser?.role ?? roleFromEmail(firebaseUser.email ?? ""),
    avatar: knownUser?.avatar ?? firebaseUser.photoURL ?? undefined,
  }
}

async function loadUserProfile(firebaseUser: FirebaseUser): Promise<User> {
  const fallbackProfile = profileFromFirebaseUser(firebaseUser)
  const db = getDb()

  if (!db) return fallbackProfile

  try {
    const ref = doc(db, "users", firebaseUser.uid)
    const snap = await getDoc(ref)

    if (!snap.exists()) {
      try {
        await setDoc(
          ref,
          {
            id: fallbackProfile.id,
            firebaseUid: firebaseUser.uid,
            name: fallbackProfile.name,
            email: fallbackProfile.email,
            role: fallbackProfile.role,
            avatar: fallbackProfile.avatar ?? null,
          },
          { merge: true },
        )
      } catch {
        // Firestore write failed (regras ou banco não criado) — usa perfil local
      }
      return fallbackProfile
    }

    const data = snap.data() as Partial<User>
    return {
      id: data.id ?? fallbackProfile.id,
      firebaseUid: firebaseUser.uid,
      name: data.name ?? fallbackProfile.name,
      email: data.email ?? fallbackProfile.email,
      role: data.role ?? fallbackProfile.role,
      avatar: data.avatar ?? fallbackProfile.avatar,
    }
  } catch {
    // Firestore inacessível — usa perfil derivado do Firebase Auth
    return fallbackProfile
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    localStorage.removeItem("dental-user")

    const auth = getFirebaseAuth()
    if (!auth) {
      setUser(null)
      setIsLoading(false)
      return
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setIsLoading(true)
        if (!firebaseUser) {
          setUser(null)
          clearAuthCookie()
          return
        }
        setAuthCookie()
        setUser(await loadUserProfile(firebaseUser))
      } finally {
        setIsLoading(false)
      }
    })
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const auth = getFirebaseAuth()

    // Fallback para modo demo quando Firebase não está configurado
    if (!auth) {
      const employee = findStoredEmployeeByEmail(email)
      if (employee && employee.password === password) {
        setUser({
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
        })
        setAuthCookie()
        sessionStorage.removeItem("introVideoShown")
        return true
      }

      const found = mockUsers.find((u) => u.email === email)
      if (found && password === "demo123") {
        setUser(found)
        setAuthCookie()
        sessionStorage.removeItem("introVideoShown")
        return true
      }
      return false
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      setAuthCookie()
      setUser(await loadUserProfile(credential.user))
      sessionStorage.removeItem("introVideoShown")
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    const auth = getFirebaseAuth()
    if (auth) {
      await signOut(auth)
    }
    setUser(null)
    clearAuthCookie()
    localStorage.removeItem("dental-user")
    sessionStorage.removeItem("introVideoShown")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
