"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ShoppingCart, Heart, Search, Menu, X } from 'lucide-react'
import { Button } from './Button'
import { useCartStore } from '@/lib/store'
import { useWishlist } from './Wishlist'

// Floating Action Button for mobile
export function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false)
  const { getTotalItems, toggleCart } = useCartStore()

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 md:hidden">
      {/* Cart FAB */}
      {getTotalItems() > 0 && (
        <button
          onClick={toggleCart}
          className="relative w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {getTotalItems()}
          </span>
        </button>
      )}

      {/* Scroll to top FAB */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

// Bottom Navigation for mobile
export function BottomNavigation() {
  const { getTotalItems, toggleCart } = useCartStore()
  const { getWishlistCount } = useWishlist()
  const [activeTab, setActiveTab] = useState('inicio')

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏠', href: '/' },
    { id: 'productos', label: 'Productos', icon: '🛍️', href: '/productos' },
    { id: 'buscar', label: 'Buscar', icon: '🔍', href: '/productos' },
    { id: 'favoritos', label: 'Favoritos', icon: '❤️', href: '/favoritos', count: getWishlistCount() },
    { id: 'carrito', label: 'Carrito', icon: '🛒', action: toggleCart, count: getTotalItems() }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="grid grid-cols-5 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action()
              } else if (item.href) {
                window.location.href = item.href
              }
              setActiveTab(item.id)
            }}
            className={cn(
              'flex flex-col items-center justify-center py-2 px-1 text-xs relative transition-colors',
              activeTab === item.id
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-primary-500'
            )}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {item.count && item.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.count > 99 ? '99+' : item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Pull to refresh
export function PullToRefresh({ onRefresh, children }: { 
  onRefresh: () => Promise<void>
  children: React.ReactNode 
}) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && startY > 0) {
      const currentY = e.touches[0].clientY
      const distance = Math.max(0, (currentY - startY) * 0.5)
      
      if (distance > 0) {
        e.preventDefault()
        setPullDistance(distance)
        setIsPulling(distance > 60)
      }
    }
  }

  const handleTouchEnd = async () => {
    if (isPulling && pullDistance > 60) {
      await onRefresh()
    }
    
    setIsPulling(false)
    setPullDistance(0)
    setStartY(0)
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {pullDistance > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-primary-50 transition-all"
          style={{ 
            height: `${Math.min(pullDistance, 80)}px`,
            transform: `translateY(-${Math.min(pullDistance, 80)}px)`
          }}
        >
          <div className={cn(
            'transition-all duration-200',
            isPulling ? 'animate-spin' : ''
          )}>
            {isPulling ? '🔄' : '⬇️'}
          </div>
          <span className="ml-2 text-sm text-primary-600">
            {isPulling ? 'Suelta para actualizar' : 'Desliza para actualizar'}
          </span>
        </div>
      )}
      {children}
    </div>
  )
}

// Touch-friendly product card for mobile
export function MobileProductCard({ 
  product, 
  onAddToCart, 
  className 
}: { 
  product: any
  onAddToCart: () => void
  className?: string 
}) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className={cn(
      'bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 touch-manipulation',
      className
    )}>
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {!imageError ? (
          <img
            src={product.images?.[0] || '/placeholder-product.png'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-4xl">📦</span>
          </div>
        )}
        
        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute bottom-2 left-2 right-2 flex gap-2">
            <Button size="sm" className="flex-1 bg-white/90 text-gray-800 hover:bg-white">
              Ver
            </Button>
            <Button size="sm" onClick={onAddToCart} className="flex-1">
              Comprar
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isCustomizable && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Personalizable
            </span>
          )}
          {product.variants?.[0]?.stock <= 5 && product.variants?.[0]?.stock > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              ¡Últimas!
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.category?.name}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={cn(
                    'text-sm',
                    star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  )}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
        )}
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary-600">
              {product.basePrice?.toFixed(2)}€
            </span>
            {product.variants?.length > 1 && (
              <span className="text-xs text-gray-500 ml-1">desde</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors">
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            </button>
            <Button 
              size="sm" 
              onClick={onAddToCart}
              disabled={product.variants?.[0]?.stock <= 0}
              className="min-w-[80px]"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Comprar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile-optimized search bar
export function MobileSearchBar({ 
  value, 
  onChange, 
  onSubmit,
  placeholder = "Buscar productos..." 
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
}) {
  return (
    <div className="flex gap-2 p-4 bg-white border-b border-gray-200 md:hidden">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <Button 
        onClick={onSubmit}
        className="px-6 py-3 rounded-full"
      >
        Buscar
      </Button>
    </div>
  )
}