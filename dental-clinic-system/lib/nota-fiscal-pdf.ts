import { jsPDF } from "jspdf"
import type { Order } from "@/components/orders-context"

const PRIMARY = "#50348F"
const GREEN = "#16a34a"
const GOLD = "#C9B888"

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}

function fmt(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const PAYMENT_LABELS: Record<string, string> = {
  credit_card: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
  pix: "PIX",
  boleto: "Boleto Bancário",
  bank_transfer: "Transferência Bancária",
}

export function gerarNotaFiscalPDF(order: Order, buyerName: string) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const margin = 16

  const [pr, pg, pb] = hexToRgb(PRIMARY)
  const [gr, gg, gb] = hexToRgb(GREEN)

  // ── Header ───────────────────────────────────────────────────────────────────
  doc.setFillColor(pr, pg, pb)
  doc.rect(0, 0, W, 26, "F")
  doc.setFillColor(...hexToRgb(GOLD))
  doc.rect(0, 26, W, 3, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text("Oris", margin, 15)

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text("Gestão Odontológica Inteligente", margin + 28, 15)

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.text("NOTA FISCAL / RECIBO DE COMPRA", W / 2, 15, { align: "center" })

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(`Emitido em: ${fmtDate(order.date)}`, W - margin, 15, { align: "right" })

  let y = 38

  // ── Info do Pedido ───────────────────────────────────────────────────────────
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(pr, pg, pb)
  doc.text("DADOS DO PEDIDO", margin, y)
  y += 5

  doc.setFillColor(248, 248, 252)
  doc.roundedRect(margin, y, W - margin * 2, 22, 2, 2, "F")
  doc.setDrawColor(pr, pg, pb)
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, y, W - margin * 2, 22, 2, 2, "S")

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(60, 60, 80)

  const col1x = margin + 4
  const col2x = W / 2

  doc.setFont("helvetica", "bold")
  doc.text("Número do Pedido:", col1x, y + 7)
  doc.setFont("helvetica", "normal")
  doc.text(order.id, col1x + 38, y + 7)

  doc.setFont("helvetica", "bold")
  doc.text("Data da Compra:", col2x, y + 7)
  doc.setFont("helvetica", "normal")
  doc.text(fmtDate(order.date), col2x + 33, y + 7)

  doc.setFont("helvetica", "bold")
  doc.text("Comprador:", col1x, y + 14)
  doc.setFont("helvetica", "normal")
  doc.text(buyerName, col1x + 22, y + 14)

  doc.setFont("helvetica", "bold")
  doc.text("Pagamento:", col2x, y + 14)
  doc.setFont("helvetica", "normal")
  doc.text(PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod, col2x + 22, y + 14)

  y += 30

  // ── Endereço ─────────────────────────────────────────────────────────────────
  const hasAddress = order.address.street || order.address.city
  if (hasAddress) {
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(pr, pg, pb)
    doc.text("ENDEREÇO DE ENTREGA", margin, y)
    y += 5

    doc.setFillColor(248, 248, 252)
    doc.roundedRect(margin, y, W - margin * 2, 18, 2, 2, "F")
    doc.setDrawColor(pr, pg, pb)
    doc.roundedRect(margin, y, W - margin * 2, 18, 2, 2, "S")

    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(60, 60, 80)

    const addrLine1 = [order.address.street, order.address.number, order.address.complement]
      .filter(Boolean)
      .join(", ")
    const addrLine2 = [order.address.neighborhood, order.address.city, order.address.state, order.address.zipCode]
      .filter(Boolean)
      .join(" — ")

    if (addrLine1) doc.text(addrLine1, col1x, y + 7)
    if (addrLine2) doc.text(addrLine2, col1x, y + 13)

    y += 26
  }

  // ── Itens ────────────────────────────────────────────────────────────────────
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(pr, pg, pb)
  doc.text("ITENS DO PEDIDO", margin, y)
  y += 5

  const rowH = 7
  doc.setFillColor(pr, pg, pb)
  doc.rect(margin, y, W - margin * 2, rowH, "F")
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255)
  doc.text("Produto", margin + 3, y + 4.8)
  doc.text("Qtd", W - margin - 60, y + 4.8)
  doc.text("Unit.", W - margin - 40, y + 4.8)
  doc.text("Total", W - margin - 3, y + 4.8, { align: "right" })
  y += rowH

  order.items.forEach((item, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 252 : 246, idx % 2 === 0 ? 252 : 246, idx % 2 === 0 ? 255 : 252)
    doc.rect(margin, y, W - margin * 2, rowH, "F")
    doc.setFontSize(7.5)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(50, 50, 70)

    const name = item.name.length > 52 ? item.name.slice(0, 51) + "…" : item.name
    doc.text(name, margin + 3, y + 4.8)
    doc.text(String(item.quantity), W - margin - 60, y + 4.8)
    doc.text(fmt(item.price), W - margin - 40, y + 4.8)
    doc.setFont("helvetica", "bold")
    doc.text(fmt(item.price * item.quantity), W - margin - 3, y + 4.8, { align: "right" })
    y += rowH
  })

  y += 6

  // ── Totais ───────────────────────────────────────────────────────────────────
  const totalsW = 80
  const totalsX = W - margin - totalsW

  const totalsLines = [
    { label: "Subtotal:", value: fmt(order.subtotal), color: [60, 60, 80] as [number, number, number], bold: false },
    { label: "Impostos (15%):", value: fmt(order.tax), color: [180, 120, 20] as [number, number, number], bold: false },
    { label: "Frete:", value: order.shipping === 0 ? "Grátis" : fmt(order.shipping), color: [30, 80, 180] as [number, number, number], bold: false },
  ]

  totalsLines.forEach((line, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 248 : 243, idx % 2 === 0 ? 248 : 243, idx % 2 === 0 ? 252 : 249)
    doc.rect(totalsX, y, totalsW, 7, "F")
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...line.color)
    doc.text(line.label, totalsX + 3, y + 4.8)
    doc.text(line.value, W - margin - 2, y + 4.8, { align: "right" })
    y += 7
  })

  // Total final
  doc.setFillColor(pr, pg, pb)
  doc.rect(totalsX, y, totalsW, 10, "F")
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255)
  doc.text("TOTAL:", totalsX + 3, y + 6.5)
  doc.text(fmt(order.total), W - margin - 2, y + 6.5, { align: "right" })
  y += 16

  // ── Rodapé informativo ────────────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 230)
  doc.setLineWidth(0.3)
  doc.line(margin, y, W - margin, y)
  y += 6

  doc.setFontSize(7.5)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(120, 120, 140)
  doc.text(
    "Este documento é um comprovante de compra gerado automaticamente pelo sistema Oris.",
    W / 2,
    y,
    { align: "center" }
  )
  y += 4.5
  doc.text(
    "Para dúvidas sobre seu pedido, entre em contato com o suporte.",
    W / 2,
    y,
    { align: "center" }
  )

  // ── Footer ────────────────────────────────────────────────────────────────────
  doc.setFillColor(pr, pg, pb)
  doc.rect(0, H - 10, W, 10, "F")
  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(200, 200, 220)
  doc.text("Oris — Gestão Odontológica Inteligente", margin, H - 4)
  doc.text(`Pedido ${order.id}`, W - margin, H - 4, { align: "right" })

  doc.save(`nota-fiscal-${order.id}.pdf`)
}
