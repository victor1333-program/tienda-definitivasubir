"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  BarChart3,
  FileImage,
  UserCircle,
  Home,
  ChevronDown,
  LogOut,
  Palette,
  Truck,
  CreditCard,
  PieChart,
  FileText,
  Layers,
  Building2,
  Factory,
  Calculator,
  Package2,
  Target,
  TrendingUp,
  Receipt,
  BookOpen,
  Mail,
  Menu,
  Layout,
  Brush
} from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Auto-expand menu based on current path
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pathname.startsWith("/admin/content")) {
        setExpandedMenus(prev => prev.includes("contenido") ? prev : [...prev, "contenido"])
      } else if (pathname.startsWith("/admin/products") || pathname.startsWith("/admin/categories") || pathname.startsWith("/admin/inventory") || pathname.startsWith("/admin/suppliers")) {
        setExpandedMenus(prev => prev.includes("productos") ? prev : [...prev, "productos"])
      } else if (pathname.startsWith("/admin/production")) {
        setExpandedMenus(prev => prev.includes("produccion") ? prev : [...prev, "produccion"])
      } else if (pathname.startsWith("/admin/customers")) {
        setExpandedMenus(prev => prev.includes("clientes") ? prev : [...prev, "clientes"])
      } else if (pathname.startsWith("/admin/finances")) {
        setExpandedMenus(prev => prev.includes("finanzas") ? prev : [...prev, "finanzas"])
      } else if (pathname.startsWith("/admin/settings") || pathname.startsWith("/admin/email-system")) {
        setExpandedMenus(prev => prev.includes("configuracion") ? prev : [...prev, "configuracion"])
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [pathname])

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => {
      const newMenus = prev.includes(menu) 
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
      return newMenus
    })
  }

  const handleLogout = async () => {
    setShowLogoutModal(false)
    await signOut({ callbackUrl: "/auth/signin" })
  }

  const getLinkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      pathname === path
        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
        : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
    }`

  const getParentLinkClass = (basePath: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      pathname.startsWith(basePath)
        ? "bg-orange-50 text-orange-700 border border-orange-200"
        : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
    }`

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col shadow-sm fixed left-0 top-0 z-30">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src="/img/Social_Logo.png" 
                alt="Lovilike Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Lovilike</h2>
              <p className="text-xs text-gray-500 font-medium">Panel Administrativo</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db #f3f4f6'
        }}>
          <Link href="/admin" className={getLinkClass("/admin")}>
            <Home className="h-5 w-5" />
            Dashboard
          </Link>

          <Link href="/admin/orders" className={getLinkClass("/admin/orders")}>
            <ShoppingCart className="h-5 w-5" />
            Pedidos
          </Link>

          {/* Productos Menu */}
          <div>
            <button
              onClick={() => toggleMenu("productos")}
              className={`w-full ${getParentLinkClass("/admin/products")} justify-between`}
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5" />
                Productos
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                expandedMenus.includes("productos") ? "rotate-180" : ""
              }`} />
            </button>
            
            {expandedMenus.includes("productos") && (
              <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-4">
                <Link href="/admin/products" className={getLinkClass("/admin/products")}>
                  <Package className="h-4 w-4" />
                  Productos
                </Link>
                <Link href="/admin/categories" className={getLinkClass("/admin/categories")}>
                  <Layers className="h-4 w-4" />
                  Categorías
                </Link>
                <Link href="/admin/inventory" className={getLinkClass("/admin/inventory")}>
                  <Package2 className="h-4 w-4" />
                  Inventario
                </Link>
                <Link href="/admin/suppliers" className={getLinkClass("/admin/suppliers")}>
                  <Building2 className="h-4 w-4" />
                  Proveedores
                </Link>
              </div>
            )}
          </div>

          {/* Producción Menu */}
          <div>
            <button
              onClick={() => toggleMenu("produccion")}
              className={`w-full ${getParentLinkClass("/admin/production")} justify-between`}
            >
              <div className="flex items-center gap-3">
                <Factory className="h-5 w-5" />
                Producción
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                expandedMenus.includes("produccion") ? "rotate-180" : ""
              }`} />
            </button>
            
            {expandedMenus.includes("produccion") && (
              <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-4">
                <Link href="/admin/production/board" className={getLinkClass("/admin/production/board")}>
                  <Layers className="h-4 w-4" />
                  Tablero
                </Link>
                <Link href="/admin/workshop" className={getLinkClass("/admin/workshop")}>
                  <Settings className="h-4 w-4" />
                  Taller
                </Link>
                <Link href="/admin/production/material-stock" className={getLinkClass("/admin/production/material-stock")}>
                  <Package2 className="h-4 w-4" />
                  Stock Material
                </Link>
                <Link href="/admin/production/cost-calculator" className={getLinkClass("/admin/production/cost-calculator")}>
                  <Calculator className="h-4 w-4" />
                  Calc. Costes
                </Link>
                <Link href="/admin/production/materials" className={getLinkClass("/admin/production/materials")}>
                  <Package2 className="h-4 w-4" />
                  Materiales
                </Link>
              </div>
            )}
          </div>

          <Link href="/admin/designs" className={getLinkClass("/admin/designs")}>
            <Target className="h-5 w-5" />
            Diseños
          </Link>

          <Link href="/admin/email-system" className={getLinkClass("/admin/email-system")}>
            <Mail className="h-5 w-5" />
            Sistema Email
          </Link>

          {/* Contenido Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("contenido")}
              className={`w-full ${getParentLinkClass("/admin/content")} justify-between`}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                Contenido
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                expandedMenus.includes("contenido") ? "rotate-180" : ""
              }`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${
              expandedMenus.includes("contenido") ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}>
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-orange-200 pl-4 bg-gray-50/50 rounded-r-lg py-2">
                <Link href="/admin/content/gallery" className={getLinkClass("/admin/content/gallery")}>
                  <FileImage className="h-4 w-4" />
                  Galería
                </Link>
                <Link href="/admin/content/menus" className={getLinkClass("/admin/content/menus")}>
                  <Menu className="h-4 w-4" />
                  Menús
                </Link>
              </div>
            </div>
          </div>

          {/* Clientes Menu */}
          <div>
            <button
              onClick={() => toggleMenu("clientes")}
              className={`w-full ${getParentLinkClass("/admin/customers")} justify-between`}
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                Clientes
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                expandedMenus.includes("clientes") ? "rotate-180" : ""
              }`} />
            </button>
            
            {expandedMenus.includes("clientes") && (
              <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-4">
                <Link href="/admin/customers" className={getLinkClass("/admin/customers")}>
                  <Users className="h-4 w-4" />
                  Lista Clientes
                </Link>
              </div>
            )}
          </div>

          {/* Finanzas Menu */}
          <div>
            <button
              onClick={() => toggleMenu("finanzas")}
              className={`w-full ${getParentLinkClass("/admin/finances")} justify-between`}
            >
              <div className="flex items-center gap-3">
                <PieChart className="h-5 w-5" />
                Finanzas
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                expandedMenus.includes("finanzas") ? "rotate-180" : ""
              }`} />
            </button>
            
            {expandedMenus.includes("finanzas") && (
              <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-4">
                <Link href="/admin/invoices" className={getLinkClass("/admin/invoices")}>
                  <Receipt className="h-4 w-4" />
                  Facturas
                </Link>
                <Link href="/admin/finances/quotes" className={getLinkClass("/admin/finances/quotes")}>
                  <FileText className="h-4 w-4" />
                  Presupuestos
                </Link>
                <Link href="/admin/finances/expenses" className={getLinkClass("/admin/finances/expenses")}>
                  <BookOpen className="h-4 w-4" />
                  Gastos
                </Link>
              </div>
            )}
          </div>

          {/* Configuración Menu */}
          <div>
            <button
              onClick={() => toggleMenu("configuracion")}
              className={`w-full ${getParentLinkClass("/admin/settings")} justify-between`}
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                Configuración
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                expandedMenus.includes("configuracion") ? "rotate-180" : ""
              }`} />
            </button>
            
            {expandedMenus.includes("configuracion") && (
              <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-4">
                <Link href="/admin/settings/general" className={getLinkClass("/admin/settings/general")}>
                  <Settings className="h-4 w-4" />
                  General
                </Link>
                <Link href="/admin/settings/billing" className={getLinkClass("/admin/settings/billing")}>
                  <Receipt className="h-4 w-4" />
                  Facturación
                </Link>
                <Link href="/admin/settings/payment-methods" className={getLinkClass("/admin/settings/payment-methods")}>
                  <CreditCard className="h-4 w-4" />
                  Métodos Pago
                </Link>
                <Link href="/admin/settings/shipping" className={getLinkClass("/admin/settings/shipping")}>
                  <Truck className="h-4 w-4" />
                  Métodos Envío
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl text-center max-w-sm mx-4">
            <div className="mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">¿Cerrar sesión?</h2>
              <p className="text-gray-600 mt-2">Se cerrará tu sesión en el panel de administración.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleLogout} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sí, cerrar
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)} 
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}