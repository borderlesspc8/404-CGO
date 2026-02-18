"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileDown, Printer, FileJson, Share2, FileSpreadsheet } from "lucide-react"
import { SalesOpportunity } from "./reports-table"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import * as XLSX from "xlsx"

interface ReportsActionsProps {
  data: SalesOpportunity[]
  filteredData: SalesOpportunity[]
  filters: any
}

export function ReportsActions({
  data,
  filteredData,
  filters,
}: ReportsActionsProps) {
  const handlePrintPDF = async () => {
    const element = document.getElementById("reports-table-print")
    if (!element) return

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      })

      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      const pdf = new jsPDF("p", "mm", "a4")
      let position = 0

      // Adiciona título
      pdf.setFontSize(16)
      pdf.text("Relatório de Oportunidades de Venda", 10, 10)

      // Adiciona data do relatório
      pdf.setFontSize(10)
      pdf.text(`Data do Relatório: ${new Date().toLocaleDateString("pt-BR")}`, 10, 20)
      pdf.text(`Total de Registros: ${filteredData.length}`, 10, 27)

      // Adiciona a tabela
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgData = canvas.toDataURL("image/png")
      const y = 35

      pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight)
      heightLeft -= pageHeight - 35

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`relatorio-oportunidades-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar PDF")
    }
  }

  const handleExportCSV = () => {
    const headers = [
      "Data",
      "Paciente",
      "Email",
      "Telefone",
      "Tipo",
      "Descrição",
      "Valor",
      "Status",
      "Probabilidade %",
      "Próxima Ação",
      "Data da Próxima Ação",
    ]

    const rows = filteredData.map((item) => [
      new Date(item.date).toLocaleDateString("pt-BR"),
      item.patient,
      item.email,
      item.phone,
      item.type,
      item.description,
      item.value.toString().replace(".", ","),
      item.status,
      item.probability.toString(),
      item.nextAction || "-",
      item.nextActionDate
        ? new Date(item.nextActionDate).toLocaleDateString("pt-BR")
        : "-",
    ])

    const csvContent = [
      headers.join(";"),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(";")),
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `relatorio-oportunidades-${new Date().toISOString().split("T")[0]}.csv`
    )
    link.click()
  }

  const handleExportJSON = () => {
    const json = JSON.stringify(
      {
        dataRelatorio: new Date().toISOString(),
        filtros: filters,
        totalRegistros: filteredData.length,
        dados: filteredData,
      },
      null,
      2
    )

    const blob = new Blob([json], {
      type: "application/json;charset=utf-8;",
    })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `relatorio-oportunidades-${new Date().toISOString().split("T")[0]}.json`
    )
    link.click()
  }

  const handleExportExcel = () => {
    const headers = [
      "Data",
      "Paciente",
      "Email",
      "Telefone",
      "Tipo",
      "Descrição",
      "Valor",
      "Status",
      "Probabilidade %",
      "Próxima Ação",
      "Data da Próxima Ação",
    ]

    const rows = filteredData.map((item) => [
      new Date(item.date).toLocaleDateString("pt-BR"),
      item.patient,
      item.email,
      item.phone,
      item.type,
      item.description,
      item.value,
      item.status,
      item.probability,
      item.nextAction || "-",
      item.nextActionDate
        ? new Date(item.nextActionDate).toLocaleDateString("pt-BR")
        : "-",
    ])

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])

    // Definir largura das colunas
    const colWidths = [12, 20, 25, 15, 15, 30, 12, 15, 12, 20, 18]
    ws["!cols"] = colWidths.map((width) => ({ wch: width }))

    // Estilo para o header (linha 1)
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1")
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1"
      if (!ws[address]) continue
      ws[address].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "0EA5E9" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      }
    }

    // Formatar números de moeda
    for (let R = 2; R <= rows.length + 1; ++R) {
      const address = "G" + R.toString()
      if (ws[address]) {
        ws[address].z = '"R$"#,##0.00'
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Oportunidades")
    XLSX.writeFile(
      wb,
      `relatorio-oportunidades-${new Date().toISOString().split("T")[0]}.xlsx`
    )
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileDown className="h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handlePrintPDF} className="gap-2">
                <FileDown className="h-4 w-4" />
                Exportar como PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel} className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Exportar como Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV} className="gap-2">
                <Share2 className="h-4 w-4" />
                Exportar como CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON} className="gap-2">
                <FileJson className="h-4 w-4" />
                Exportar como JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="text-sm text-muted-foreground flex items-center ml-auto">
            {filteredData.length} de {data.length} registros
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
