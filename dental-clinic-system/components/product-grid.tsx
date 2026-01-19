"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useShoppingCart } from "@/components/shopping-cart-context"
import { useFavorites } from "@/components/favorites-context"
import { Product, ecommerceProducts, propagandaProductMap } from "@/lib/ecommerce-data"
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react"

interface ProductGridProps {
  products?: Product[]
  recommended?: boolean
  serviceType?: string
}

export function ProductGrid({
  products = ecommerceProducts,
  recommended = false,
  serviceType,
}: ProductGridProps) {
  const { addItem } = useShoppingCart()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  // Filtrar produtos recomendados se necessário
  let filteredProducts = products
  if (recommended && serviceType) {
    const recommendedIds = propagandaProductMap[serviceType.toLowerCase()] || []
    filteredProducts = products.filter((p) => recommendedIds.includes(p.id))
  }

  // Aplicar filtros
  filteredProducts = filteredProducts.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = !filterCategory || product.category === filterCategory
    return matchSearch && matchCategory
  })

  const categories = Array.from(new Set(products.map((p) => p.category)))

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1
    addItem(product, quantity)
    setQuantities({ ...quantities, [product.id]: 1 })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="space-y-3">
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory("")}
          >
            Todas as Categorias
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filterCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Grade de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className={`hover:shadow-lg transition ${
              product.stock < (product.minQuantity || 10) ? "border-yellow-300" : ""
            }`}
          >
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.category}
                  </p>
                </div>
                {product.recommended && (
                  <Badge className="bg-green-600 text-white whitespace-nowrap">
                    Recomendado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Descrição */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>

              {/* Preço e Estoque */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Fornecedor: {product.supplier}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {product.stock} em estoque
                  </p>
                  {product.stock < (product.minQuantity || 10) && (
                    <Badge variant="destructive" className="text-xs mt-1">
                      Baixo
                    </Badge>
                  )}
                </div>
              </div>

              {/* Controle de Quantidade */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setQuantities({
                      ...quantities,
                      [product.id]: Math.max(1, (quantities[product.id] || 1) - 1),
                    })
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantities[product.id] || 1}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [product.id]: Math.min(product.stock, parseInt(e.target.value) || 1),
                    })
                  }
                  className="w-12 text-center h-10"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setQuantities({
                      ...quantities,
                      [product.id]: Math.min(
                        product.stock,
                        (quantities[product.id] || 1) + 1
                      ),
                    })
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Carrinho
                </Button>
                <Button
                  size="sm"
                  variant={isFavorite(product.id) ? "default" : "outline"}
                  onClick={() => {
                    if (isFavorite(product.id)) {
                      removeFavorite(product.id)
                    } else {
                      addFavorite(product.id, product.price)
                    }
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite(product.id) ? "fill-current" : ""
                    }`}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Nenhum produto encontrado
          </CardContent>
        </Card>
      )}
    </div>
  )
}
