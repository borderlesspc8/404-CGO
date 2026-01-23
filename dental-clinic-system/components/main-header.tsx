"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LogOut, Menu, Search, User, ShoppingCart } from "lucide-react"
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
import { useShoppingCart } from "@/components/shopping-cart-context"

export function MainHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { getItemCount } = useShoppingCart()
  const cartCount = getItemCount()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleProfile = () => {
    router.push("/perfil")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <>
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <header className="bg-[#5b4b8a] px-4 py-1 flex items-center justify-between gap-6">
        {/* Left side: Menu and Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#c9b888] hover:bg-[#b8a777] rounded-full w-12 h-12 shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-[#5b4b8a]" />
          </Button>

          {/* Logo - Much more visible */}
          <div className="flex items-center ml-16">
            <Image
              src="/logo-oris.png"
              alt="Oris - Gestão Odontológica"
              width={500}
              height={175}
              className="h-32 w-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Center: Search bar */}
        <div className="flex-1 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="w-full">
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
        </div>

        {/* Right side: Cart and User profile */}
        <div className="flex items-center gap-4 flex-shrink-0">
        {/* Cart button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-[#5b4b8a]/80"
          onClick={() => router.push("/carrinho")}
        >
          <ShoppingCart className="w-6 h-6 text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Button>

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
            <DropdownMenuContent
              align="end"
              className="w-60 rounded-2xl border border-[#e5e2f5] bg-white shadow-lg shadow-[#2c1f5b]/20"
            >
              <DropdownMenuLabel className="text-[#2c1f5b] font-semibold px-4 py-3">
                Minha Conta
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#e5e2f5]" />
              <DropdownMenuItem
                onClick={handleProfile}
                className="mx-2 my-2 flex items-center gap-2 rounded-lg bg-[#c9b888] text-[#2c1f5b] font-medium hover:bg-[#b8a777]"
              >
                <User className="h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="mx-2 mb-2 flex items-center gap-2 rounded-lg text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}
