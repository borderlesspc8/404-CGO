"use client"

import type React from "react"

import { useState } from "react"
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

export function MainHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <header className="bg-[#5b4b8a] px-6 py-4 flex items-center justify-between gap-4">
      {/* Menu button */}
      <Button variant="ghost" size="icon" className="bg-[#c9b888] hover:bg-[#b8a777] rounded-full w-12 h-12">
        <Menu className="w-6 h-6 text-[#5b4b8a]" />
      </Button>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
        <div className="relative">
          <Input
            type="text"
            placeholder="Encontre pacientes ou funções do sistema"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-full pl-6 pr-12 py-6 text-[#5b4b8a] placeholder:text-[#5b4b8a]/50"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b4b8a] hover:text-[#5b4b8a]/70"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
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
  )
}
