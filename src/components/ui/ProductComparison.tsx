import React, { useState, useEffect } from 'react'
import { Scale, X, Eye, ShoppingCart } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  basePrice: number
  images: string[]
  category: {
    name: string
  }
  variants: Array<{
    id: string
    name: string
    price: number
  }>
}

interface ComparisonButtonProps {
  productId: string
  className?: string
}

export function ComparisonButton({ productId, className }: ComparisonButtonProps) {
  const [isInComparison, setIsInComparison] = useState(false)

  useEffect(() => {
    checkComparisonStatus()
  }, [productId])

  const checkComparisonStatus = () => {
    const comparison = JSON.parse(localStorage.getItem('comparison') || '[]')
    setIsInComparison(comparison.includes(productId))
  }

  const toggleComparison = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const comparison = JSON.parse(localStorage.getItem('comparison') || '[]')
    
    if (isInComparison) {
      const updated = comparison.filter((id: string) => id !== productId)
      localStorage.setItem('comparison', JSON.stringify(updated))
      setIsInComparison(false)
      toast.success('Eliminado de comparación')
    } else {
      if (comparison.length >= 3) {
        toast.error('Máximo 3 productos para comparar')
        return
      }
      const updated = [...comparison, productId]
      localStorage.setItem('comparison', JSON.stringify(updated))
      setIsInComparison(true)
      toast.success('Añadido a comparación')
    }
    
    window.dispatchEvent(new CustomEvent('comparisonUpdated'))
  }

  return (
    <button
      onClick={toggleComparison}
      className={cn(
        'p-2 rounded-full transition-all duration-200 hover:scale-110',
        isInComparison 
          ? 'bg-blue-500 text-white' 
          : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-500',
        className
      )}
      title={isInComparison ? 'Eliminar de comparación' : 'Añadir a comparación'}
    >
      <Scale className="w-4 h-4" />
    </button>
  )
}

interface ComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadComparisonProducts()
    }
  }, [isOpen])

  const loadComparisonProducts = async () => {
    setLoading(true)
    try {
      const comparison = JSON.parse(localStorage.getItem('comparison') || '[]')
      if (comparison.length === 0) {
        setProducts([])
        return
      }

      const productPromises = comparison.map(async (id: string) => {
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          return response.json()
        }
        return null
      })

      const results = await Promise.all(productPromises)
      setProducts(results.filter(Boolean))
    } catch (error) {
      console.error('Error loading comparison products:', error)
      toast.error('Error al cargar productos para comparar')
    } finally {
      setLoading(false)
    }
  }

  const removeFromComparison = (productId: string) => {
    const comparison = JSON.parse(localStorage.getItem('comparison') || '[]')
    const updated = comparison.filter((id: string) => id !== productId)
    localStorage.setItem('comparison', JSON.stringify(updated))
    setProducts(products.filter(p => p.id !== productId))
    window.dispatchEvent(new CustomEvent('comparisonUpdated'))
    toast.success('Producto eliminado de la comparación')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            Comparar Productos ({products.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay productos para comparar
              </h3>
              <p className="text-gray-500 mb-4">
                Añade productos desde el catálogo para comenzar a comparar
              </p>
              <Button onClick={onClose}>
                Explorar Productos
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="relative">
                  <button
                    onClick={() => removeFromComparison(product.id)}
                    className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="aspect-square bg-gray-100 relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.images[0] || '/placeholder-product.png'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4 space-y-3">
                    <Badge variant="outline" className="text-xs">
                      {product.category.name}
                    </Badge>

                    <h3 className="font-medium text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="space-y-2">
                      <div className="text-lg font-bold text-primary-600">
                        Desde {product.basePrice.toFixed(2)}€
                      </div>
                      
                      {product.variants.length > 0 && (
                        <div className="text-sm text-gray-500">
                          {product.variants.length} variante{product.variants.length > 1 ? 's' : ''} disponible{product.variants.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href={`/productos/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                      <Link href={`/productos/${product.id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Comprar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function useComparison() {
  const [comparison, setComparison] = useState<string[]>([])

  useEffect(() => {
    const savedComparison = JSON.parse(localStorage.getItem('comparison') || '[]')
    setComparison(savedComparison)

    const handleComparisonUpdate = () => {
      const updated = JSON.parse(localStorage.getItem('comparison') || '[]')
      setComparison(updated)
    }

    window.addEventListener('comparisonUpdated', handleComparisonUpdate)
    
    return () => {
      window.removeEventListener('comparisonUpdated', handleComparisonUpdate)
    }
  }, [])

  return {
    comparison,
    getComparisonCount: () => comparison.length
  }
}