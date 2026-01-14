"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AppSidebar } from "@/components/app-sidebar"
import { mockPatients, mockProfessionals } from "@/lib/mock-data"

interface MainHeaderProps {
  title?: string
}

interface SearchSuggestion {
  id: string
  text: string
  type: string
  link: string
}

export function MainHeader({ title }: MainHeaderProps = {}) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K ou Cmd+K para focar na busca
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      // ESC para fechar sugestões
      if (e.key === "Escape") {
        setShowSuggestions(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClickOutside)
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      generateSuggestions(searchQuery)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  const generateSuggestions = (query: string) => {
    const lowerQuery = query.toLowerCase()
    const newSuggestions: SearchSuggestion[] = []

    // Buscar pacientes
    mockPatients.forEach((patient) => {
      const fullName = `${patient.name} ${patient.lastName}`.toLowerCase()
      if (fullName.includes(lowerQuery) && newSuggestions.length < 5) {
        newSuggestions.push({
          id: patient.id,
          text: `${patient.name} ${patient.lastName}`,
          type: "Paciente",
          link: `/pacientes/${patient.id}`,
        })
      }
    })

    // Buscar profissionais
    mockProfessionals.forEach((prof) => {
      if (prof.name.toLowerCase().includes(lowerQuery) && newSuggestions.length < 8) {
        newSuggestions.push({
          id: prof.id,
          text: prof.name,
          type: "Profissional",
          link: "/agenda",
        })
      }
    })

    // Funções do sistema
    const systemFunctions = [
      { id: "agenda", name: "Agenda", link: "/agenda" },
      { id: "pacientes", name: "Pacientes", link: "/pacientes" },
      { id: "financeiro", name: "Financeiro", link: "/financeiro" },
      { id: "crm", name: "CRM", link: "/crm" },
      { id: "estoque", name: "Estoque", link: "/estoque" },
      { id: "dashboard", name: "Dashboard", link: "/dashboard" },
      { id: "analytics", name: "Relatórios", link: "/dashboard/analytics" },
    ]

    systemFunctions.forEach((func) => {
      if (func.name.toLowerCase().includes(lowerQuery) && newSuggestions.length < 10) {
        newSuggestions.push({
          id: func.id,
          text: func.name,
          type: "Função",
          link: func.link,
        })
      }
    })

    setSuggestions(newSuggestions)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSuggestionClick = (link: string) => {
    setShowSuggestions(false)
    setSearchQuery("")
    router.push(link)
  }

  return (
    <>
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <header className="bg-[#5b4b8a] px-6 py-4 flex items-center justify-between gap-4">
        {/* Menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-[#c9b888] hover:bg-[#b8a777] rounded-full w-12 h-12"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6 text-[#5b4b8a]" />
        </Button>

        {/* Title - if provided */}
        {title && (
          <div className="text-white font-bold text-lg">
            {title}
          </div>
        )}

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
        <div className="relative">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Encontre pacientes ou funções do sistema (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim().length >= 2) {
                setShowSuggestions(true)
              }
            }}
            className="w-full bg-white rounded-full pl-6 pr-12 py-6 text-[#5b4b8a] placeholder:text-[#5b4b8a]/50"
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b4b8a] hover:text-[#5b4b8a]/70"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              {suggestions.map((suggestion) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.link)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between group"
                >
                  <div className="flex-1">
                    <div className="font-medium text-[#5b4b8a] group-hover:text-[#4a3a7a]">
                      {suggestion.text}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {suggestion.type}
                  </span>
                </button>
              ))}
            </div>
            <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
              <button
                type="submit"
                onClick={() => setShowSuggestions(false)}
                className="text-sm text-[#5b4b8a] hover:underline flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Ver todos os resultados para "{searchQuery}"
              </button>
            </div>
          </div>
        )}
      </form>

      {/* User profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 hover:bg-[#5b4b8a]/80">
            <span className="text-white font-medium">{user?.name || "Usuário"}</span>
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback className="bg-[#c9b888] text-[#5b4b8a] font-bold">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
    </>
  )
}
