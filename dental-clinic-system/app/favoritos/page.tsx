"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFavorites } from "@/components/favorites-context"
import { useShoppingCart } from "@/components/shopping-cart-context"
import { ecommerceProducts } from "@/lib/ecommerce-data"
import { Heart, ShoppingCart, TrendingDown, AlertCircle, Trash2 } from "lucide-react"

export default function FavoritosPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { favorites, removeFavorite, getDiscountNotifications } = useFavorites()
  const { addItem } = useShoppingCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [isLoading, user, router])

  if (!mounted || isLoading || !user) return null

  const favoriteProducts = favorites
    .map((fav) => {
      const product = ecommerceProducts.find((p) => p.id === fav.productId)
      return product ? { ...product, favoriteData: fav } : null
    })
    .filter((p) => p !== null)

  const discountNotifications = getDiscountNotifications()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleAddToCart = (product: any) => {
    addItem(product, 1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />

      <main className="flex-1 container mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            Meus Favoritos
          </h1>
          <p className="text-muted-foreground mt-1">
            Produtos que você marcou como favoritos ({favorites.length})
          </p>
        </div>

        {/* Notificações de Desconto */}
        {discountNotifications.length > 0 && (
          <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <TrendingDown className="h-5 w-5 text-green-600" />
            <AlertDescription className="ml-2">
              <strong className="text-green-700 dark:text-green-400">
                🎉 Ótimas notícias!
              </strong>{" "}
              {discountNotifications.length} produto(s) favorito(s) com desconto agora!
              <div className="mt-2 space-y-1">
                {discountNotifications.map((notif) => (
                  <div key={notif.productId} className="text-sm">
                    • <strong>{notif.productName}</strong> -{" "}
                    <span className="text-green-700 dark:text-green-400 font-bold">
                      {notif.discountPercent}% OFF
                    </span>{" "}
                    (de {formatCurrency(notif.originalPrice)} por{" "}
                    {formatCurrency(notif.currentPrice)})
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {favoriteProducts.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground mb-6">
                Você ainda não tem produtos favoritos
              </p>
              <Button onClick={() => router.push("/ecommerce")}>
                Explorar Produtos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteProducts.map((product) => {
              if (!product) return null
              
              const hasDiscount = product.price < product.favoriteData.originalPrice
              const discountPercent = hasDiscount
                ? Math.round(
                    ((product.favoriteData.originalPrice - product.price) /
                      product.favoriteData.originalPrice) *
                      100
                  )
                : 0

              return (
                <Card
                  key={product.id}
                  className={`hover:shadow-lg transition ${
                    hasDiscount ? "border-green-500 border-2" : ""
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
                      {hasDiscount && (
                        <Badge className="bg-green-600 text-white whitespace-nowrap">
                          -{discountPercent}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    {/* Preço */}
                    <div className="space-y-1">
                      {hasDiscount && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.favoriteData.originalPrice)}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.stock} em estoque
                      </p>
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
                        Adicionar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFavorite(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      <MainFooter />
    </div>
  )
}
