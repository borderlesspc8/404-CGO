import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import "@/styles/print.css"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/components/shopping-cart-context"
import { FavoritesProvider } from "@/components/favorites-context"
import { OrdersProvider } from "@/components/orders-context"
import { ReviewsProvider } from "@/components/reviews-context"
import { SidebarProvider } from "@/components/sidebar-context"
import PWAInstaller from "@/components/pwa-installer"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Oris - Gestão odontológica inteligente",
  description: "Sistema completo de gestão para clínicas odontológicas",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Clínica Dental",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://clinicadental.com",
    title: "Clínica Odontológica - Gestão e E-commerce",
    description: "Sistema completo de gestão de clínica odontológica com e-commerce",
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clínica Odontológica",
    description: "Sistema de gestão com e-commerce integrado",
    images: ["/icon-512x512.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        <PWAInstaller />
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
        <Analytics />
      </body>
    </html>
  )
}
