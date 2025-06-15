'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Package2, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Calculator,
  Palette,
  Package,
  Box
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Material {
  id: string
  name: string
  description: string
  category: string
  sku: string
  supplier: string
  currentStock: number
  minimumStock: number
  maximumStock: number
  unitCost: number
  unitMeasure: string
  location: string
  color?: string
  size?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  lastRestockDate: string
  expirationDate?: string
  isActive: boolean
  tags: string[]
}

interface MaterialCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
  materialCount: number
}

interface StockMovement {
  id: string
  materialId: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason: string
  date: string
  user: string
  cost?: number
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [categories, setCategories] = useState<MaterialCategory[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'overstocked'>('all')
  const [showAddMaterial, setShowAddMaterial] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [activeTab, setActiveTab] = useState<'materials' | 'categories' | 'movements' | 'reports'>('materials')

  useEffect(() => {
    fetchMaterialsData()
  }, [])

  const fetchMaterialsData = async () => {
    try {
      setLoading(true)
      
      // Mock data - en producción esto vendría de la API
      const mockCategories: MaterialCategory[] = [
        {
          id: 'fabrics',
          name: 'Telas',
          description: 'Telas para impresión textil',
          color: 'bg-blue-500',
          icon: '🧵',
          materialCount: 15
        },
        {
          id: 'inks',
          name: 'Tintas',
          description: 'Tintas para impresión',
          color: 'bg-purple-500',
          icon: '🎨',
          materialCount: 8
        },
        {
          id: 'ceramics',
          name: 'Cerámicas',
          description: 'Tazas, platos y cerámicas',
          color: 'bg-orange-500',
          icon: '☕',
          materialCount: 12
        },
        {
          id: 'paper',
          name: 'Papel',
          description: 'Papel para impresión y packaging',
          color: 'bg-green-500',
          icon: '📄',
          materialCount: 6
        },
        {
          id: 'packaging',
          name: 'Embalaje',
          description: 'Cajas, bolsas y material de embalaje',
          color: 'bg-yellow-500',
          icon: '📦',
          materialCount: 10
        }
      ]

      const mockMaterials: Material[] = [
        {
          id: '1',
          name: 'Tela Algodón 100% Blanca',
          description: 'Tela de algodón 100% para camisetas, color blanco',
          category: 'fabrics',
          sku: 'TEL-ALG-BLA-001',
          supplier: 'TextilPro S.L.',
          currentStock: 50,
          minimumStock: 20,
          maximumStock: 100,
          unitCost: 8.50,
          unitMeasure: 'metros',
          location: 'Almacén A - Estante 1',
          color: 'Blanco',
          size: 'Rollo 150cm ancho',
          weight: 180,
          lastRestockDate: '2024-03-01',
          isActive: true,
          tags: ['algodón', 'camisetas', 'blanco']
        },
        {
          id: '2',
          name: 'Tinta Sublimación Negro',
          description: 'Tinta de sublimación color negro, alta calidad',
          category: 'inks',
          sku: 'TNT-SUB-NEG-001',
          supplier: 'InkMaster S.A.',
          currentStock: 8,
          minimumStock: 15,
          maximumStock: 50,
          unitCost: 45.00,
          unitMeasure: 'litros',
          location: 'Almacén B - Estante 3',
          color: 'Negro',
          weight: 1000,
          lastRestockDate: '2024-02-15',
          expirationDate: '2025-02-15',
          isActive: true,
          tags: ['sublimación', 'negro', 'tinta']
        },
        {
          id: '3',
          name: 'Taza Cerámica Blanca 11oz',
          description: 'Taza de cerámica blanca para sublimación, 11oz',
          category: 'ceramics',
          sku: 'TAZ-CER-BLA-11',
          supplier: 'CeramicWorld Ltd.',
          currentStock: 120,
          minimumStock: 50,
          maximumStock: 300,
          unitCost: 2.75,
          unitMeasure: 'unidades',
          location: 'Almacén C - Estante 5',
          color: 'Blanco',
          dimensions: {
            length: 9.5,
            width: 8.2,
            height: 9.5
          },
          weight: 350,
          lastRestockDate: '2024-03-10',
          isActive: true,
          tags: ['taza', 'cerámica', 'sublimación', '11oz']
        },
        {
          id: '4',
          name: 'Papel Transfer A4',
          description: 'Papel transfer para impresión en telas oscuras',
          category: 'paper',
          sku: 'PAP-TRA-A4-001',
          supplier: 'PaperPrint S.L.',
          currentStock: 0,
          minimumStock: 10,
          maximumStock: 100,
          unitCost: 1.20,
          unitMeasure: 'hojas',
          location: 'Almacén A - Estante 8',
          size: 'A4',
          weight: 5,
          lastRestockDate: '2024-01-20',
          isActive: true,
          tags: ['transfer', 'A4', 'telas oscuras']
        },
        {
          id: '5',
          name: 'Caja Cartón 20x15x10cm',
          description: 'Caja de cartón corrugado para envíos',
          category: 'packaging',
          sku: 'CAJ-CAR-201510',
          supplier: 'PackagePro S.A.',
          currentStock: 250,
          minimumStock: 100,
          maximumStock: 500,
          unitCost: 0.85,
          unitMeasure: 'unidades',
          location: 'Almacén D - Estante 1',
          dimensions: {
            length: 20,
            width: 15,
            height: 10
          },
          weight: 120,
          lastRestockDate: '2024-03-05',
          isActive: true,
          tags: ['caja', 'cartón', 'envío']
        }
      ]

      setCategories(mockCategories)
      setMaterials(mockMaterials)
    } catch (error) {
      console.error('Error fetching materials data:', error)
      toast.error('Error al cargar los materiales')
    } finally {
      setLoading(false)
    }
  }

  const getStockStatus = (material: Material) => {
    if (material.currentStock === 0) {
      return { status: 'out', color: 'text-red-600', bg: 'bg-red-100', label: 'Agotado' }
    } else if (material.currentStock <= material.minimumStock) {
      return { status: 'low', color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Stock Bajo' }
    } else if (material.currentStock >= material.maximumStock * 0.9) {
      return { status: 'high', color: 'text-blue-600', bg: 'bg-blue-100', label: 'Stock Alto' }
    } else {
      return { status: 'normal', color: 'text-green-600', bg: 'bg-green-100', label: 'Normal' }
    }
  }

  const getStockIcon = (status: string) => {
    switch (status) {
      case 'out':
        return <AlertTriangle className="w-4 h-4" />
      case 'low':
        return <TrendingDown className="w-4 h-4" />
      case 'high':
        return <TrendingUp className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory
    
    const stockStatus = getStockStatus(material).status
    const matchesStockFilter = stockFilter === 'all' || 
                              (stockFilter === 'low' && stockStatus === 'low') ||
                              (stockFilter === 'out' && stockStatus === 'out') ||
                              (stockFilter === 'overstocked' && stockStatus === 'high')
    
    return matchesSearch && matchesCategory && matchesStockFilter
  })

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.icon || '📦'
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Sin categoría'
  }

  const calculateTotalValue = () => {
    return materials.reduce((total, material) => {
      return total + (material.currentStock * material.unitCost)
    }, 0)
  }

  const getLowStockCount = () => {
    return materials.filter(material => {
      const status = getStockStatus(material).status
      return status === 'low' || status === 'out'
    }).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Gestión de Materiales</h1>
          <p className="text-gray-600">Controla el inventario y recursos para producción</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Importar
          </Button>
          <Button
            onClick={() => setShowAddMaterial(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Material
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Materiales</p>
              <p className="text-3xl font-bold text-gray-900">{materials.length}</p>
            </div>
            <Package2 className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
              <p className="text-3xl font-bold text-gray-900">€{calculateTotalValue().toFixed(2)}</p>
            </div>
            <Calculator className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-3xl font-bold text-red-600">{getLowStockCount()}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categorías</p>
              <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <Box className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('materials')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'materials'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Materiales
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Categorías
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'movements'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Movimientos
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Reportes
          </button>
        </nav>
      </div>

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar materiales por nombre, SKU o proveedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="all">Todos los stocks</option>
                  <option value="low">Stock bajo</option>
                  <option value="out">Agotado</option>
                  <option value="overstocked">Sobrestockeado</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Materials Grid */}
          <div className="grid gap-6">
            {filteredMaterials.map((material) => {
              const stockInfo = getStockStatus(material)
              return (
                <Card key={material.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getCategoryIcon(material.category)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{material.name}</h3>
                          <p className="text-sm text-gray-500">{material.sku}</p>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stockInfo.bg} ${stockInfo.color}`}>
                          {getStockIcon(stockInfo.status)}
                          {stockInfo.label}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{material.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Categoría:</span>
                          <p className="font-medium">{getCategoryName(material.category)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock Actual:</span>
                          <p className="font-medium">{material.currentStock} {material.unitMeasure}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock Mínimo:</span>
                          <p className="font-medium">{material.minimumStock} {material.unitMeasure}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Costo Unitario:</span>
                          <p className="font-medium">€{material.unitCost.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Proveedor:</span>
                          <p className="font-medium">{material.supplier}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Ubicación:</span>
                          <p className="font-medium">{material.location}</p>
                        </div>
                      </div>
                      
                      {material.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {material.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <Package2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay materiales</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron materiales con los filtros aplicados
              </p>
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{category.materialCount} materiales</p>
                </div>
                <Button size="sm" variant="outline">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="grid gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Resumen de Inventario</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{materials.filter(m => getStockStatus(m).status === 'normal').length}</p>
                <p className="text-sm text-gray-600">Stock Normal</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{materials.filter(m => getStockStatus(m).status === 'low').length}</p>
                <p className="text-sm text-gray-600">Stock Bajo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{materials.filter(m => getStockStatus(m).status === 'out').length}</p>
                <p className="text-sm text-gray-600">Agotados</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}