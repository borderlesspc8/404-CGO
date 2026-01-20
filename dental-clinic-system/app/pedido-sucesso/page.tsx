"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/components/orders-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Home, Package } from "lucide-react"

export default function PedidoSucessoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { getOrderById } = useOrders()
  const [mounted, setMounted] = useState(false)

  const orderId = searchParams.get("orderId")
  const order = orderId ? getOrderById(orderId) : null

  useEffect(() => {
    setMounted(true)
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!mounted) return null

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

      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Ícone de Sucesso */}
          <div className="text-center mb-8">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-600">Compra Realizada!</h1>
            <p className="text-muted-foreground mt-2">
              Obrigado pela sua compra. Seu pedido foi confirmado.
            </p>
          </div>

          {/* Detalhes do Pedido */}
          {order ? (
            <div className="space-y-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Detalhes do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Número do Pedido</p>
                      <p className="font-bold text-lg">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p className="font-bold text-lg">
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="font-semibold mb-3">Produtos</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm pb-2 border-b last:border-b-0"
                        >
                          <span>{item.name}</span>
                          <span className="font-semibold">
                            {item.quantity}x {formatCurrency(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-yellow-600">
                      <span>Impostos:</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Frete:</span>
                      <span>{formatCurrency(order.shipping)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total:</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço de Entrega */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">📍 Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-semibold">{user?.name}</p>
                  <p>
                    {order.address.street}, {order.address.number}
                  </p>
                  {order.address.complement && (
                    <p>{order.address.complement}</p>
                  )}
                  <p>
                    {order.address.neighborhood} - {order.address.city},{" "}
                    {order.address.state}
                  </p>
                  <p className="font-semibold">{order.address.zipCode}</p>
                </CardContent>
              </Card>

              {/* Pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">💳 Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm capitalize">
                    {order.paymentMethod.replace("_", " ")}
                  </p>
                </CardContent>
              </Card>

              {/* Próximos Passos */}
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-base">📋 O que acontece agora?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex gap-3">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>
                      Você receberá um e-mail de confirmação em breve
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>
                      Seu pedido será preparado para envio (2-3 dias úteis)
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>
                      Você receberá o código de rastreamento por e-mail
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-blue-600">4.</span>
                    <span>
                      Acompanhe seu pedido em "Meus Pedidos" a qualquer momento
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/pedidos")}
                >
                  <Package className="h-4 w-4" />
                  Ver Meus Pedidos
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => router.push("/ecommerce")}
                >
                  <Home className="h-4 w-4" />
                  Continuar Comprando
                </Button>
              </div>

              {/* Nota Fiscal */}
              <Button
                variant="ghost"
                className="w-full gap-2 text-green-600 hover:text-green-700"
              >
                <Download className="h-4 w-4" />
                Baixar Nota Fiscal
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Pedido não encontrado
                </p>
                <Button onClick={() => router.push("/pedidos")}>
                  Ver Meus Pedidos
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <MainFooter />
    </div>
  )
}
