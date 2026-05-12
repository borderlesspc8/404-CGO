import { jsPDF } from "jspdf"
import type { SalesOpportunity } from "@/components/reports-table"

const PRIMARY = "#50348F"
const ACCENT = "#C9B888"

const STATUS_LABELS: Record<string, string> = {
  aberta: "Aberta",
  em_andamento: "Em Andamento",
  fechada: "Fechada",
  perdida: "Perdida",
}

function fmt(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

export function gerarRelatorioPDF(data: SalesOpportunity[], filtros?: Record<string, string>) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const margin = 14
  const now = new Date()
  const dataHora = now.toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })

  // ── Header ──────────────────────────────────────────────────────────────────
  const [pr, pg, pb] = hexToRgb(PRIMARY)
  doc.setFillColor(pr, pg, pb)
  doc.rect(0, 0, W, 22, "F")

  const [ar, ag, ab] = hexToRgb(ACCENT)
  doc.setFillColor(ar, ag, ab)
  doc.rect(0, 22, W, 3, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("Oris", margin, 13)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("Gestão Odontológica Inteligente", margin + 22, 13)

  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Relatório de Oportunidades", W / 2, 13, { align: "center" })

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(`Gerado em: ${dataHora}`, W - margin, 13, { align: "right" })

  let y = 34

  // ── Resumo ───────────────────────────────────────────────────────────────────
  const totalValue = data.reduce((s, i) => s + i.value, 0)
  const totalPotential = data.reduce((s, i) => s + i.value * (i.probability / 100), 0)
  const closedValue = data.filter((i) => i.status === "fechada").reduce((s, i) => s + i.value, 0)
  const openCount = data.filter((i) => i.status === "aberta").length
  const convRate = data.length > 0 ? (data.filter((i) => i.status === "fechada").length / data.length) * 100 : 0

  const cardW = (W - margin * 2 - 12) / 4
  const cards = [
    { label: "Valor Total",         value: fmt(totalValue),     sub: `${data.length} oportunidades` },
    { label: "Valor Potencial",     value: fmt(totalPotential), sub: "ponderado por probabilidade" },
    { label: "Oportunidades Abertas", value: String(openCount), sub: "aguardando conversão" },
    { label: "Faturado",            value: fmt(closedValue),    sub: `taxa de conversão ${convRate.toFixed(1)}%` },
  ]

  cards.forEach((card, i) => {
    const x = margin + i * (cardW + 4)
    doc.setFillColor(248, 248, 252)
    doc.roundedRect(x, y, cardW, 20, 2, 2, "F")
    doc.setDrawColor(pr, pg, pb)
    doc.setLineWidth(0.8)
    doc.line(x, y, x, y + 20)

    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 120)
    doc.text(card.label, x + 4, y + 6)

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(pr, pg, pb)
    doc.text(card.value, x + 4, y + 13)

    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(140, 140, 160)
    doc.text(card.sub, x + 4, y + 18)
  })

  y += 28

  // ── Stats por tipo e status (lado a lado) ────────────────────────────────────
  const halfW = (W - margin * 2 - 6) / 2

  // Agrupa por tipo
  const byType = data.reduce((acc, i) => {
    acc[i.type] = acc[i.type] ?? { count: 0, value: 0 }
    acc[i.type].count++
    acc[i.type].value += i.value
    return acc
  }, {} as Record<string, { count: number; value: number }>)

  // Agrupa por status
  const byStatus = data.reduce((acc, i) => {
    acc[i.status] = acc[i.status] ?? { count: 0, value: 0 }
    acc[i.status].count++
    acc[i.status].value += i.value
    return acc
  }, {} as Record<string, { count: number; value: number }>)

  function drawMiniTable(
    x: number,
    startY: number,
    title: string,
    rows: { label: string; count: number; value: number }[],
  ): number {
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(pr, pg, pb)
    doc.text(title, x, startY)

    let ty = startY + 5
    const colWidths = [halfW * 0.45, halfW * 0.2, halfW * 0.3]

    // Header
    doc.setFillColor(pr, pg, pb)
    doc.rect(x, ty, halfW, 5, "F")
    doc.setFontSize(7)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255)
    doc.text("Tipo/Status", x + 2, ty + 3.5)
    doc.text("Qtd", x + colWidths[0] + 2, ty + 3.5)
    doc.text("Valor Total", x + colWidths[0] + colWidths[1] + 2, ty + 3.5)
    ty += 5

    rows.forEach((row, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 250 : 245, idx % 2 === 0 ? 250 : 245, idx % 2 === 0 ? 255 : 252)
      doc.rect(x, ty, halfW, 5, "F")
      doc.setFontSize(7.5)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(50, 50, 70)
      doc.text(row.label, x + 2, ty + 3.5)
      doc.text(String(row.count), x + colWidths[0] + 2, ty + 3.5)
      doc.text(fmt(row.value), x + colWidths[0] + colWidths[1] + 2, ty + 3.5)
      ty += 5
    })

    return ty + 4
  }

  const typeRows = Object.entries(byType)
    .sort(([, a], [, b]) => b.value - a.value)
    .map(([label, v]) => ({ label, ...v }))

  const statusRows = Object.entries(byStatus)
    .sort(([, a], [, b]) => b.value - a.value)
    .map(([label, v]) => ({ label: STATUS_LABELS[label] ?? label, ...v }))

  const endLeft = drawMiniTable(margin, y, "Por Tipo de Serviço", typeRows)
  const endRight = drawMiniTable(margin + halfW + 6, y, "Por Status", statusRows)
  y = Math.max(endLeft, endRight) + 4

  // ── Linha divisória ──────────────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 230)
  doc.setLineWidth(0.3)
  doc.line(margin, y, W - margin, y)
  y += 6

  // ── Tabela de oportunidades ──────────────────────────────────────────────────
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(pr, pg, pb)
  doc.text("Lista de Oportunidades", margin, y)
  y += 5

  const colDefs = [
    { header: "Data",        width: 18 },
    { header: "Paciente",    width: 42 },
    { header: "Tipo",        width: 28 },
    { header: "Descrição",   width: 58 },
    { header: "Valor",       width: 28 },
    { header: "Probabilidade", width: 22 },
    { header: "Status",      width: 26 },
  ]
  const rowH = 6

  // Header
  doc.setFillColor(pr, pg, pb)
  doc.rect(margin, y, W - margin * 2, rowH, "F")
  doc.setFontSize(7.5)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255)
  let cx = margin
  colDefs.forEach((col) => {
    doc.text(col.header, cx + 1.5, y + 4)
    cx += col.width
  })
  y += rowH

  // Rows
  data.forEach((item, idx) => {
    if (y + rowH > H - 18) {
      doc.addPage()
      y = 14

      // Repeat table header on new page
      doc.setFillColor(pr, pg, pb)
      doc.rect(margin, y, W - margin * 2, rowH, "F")
      doc.setFontSize(7.5)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(255, 255, 255)
      let hx = margin
      colDefs.forEach((col) => {
        doc.text(col.header, hx + 1.5, y + 4)
        hx += col.width
      })
      y += rowH
    }

    doc.setFillColor(idx % 2 === 0 ? 252 : 246, idx % 2 === 0 ? 252 : 246, idx % 2 === 0 ? 255 : 252)
    doc.rect(margin, y, W - margin * 2, rowH, "F")

    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(40, 40, 60)

    const [itemY, itemM, itemD] = item.date.split("-")
    const dateFmt = `${itemD}/${itemM}/${itemY}`

    const cells = [
      dateFmt,
      item.patient.length > 22 ? item.patient.slice(0, 21) + "…" : item.patient,
      item.type,
      item.description.length > 34 ? item.description.slice(0, 33) + "…" : item.description,
      fmt(item.value),
      `${item.probability}%`,
      STATUS_LABELS[item.status] ?? item.status,
    ]

    let rx = margin
    cells.forEach((cell, ci) => {
      doc.text(cell, rx + 1.5, y + 4)
      rx += colDefs[ci].width
    })

    y += rowH
  })

  // ── Footer ────────────────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setFillColor(pr, pg, pb)
    doc.rect(0, H - 8, W, 8, "F")
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(200, 200, 220)
    doc.text("Oris — Gestão Odontológica Inteligente", margin, H - 3)
    doc.text(`Página ${p} de ${pageCount}`, W - margin, H - 3, { align: "right" })
  }

  const fileName = `relatorio-oportunidades-${now.toISOString().split("T")[0]}.pdf`
  doc.save(fileName)
}
