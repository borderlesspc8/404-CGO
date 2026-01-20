"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

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
  status: "completed" | "processing" | "shipped" | "delivered"
  paymentMethod: string
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
  getTotalSpent: () => number
  getOrderCount: () => number
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("dental-orders")
    if (stored) {
      setOrders(JSON.parse(stored))
    }
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
