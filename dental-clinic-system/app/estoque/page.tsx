"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertCircle,
  Package,
  TrendingDown,
  Plus,
  Search,
  Download,
  Heart,
  ShoppingCart,
  Trash2,
} from "lucide-react"
import { InventoryItem, initialInventory } from "@/lib/inventory-data"
import { RecommendedCart } from "@/components/recommended-cart"
import { useFavorites } from "@/components/favorites-context"
import { useShoppingCart } from "@/components/shopping-cart-context"
import { ecommerceProducts } from "@/lib/ecommerce-data"

export default function EstoquePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(
    initialInventory
  )
  const { favorites, removeFavorite } = useFavorites()
  const { addItem } = useShoppingCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    const filtered = inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredInventory(filtered)
  }, [searchTerm, inventory])

  const lowStockItems = inventory.filter((item) => item.quantity < item.minStock)
  const criticalItems = inventory.filter((item) => item.quantity <= 2)
  const outOfStockItems = inventory.filter((item) => item.quantity <= 2)
  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  if (isLoading || !user) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />

      <main className="flex-1 container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Controle de Estoque</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Item
          </Button>
        </div>

        {/* Carrinho Recomendado */}
        {criticalItems.length > 0 && (
          <div className="mb-6">
            <RecommendedCart criticalItems={criticalItems} />
          </div>
        )}

        {/* Resumo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total em Estoque</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
              <p className="text-xs text-muted-foreground">itens diferentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">investimento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">abaixo do mínimo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockItems.length}</div>
              <p className="text-xs text-muted-foreground">zerados</p>
            </CardContent>
          </Card>
        </div>

        {/* Alertas Críticos */}
        {outOfStockItems.length > 0 && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Itens Críticos (Sem Estoque)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {outOfStockItems.map((item) => (
                  <Badge key={item.id} variant="destructive">
                    {item.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {lowStockItems.length > 0 && outOfStockItems.length === 0 && (
          <Card className="border-yellow-200 bg-yellow-50 mb-6">
            <CardHeader>
              <CardTitle className="text-yellow-900 flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Aviso: Itens com Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map((item) => (
                  <Badge key={item.id} variant="outline" className="bg-yellow-100">
                    {item.name} ({item.quantity}/{item.minStock})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="todos">Todos os Itens</TabsTrigger>
            <TabsTrigger value="baixo">Estoque Baixo</TabsTrigger>
            <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
            <TabsTrigger value="descontos">Descontos</TabsTrigger>
            <TabsTrigger value="favoritos">
              <Heart className="w-4 h-4 mr-2" />
              Favoritos
            </TabsTrigger>
          </TabsList>

          {/* Tab: Todos */}
          <TabsContent value="todos" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar Item</Label>
              <Input
                id="search"
                placeholder="Nome do item, fornecedor, categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-center">Quantidade</TableHead>
                        <TableHead className="text-center">Mínimo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Unit. (R$)</TableHead>
                        <TableHead className="text-right">Total (R$)</TableHead>
                        <TableHead>Fornecedor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            Nenhum item encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={
                                  item.quantity <= 2
                                    ? "font-bold text-red-600"
                                    : item.quantity < item.minStock
                                      ? "font-bold text-yellow-600"
                                      : ""
                                }
                              >
                                {item.quantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">{item.minStock}</TableCell>
                            <TableCell>
                              {item.quantity <= 2 ? (
                                <Badge className="bg-red-600">Crítico</Badge>
                              ) : item.quantity < item.minStock ? (
                                <Badge className="bg-yellow-600">Baixo</Badge>
                              ) : (
                                <Badge className="bg-green-600">OK</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.unitPrice)}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </TableCell>
                            <TableCell>{item.supplier}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Estoque Baixo */}
          <TabsContent value="baixo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Itens com Estoque Abaixo do Mínimo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Atual</TableHead>
                        <TableHead className="text-center">Mínimo</TableHead>
                        <TableHead className="text-center">Falta</TableHead>
                        <TableHead className="text-right">Custo Reab.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStockItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            ✅ Todos os itens estão com estoque adequado!
                          </TableCell>
                        </TableRow>
                      ) : (
                        lowStockItems.map((item) => {
                          const shortage = item.minStock - item.quantity
                          const restockCost = shortage * item.unitPrice
                          return (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell className="text-center font-bold">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-center">{item.minStock}</TableCell>
                              <TableCell className="text-center text-red-600 font-bold">
                                -{shortage}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {formatCurrency(restockCost)}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {lowStockItems.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="font-semibold text-yellow-900">
                      Custo Total para Reabastecimento:
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(
                        lowStockItems.reduce(
                          (sum, item) =>
                            sum + (item.minStock - item.quantity) * item.unitPrice,
                          0
                        )
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Categorias */}
          <TabsContent value="categorias" className="space-y-4">
            {["tratamento", "limpeza", "implante", "clareamento", "ortodoncia", "periodontia"].map(
              (category) => {
                const categoryItems = inventory.filter((item) => item.category === category)
                const categoryValue = categoryItems.reduce(
                  (sum, item) => sum + item.quantity * item.unitPrice,
                  0
                )

                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="capitalize">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Itens</p>
                          <p className="text-2xl font-bold">{categoryItems.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor Total</p>
                          <p className="text-2xl font-bold">{formatCurrency(categoryValue)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                          <p className="text-2xl font-bold text-yellow-600">
                            {categoryItems.filter((i) => i.quantity < i.minStock).length}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Sem Estoque</p>
                          <p className="text-2xl font-bold text-red-600">
                            {categoryItems.filter((i) => i.quantity <= 2).length}
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead className="text-center">Qtd</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categoryItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell>
                                  {item.quantity <= 2 ? (
                                    <Badge className="bg-red-600">Crítico</Badge>
                                  ) : item.quantity < item.minStock ? (
                                    <Badge className="bg-yellow-600">Baixo</Badge>
                                  ) : (
                                    <Badge className="bg-green-600">OK</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(item.quantity * item.unitPrice)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )
              }
            )}
          </TabsContent>

          {/* Tab: Descontos */}
          <TabsContent value="descontos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Banner 1 - Desconto Especial em Implantes */}
              <Card className="border-red-300 bg-gradient-to-br from-red-50 to-red-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <TrendingDown className="h-5 w-5" />
                    Desconto Especial em Implantes!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-800 mb-4">
                    Aproveite até 30% de desconto em implantes dentários. Faltam apenas alguns materiais no estoque!
                  </p>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="destructive">URGENTE</Badge>
                    <Badge className="bg-red-600">Parafuso</Badge>
                    <Badge className="bg-red-600">Capa provisória</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-red-600 hover:bg-red-700">
                      Ver Produtos
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/propagandas")}>
                      Mais Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Banner 2 - Promoção Clareamento */}
              <Card className="border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-900">
                    <TrendingDown className="h-5 w-5" />
                    Promoção Clareamento Dental!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-800 mb-4">
                    Estoque completo! Aproveite 20% de desconto em produtos para clareamento.
                  </p>
                  <div className="flex gap-2 mb-4">
                    <Badge className="bg-yellow-600">IMPORTANTE</Badge>
                    <Badge className="bg-green-600">Estoque OK</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                      Ver Produtos
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/propagandas")}>
                      Mais Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-[#50348F] to-[#B8AF39] text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Quer personalizar seus descontos?</h3>
                    <p className="text-sm opacity-90">
                      Crie ofertas personalizadas para seus pacientes baseado no histórico e necessidades
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={() => router.push("/propagandas")}
                  >
                    Acessar Descontos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Favoritos */}
          <TabsContent value="favoritos" className="space-y-4">
            {mounted && favorites.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum produto favorito</h3>
                  <p className="text-gray-600 mb-4">
                    Adicione produtos aos favoritos no E-commerce para acompanhá-los aqui
                  </p>
                  <Button onClick={() => router.push("/ecommerce")}>
                    Ir para E-commerce
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mounted && favorites.map((fav) => {
                  const product = ecommerceProducts.find((p) => p.id === fav.productId)
                  if (!product) return null

                  return (
                    <Card key={fav.productId} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        {(product.discount ?? 0) > 0 && (
                          <Badge className="absolute top-2 right-2 bg-red-600">
                            -{product.discount}%
                          </Badge>
                        )}
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-2 left-2"
                          onClick={() => removeFavorite(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-base">{product.name}</CardTitle>
                        <Badge variant="outline">{product.category}</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            {(product.discount ?? 0) > 0 && (
                              <p className="text-sm text-gray-500 line-through">
                                {formatCurrency(product.price)}
                              </p>
                            )}
                            <p className="text-xl font-bold text-[#50348F]">
                              {formatCurrency((product.discount ?? 0) > 0 
                                ? product.price * (1 - (product.discount ?? 0) / 100)
                                : product.price)}
                            </p>
                          </div>
                          {product.inStock ? (
                            <Badge className="bg-green-600">Em Estoque</Badge>
                          ) : (
                            <Badge variant="destructive">Indisponível</Badge>
                          )}
                        </div>
                        <Button 
                          className="w-full gap-2"
                          onClick={() => {
                            addItem(product, 1)
                            router.push("/carrinho")
                          }}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Adicionar ao Carrinho
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <MainFooter />
    </div>
  )
}
