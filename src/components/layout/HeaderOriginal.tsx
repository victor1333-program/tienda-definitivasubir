"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { 
  ChevronDown, 
  Search, 
  Heart, 
  ShoppingCart, 
  Bell,
  User,
  Phone,
  Mail,
  Truck,
  Menu,
  X
} from "lucide-react"
import { useCartStore } from "@/lib/store"
import { Button } from "@/components/ui/Button"
import AuthModal from "@/components/auth/AuthModal"

export default function HeaderOriginal() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')
  
  const { data: session } = useSession()
  const { getTotalItems, toggleCart } = useCartStore()

  const categories = [
    { name: "Bodas & Eventos", href: "/categoria/bodas-eventos", icon: "💍" },
    { name: "Comuniones & Bautizos", href: "/categoria/comuniones-bautizos", icon: "✝️" },
    { name: "Baby Shower & Nacimiento", href: "/categoria/baby-shower", icon: "👶" },
    { name: "Textil Personalizado", href: "/categoria/textil-personalizado", icon: "👕" },
    { name: "Tazas & Accesorios", href: "/categoria/tazas-accesorios", icon: "☕" },
    { name: "Decoración", href: "/categoria/decoracion", icon: "🎨" },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/productos?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-2 space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-base">📞</span>
              <span className="font-semibold">611 066 997</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base">📧</span>
              <span className="font-semibold">info@lovilike.es</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base">🚚</span>
              <span className="font-semibold">Entrega Gratis en compras superiores a 50€</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base">⚡</span>
              <span className="font-semibold">Entrega 24h con envío Express</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-lg p-4">
                  <img 
                    src="/img/Social_Logo.png" 
                    alt="Lovilike Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link 
                href="/" 
                className="flex items-center px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200"
              >
                <span className="mr-2">🏠</span>
                <span className="font-semibold">Inicio</span>
              </Link>

              {/* Products Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200"
                >
                  <span className="mr-2">📦</span>
                  <span className="font-semibold">Productos</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-1 w-80 bg-gradient-to-b from-orange-500 to-orange-600 rounded-xl shadow-xl py-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="px-4 pb-3 border-b border-orange-400">
                    <h3 className="font-semibold text-white text-sm">Categorías de Productos</h3>
                  </div>
                  <div className="py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="flex items-center px-4 py-3 text-white hover:bg-orange-400 hover:bg-opacity-50 transition-colors"
                      >
                        <span className="text-lg mr-3">{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 pt-3 border-t border-orange-400">
                    <Link
                      href="/productos"
                      className="block w-full text-center bg-white text-orange-600 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-bold"
                    >
                      Ver Todos los Productos
                    </Link>
                  </div>
                </div>
              </div>

              <Link 
                href="/personalizador" 
                className="flex items-center px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200"
              >
                <span className="mr-2">🎨</span>
                <span className="font-semibold">Personalizar</span>
              </Link>

              <Link 
                href="/contacto" 
                className="flex items-center px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200"
              >
                <span className="mr-2">📞</span>
                <span className="font-semibold">Contacto</span>
              </Link>
            </nav>

            {/* Search, Cart, User */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-4 pr-10 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-1.5 rounded-full hover:bg-orange-600 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>

              {/* Wishlist */}
              <Link 
                href="/favoritos" 
                className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors relative"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <button 
                onClick={toggleCart}
                className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                  3
                </span>
              </button>

              {/* User Menu */}
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-2 rounded-full hover:bg-orange-600 transition-colors"
                  >
                    <div className="w-6 h-6 bg-orange-300 rounded-full flex items-center justify-center">
                      <span className="text-orange-800 font-bold text-sm">
                        {session.user?.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <span className="text-sm font-bold hidden md:inline">
                      {session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN' ? 'Administrador' : session.user?.name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                      <Link
                        href="/perfil"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        href="/perfil/pedidos"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mis Pedidos
                      </Link>
                      {(session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN') && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Panel de Admin
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          signOut()
                          setIsUserMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={() => {
                      setAuthModalMode('login')
                      setShowAuthModal(true)
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-full text-sm font-medium"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    onClick={() => {
                      setAuthModalMode('register')
                      setShowAuthModal(true)
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-full text-sm font-medium"
                  >
                    Registro
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-r-full hover:bg-orange-600 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Navigation Links */}
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              🏠 Inicio
            </Link>
            <Link
              href="/productos"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              📦 Productos
            </Link>
            <Link
              href="/personalizador"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              🎨 Personalizar
            </Link>
            <Link
              href="/contacto"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              📞 Contacto
            </Link>

            {/* Categories */}
            <div className="border-t border-gray-200 pt-2">
              <p className="px-3 py-2 text-sm font-semibold text-gray-500">Categorías</p>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="block px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.icon} {category.name}
                </Link>
              ))}
            </div>

            {/* User Section */}
            {session ? (
              <div className="border-t border-gray-200 pt-2">
                <div className="px-3 py-2 text-sm font-semibold text-gray-500">
                  Hola, {session.user?.name}
                </div>
                <Link
                  href="/perfil"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
                <Link
                  href="/perfil/pedidos"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mis Pedidos
                </Link>
                {(session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN') && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panel de Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-2">
                <button
                  onClick={() => {
                    setShowAuthModal(true)
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 bg-orange-500 text-white rounded-lg"
                >
                  Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authModalMode}
          onSwitchMode={setAuthModalMode}
        />
      )}

      {/* Click outside to close dropdowns */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}