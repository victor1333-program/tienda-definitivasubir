"use client"

import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import HeaderOriginal from "./HeaderOriginal"
import Footer from "./Footer"

// Test both lazy components
const CartSidebar = dynamic(() => import("./CartSidebar"), {
  loading: () => null,
  ssr: false
})

const WhatsAppWidget = dynamic(() => import("../WhatsAppWidget"), {
  loading: () => null,
  ssr: false
})

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')
  const isAuthRoute = pathname.startsWith('/auth')

  if (isAdminRoute || isAuthRoute) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    )
  }

  // Test with both components added
  return (
    <>
      <HeaderOriginal />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <CartSidebar />
      <WhatsAppWidget />
    </>
  )
}