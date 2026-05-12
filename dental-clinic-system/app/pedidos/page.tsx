"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useOrders, Order } from "@/components/orders-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Download,
  Eye,
  Loader2,
  MapPin,
  CreditCard,
  Package,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  Copy,
} from "lucide-react"
import { gerarNotaFiscalPDF } from "@/lib/nota-fiscal-pdf"
import { toast } from "sonner"

const statusTranslation: Record<Order["status"], string> = {
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
}

const statusColors: Record<Order["status"], string> = {
  processing: "bg-yellow-600",
  shipped: "bg-blue-600",
  delivered: "bg-green-600",
}

const paymentLabels: Record<string, string> = {
  credit_card: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
  pix: "PIX",
  boleto: "Boleto Bancário",
  bank_transfer: "Transferência Bancária",
}

function OrderTimeline({ order }: { order: Order }) {
  const steps: { key: Order["status"]; label: string; icon: React.ReactNode; date?: string }[] = [
    {
      key: "processing",
      label: "Pedido Realizado",
      icon: <Clock className="h-4 w-4" />,
      date: order.date,
    },
    {
      key: "shipped",
      label: "Pedido Enviado",
      icon: <Truck className="h-4 w-4" />,
      date: order.shippedAt,
    },
    {
      key: "delivered",
      label: "Pedido Entregue",
      icon: <CheckCircle2 className="h-4 w-4" />,
      date: order.deliveredAt,
    },
  ]

  const statusOrder: Order["status"][] = ["processing", "shipped", "delivered"]
  const currentIdx = statusOrder.indexOf(order.status)

  const fmt = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null

  return (
    <div className="relative flex flex-col gap-0">
      {steps.map((step, idx) => {
        const done = idx <= currentIdx
        const active = idx === currentIdx
        return (
          <div key={step.key} className="flex items-start gap-3">
            {/* Linha vertical + círculo */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
                  done
                    ? "bg-primary border-primary text-white"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {step.icon}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-0.5 h-8 ${
                    idx < currentIdx ? "bg-primary" : "bg-muted-foreground/20"
                  }`}
                />
              )}
            </div>

            {/* Texto */}
            <div className="pb-2 pt-1">
              <p className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </p>
              {done && fmt(step.date) && (
                <p className="text-xs text-muted-foreground">{fmt(step.date)}</p>
              )}
              {!done && (
                <p className="text-xs text-muted-foreground">Aguardando...</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function PedidosPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { orders, getOrdersByStatus, updateOrderStatus } = useOrders()
  const [mounted, setMounted] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<Order["status"] | "all">("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    if (!isLoading && !user) router.push("/")
  }, [isLoading, user, router])

  // Sync dialog com o estado mais recente do pedido
  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find((o) => o.id === selectedOrder.id)
      if (updated) setSelectedOrder(updated)
    }
  }, [orders])

  if (!mounted || isLoading || !user) return null

  const filteredOrders =
    selectedStatus === "all" ? orders : getOrdersByStatus(selectedStatus as Order["status"])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const handleDownloadNota = (order: Order) => {
    setDownloadingId(order.id)
    setTimeout(() => {
      gerarNotaFiscalPDF(order, user?.name || "Cliente")
      setDownloadingId(null)
    }, 50)
  }

  const handleMarkShipped = (order: Order) => {
    updateOrderStatus(order.id, "shipped")
    toast.success("Pedido marcado como enviado")
  }

  const handleMarkDelivered = (order: Order) => {
    updateOrderStatus(order.id, "delivered")
    toast.success("Pedido marcado como recebido!")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />

      <main className="flex-1 container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Meus Pedidos</h1>
        </div>

        {/* Filtros de Status */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={selectedStatus === "all" ? "default" : "outline"}
            onClick={() => setSelectedStatus("all")}
            size="sm"
          >
            Todos ({orders.length})
          </Button>
          {(["processing", "shipped", "delivered"] as const).map((status) => {
            const count = getOrdersByStatus(status).length
            return count > 0 ? (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                onClick={() => setSelectedStatus(status)}
                size="sm"
              >
                {statusTranslation[status]} ({count})
              </Button>
            ) : null
          })}
        </div>

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-lg text-muted-foreground mb-6">
                Você ainda não tem pedidos
              </p>
              <Button onClick={() => router.push("/ecommerce")}>Fazer Compras</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-base">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {statusTranslation[order.status]}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Itens resumo */}
                  <div className="space-y-1 text-sm">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-muted-foreground">
                        <span>{item.name} ×{item.quantity}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Rastreamento */}
                  {order.trackingCode && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-sm border border-blue-200">
                      <Truck className="h-4 w-4 text-blue-600 shrink-0" />
                      <span className="text-blue-700 dark:text-blue-300 font-medium">
                        Rastreamento:
                      </span>
                      <span className="font-mono font-bold text-blue-800 dark:text-blue-200">
                        {order.trackingCode}
                      </span>
                      <button
                        className="ml-auto text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          navigator.clipboard.writeText(order.trackingCode!)
                          toast.success("Código copiado!")
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">
                      Total: {formatCurrency(order.total)}
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {/* Ação principal conforme status */}
                      {order.status === "processing" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleMarkShipped(order)}
                        >
                          <Truck className="h-4 w-4" />
                          Marcar como Enviado
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button
                          size="sm"
                          className="gap-2 bg-green-600 hover:bg-green-700"
                          onClick={() => handleMarkDelivered(order)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Marcar como Recebido
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                        Detalhes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                        onClick={() => handleDownloadNota(order)}
                        disabled={downloadingId === order.id}
                      >
                        {downloadingId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Nota Fiscal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Dialog de Detalhes */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Detalhes do Pedido
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 text-sm">
              {/* ID e Status */}
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Número do Pedido</p>
                  <p className="font-bold">{selectedOrder.id}</p>
                </div>
                <Badge className={statusColors[selectedOrder.status]}>
                  {statusTranslation[selectedOrder.status]}
                </Badge>
              </div>

              {/* Data */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{formatDate(selectedOrder.date)}</span>
              </div>

              <Separator />

              {/* Timeline */}
              <div>
                <p className="font-semibold mb-3">Rastreamento do Pedido</p>
                <OrderTimeline order={selectedOrder} />

                {selectedOrder.trackingCode && (
                  <div className="mt-3 flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-sm border border-blue-200">
                    <Truck className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Código:</span>
                    <span className="font-mono font-bold text-blue-800 dark:text-blue-200">
                      {selectedOrder.trackingCode}
                    </span>
                    <button
                      className="ml-auto text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedOrder.trackingCode!)
                        toast.success("Código copiado!")
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Produtos */}
              <div>
                <p className="font-semibold mb-2">Produtos</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item.name} <span className="font-medium">×{item.quantity}</span>
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Valores */}
              <div className="space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-yellow-600">
                  <span>Impostos (15%)</span>
                  <span>{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Frete</span>
                  <span>
                    {selectedOrder.shipping === 0
                      ? "Grátis"
                      : formatCurrency(selectedOrder.shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base text-green-600 pt-1">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              <Separator />

              {/* Pagamento */}
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Forma de Pagamento</p>
                  <p className="font-medium">
                    {paymentLabels[selectedOrder.paymentMethod] || selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Endereço */}
              {(selectedOrder.address.street || selectedOrder.address.city) && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Endereço de Entrega</p>
                    {selectedOrder.address.street && (
                      <p className="font-medium">
                        {selectedOrder.address.street}
                        {selectedOrder.address.number && `, ${selectedOrder.address.number}`}
                        {selectedOrder.address.complement && ` — ${selectedOrder.address.complement}`}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      {[
                        selectedOrder.address.neighborhood,
                        selectedOrder.address.city,
                        selectedOrder.address.state,
                      ]
                        .filter(Boolean)
                        .join(" — ")}
                    </p>
                    {selectedOrder.address.zipCode && (
                      <p className="text-muted-foreground">{selectedOrder.address.zipCode}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex flex-col gap-2 pt-2">
                {selectedOrder.status === "processing" && (
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleMarkShipped(selectedOrder)}
                  >
                    <Truck className="h-4 w-4" />
                    Marcar como Enviado
                  </Button>
                )}
                {selectedOrder.status === "shipped" && (
                  <Button
                    className="w-full gap-2 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleMarkDelivered(selectedOrder)
                      setSelectedOrder(null)
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Marcar como Recebido
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                  onClick={() => {
                    handleDownloadNota(selectedOrder)
                    setSelectedOrder(null)
                  }}
                >
                  <Download className="h-4 w-4" />
                  Baixar Nota Fiscal
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <MainFooter />
    </div>
  )
}
