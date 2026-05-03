"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { mockProfessionals } from "@/lib/mock-data"

interface CalendarSidebarProps {
  selectedProfessionals: string[]
  onProfessionalToggle: (professionalId: string) => void
  currentDate: Date
  onDateChange: (date: Date) => void
}

export function CalendarSidebar({
  selectedProfessionals,
  onProfessionalToggle,
  currentDate,
  onDateChange,
}: CalendarSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const monthNames = [
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO",
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    onDateChange(newDate)
  }

  const nextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    onDateChange(newDate)
  }

  const selectDay = (day: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(day)
    onDateChange(newDate)
  }

  const filteredProfessionals = mockProfessionals.filter((prof) =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Mini Calendar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="font-bold text-[#50348F]">
            {monthNames[currentDate.getMonth()]}
            <br />
            {currentDate.getFullYear()}
          </h3>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          <div className="font-semibold text-red-600">D</div>
          <div className="font-semibold">S</div>
          <div className="font-semibold">T</div>
          <div className="font-semibold">Q</div>
          <div className="font-semibold">Q</div>
          <div className="font-semibold">S</div>
          <div className="font-semibold">S</div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const isToday = day === currentDate.getDate()
            return (
              <button
                key={day}
                onClick={() => selectDay(day)}
                className={`aspect-square flex items-center justify-center rounded ${
                  isToday ? "bg-[#50348F] text-white font-bold" : "hover:bg-gray-100"
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>

        <p className="text-xs text-center mt-3 text-gray-500">#atualizado 14:47</p>
      </div>

      {/* Professionals list */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-semibold text-[#50348F] mb-2 flex items-center justify-between">
            Profissionais
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </h4>
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm"
            />
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredProfessionals.map((professional) => (
            <div key={professional.id} className="flex items-center gap-2">
              <Checkbox
                id={`prof-${professional.id}`}
                checked={selectedProfessionals.includes(professional.id)}
                onCheckedChange={() => onProfessionalToggle(professional.id)}
                className="data-[state=checked]:bg-transparent"
                style={{
                  borderColor: professional.color,
                  backgroundColor: selectedProfessionals.includes(professional.id) ? professional.color : "transparent",
                }}
              />
              <label
                htmlFor={`prof-${professional.id}`}
                className="text-sm cursor-pointer flex-1"
                style={{ color: professional.color }}
              >
                {professional.name}
              </label>
            </div>
          ))}
        </div>

        {/* Alerts section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-[#50348F] text-sm">Alertas de Retorno</h4>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative mb-3">
            <Input type="text" placeholder="Buscar..." className="text-sm" />
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="text-xs text-gray-600">
            <p className="bg-green-100 px-2 py-1 rounded mb-1">ELZA KIMIE KIS... Um mês</p>
          </div>
        </div>
      </div>
    </div>
  )
}
