"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { loadFromStorage } from "@/lib/utils"

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  date: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: "processing" | "shipped" | "delivered"
  paymentMethod: string
  trackingCode?: string
  shippedAt?: string
  deliveredAt?: string
  address: {
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
}

interface OrdersContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "date">) => string
  getOrderById: (id: string) => Order | undefined
  getOrdersByStatus: (status: Order["status"]) => Order[]
  updateOrderStatus: (id: string, status: Order["status"]) => void
  getTotalSpent: () => number
  getOrderCount: () => number
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setOrders(loadFromStorage<Order[]>("dental-orders", []))
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dental-orders", JSON.stringify(orders))
    }
  }, [orders, mounted])

  const addOrder = (orderData: Omit<Order, "id" | "date">): string => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
    }
    setOrders((prev) => [newOrder, ...prev])
    return newOrder.id
  }

  const getOrderById = (id: string): Order | undefined => {
    return orders.find((o) => o.id === id)
  }

  const getOrdersByStatus = (status: Order["status"]): Order[] => {
    return orders.filter((o) => o.status === status)
  }

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const updates: Partial<Order> = { status }
        if (status === "shipped" && !o.trackingCode) {
          updates.trackingCode = `BR${Math.random().toString(36).slice(2, 10).toUpperCase()}BR`
          updates.shippedAt = new Date().toISOString()
        }
        if (status === "delivered") {
          updates.deliveredAt = new Date().toISOString()
        }
        return { ...o, ...updates }
      })
    )
  }

  const getTotalSpent = (): number => {
    return orders.reduce((sum, order) => sum + order.total, 0)
  }

  const getOrderCount = (): number => {
    return orders.length
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        getOrderById,
        getOrdersByStatus,
        updateOrderStatus,
        getTotalSpent,
        getOrderCount,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider")
  }
  return context
}
