"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Review {
  id: string
  productId: string
  productName: string
  userName: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
}

interface ReviewsContextType {
  reviews: Review[]
  addReview: (review: Omit<Review, "id" | "date">) => void
  getReviewsByProduct: (productId: string) => Review[]
  getAverageRating: (productId: string) => number
  getTotalReviews: (productId: string) => number
  getRatingDistribution: (productId: string) => Record<number, number>
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

// Dados iniciais de exemplo
const INITIAL_REVIEWS: Review[] = [
  {
    id: "REV-001",
    productId: "1",
    productName: "Resina Composta A2",
    userName: "Dr. Silva",
    rating: 5,
    title: "Excelente qualidade!",
    comment: "Resina de primeira qualidade. Ótima consistência e cor exata.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
  },
  {
    id: "REV-002",
    productId: "1",
    productName: "Resina Composta A2",
    userName: "Dra. Lima",
    rating: 4,
    title: "Muito bom",
    comment: "Uso regularmente, ótimo custo-benefício.",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
  },
  {
    id: "REV-003",
    productId: "2",
    productName: "Fita Dental Mint",
    userName: "Dr. Costa",
    rating: 5,
    title: "Recomendo!",
    comment: "Meus pacientes adoram. Bom tamanho e sabor.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
  },
  {
    id: "REV-004",
    productId: "3",
    productName: "Pasta de Dente Flúor",
    userName: "Dr. Martins",
    rating: 4,
    title: "Bom produto",
    comment: "Boa qualidade, entrega rápida.",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
  },
]

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("dental-reviews")
    if (stored) {
      setReviews(JSON.parse(stored))
    } else {
      // Carrega reviews iniciais
      setReviews(INITIAL_REVIEWS)
      localStorage.setItem("dental-reviews", JSON.stringify(INITIAL_REVIEWS))
    }
  }, [])

  useEffect(() => {
    if (mounted && reviews.length > 0) {
      localStorage.setItem("dental-reviews", JSON.stringify(reviews))
    }
  }, [reviews, mounted])

  const addReview = (reviewData: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...reviewData,
      id: `REV-${Date.now()}`,
      date: new Date().toISOString(),
    }
    setReviews((prev) => [newReview, ...prev])
  }

  const getReviewsByProduct = (productId: string): Review[] => {
    return reviews.filter((r) => r.productId === productId)
  }

  const getAverageRating = (productId: string): number => {
    const productReviews = getReviewsByProduct(productId)
    if (productReviews.length === 0) return 0
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / productReviews.length) * 10) / 10
  }

  const getTotalReviews = (productId: string): number => {
    return getReviewsByProduct(productId).length
  }

  const getRatingDistribution = (productId: string): Record<number, number> => {
    const productReviews = getReviewsByProduct(productId)
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    productReviews.forEach((r) => {
      distribution[r.rating]++
    })
    return distribution
  }

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        addReview,
        getReviewsByProduct,
        getAverageRating,
        getTotalReviews,
        getRatingDistribution,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewsContext)
  if (!context) {
    throw new Error("useReviews must be used within ReviewsProvider")
  }
  return context
}
