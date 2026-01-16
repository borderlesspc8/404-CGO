"use client"

import { Home, Calendar, Users, DollarSign, BarChart3, MessageSquare, Package, FlaskConical, Settings, ShoppingCart } from "lucide-react"
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
  { icon: FlaskConical, label: "Laboratório", href: "/laboratorio" },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
]

export function AppSidebar({ isOpen = false, onClose = () => {} }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out w-64",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-[#5b4b8a] px-6 py-6">
            <h2 className="text-[#c9b888] text-2xl font-bold">Menu</h2>
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
                          ? "bg-[#5b4b8a] text-white"
                          : "text-[#5b4b8a] hover:bg-[#5b4b8a]/10"
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
