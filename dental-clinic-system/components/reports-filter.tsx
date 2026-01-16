"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, X } from "lucide-react"

interface ReportsFilterProps {
  onFilterChange: (filters: FilterState) => void
  filters: FilterState
}

export interface FilterState {
  searchTerm: string
  type: string
  status: string
  dateFrom: string
  dateTo: string
  minValue: string
  maxValue: string
}

export function ReportsFilter({ onFilterChange, filters }: ReportsFilterProps) {
  const handleReset = () => {
    onFilterChange({
      searchTerm: "",
      type: "todos",
      status: "todos",
      dateFrom: "",
      dateTo: "",
      minValue: "",
      maxValue: "",
    })
  }

  const handleChange = (field: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [field]: value })
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros de Busca
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Busca por termo */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Nome, descrição..."
              value={filters.searchTerm}
              onChange={(e) => handleChange("searchTerm", e.target.value)}
            />
          </div>

          {/* Tipo de Oportunidade */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Oportunidade</Label>
            <Select value={filters.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="tratamento">Tratamento</SelectItem>
                <SelectItem value="limpeza">Limpeza</SelectItem>
                <SelectItem value="implante">Implante</SelectItem>
                <SelectItem value="clareamento">Clareamento</SelectItem>
                <SelectItem value="ortodoncia">Ortodontia</SelectItem>
                <SelectItem value="periodontia">Periodontia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="aberta">Aberta</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="fechada">Fechada</SelectItem>
                <SelectItem value="perdida">Perdida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data inicial */}
          <div className="space-y-2">
            <Label htmlFor="dateFrom">Data Inicial</Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange("dateFrom", e.target.value)}
            />
          </div>

          {/* Data final */}
          <div className="space-y-2">
            <Label htmlFor="dateTo">Data Final</Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange("dateTo", e.target.value)}
            />
          </div>

          {/* Valor mínimo */}
          <div className="space-y-2">
            <Label htmlFor="minValue">Valor Mínimo</Label>
            <Input
              id="minValue"
              type="number"
              placeholder="R$ 0"
              value={filters.minValue}
              onChange={(e) => handleChange("minValue", e.target.value)}
            />
          </div>

          {/* Valor máximo */}
          <div className="space-y-2">
            <Label htmlFor="maxValue">Valor Máximo</Label>
            <Input
              id="maxValue"
              type="number"
              placeholder="R$ 10000"
              value={filters.maxValue}
              onChange={(e) => handleChange("maxValue", e.target.value)}
            />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
