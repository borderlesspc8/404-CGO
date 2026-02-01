"use client"

import { Home, Calendar, Users, DollarSign, BarChart3, MessageSquare, Package, FlaskConical, Settings, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Agenda", href: "/agenda" },
  { icon: Users, label: "Pacientes", href: "/pacientes" },
  { icon: DollarSign, label: "Financeiro", href: "/financeiro" },
  { icon: BarChart3, label: "Relatórios", href: "/relatorios" },
  { icon: Package, label: "Estoque", href: "/estoque" },
  { icon: MessageSquare, label: "Propagandas", href: "/propagandas" },
  { icon: ShoppingCart, label: "E-commerce", href: "/ecommerce" },
  { icon: Heart, label: "Favoritos", href: "/favoritos" },
  { icon: Package, label: "Meus Pedidos", href: "/pedidos" },
  { icon: FlaskConical, label: "Laboratório", href: "/laboratorio" },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
]

export function AppSidebar({ isOpen = false, onClose = () => {} }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar - empurra o conteúdo ao abrir */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-white shadow-xl z-40 transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] w-52",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white px-4 py-4">
            <h2 className="text-[#50348F] text-xl font-bold">Menu</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-[#50348F] text-white"
                          : "text-[#50348F] hover:bg-[#50348F]/10"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-gray-500 text-center">
              Sistema de Clínica Odontológica
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
