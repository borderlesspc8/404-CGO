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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useShoppingCart } from "@/components/shopping-cart-context"
import { useOrders } from "@/components/orders-context"
import { PaymentOptions } from "@/components/payment-options"
import { ecommerceProducts } from "@/lib/ecommerce-data"
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  MapPin,
  Truck,
} from "lucide-react"

interface ShippingOption {
  id: string
  name: string
  price: number
  days: string
  region: string
}

const shippingOptions: ShippingOption[] = [
  { id: "local", name: "Entrega Local", price: 0, days: "1-2 dias", region: "Mesma cidade" },
  { id: "regional", name: "Entrega Regional", price: 25, days: "3-5 dias", region: "Mesmo estado" },
  { id: "nacional", name: "Entrega Nacional", price: 45, days: "7-10 dias", region: "Todo Brasil" },
  { id: "expressa", name: "Entrega Expressa", price: 80, days: "1 dia", region: "Capitais" },
]

export default function CarrinhoPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useShoppingCart()
  const { addOrder } = useOrders()
  const [mounted, setMounted] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState("local")
  const [selectedPayment, setSelectedPayment] = useState("credit_card")
  const [address, setAddress] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "São Paulo",
    state: "SP",
    zipCode: "",
  })

  useEffect(() => {
    setMounted(true)
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [isLoading, user, router])

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
    const orderItems = items.map((item) => ({
      productId: item.productId,
      name: getProductName(item.productId),
      price: item.price,
      quantity: item.quantity,
    }))

    const orderId = addOrder({
      items: orderItems,
      subtotal: total,
      tax: taxEstimate,
      shipping: finalShippingCost,
      total: finalTotal,
      status: "processing",
      paymentMethod: selectedPayment,
      address,
    })

    clearCart()
    router.push(`/pedido-sucesso?orderId=${orderId}`)
  }

  if (!mounted || isLoading || !user) return null

  const total = getTotal()
  
  // Filtrar opções de frete baseado na localização
  const isSaoPauloCity = address.city.toLowerCase().trim() === "são paulo"
  const isSaoPauloState = address.state.toUpperCase().trim() === "SP"
  
  const availableShippingOptions = shippingOptions.filter((option) => {
    // Entrega Local só disponível para São Paulo - SP
    if (option.id === "local" && !isSaoPauloCity) return false
    // Entrega Regional só disponível para SP (estado)
    if (option.id === "regional" && !isSaoPauloState) return false
    return true
  })
  
  // Ajustar seleção se a opção escolhida não estiver mais disponível
  const isSelectedShippingAvailable = availableShippingOptions.some(
    (opt) => opt.id === selectedShipping
  )
  const currentShipping = isSelectedShippingAvailable
    ? selectedShipping
    : availableShippingOptions[0]?.id || "nacional"
  
  const shippingCost = shippingOptions.find((s) => s.id === currentShipping)?.price || 0
  const freeShipping = total >= 500
  const finalShippingCost = freeShipping ? 0 : shippingCost
  const taxEstimate = total * 0.15
  const finalTotal = total + taxEstimate + finalShippingCost

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
              {/* Endereço de Entrega */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        placeholder="00000-000"
                        value={address.zipCode}
                        onChange={(e) =>
                          setAddress({ ...address, zipCode: e.target.value })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        placeholder="Nome da rua"
                        value={address.street}
                        onChange={(e) =>
                          setAddress({ ...address, street: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        placeholder="123"
                        value={address.number}
                        onChange={(e) =>
                          setAddress({ ...address, number: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        placeholder="Apto, sala..."
                        value={address.complement}
                        onChange={(e) =>
                          setAddress({ ...address, complement: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        placeholder="Bairro"
                        value={address.neighborhood}
                        onChange={(e) =>
                          setAddress({ ...address, neighborhood: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        placeholder="Cidade"
                        value={address.city}
                        onChange={(e) =>
                          setAddress({ ...address, city: e.target.value })
                        }
                      />
                      {!isSaoPauloCity && (
                        <p className="text-xs text-yellow-600 mt-1">
                          ⚠️ Entrega Local disponível apenas para São Paulo
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        placeholder="UF"
                        maxLength={2}
                        value={address.state}
                        onChange={(e) =>
                          setAddress({ ...address, state: e.target.value.toUpperCase() })
                        }
                      />
                      {!isSaoPauloState && (
                        <p className="text-xs text-yellow-600 mt-1">
                          ⚠️ Entrega Regional disponível apenas para SP
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Opções de Frete */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Opções de Frete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={currentShipping} onValueChange={setSelectedShipping}>
                    <div className="space-y-3">
                      {availableShippingOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3 p-3 border rounded hover:bg-accent cursor-pointer"
                          onClick={() => setSelectedShipping(option.id)}
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label
                            htmlFor={option.id}
                            className="flex-1 cursor-pointer flex justify-between items-center"
                          >
                            <div>
                              <p className="font-semibold">{option.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {option.region} • {option.days}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">
                                {option.price === 0 || (freeShipping && option.id !== "expressa")
                                  ? "Grátis"
                                  : formatCurrency(option.price)}
                              </p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {/* Mensagens informativas */}
                  {!isSaoPauloCity && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded border border-yellow-200 text-xs text-yellow-900 dark:text-yellow-400">
                      ℹ️ Entrega Local disponível apenas para a cidade de São Paulo
                    </div>
                  )}
                  
                  {!isSaoPauloState && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded border border-yellow-200 text-xs text-yellow-900 dark:text-yellow-400">
                      ℹ️ Entrega Regional disponível apenas para o estado de São Paulo
                    </div>
                  )}

                  {freeShipping && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 text-xs text-green-900 dark:text-green-400">
                      🎉 Você ganhou frete grátis em compras acima de R$ 500!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Formas de Pagamento */}
              <PaymentOptions
                onPaymentSelect={setSelectedPayment}
                selectedMethod={selectedPayment}
              />

              {/* Produtos */}
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
                      <span className="font-semibold">
                        {freeShipping
                          ? "Grátis"
                          : finalShippingCost === 0
                          ? "Grátis"
                          : formatCurrency(finalShippingCost)}
                      </span>
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
                      disabled={!address.street || !address.city || !address.state}
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

                  {/* Avisos */}
                  {!freeShipping && total >= 450 && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded border border-yellow-200 text-xs text-yellow-900 dark:text-yellow-400">
                      💡 Faltam {formatCurrency(500 - total)} para frete grátis!
                    </div>
                  )}
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
