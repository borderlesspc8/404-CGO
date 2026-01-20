"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/components/orders-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Eye } from "lucide-react"
import { Order } from "@/components/orders-context"

const statusTranslation: Record<Order["status"], string> = {
  completed: "Concluído",
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
}

const statusColors: Record<Order["status"], string> = {
  completed: "bg-blue-600",
  processing: "bg-yellow-600",
  shipped: "bg-purple-600",
  delivered: "bg-green-600",
}

export default function PedidosPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { orders, getOrdersByStatus } = useOrders()
  const [mounted, setMounted] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<Order["status"] | "all">(
    "all"
  )

  useEffect(() => {
    setMounted(true)
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!mounted) return null

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : getOrdersByStatus(selectedStatus as Order["status"])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
          {(["processing", "shipped", "delivered", "completed"] as const).map(
            (status) => {
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
            }
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-lg text-muted-foreground mb-6">
                Você ainda não tem pedidos
              </p>
              <Button onClick={() => router.push("/ecommerce")}>
                Fazer Compras
              </Button>
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
                  {/* Itens */}
                  <div>
                    <p className="font-semibold mb-2">
                      Produtos ({order.items.length})
                    </p>
                    <div className="space-y-1 text-sm">
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between text-muted-foreground"
                        >
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Totais */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Impostos:</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Frete:</span>
                      <span>{formatCurrency(order.shipping)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">
                      Total: {formatCurrency(order.total)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() =>
                          alert(
                            `Detalhes do pedido ${order.id}\n\nEndereço: ${order.address.street}, ${order.address.number}\n${order.address.city} - ${order.address.state}\n\nForma de pagamento: ${order.paymentMethod}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                        Detalhes
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Nota Fiscal
                      </Button>
                    </div>
                  </div>

                  {/* Endereço de Entrega */}
                  <div className="p-3 bg-muted rounded text-sm">
                    <p className="font-semibold mb-1">📍 Entrega em:</p>
                    <p className="text-muted-foreground">
                      {order.address.street}, {order.address.number}
                      {order.address.complement && ` - ${order.address.complement}`}
                    </p>
                    <p className="text-muted-foreground">
                      {order.address.neighborhood} - {order.address.city},{" "}
                      {order.address.state}
                    </p>
                    <p className="text-muted-foreground">{order.address.zipCode}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <MainFooter />
    </div>
  )
}
