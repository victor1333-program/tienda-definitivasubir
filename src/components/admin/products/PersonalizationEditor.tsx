"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Move, RotateCw, Square, Circle, Type, 
  Image as ImageIcon, Palette, Eye, Save,
  ZoomIn, ZoomOut, RotateCcw, Trash2
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ColoredSwitch } from "@/components/ui/ColoredSwitch"
import { Badge } from "@/components/ui/Badge"

interface CanvasElement {
  id: string
  type: 'text' | 'image' | 'shape'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  content?: string
  color?: string
  fontSize?: number
  fontFamily?: string
  imageUrl?: string
  shapeType?: 'rectangle' | 'circle' | 'triangle'
  fillColor?: string
  strokeColor?: string
  strokeWidth?: number
}

interface PersonalizationEditorProps {
  productId: string
  productImages?: string[]
  onSave?: (elements: CanvasElement[]) => void
}

export default function PersonalizationEditor({
  productId,
  productImages = [],
  onSave
}: PersonalizationEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 500 })
  
  // Herramientas
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'shape' | 'image'>('select')
  const [textSettings, setTextSettings] = useState({
    content: 'Texto personalizado',
    color: '#000000',
    fontSize: 24,
    fontFamily: 'Arial'
  })
  const [shapeSettings, setShapeSettings] = useState({
    type: 'rectangle' as 'rectangle' | 'circle' | 'triangle',
    fillColor: '#3B82F6',
    strokeColor: '#1D4ED8',
    strokeWidth: 2
  })

  const fontOptions = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana']

  // Generar ID único
  const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Agregar elemento al canvas
  const addElement = (type: 'text' | 'image' | 'shape') => {
    const newElement: CanvasElement = {
      id: generateId(),
      type,
      x: 50,
      y: 50,
      width: type === 'text' ? 150 : 100,
      height: type === 'text' ? 30 : 100,
      rotation: 0,
      ...(type === 'text' && {
        content: textSettings.content,
        color: textSettings.color,
        fontSize: textSettings.fontSize,
        fontFamily: textSettings.fontFamily
      }),
      ...(type === 'shape' && {
        shapeType: shapeSettings.type,
        fillColor: shapeSettings.fillColor,
        strokeColor: shapeSettings.strokeColor,
        strokeWidth: shapeSettings.strokeWidth
      })
    }

    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  // Actualizar elemento seleccionado
  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElement) return
    
    setElements(elements.map(el => 
      el.id === selectedElement ? { ...el, ...updates } : el
    ))
  }

  // Eliminar elemento seleccionado
  const deleteSelectedElement = () => {
    if (!selectedElement) return
    
    setElements(elements.filter(el => el.id !== selectedElement))
    setSelectedElement(null)
  }

  // Renderizar canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Fondo del producto (imagen o color)
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Si hay imagen de producto, mostrarla
    if (productImages.length > 0) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        drawElements()
      }
      img.src = productImages[0]
    } else {
      drawElements()
    }

    function drawElements() {
      // Renderizar elementos
      elements.forEach(element => {
        ctx.save()
        
        // Aplicar transformaciones
        const centerX = element.x + element.width / 2
        const centerY = element.y + element.height / 2
        ctx.translate(centerX, centerY)
        ctx.rotate((element.rotation * Math.PI) / 180)
        ctx.translate(-centerX, -centerY)

        // Renderizar según tipo
        switch (element.type) {
          case 'text':
            ctx.fillStyle = element.color || '#000000'
            ctx.font = `${element.fontSize || 24}px ${element.fontFamily || 'Arial'}`
            ctx.fillText(element.content || '', element.x, element.y + (element.fontSize || 24))
            break

          case 'shape':
            ctx.fillStyle = element.fillColor || '#3B82F6'
            ctx.strokeStyle = element.strokeColor || '#1D4ED8'
            ctx.lineWidth = element.strokeWidth || 2

            if (element.shapeType === 'rectangle') {
              ctx.fillRect(element.x, element.y, element.width, element.height)
              ctx.strokeRect(element.x, element.y, element.width, element.height)
            } else if (element.shapeType === 'circle') {
              const radius = Math.min(element.width, element.height) / 2
              const centerX = element.x + element.width / 2
              const centerY = element.y + element.height / 2
              ctx.beginPath()
              ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
              ctx.fill()
              ctx.stroke()
            }
            break

          case 'image':
            if (element.imageUrl) {
              const img = new Image()
              img.onload = () => {
                ctx.drawImage(img, element.x, element.y, element.width, element.height)
              }
              img.src = element.imageUrl
            }
            break
        }

        // Mostrar borde de selección
        if (element.id === selectedElement && !isPreviewMode) {
          ctx.strokeStyle = '#3B82F6'
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4)
          ctx.setLineDash([])
        }

        ctx.restore()
      })
    }
  }, [elements, selectedElement, isPreviewMode, productImages])

  const selectedEl = elements.find(el => el.id === selectedElement)

  return (
    <div className="space-y-6">
      {/* Barra de herramientas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🎨 Editor Visual de Personalización</span>
            <div className="flex items-center gap-2">
              <ColoredSwitch
                checked={isPreviewMode}
                onCheckedChange={setIsPreviewMode}
                activeColor="blue"
                inactiveColor="gray"
              />
              <Label className="text-sm">Modo Preview</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={activeTool === 'select' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTool('select')}
            >
              <Move className="h-4 w-4 mr-1" />
              Seleccionar
            </Button>
            <Button
              variant={activeTool === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTool('text')}
            >
              <Type className="h-4 w-4 mr-1" />
              Texto
            </Button>
            <Button
              variant={activeTool === 'shape' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTool('shape')}
            >
              <Square className="h-4 w-4 mr-1" />
              Formas
            </Button>
            <Button
              variant={activeTool === 'image' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTool('image')}
              disabled
            >
              <ImageIcon className="h-4 w-4 mr-1" />
              Imagen
            </Button>
            
            <div className="border-l border-gray-300 mx-2"></div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(50, zoom - 25))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm self-center px-2">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <div className="border-l border-gray-300 mx-2"></div>

            <Button
              variant="outline"
              size="sm"
              onClick={deleteSelectedElement}
              disabled={!selectedElement}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Acciones rápidas */}
          <div className="flex gap-2">
            {activeTool === 'text' && (
              <Button size="sm" onClick={() => addElement('text')}>
                + Agregar Texto
              </Button>
            )}
            {activeTool === 'shape' && (
              <Button size="sm" onClick={() => addElement('shape')}>
                + Agregar Forma
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Vista del Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div 
                  className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm"
                  style={{ transform: `scale(${zoom / 100})` }}
                >
                  <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="cursor-crosshair"
                    onClick={(e) => {
                      if (isPreviewMode) return
                      
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = (e.clientX - rect.left) * (canvasSize.width / rect.width)
                      const y = (e.clientY - rect.top) * (canvasSize.height / rect.height)
                      
                      // Buscar elemento clickeado
                      const clickedElement = elements.find(el => 
                        x >= el.x && x <= el.x + el.width &&
                        y >= el.y && y <= el.y + el.height
                      )
                      
                      setSelectedElement(clickedElement?.id || null)
                    }}
                  />
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Badge variant="outline">
                  Tamaño: {canvasSize.width}x{canvasSize.height}px
                </Badge>
                <Badge variant="outline" className="ml-2">
                  Elementos: {elements.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de propiedades */}
        <div className="space-y-4">
          {/* Configuración de herramientas */}
          {activeTool === 'text' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configuración de Texto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Contenido</Label>
                  <Input
                    value={textSettings.content}
                    onChange={(e) => setTextSettings({...textSettings, content: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Fuente</Label>
                  <select
                    value={textSettings.fontFamily}
                    onChange={(e) => setTextSettings({...textSettings, fontFamily: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Tamaño</Label>
                  <Input
                    type="number"
                    value={textSettings.fontSize}
                    onChange={(e) => setTextSettings({...textSettings, fontSize: parseInt(e.target.value)})}
                    min="8"
                    max="72"
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={textSettings.color}
                    onChange={(e) => setTextSettings({...textSettings, color: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTool === 'shape' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configuración de Formas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Tipo</Label>
                  <select
                    value={shapeSettings.type}
                    onChange={(e) => setShapeSettings({...shapeSettings, type: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="rectangle">Rectángulo</option>
                    <option value="circle">Círculo</option>
                  </select>
                </div>
                <div>
                  <Label>Color de relleno</Label>
                  <Input
                    type="color"
                    value={shapeSettings.fillColor}
                    onChange={(e) => setShapeSettings({...shapeSettings, fillColor: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Color de borde</Label>
                  <Input
                    type="color"
                    value={shapeSettings.strokeColor}
                    onChange={(e) => setShapeSettings({...shapeSettings, strokeColor: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Propiedades del elemento seleccionado */}
          {selectedElement && selectedEl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Propiedades del Elemento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>X</Label>
                    <Input
                      type="number"
                      value={selectedEl.x}
                      onChange={(e) => updateSelectedElement({ x: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Y</Label>
                    <Input
                      type="number"
                      value={selectedEl.y}
                      onChange={(e) => updateSelectedElement({ y: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Ancho</Label>
                    <Input
                      type="number"
                      value={selectedEl.width}
                      onChange={(e) => updateSelectedElement({ width: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Alto</Label>
                    <Input
                      type="number"
                      value={selectedEl.height}
                      onChange={(e) => updateSelectedElement({ height: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Rotación (°)</Label>
                  <Input
                    type="number"
                    value={selectedEl.rotation}
                    onChange={(e) => updateSelectedElement({ rotation: parseInt(e.target.value) })}
                    min="0"
                    max="360"
                  />
                </div>

                {selectedEl.type === 'text' && (
                  <>
                    <div>
                      <Label>Contenido</Label>
                      <Input
                        value={selectedEl.content || ''}
                        onChange={(e) => updateSelectedElement({ content: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Color</Label>
                      <Input
                        type="color"
                        value={selectedEl.color || '#000000'}
                        onChange={(e) => updateSelectedElement({ color: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Lista de elementos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Elementos en Canvas</CardTitle>
            </CardHeader>
            <CardContent>
              {elements.length === 0 ? (
                <p className="text-sm text-gray-500">No hay elementos</p>
              ) : (
                <div className="space-y-2">
                  {elements.map((element, index) => (
                    <div
                      key={element.id}
                      className={`p-2 rounded border cursor-pointer ${
                        selectedElement === element.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedElement(element.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {element.type === 'text' ? 'Texto' : 
                           element.type === 'shape' ? 'Forma' : 'Imagen'} {index + 1}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {element.x},{element.y}
                        </Badge>
                      </div>
                      {element.type === 'text' && (
                        <p className="text-xs text-gray-600 truncate">
                          "{element.content}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guardar */}
          <Button
            onClick={() => onSave?.(elements)}
            className="w-full"
            disabled={elements.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Diseño
          </Button>
        </div>
      </div>

      {/* Información de desarrollo */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">✨ Editor Visual Básico</h4>
          <p className="text-sm text-blue-700">
            Esta es la versión básica del editor visual. Próximamente se agregará: 
            soporte para imágenes personalizadas, más formas, efectos, capas, 
            plantillas predefinidas, y exportación a diferentes formatos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}