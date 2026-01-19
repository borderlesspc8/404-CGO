"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface FavoriteProduct {
  productId: string
  addedAt: string
  originalPrice: number
}

interface FavoritesContextType {
  favorites: FavoriteProduct[]
  addFavorite: (productId: string, price: number) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  getFavoriteCount: () => number
  getDiscountNotifications: () => DiscountNotification[]
}

interface DiscountNotification {
  productId: string
  productName: string
  originalPrice: number
  currentPrice: number
  discountPercent: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("dental-favorites")
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dental-favorites", JSON.stringify(favorites))
    }
  }, [favorites, mounted])

  const addFavorite = (productId: string, price: number) => {
    setFavorites((prev) => [
      ...prev.filter((f) => f.productId !== productId),
      {
        productId,
        addedAt: new Date().toISOString(),
        originalPrice: price,
      },
    ])
  }

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((f) => f.productId !== productId))
  }

  const isFavorite = (productId: string) => {
    return favorites.some((f) => f.productId === productId)
  }

  const getFavoriteCount = () => {
    return favorites.length
  }

  const getDiscountNotifications = (): DiscountNotification[] => {
    // Importar aqui dentro da função para evitar problemas de SSR
    const { ecommerceProducts } = require("@/lib/ecommerce-data")
    
    const notifications: DiscountNotification[] = []
    
    favorites.forEach((fav) => {
      const product = ecommerceProducts.find((p: any) => p.id === fav.productId)
      if (product && product.price < fav.originalPrice) {
        const discountPercent = Math.round(
          ((fav.originalPrice - product.price) / fav.originalPrice) * 100
        )
        notifications.push({
          productId: fav.productId,
          productName: product.name,
          originalPrice: fav.originalPrice,
          currentPrice: product.price,
          discountPercent,
        })
      }
    })
    
    return notifications
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        getFavoriteCount,
        getDiscountNotifications,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider")
  }
  return context
}
