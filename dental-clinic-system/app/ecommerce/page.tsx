 "use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { ProductGrid } from "@/components/product-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useShoppingCart } from "@/components/shopping-cart-context"
import { useFavorites } from "@/components/favorites-context"
import { ShoppingCart, TrendingUp, Heart, TrendingDown } from "lucide-react"

export default function EcommercePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuth()
  const initialSearch = searchParams.get("search") ?? ""
  const { getItemCount } = useShoppingCart()
  const { getFavoriteCount, getDiscountNotifications } = useFavorites()
  const [itemCount, setItemCount] = useState(0)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [discountNotifications, setDiscountNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
    setItemCount(getItemCount())
    setFavoriteCount(getFavoriteCount())
    setDiscountNotifications(getDiscountNotifications())
  }, [isLoading, user, router, getItemCount, getFavoriteCount, getDiscountNotifications])

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />

      <main className="flex-1 container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">E-commerce de Suprimentos</h1>
            <p className="text-muted-foreground mt-1">
              Acesse nosso catálogo de materiais dentários de qualidade
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/favoritos")}
              variant="outline"
              className="gap-2 relative"
            >
              <Heart className="h-5 w-5" />
              Favoritos ({favoriteCount})
            </Button>
            <Button
              onClick={() => router.push("/carrinho")}
              className="gap-2 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              Carrinho ({itemCount})
            </Button>
          </div>
        </div>

        {/* Notificações de Desconto */}
        {discountNotifications.length > 0 && (
          <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <TrendingDown className="h-5 w-5 text-green-600" />
            <AlertDescription className="ml-2">
              <strong className="text-green-700 dark:text-green-400">
                🎉 Produtos favoritos com desconto!
              </strong>{" "}
              Você tem {discountNotifications.length} produto(s) favorito(s) com desconto.{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-green-700 dark:text-green-400"
                onClick={() => router.push("/favoritos")}
              >
                Ver Favoritos
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Cards de Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Disponíveis</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+500</div>
              <p className="text-xs text-muted-foreground">
                Materiais em estoque
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frete Grátis</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+R$ 500</div>
              <p className="text-xs text-muted-foreground">
                Em compras acima de R$ 500
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preços Competitivos</CardTitle>
              <Badge className="bg-green-600">MELHOR VALOR</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Desconto</div>
              <p className="text-xs text-muted-foreground">
                Até 15% em compras em volume
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Grade de Produtos */}
        <ProductGrid initialSearch={initialSearch} />
      </main>

      <MainFooter />
    </div>
  )
}
