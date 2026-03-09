"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { mockUsers, type User } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restaura sessão do localStorage (evita logout em reload/hot reload)
    const storedUser = localStorage.getItem("dental-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("dental-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userWithoutPassword = { ...foundUser, password: "" }
      setUser(userWithoutPassword)
      localStorage.setItem("dental-user", JSON.stringify(userWithoutPassword))
      // Limpa a flag do vídeo para que seja exibido novamente neste login
      sessionStorage.removeItem("introVideoShown")
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("dental-user")
    // Limpa a flag do vídeo para que seja exibido no próximo login
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
