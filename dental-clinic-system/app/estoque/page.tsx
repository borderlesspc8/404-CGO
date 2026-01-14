"use client"

import React, { useState } from "react"
import { MainHeader } from "@/components/main-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, AlertTriangle, TrendingDown } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  quantity: number
  minQuantity: number
  price: number
  supplier: string
  lastUpdate: string
}

interface StockMovement {
  id: string
  productName: string
  type: "entrada" | "saída"
  quantity: number
  reason: string
  date: string
  user: string
}

interface Report {
  totalProducts: number
  totalValue: number
  lowStockItems: number
  totalMovements: number
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Resina Composta A2",
    category: "Restauração",
    quantity: 45,
    minQuantity: 10,
    price: 250.0,
    supplier: "Fornecedor A",
    lastUpdate: "2026-01-14",
  },
  {
    id: "2",
    name: "Anestésico Articaína",
    category: "Medicamentos",
    quantity: 5,
    minQuantity: 20,
    price: 180.0,
    supplier: "Fornecedor B",
    lastUpdate: "2026-01-10",
  },
  {
    id: "3",
    name: "Fio Dental Fluorado",
    category: "Higiene",
    quantity: 120,
    minQuantity: 30,
    price: 45.0,
    supplier: "Fornecedor C",
    lastUpdate: "2026-01-12",
  },
]

const mockMovements: StockMovement[] = [
  {
    id: "1",
    productName: "Resina Composta A2",
    type: "saída",
    quantity: 2,
    reason: "Restauração procedimento #105",
    date: "2026-01-14",
    user: "Dr. João",
  },
  {
    id: "2",
    productName: "Fio Dental Fluorado",
    type: "entrada",
    quantity: 50,
    reason: "Compra fornecedor",
    date: "2026-01-13",
    user: "Admin",
  },
]

export default function EstoquePage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    quantity: 0,
    minQuantity: 0,
    price: 0,
    supplier: "",
  })

  const getStockStatus = (quantity: number, minQuantity: number) => {
    if (quantity <= minQuantity) return { status: "crítico", color: "bg-red-100 text-red-800" }
    if (quantity <= minQuantity * 1.5)
      return { status: "baixo", color: "bg-yellow-100 text-yellow-800" }
    return { status: "ok", color: "bg-green-100 text-green-800" }
  }

  const handleAddProduct = () => {
    if (
      newProduct.name &&
      newProduct.category &&
      newProduct.quantity >= 0
    ) {
      const product: Product = {
        id: Math.random().toString(),
        ...newProduct,
        lastUpdate: new Date().toISOString().split("T")[0],
      }
      setProducts([...products, product])
      setNewProduct({
        name: "",
        category: "",
        quantity: 0,
        minQuantity: 0,
        price: 0,
        supplier: "",
      })
    }
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const calculateReport = (): Report => {
    const lowStockItems = products.filter(
      (p) => p.quantity <= p.minQuantity * 1.5
    ).length
    const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0)

    return {
      totalProducts: products.length,
      totalValue,
      lowStockItems,
      totalMovements: movements.length,
    }
  }

  const report = calculateReport()

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MainHeader title="Estoque - Gestão de Inventário" />
        <main className="flex-1 overflow-auto p-8">
          <Tabs defaultValue="produtos" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="produtos">Produtos</TabsTrigger>
              <TabsTrigger value="movimentacao">Movimentação</TabsTrigger>
              <TabsTrigger value="relatorio">Relatório</TabsTrigger>
            </TabsList>

            {/* Produtos Tab */}
            <TabsContent value="produtos" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#5b4b8a]">Produtos em Estoque</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#5b4b8a] hover:bg-[#4a3a7a]">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Produto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Produto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome do Produto</Label>
                        <Input
                          placeholder="Ex: Resina Composta"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Input
                          placeholder="Ex: Restauração"
                          value={newProduct.category}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, category: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Quantidade</Label>
                        <Input
                          type="number"
                          value={newProduct.quantity}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              quantity: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Quantidade Mínima</Label>
                        <Input
                          type="number"
                          value={newProduct.minQuantity}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              minQuantity: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Preço Unitário</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Fornecedor</Label>
                        <Input
                          placeholder="Ex: Fornecedor A"
                          value={newProduct.supplier}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, supplier: e.target.value })
                          }
                        />
                      </div>
                      <Button
                        onClick={handleAddProduct}
                        className="w-full bg-[#5b4b8a] hover:bg-[#4a3a7a]"
                      >
                        Adicionar Produto
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Alert for low stock items */}
              {report.lowStockItems > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      {report.lowStockItems} produto(s) com estoque baixo
                    </h3>
                    <p className="text-sm text-red-700">
                      Verifique os produtos com quantidade crítica
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Mínimo</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const status = getStockStatus(product.quantity, product.minQuantity)
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.minQuantity}</TableCell>
                          <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                          <TableCell className="font-semibold">
                            R$ {(product.quantity * product.price).toFixed(2)}
                          </TableCell>
                          <TableCell>{product.supplier}</TableCell>
                          <TableCell>
                            <Badge className={status.color}>{status.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Movimentação Tab */}
            <TabsContent value="movimentacao" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#5b4b8a]">Movimentação de Estoque</h2>

              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Usuário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="font-medium">
                          {movement.productName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              movement.type === "entrada"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{movement.quantity}</TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell>{movement.date}</TableCell>
                        <TableCell>{movement.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Relatório Tab */}
            <TabsContent value="relatorio" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#5b4b8a]">Relatórios</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total de Produtos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#5b4b8a]">
                      {report.totalProducts}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Valor Total do Estoque
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      R$ {report.totalValue.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Produtos com Estoque Baixo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {report.lowStockItems > 0 && (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <div className="text-3xl font-bold text-red-600">
                        {report.lowStockItems}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total de Movimentações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-blue-600" />
                      <div className="text-3xl font-bold text-blue-600">
                        {report.totalMovements}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Products Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes dos Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-[#5b4b8a]">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">R$ {(product.quantity * product.price).toFixed(2)}</p>
                            <p className="text-sm text-gray-600">
                              {product.quantity} un. × R$ {product.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
