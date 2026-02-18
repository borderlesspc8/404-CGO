"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, AlertTriangle } from "lucide-react"
import { InventoryItem } from "@/lib/inventory-data"
import { ecommerceProducts } from "@/lib/ecommerce-data"
import { useShoppingCart } from "@/components/shopping-cart-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface RecommendedCartProps {
  criticalItems: InventoryItem[]
}

// Mapeamento PRECISO de itens de inventário para produtos de e-commerce
// Baseado nos nomes EXATOS do inventário
const inventoryToProductMap: Record<string, string | null> = {
  "Resina Composta": "prod-001",           // Resina Composta Premium
  "Adesivo Dentário": "prod-002",          // Adesivo Dentário Universal
  "Implante Dentário": "prod-003",         // Implante Dentário Titânio
  "Parafuso Protético": "prod-008",        // Cimento Resinoso (alternativa)
  "Gel Clareador": "prod-004",             // Gel Clareador 35%
  "Bandeja Intrabucal": "prod-014",        // Bandeja de Clareamento
  "Aparelho Fixo": "prod-005",             // Aparelho Fixo Cerâmico
  "Fio Ortodôntico": "prod-007",           // Fio Ortodôntico NiTi
  "Curetas Periodontais": "prod-006",      // Curetas Periodontais Set
  "Pedra Pomes": "prod-010",               // Pasta de Profilaxia Premium
  "Coroa Protética": "prod-015",           // Coroa Protética Temporária
  "Moldeira Customizada": "prod-013",      // Moldeira de Clareamento
}

export function RecommendedCart({ criticalItems }: RecommendedCartProps) {
  const router = useRouter()
  const { addItem } = useShoppingCart()
  const [openDialog, setOpenDialog] = useState(false)
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(
      criticalItems.map((item) => [
        item.id,
        Math.max(1, item.minStock - item.quantity),
      ])
    )
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Encontrar produto correspondente no e-commerce
  const findProductId = (inventoryItemName: string): string | null => {
    console.log(`🔍 Procurando produto para: "${inventoryItemName}"`)

    // Procurar match exato no mapa
    const mappedId = inventoryToProductMap[inventoryItemName]
    if (mappedId !== undefined) {
      if (mappedId === null) {
        console.log(`⚠️  Item "${inventoryItemName}" não tem produto correspondente no e-commerce`)
        return null
      }
      console.log(`✓ Match encontrado: ${inventoryItemName} -> ${mappedId}`)
      return mappedId
    }

    console.log(`✗ Item "${inventoryItemName}" não encontrado no mapa de mapeamento`)
    return null
  }

  // Encontrar produto e seu preço no e-commerce
  const getProductWithPrice = (inventoryItemName: string) => {
    const productId = findProductId(inventoryItemName)
    if (!productId) return null

    const product = ecommerceProducts.find((p) => p.id === productId)
    return product || null
  }

  // Calcular quantidade recomendada (mínimo 1 unidade) com PREÇOS DO E-COMMERCE
  const recommendedItems = criticalItems.map((item) => {
    const recommendedQty = Math.max(1, item.minStock - item.quantity)
    const product = getProductWithPrice(item.name)
    const priceToUse = product ? product.price : item.unitPrice

    return {
      ...item,
      recommendedQuantity: recommendedQty,
      recommendedCost: recommendedQty * priceToUse,
      ecommercePrice: priceToUse,
      hasProduct: product !== null,
    }
  })

  const totalRecommendedCost = recommendedItems.reduce(
    (sum, item) => sum + item.recommendedCost,
    0
  )

  const handleQuantityChange = (itemId: string, value: number) => {
    if (value >= 1) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: value,
      }))
    }
  }

  const calculateTotalCost = () => {
    return criticalItems.reduce((sum, item) => {
      const qty = quantities[item.id] || Math.max(1, item.minStock - item.quantity)
      const product = getProductWithPrice(item.name)
      const priceToUse = product ? product.price : item.unitPrice
      return sum + qty * priceToUse
    }, 0)
  }

  const handleGenerateOrder = async () => {
    let addedItemsCount = 0
    const failedItems: string[] = []
    const skipppedItems: string[] = []

    console.log("🛒 Iniciando adição de itens ao carrinho...")
    console.log("Itens críticos:", criticalItems)

    // Adicionar itens ao carrinho
    for (const item of criticalItems) {
      const productId = findProductId(item.name)
      const qty = quantities[item.id] || Math.max(1, item.minStock - item.quantity)

      console.log(`📦 Processando ${item.name}: productId=${productId}, qty=${qty}`)

      if (productId === null) {
        skipppedItems.push(item.name)
        console.log(`⚠️  ${item.name} foi pulado (não tem produto correspondente)`)
        continue
      }

      if (productId) {
        const product = ecommerceProducts.find((p) => p.id === productId)
        console.log(`Produto encontrado:`, product)
        if (product) {
          addItem(product, qty)
          addedItemsCount++
          console.log(`✅ ${item.name} adicionado ao carrinho`)
        } else {
          failedItems.push(item.name)
          console.log(`❌ Produto com ID ${productId} não encontrado no catálogo`)
        }
      }
    }

    setOpenDialog(false)

    // Mostrar notificação
    if (addedItemsCount > 0) {
      const message = skipppedItems.length > 0 
        ? `${addedItemsCount} item(s) adicionado(s). ${skipppedItems.length} item(s) não tinha produto no e-commerce (${skipppedItems.join(", ")})`
        : `${addedItemsCount} item(s) adicionado(s) com sucesso`

      toast({
        title: "Itens adicionados ao carrinho!",
        description: message + ". Redirecionando...",
      })

      // Redirecionar para o carrinho após 2 segundos
      setTimeout(() => {
        console.log("🔄 Redirecionando para /carrinho")
        router.push("/carrinho")
      }, 2000)
    } else {
      toast({
        title: "Erro ao adicionar itens",
        description: "Nenhum item foi adicionado ao carrinho. Verifique o console para detalhes.",
      })
    }

    if (failedItems.length > 0) {
      console.error(`❌ Itens que falharam: ${failedItems.join(", ")}`)
    }
  }

  if (criticalItems.length === 0) {
    return null
  }

  return (
    <>
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-orange-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho Recomendado
          </CardTitle>
          <p className="text-sm text-orange-700 mt-1">
            Itens em estado crítico que precisam ser reabastecidos
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de itens críticos */}
          <div className="space-y-2">
            {recommendedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-3 bg-white rounded-lg border border-orange-100 hover:border-orange-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <Badge className="bg-red-600 text-xs">Crítico</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Atual: <span className="font-semibold text-red-600">{item.quantity}</span>
                    {" | "}
                    Mínimo: <span className="font-semibold">{item.minStock}</span>
                    {" | "}
                    Fornecedor: <span className="text-gray-700">{item.supplier}</span>
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Req: {item.recommendedQuantity} un</p>
                      <p className="font-semibold text-orange-700">
                        {formatCurrency(item.recommendedCost)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo e ação */}
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-700">Custo Total Recomendado:</span>
              <span className="text-2xl font-bold text-orange-700">
                {formatCurrency(totalRecommendedCost)}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              {recommendedItems.length} item(s) - Reabastecimento de{" "}
              {recommendedItems.reduce((sum, item) => sum + item.recommendedQuantity, 0)} unidades
            </p>
            <Button
              onClick={() => setOpenDialog(true)}
              className="w-full bg-orange-600 hover:bg-orange-700"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar ao E-commerce
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para ajustar quantidades */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmar Compra para Reabastecimento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
              Revise as quantidades abaixo antes de adicionar ao carrinho de e-commerce. Você pode
              aumentar as quantidades se desejar comprar mais.
            </div>

            <div className="space-y-3">
              {criticalItems.map((item) => {
                const defaultQty = Math.max(1, item.minStock - item.quantity)
                const currentQty = quantities[item.id] || defaultQty
                const productId = findProductId(item.name)
                const hasProduct = productId !== null
                const product = getProductWithPrice(item.name)
                const priceToUse = product ? product.price : item.unitPrice

                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-3 ${
                      !hasProduct ? "bg-gray-50 opacity-60" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          Fornecedor: {item.supplier} | Preço unitário (E-commerce):{" "}
                          {formatCurrency(priceToUse)}
                        </p>
                        {!hasProduct && (
                          <p className="text-xs text-orange-600 font-semibold mt-1">
                            ⚠️  Este item não está disponível no e-commerce
                          </p>
                        )}
                      </div>
                      <Badge className="bg-red-600">Crítico</Badge>
                    </div>
                    {hasProduct && (
                      <div className="flex items-center gap-3">
                        <Label htmlFor={`qty-${item.id}`} className="text-xs">
                          Quantidade:
                        </Label>
                        <Input
                          id={`qty-${item.id}`}
                          type="number"
                          min="1"
                          value={currentQty}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                          }
                          className="w-20"
                        />
                        <span className="text-sm font-semibold text-gray-600 ml-auto">
                          Subtotal: {formatCurrency(currentQty * priceToUse)}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Valor Total do Pedido:</span>
                <span className="text-2xl font-bold text-orange-700">
                  {formatCurrency(calculateTotalCost())}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleGenerateOrder}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
