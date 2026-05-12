import { jsPDF } from "jspdf"

const PRIMARY = "#50348F"
const GREEN = "#16a34a"
const RED = "#dc2626"
const ORANGE = "#ea580c"

interface Transaction {
  id: string
  date: string
  description: string
  type: "receita" | "despesa"
  value: number
  status: string
  category: string
}

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}

function fmt(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function fmtDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

const STATUS_LABELS: Record<string, string> = {
  pago: "Pago",
  pendente: "Pendente",
  aprovado: "Aprovado",
}

export function gerarFinanceiroPDF(transactions: Transaction[], saldoAbertura = 0) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const margin = 14
  const now = new Date()
  const dataHora = now.toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })

  const [pr, pg, pb] = hexToRgb(PRIMARY)
  const [gr, gg, gb] = hexToRgb(GREEN)
  const [rr, rg, rb] = hexToRgb(RED)
  const [or, og, ob] = hexToRgb(ORANGE)

  // ── Header ───────────────────────────────────────────────────────────────────
  doc.setFillColor(pr, pg, pb)
  doc.rect(0, 0, W, 22, "F")
  doc.setFillColor(...hexToRgb("#C9B888"))
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
  doc.text("Relatório Financeiro", W / 2, 13, { align: "center" })

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(`Gerado em: ${dataHora}`, W - margin, 13, { align: "right" })

  let y = 34

  // ── Cards de resumo ──────────────────────────────────────────────────────────
  const totalReceitas = transactions.filter((t) => t.type === "receita").reduce((s, t) => s + t.value, 0)
  const totalDespesas = transactions.filter((t) => t.type === "despesa").reduce((s, t) => s + t.value, 0)
  const saldo = totalReceitas - totalDespesas
  const aReceber = transactions.filter((t) => t.type === "receita" && t.status !== "pago").reduce((s, t) => s + t.value, 0)
  const aPagar = transactions.filter((t) => t.type === "despesa" && t.status !== "pago").reduce((s, t) => s + t.value, 0)

  const cardW = (W - margin * 2 - 16) / 5
  const cardDefs = [
    { label: "Receitas",     value: fmt(totalReceitas), color: [gr, gg, gb] as [number,number,number], sub: `${transactions.filter(t => t.type === "receita").length} lançamentos` },
    { label: "Despesas",     value: fmt(totalDespesas), color: [rr, rg, rb] as [number,number,number], sub: `${transactions.filter(t => t.type === "despesa").length} lançamentos` },
    { label: "Saldo",        value: fmt(saldo),         color: saldo >= 0 ? [pr, pg, pb] as [number,number,number] : [rr, rg, rb] as [number,number,number], sub: "resultado líquido" },
    { label: "A Receber",    value: fmt(aReceber),      color: [or, og, ob] as [number,number,number], sub: "receitas pendentes" },
    { label: "A Pagar",      value: fmt(aPagar),        color: [rr, rg, rb] as [number,number,number], sub: "despesas pendentes" },
  ]

  cardDefs.forEach((card, i) => {
    const x = margin + i * (cardW + 4)
    doc.setFillColor(248, 248, 252)
    doc.roundedRect(x, y, cardW, 20, 2, 2, "F")
    doc.setDrawColor(...card.color)
    doc.setLineWidth(0.8)
    doc.line(x, y, x, y + 20)

    doc.setFontSize(7.5)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 120)
    doc.text(card.label, x + 3, y + 6)

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...card.color)
    doc.text(card.value, x + 3, y + 13)

    doc.setFontSize(6.5)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(150, 150, 170)
    doc.text(card.sub, x + 3, y + 18)
  })

  y += 28

  // ── Análise por categoria ─────────────────────────────────────────────────────
  const byCategory: Record<string, { receita: number; despesa: number }> = {}
  transactions.forEach((t) => {
    if (!byCategory[t.category]) byCategory[t.category] = { receita: 0, despesa: 0 }
    byCategory[t.category][t.type as "receita" | "despesa"] += t.value
  })
  const catRows = Object.entries(byCategory).sort(([, a], [, b]) => (b.receita - b.despesa) - (a.receita - a.despesa))

  const halfW = (W - margin * 2 - 6) / 2

  // Tabela de categorias
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(pr, pg, pb)
  doc.text("Receitas × Despesas por Categoria", margin, y)
  y += 5

  const catHeaderH = 5
  doc.setFillColor(pr, pg, pb)
  doc.rect(margin, y, halfW, catHeaderH, "F")
  doc.setFontSize(7)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255)
  doc.text("Categoria", margin + 2, y + 3.5)
  doc.text("Receitas", margin + halfW * 0.42, y + 3.5)
  doc.text("Despesas", margin + halfW * 0.60, y + 3.5)
  doc.text("Resultado", margin + halfW * 0.79, y + 3.5)
  y += catHeaderH

  catRows.forEach(([cat, vals], idx) => {
    const net = vals.receita - vals.despesa
    doc.setFillColor(idx % 2 === 0 ? 250 : 245, idx % 2 === 0 ? 250 : 245, idx % 2 === 0 ? 255 : 252)
    doc.rect(margin, y, halfW, 5, "F")
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(50, 50, 70)
    doc.text(cat, margin + 2, y + 3.5)

    doc.setTextColor(gr, gg, gb)
    doc.text(vals.receita > 0 ? fmt(vals.receita) : "—", margin + halfW * 0.42, y + 3.5)

    doc.setTextColor(rr, rg, rb)
    doc.text(vals.despesa > 0 ? fmt(vals.despesa) : "—", margin + halfW * 0.60, y + 3.5)

    const [nr, ng, nb2] = net >= 0 ? [gr, gg, gb] : [rr, rg, rb]
    doc.setTextColor(nr, ng, nb2)
    doc.setFont("helvetica", "bold")
    doc.text(fmt(net), margin + halfW * 0.79, y + 3.5)
    y += 5
  })

  // Caixa do dia (coluna direita)
  const todayKey = new Date().toISOString().split("T")[0]
  const todayTxs = transactions.filter((t) => t.date === todayKey)
  const entradasHoje = todayTxs.filter((t) => t.type === "receita").reduce((s, t) => s + t.value, 0)
  const saidasHoje = todayTxs.filter((t) => t.type === "despesa").reduce((s, t) => s + t.value, 0)
  const fechamento = saldoAbertura + entradasHoje - saidasHoje

  const boxX = margin + halfW + 6
  let boxY = 34 + 28

  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(pr, pg, pb)
  doc.text(`Caixa do Dia — ${fmtDate(todayKey)}`, boxX, boxY)
  boxY += 5

  const caixaItems = [
    { label: "Saldo Abertura", value: fmt(saldoAbertura), color: [80, 80, 100] as [number,number,number] },
    { label: "Entradas",       value: fmt(entradasHoje),  color: [gr, gg, gb] as [number,number,number] },
    { label: "Saídas",         value: fmt(saidasHoje),    color: [rr, rg, rb] as [number,number,number] },
    { label: "Fechamento",     value: fmt(fechamento),    color: fechamento >= 0 ? [pr, pg, pb] as [number,number,number] : [rr, rg, rb] as [number,number,number] },
  ]

  caixaItems.forEach((item, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 250 : 245, idx % 2 === 0 ? 250 : 245, idx % 2 === 0 ? 255 : 252)
    doc.rect(boxX, boxY, halfW, 7, "F")
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(80, 80, 100)
    doc.text(item.label, boxX + 3, boxY + 4.5)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...item.color)
    doc.text(item.value, boxX + halfW - 3, boxY + 4.5, { align: "right" })
    boxY += 7
  })

  y = Math.max(y, boxY) + 6

  // ── Divisória ────────────────────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 230)
  doc.setLineWidth(0.3)
  doc.line(margin, y, W - margin, y)
  y += 6

  // ── Tabela de movimentações ──────────────────────────────────────────────────
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(pr, pg, pb)
  doc.text(`Movimentações  (${transactions.length} registros)`, margin, y)
  y += 5

  const colDefs = [
    { header: "Data",       width: 20 },
    { header: "Descrição",  width: 80 },
    { header: "Categoria",  width: 30 },
    { header: "Tipo",       width: 22 },
    { header: "Status",     width: 22 },
    { header: "Valor",      width: 32 },
  ]
  const rowH = 6

  const drawTableHeader = (startY: number) => {
    doc.setFillColor(pr, pg, pb)
    doc.rect(margin, startY, W - margin * 2, rowH, "F")
    doc.setFontSize(7.5)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255)
    let cx = margin
    colDefs.forEach((col) => {
      doc.text(col.header, cx + 1.5, startY + 4)
      cx += col.width
    })
    return startY + rowH
  }

  y = drawTableHeader(y)

  transactions.forEach((t, idx) => {
    if (y + rowH > H - 12) {
      doc.addPage()
      y = 14
      y = drawTableHeader(y)
    }

    doc.setFillColor(idx % 2 === 0 ? 252 : 246, idx % 2 === 0 ? 252 : 246, idx % 2 === 0 ? 255 : 252)
    doc.rect(margin, y, W - margin * 2, rowH, "F")
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")

    const isReceita = t.type === "receita"
    const cells = [
      { text: fmtDate(t.date),   color: [60, 60, 80] as [number,number,number] },
      { text: t.description.length > 46 ? t.description.slice(0, 45) + "…" : t.description, color: [40, 40, 60] as [number,number,number] },
      { text: t.category,        color: [80, 80, 100] as [number,number,number] },
      { text: isReceita ? "Receita" : "Despesa", color: isReceita ? [gr, gg, gb] as [number,number,number] : [rr, rg, rb] as [number,number,number] },
      { text: STATUS_LABELS[t.status] ?? t.status, color: t.status === "pago" ? [gr, gg, gb] as [number,number,number] : [or, og, ob] as [number,number,number] },
      { text: `${isReceita ? "+" : "−"} ${fmt(t.value)}`, color: isReceita ? [gr, gg, gb] as [number,number,number] : [rr, rg, rb] as [number,number,number] },
    ]

    let cx = margin
    cells.forEach((cell, ci) => {
      doc.setTextColor(...cell.color)
      if (ci === cells.length - 1) {
        doc.setFont("helvetica", "bold")
      }
      doc.text(cell.text, cx + 1.5, y + 4)
      cx += colDefs[ci].width
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

  const fileName = `financeiro-${now.toISOString().split("T")[0]}.pdf`
  doc.save(fileName)
}
