"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/components/shopping-cart-context"
import { FavoritesProvider } from "@/components/favorites-context"
import { OrdersProvider } from "@/components/orders-context"
import { ReviewsProvider } from "@/components/reviews-context"
import { SidebarProvider } from "@/components/sidebar-context"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <CartProvider>
          <FavoritesProvider>
            <OrdersProvider>
              <ReviewsProvider>{children}</ReviewsProvider>
            </OrdersProvider>
          </FavoritesProvider>
        </CartProvider>
      </SidebarProvider>
    </AuthProvider>
  )
}
