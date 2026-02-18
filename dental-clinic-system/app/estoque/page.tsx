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
} from "lucide-react"
import { InventoryItem, initialInventory } from "@/lib/inventory-data"
import { RecommendedCart } from "@/components/recommended-cart"

export default function EstoquePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(
    initialInventory
  )

  useEffect(() => {
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todos">Todos os Itens</TabsTrigger>
            <TabsTrigger value="baixo">Estoque Baixo</TabsTrigger>
            <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
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
        </Tabs>
      </main>

      <MainFooter />
    </div>
  )
}
