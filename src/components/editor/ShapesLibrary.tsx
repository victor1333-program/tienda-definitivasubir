'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  Square, 
  Circle, 
  Triangle, 
  Star, 
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Pentagon,
  Hexagon,
  Heart,
  Diamond,
  X,
  Minus
} from 'lucide-react'

interface ShapeItem {
  id: string
  name: string
  type: string
  icon: React.ReactNode
  category: string
  description: string
  defaultSize: {
    width: number
    height: number
  }
}

interface ShapesLibraryProps {
  isOpen: boolean
  onClose: () => void
  onSelectShape: (shape: ShapeItem) => void
  currentShapeSettings: {
    fillColor: string
    strokeColor: string
    strokeWidth: number
  }
  onUpdateSettings: (settings: any) => void
}

const shapesLibrary: ShapeItem[] = [
  // Formas básicas
  {
    id: 'rectangle',
    name: 'Rectángulo',
    type: 'rectangle',
    icon: <Square className="w-6 h-6" />,
    category: 'basic',
    description: 'Rectángulo básico',
    defaultSize: { width: 120, height: 80 }
  },
  {
    id: 'square',
    name: 'Cuadrado',
    type: 'square',
    icon: <Square className="w-6 h-6" />,
    category: 'basic',
    description: 'Cuadrado perfecto',
    defaultSize: { width: 100, height: 100 }
  },
  {
    id: 'circle',
    name: 'Círculo',
    type: 'circle',
    icon: <Circle className="w-6 h-6" />,
    category: 'basic',
    description: 'Círculo perfecto',
    defaultSize: { width: 100, height: 100 }
  },
  {
    id: 'ellipse',
    name: 'Elipse',
    type: 'ellipse',
    icon: <Circle className="w-6 h-6" />,
    category: 'basic',
    description: 'Óvalo o elipse',
    defaultSize: { width: 140, height: 80 }
  },

  // Polígonos
  {
    id: 'triangle',
    name: 'Triángulo',
    type: 'triangle',
    icon: <Triangle className="w-6 h-6" />,
    category: 'polygons',
    description: 'Triángulo equilátero',
    defaultSize: { width: 100, height: 87 }
  },
  {
    id: 'triangle-right',
    name: 'Triángulo Rectángulo',
    type: 'triangle-right',
    icon: <Triangle className="w-6 h-6" />,
    category: 'polygons',
    description: 'Triángulo con ángulo recto',
    defaultSize: { width: 100, height: 100 }
  },
  {
    id: 'pentagon',
    name: 'Pentágono',
    type: 'pentagon',
    icon: <Pentagon className="w-6 h-6" />,
    category: 'polygons',
    description: 'Pentágono regular',
    defaultSize: { width: 100, height: 100 }
  },
  {
    id: 'hexagon',
    name: 'Hexágono',
    type: 'hexagon',
    icon: <Hexagon className="w-6 h-6" />,
    category: 'polygons',
    description: 'Hexágono regular',
    defaultSize: { width: 100, height: 87 }
  },

  // Flechas
  {
    id: 'arrow-right',
    name: 'Flecha Derecha',
    type: 'arrow-right',
    icon: <ArrowRight className="w-6 h-6" />,
    category: 'arrows',
    description: 'Flecha apuntando a la derecha',
    defaultSize: { width: 120, height: 60 }
  },
  {
    id: 'arrow-left',
    name: 'Flecha Izquierda',
    type: 'arrow-left',
    icon: <ArrowLeft className="w-6 h-6" />,
    category: 'arrows',
    description: 'Flecha apuntando a la izquierda',
    defaultSize: { width: 120, height: 60 }
  },
  {
    id: 'arrow-up',
    name: 'Flecha Arriba',
    type: 'arrow-up',
    icon: <ArrowUp className="w-6 h-6" />,
    category: 'arrows',
    description: 'Flecha apuntando hacia arriba',
    defaultSize: { width: 60, height: 120 }
  },
  {
    id: 'arrow-down',
    name: 'Flecha Abajo',
    type: 'arrow-down',
    icon: <ArrowDown className="w-6 h-6" />,
    category: 'arrows',
    description: 'Flecha apuntando hacia abajo',
    defaultSize: { width: 60, height: 120 }
  },

  // Símbolos especiales
  {
    id: 'star',
    name: 'Estrella',
    type: 'star',
    icon: <Star className="w-6 h-6" />,
    category: 'symbols',
    description: 'Estrella de 5 puntas',
    defaultSize: { width: 100, height: 100 }
  },
  {
    id: 'heart',
    name: 'Corazón',
    type: 'heart',
    icon: <Heart className="w-6 h-6" />,
    category: 'symbols',
    description: 'Corazón romántico',
    defaultSize: { width: 100, height: 90 }
  },
  {
    id: 'diamond',
    name: 'Rombo',
    type: 'diamond',
    icon: <Diamond className="w-6 h-6" />,
    category: 'symbols',
    description: 'Rombo o diamante',
    defaultSize: { width: 100, height: 100 }
  },

  // Líneas
  {
    id: 'line-horizontal',
    name: 'Línea Horizontal',
    type: 'line-horizontal',
    icon: <Minus className="w-6 h-6" />,
    category: 'lines',
    description: 'Línea recta horizontal',
    defaultSize: { width: 150, height: 2 }
  },
  {
    id: 'line-vertical',
    name: 'Línea Vertical',
    type: 'line-vertical',
    icon: <span className="w-6 h-6 flex items-center justify-center">|</span>,
    category: 'lines',
    description: 'Línea recta vertical',
    defaultSize: { width: 2, height: 150 }
  },
  {
    id: 'line-diagonal',
    name: 'Línea Diagonal',
    type: 'line-diagonal',
    icon: <span className="w-6 h-6 flex items-center justify-center">/</span>,
    category: 'lines',
    description: 'Línea diagonal',
    defaultSize: { width: 100, height: 100 }
  }
]

export default function ShapesLibrary({ 
  isOpen, 
  onClose, 
  onSelectShape, 
  currentShapeSettings,
  onUpdateSettings 
}: ShapesLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [shapeSettings, setShapeSettings] = useState(currentShapeSettings)

  if (!isOpen) return null

  const categories = [
    { id: 'all', name: 'Todas', count: shapesLibrary.length },
    { id: 'basic', name: 'Básicas', count: shapesLibrary.filter(s => s.category === 'basic').length },
    { id: 'polygons', name: 'Polígonos', count: shapesLibrary.filter(s => s.category === 'polygons').length },
    { id: 'arrows', name: 'Flechas', count: shapesLibrary.filter(s => s.category === 'arrows').length },
    { id: 'symbols', name: 'Símbolos', count: shapesLibrary.filter(s => s.category === 'symbols').length },
    { id: 'lines', name: 'Líneas', count: shapesLibrary.filter(s => s.category === 'lines').length },
  ]

  const filteredShapes = selectedCategory === 'all' 
    ? shapesLibrary 
    : shapesLibrary.filter(shape => shape.category === selectedCategory)

  const handleSettingsChange = (field: string, value: any) => {
    const newSettings = { ...shapeSettings, [field]: value }
    setShapeSettings(newSettings)
    onUpdateSettings(newSettings)
  }

  const handleSelectShape = (shape: ShapeItem) => {
    onSelectShape(shape)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Square className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold">Biblioteca de Formas</h2>
              <p className="text-sm text-gray-600">
                Selecciona una forma geométrica para añadir al diseño
              </p>
            </div>
          </div>
          
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categorías</h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Configuración</h3>
              
              <div>
                <label className="text-xs text-gray-600 block mb-1">Color de Relleno</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={shapeSettings.fillColor}
                    onChange={(e) => handleSettingsChange('fillColor', e.target.value)}
                    className="w-16 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={shapeSettings.fillColor}
                    onChange={(e) => handleSettingsChange('fillColor', e.target.value)}
                    className="flex-1 text-xs"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 block mb-1">Color de Borde</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={shapeSettings.strokeColor}
                    onChange={(e) => handleSettingsChange('strokeColor', e.target.value)}
                    className="w-16 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={shapeSettings.strokeColor}
                    onChange={(e) => handleSettingsChange('strokeColor', e.target.value)}
                    className="flex-1 text-xs"
                    placeholder="#1e40af"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Grosor del Borde ({shapeSettings.strokeWidth}px)
                </label>
                <Input
                  type="range"
                  min="0"
                  max="10"
                  value={shapeSettings.strokeWidth}
                  onChange={(e) => handleSettingsChange('strokeWidth', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Preview */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Vista Previa</label>
                <div className="w-full h-20 bg-white border rounded flex items-center justify-center">
                  <div
                    className="w-12 h-8"
                    style={{
                      backgroundColor: shapeSettings.fillColor,
                      border: `${shapeSettings.strokeWidth}px solid ${shapeSettings.strokeColor}`,
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Shapes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredShapes.map(shape => (
                <Card 
                  key={shape.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => handleSelectShape(shape)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-3">
                      <div 
                        className="p-4 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors"
                        style={{
                          color: shapeSettings.fillColor
                        }}
                      >
                        {shape.icon}
                      </div>
                    </div>
                    <h3 className="font-medium text-sm mb-1">{shape.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{shape.description}</p>
                    <div className="text-xs text-gray-400">
                      {shape.defaultSize.width} × {shape.defaultSize.height}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredShapes.length === 0 && (
              <div className="text-center py-12">
                <Square className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay formas en esta categoría
                </h3>
                <p className="text-gray-600">
                  Selecciona otra categoría para ver más formas disponibles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}