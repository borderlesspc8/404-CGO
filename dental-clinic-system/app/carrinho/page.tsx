"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useShoppingCart } from "@/components/shopping-cart-context"
import { ecommerceProducts } from "@/lib/ecommerce-data"
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react"

export default function CarrinhoPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useShoppingCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getProductName = (productId: string) => {
    return ecommerceProducts.find((p) => p.id === productId)?.name || "Produto"
  }

  const handleCheckout = () => {
    alert("Funcionalidade de checkout será integrada com seu backend")
    clearCart()
  }

  if (!mounted) return null

  const total = getTotal()
  const taxEstimate = total * 0.15
  const finalTotal = total + taxEstimate

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />

      <main className="flex-1 container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/ecommerce")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Meu Carrinho</h1>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground mb-6">
                Seu carrinho está vazio
              </p>
              <Button onClick={() => router.push("/ecommerce")}>
                Continuar Comprando
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Itens do Carrinho */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const product = ecommerceProducts.find((p) => p.id === item.productId)
                if (!product) return null

                return (
                  <Card key={item.productId}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        {/* Info */}
                        <div className="flex-1">
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.category}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Fornecedor: {product.supplier}
                          </p>
                        </div>

                        {/* Quantidade */}
                        <div className="flex items-center gap-2 border rounded px-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            disabled={item.quantity >= product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Preço */}
                        <div className="text-right min-w-fit">
                          <p className="text-lg font-bold">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.price)} cada
                          </p>
                        </div>

                        {/* Remover */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.productId)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Resumo */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Compra</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Itens */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {items.length} produto{items.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <Separator />

                  {/* Cálculos */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-yellow-600">
                      <span>Impostos (15%):</span>
                      <span className="font-semibold">{formatCurrency(taxEstimate)}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Frete:</span>
                      <span className="font-semibold">Grátis</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatCurrency(finalTotal)}</span>
                  </div>

                  {/* Ações */}
                  <div className="space-y-2 pt-4">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleCheckout}
                    >
                      Finalizar Compra
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/ecommerce")}
                    >
                      Continuar Comprando
                    </Button>
                  </div>

                  {/* Aviso */}
                  <div className="p-3 bg-blue-50 rounded border border-blue-200 text-xs text-blue-900">
                    ✅ Frete grátis em compras acima de R$ 500
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <MainFooter />
    </div>
  )
}
