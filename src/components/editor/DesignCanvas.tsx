'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Type, 
  Image as ImageIcon, 
  Square,
  Circle,
  RotateCw,
  Copy,
  Trash2,
  Move,
  ZoomIn,
  ZoomOut,
  Download,
  Save,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import TemplateSelector from './TemplateSelector'
import ImageLibrary from './ImageLibrary'
import ShapesLibrary from './ShapesLibrary'
import ExportModal from './ExportModal'
import EffectsPanel from './EffectsPanel'
import AlignmentTools from './AlignmentTools'

interface CanvasElement {
  id: string
  type: 'text' | 'image' | 'shape'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  
  // Text properties
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  textAlign?: 'left' | 'center' | 'right'
  color?: string
  
  // Image properties
  src?: string
  imageData?: string
  
  // Shape properties
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'square' | 'ellipse' | 'triangle-right' | 'pentagon' | 'hexagon' | 'arrow-right' | 'arrow-left' | 'arrow-up' | 'arrow-down' | 'star' | 'heart' | 'diamond' | 'line-horizontal' | 'line-vertical' | 'line-diagonal'
  fillColor?: string
  strokeColor?: string
  strokeWidth?: number
  
  // Effects
  opacity?: number
  shadow?: {
    color: string
    blur: number
    offsetX: number
    offsetY: number
  }
}

interface DesignCanvasProps {
  productId?: string
  variantId?: string
  templateId?: string
  onSave?: (design: any) => void
  readOnly?: boolean
  initialElements?: CanvasElement[]
}

export default function DesignCanvas({ 
  productId,
  variantId,
  templateId,
  onSave,
  readOnly = false,
  initialElements = []
}: DesignCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [elements, setElements] = useState<CanvasElement[]>(initialElements)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [tool, setTool] = useState<'select' | 'text' | 'image' | 'shape'>('select')
  const [zoom, setZoom] = useState(1)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [history, setHistory] = useState<CanvasElement[][]>([initialElements])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showImageLibrary, setShowImageLibrary] = useState(false)
  const [showShapesLibrary, setShowShapesLibrary] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map())

  // Canvas settings
  const [canvasBackground, setCanvasBackground] = useState('#ffffff')
  const [showGrid, setShowGrid] = useState(true)

  // Text tool settings
  const [textSettings, setTextSettings] = useState({
    fontSize: 24,
    fontFamily: 'Arial',
    color: '#000000',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left' as const
  })

  // Shape tool settings
  const [shapeSettings, setShapeSettings] = useState({
    type: 'rectangle' as const,
    fillColor: '#3b82f6',
    strokeColor: '#1e40af',
    strokeWidth: 2
  })

  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newElements])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements([...history[historyIndex - 1]])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements([...history[historyIndex + 1]])
    }
  }

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = canvasBackground
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      const gridSize = 20 * zoom
      
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    // Draw elements
    elements
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach(element => {
        ctx.save()
        
        // Apply transformations
        ctx.translate(element.x * zoom, element.y * zoom)
        ctx.rotate((element.rotation * Math.PI) / 180)
        
        // Apply shadow if exists
        if (element.shadow) {
          ctx.shadowColor = element.shadow.color || '#000000'
          ctx.shadowBlur = (element.shadow.blur || 0) * zoom
          ctx.shadowOffsetX = (element.shadow.offsetX || 0) * zoom
          ctx.shadowOffsetY = (element.shadow.offsetY || 0) * zoom
        }
        
        switch (element.type) {
          case 'text':
            drawTextElement(ctx, element)
            break
          case 'image':
            drawImageElement(ctx, element)
            break
          case 'shape':
            drawShapeElement(ctx, element)
            break
        }
        
        // Reset shadow
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        
        ctx.restore()

        // Draw selection outline
        if ((selectedElement === element.id || selectedElements.includes(element.id)) && !readOnly) {
          drawSelectionOutline(ctx, element)
        }
      })
  }, [elements, selectedElement, selectedElements, zoom, canvasBackground, showGrid, readOnly])

  const drawTextElement = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    if (!element.text) return

    ctx.fillStyle = element.color || '#000000'
    ctx.font = `${element.fontStyle || 'normal'} ${element.fontWeight || 'normal'} ${(element.fontSize || 24) * zoom}px ${element.fontFamily || 'Arial'}`
    ctx.textAlign = element.textAlign || 'left'
    
    const lines = element.text.split('\n')
    const lineHeight = (element.fontSize || 24) * zoom * 1.2
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 0, index * lineHeight)
    })
  }

  const drawImageElement = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    if (element.imageData && loadedImages.has(element.id)) {
      const img = loadedImages.get(element.id)!
      ctx.drawImage(img, 0, 0, element.width * zoom, element.height * zoom)
    } else {
      // Placeholder for image drawing
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, element.width * zoom, element.height * zoom)
      ctx.strokeStyle = '#9ca3af'
      ctx.strokeRect(0, 0, element.width * zoom, element.height * zoom)
      
      // Draw placeholder icon
      ctx.fillStyle = '#6b7280'
      ctx.font = `${20 * zoom}px Arial`
      ctx.textAlign = 'center'
      ctx.fillText('🖼️', (element.width * zoom) / 2, (element.height * zoom) / 2)
    }
  }

  const drawShapeElement = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    const width = element.width * zoom
    const height = element.height * zoom

    ctx.fillStyle = element.fillColor || '#3b82f6'
    ctx.strokeStyle = element.strokeColor || '#1e40af'
    ctx.lineWidth = (element.strokeWidth || 2) * zoom
    
    // Aplicar opacidad si está definida
    if (element.opacity !== undefined) {
      ctx.globalAlpha = element.opacity
    }

    switch (element.shapeType) {
      case 'rectangle':
      case 'square':
        ctx.fillRect(0, 0, width, height)
        if (element.strokeWidth && element.strokeWidth > 0) {
          ctx.strokeRect(0, 0, width, height)
        }
        break
      case 'circle':
      case 'ellipse':
        ctx.beginPath()
        ctx.ellipse(width/2, height/2, width/2, height/2, 0, 0, 2 * Math.PI)
        ctx.fill()
        if (element.strokeWidth && element.strokeWidth > 0) {
          ctx.stroke()
        }
        break
      case 'triangle':
        ctx.beginPath()
        ctx.moveTo(width / 2, 0)
        ctx.lineTo(0, height)
        ctx.lineTo(width, height)
        ctx.closePath()
        ctx.fill()
        if (element.strokeWidth && element.strokeWidth > 0) {
          ctx.stroke()
        }
        break
      case 'triangle-right':
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(width, 0)
        ctx.lineTo(0, height)
        ctx.closePath()
        ctx.fill()
        if (element.strokeWidth && element.strokeWidth > 0) {
          ctx.stroke()
        }
        break
      case 'star':
        drawStar(ctx, width/2, height/2, 5, Math.min(width, height)/4, Math.min(width, height)/8)
        break
      case 'heart':
        drawHeart(ctx, width, height)
        break
      case 'arrow-right':
        drawArrow(ctx, width, height, 'right')
        break
      case 'arrow-left':
        drawArrow(ctx, width, height, 'left')
        break
      case 'arrow-up':
        drawArrow(ctx, width, height, 'up')
        break
      case 'arrow-down':
        drawArrow(ctx, width, height, 'down')
        break
      case 'line-horizontal':
        ctx.beginPath()
        ctx.moveTo(0, height/2)
        ctx.lineTo(width, height/2)
        ctx.stroke()
        break
      case 'line-vertical':
        ctx.beginPath()
        ctx.moveTo(width/2, 0)
        ctx.lineTo(width/2, height)
        ctx.stroke()
        break
      case 'line-diagonal':
        ctx.beginPath()
        ctx.moveTo(0, height)
        ctx.lineTo(width, 0)
        ctx.stroke()
        break
    }
    
    // Restaurar opacidad
    ctx.globalAlpha = 1
  }
  
  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }
    
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  
  const drawHeart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const x = width / 2
    const y = height / 4
    
    ctx.beginPath()
    ctx.moveTo(x, y + height / 4)
    ctx.bezierCurveTo(x, y, x - width / 4, y, x - width / 4, y + height / 8)
    ctx.bezierCurveTo(x - width / 4, y + height / 6, x, y + height / 2.5, x, height * 0.8)
    ctx.bezierCurveTo(x, y + height / 2.5, x + width / 4, y + height / 6, x + width / 4, y + height / 8)
    ctx.bezierCurveTo(x + width / 4, y, x, y, x, y + height / 4)
    ctx.fill()
    ctx.stroke()
  }
  
  const drawArrow = (ctx: CanvasRenderingContext2D, width: number, height: number, direction: 'right' | 'left' | 'up' | 'down') => {
    ctx.beginPath()
    
    switch (direction) {
      case 'right':
        ctx.moveTo(0, height * 0.3)
        ctx.lineTo(width * 0.7, height * 0.3)
        ctx.lineTo(width * 0.7, height * 0.1)
        ctx.lineTo(width, height * 0.5)
        ctx.lineTo(width * 0.7, height * 0.9)
        ctx.lineTo(width * 0.7, height * 0.7)
        ctx.lineTo(0, height * 0.7)
        break
      case 'left':
        ctx.moveTo(width, height * 0.3)
        ctx.lineTo(width * 0.3, height * 0.3)
        ctx.lineTo(width * 0.3, height * 0.1)
        ctx.lineTo(0, height * 0.5)
        ctx.lineTo(width * 0.3, height * 0.9)
        ctx.lineTo(width * 0.3, height * 0.7)
        ctx.lineTo(width, height * 0.7)
        break
      case 'up':
        ctx.moveTo(width * 0.3, height)
        ctx.lineTo(width * 0.3, height * 0.3)
        ctx.lineTo(width * 0.1, height * 0.3)
        ctx.lineTo(width * 0.5, 0)
        ctx.lineTo(width * 0.9, height * 0.3)
        ctx.lineTo(width * 0.7, height * 0.3)
        ctx.lineTo(width * 0.7, height)
        break
      case 'down':
        ctx.moveTo(width * 0.3, 0)
        ctx.lineTo(width * 0.3, height * 0.7)
        ctx.lineTo(width * 0.1, height * 0.7)
        ctx.lineTo(width * 0.5, height)
        ctx.lineTo(width * 0.9, height * 0.7)
        ctx.lineTo(width * 0.7, height * 0.7)
        ctx.lineTo(width * 0.7, 0)
        break
    }
    
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  const drawSelectionOutline = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(
      element.x * zoom - 2,
      element.y * zoom - 2,
      element.width * zoom + 4,
      element.height * zoom + 4
    )
    ctx.setLineDash([])
  }

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    if (tool === 'select') {
      // Find clicked element
      const clickedElement = elements
        .sort((a, b) => b.zIndex - a.zIndex)
        .find(element => 
          x >= element.x && 
          x <= element.x + element.width &&
          y >= element.y && 
          y <= element.y + element.height
        )
      
      const isMultiSelect = e.ctrlKey || e.metaKey
      if (clickedElement) {
        handleElementSelection(clickedElement.id, isMultiSelect)
      } else {
        setSelectedElement(null)
        setSelectedElements([])
      }
    } else {
      // Add new element
      addElement(x, y)
    }
  }

  const addElement = (x: number, y: number) => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: tool as any,
      x,
      y,
      width: 100,
      height: 50,
      rotation: 0,
      zIndex: elements.length,
      ...getDefaultPropertiesForTool()
    }

    const newElements = [...elements, newElement]
    setElements(newElements)
    saveToHistory(newElements)
    setSelectedElement(newElement.id)
    setTool('select')
  }

  const getDefaultPropertiesForTool = () => {
    switch (tool) {
      case 'text':
        return {
          text: 'Texto personalizado',
          ...textSettings
        }
      case 'shape':
        return {
          shapeType: shapeSettings.type,
          fillColor: shapeSettings.fillColor,
          strokeColor: shapeSettings.strokeColor,
          strokeWidth: shapeSettings.strokeWidth
        }
      case 'image':
        return {
          src: null
        }
      default:
        return {}
    }
  }

  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElement) return

    const newElements = elements.map(element =>
      element.id === selectedElement ? { ...element, ...updates } : element
    )
    setElements(newElements)
  }

  const deleteSelectedElement = () => {
    if (!selectedElement) return

    const newElements = elements.filter(element => element.id !== selectedElement)
    setElements(newElements)
    saveToHistory(newElements)
    setSelectedElement(null)
  }

  const duplicateSelectedElement = () => {
    if (!selectedElement) return

    const element = elements.find(e => e.id === selectedElement)
    if (!element) return

    const newElement: CanvasElement = {
      ...element,
      id: Date.now().toString(),
      x: element.x + 20,
      y: element.y + 20,
      zIndex: elements.length
    }

    const newElements = [...elements, newElement]
    setElements(newElements)
    saveToHistory(newElements)
    setSelectedElement(newElement.id)
  }

  const saveDesign = async () => {
    const designData = {
      elements,
      canvasSize,
      canvasBackground,
      productId,
      variantId,
      templateId
    }

    if (onSave) {
      onSave(designData)
    } else {
      // Default save to API
      try {
        const response = await fetch('/api/designs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(designData)
        })

        if (!response.ok) throw new Error('Error al guardar diseño')

        toast.success('Diseño guardado correctamente')
      } catch (error) {
        toast.error('Error al guardar el diseño')
      }
    }
  }

  const applyTemplate = (template: any) => {
    const newElements = template.elements.map((element: any) => ({
      ...element,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }))
    
    setElements(newElements)
    setCanvasSize(template.canvasSize)
    setCanvasBackground(template.canvasBackground)
    saveToHistory(newElements)
    setSelectedElement(null)
    
    toast.success('Plantilla aplicada correctamente')
  }

  const selectedElementData = selectedElement ? 
    elements.find(e => e.id === selectedElement) : null

  // Función para cargar imágenes
  const loadImage = (imageUrl: string, elementId: string) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setLoadedImages(prev => new Map(prev.set(elementId, img)))
      drawCanvas()
    }
    img.src = imageUrl
  }

  // Manejar selección de imagen
  const handleImageSelect = (image: any) => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: 'image',
      x: 50,
      y: 50,
      width: Math.min(image.dimensions.width, 200),
      height: Math.min(image.dimensions.height, 200),
      rotation: 0,
      zIndex: elements.length,
      imageData: image.url
    }

    const newElements = [...elements, newElement]
    setElements(newElements)
    saveToHistory(newElements)
    setSelectedElement(newElement.id)
    
    // Cargar la imagen
    loadImage(image.url, newElement.id)
    
    setShowImageLibrary(false)
  }

  // Manejar selección de forma
  const handleShapeSelect = (shape: any) => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: 'shape',
      x: 50,
      y: 50,
      width: shape.defaultSize.width,
      height: shape.defaultSize.height,
      rotation: 0,
      zIndex: elements.length,
      shapeType: shape.type,
      fillColor: shapeSettings.fillColor,
      strokeColor: shapeSettings.strokeColor,
      strokeWidth: shapeSettings.strokeWidth
    }

    const newElements = [...elements, newElement]
    setElements(newElements)
    saveToHistory(newElements)
    setSelectedElement(newElement.id)
    
    setShowShapesLibrary(false)
  }

  // Cargar imágenes existentes al montar el componente
  useEffect(() => {
    elements.forEach(element => {
      if (element.type === 'image' && element.imageData && !loadedImages.has(element.id)) {
        loadImage(element.imageData, element.id)
      }
    })
  }, [elements])

  // Función para actualizar múltiples elementos
  const updateMultipleElements = (updates: { [id: string]: any }) => {
    const newElements = elements.map(element => {
      if (updates[element.id]) {
        return { ...element, ...updates[element.id] }
      }
      return element
    })
    setElements(newElements)
    saveToHistory(newElements)
  }

  // Función para mover elementos en capas
  const moveElementLayer = (elementId: string, direction: 'front' | 'back' | 'forward' | 'backward') => {
    const newElements = [...elements]
    const elementIndex = newElements.findIndex(el => el.id === elementId)
    
    if (elementIndex === -1) return

    const element = newElements[elementIndex]
    
    switch (direction) {
      case 'front':
        element.zIndex = Math.max(...elements.map(el => el.zIndex)) + 1
        break
      case 'back':
        element.zIndex = Math.min(...elements.map(el => el.zIndex)) - 1
        break
      case 'forward':
        element.zIndex = element.zIndex + 1
        break
      case 'backward':
        element.zIndex = Math.max(0, element.zIndex - 1)
        break
    }

    setElements(newElements)
    saveToHistory(newElements)
  }

  // Manejar selección múltiple con Ctrl/Cmd
  const handleElementSelection = (elementId: string, isMultiSelect: boolean = false) => {
    if (isMultiSelect) {
      if (selectedElements.includes(elementId)) {
        setSelectedElements(prev => prev.filter(id => id !== elementId))
        if (selectedElement === elementId) {
          setSelectedElement(selectedElements.find(id => id !== elementId) || null)
        }
      } else {
        setSelectedElements(prev => [...prev, elementId])
        setSelectedElement(elementId)
      }
    } else {
      setSelectedElement(elementId)
      setSelectedElements([elementId])
    }
  }

  return (
    <div className="h-screen flex">
      {/* Toolbar */}
      <div className="w-64 bg-gray-50 border-r overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Tools */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Herramientas</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={tool === 'select' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('select')}
                className="flex items-center gap-1"
              >
                <Move className="w-4 h-4" />
                Seleccionar
              </Button>
              <Button
                variant={tool === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('text')}
                className="flex items-center gap-1"
              >
                <Type className="w-4 h-4" />
                Texto
              </Button>
              <Button
                variant={tool === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowImageLibrary(true)}
                className="flex items-center gap-1"
              >
                <ImageIcon className="w-4 h-4" />
                Imagen
              </Button>
              <Button
                variant={tool === 'shape' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowShapesLibrary(true)}
                className="flex items-center gap-1"
              >
                <Square className="w-4 h-4" />
                Forma
              </Button>
            </div>
          </div>

          {/* Actions */}
          {!readOnly && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Acciones</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplateSelector(true)}
                  className="flex items-center gap-1 col-span-2"
                >
                  📦 Usar Plantilla
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="flex items-center gap-1"
                >
                  <Undo className="w-4 h-4" />
                  Deshacer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="flex items-center gap-1"
                >
                  <Redo className="w-4 h-4" />
                  Rehacer
                </Button>
                {selectedElement && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={duplicateSelectedElement}
                      className="flex items-center gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deleteSelectedElement}
                      className="flex items-center gap-1 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Text Settings */}
          {tool === 'text' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Configuración de Texto</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600">Tamaño</label>
                  <Input
                    type="number"
                    value={textSettings.fontSize}
                    onChange={(e) => setTextSettings({
                      ...textSettings,
                      fontSize: Number(e.target.value)
                    })}
                    min="8"
                    max="128"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Fuente</label>
                  <select
                    value={textSettings.fontFamily}
                    onChange={(e) => setTextSettings({
                      ...textSettings,
                      fontFamily: e.target.value
                    })}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Color</label>
                  <Input
                    type="color"
                    value={textSettings.color}
                    onChange={(e) => setTextSettings({
                      ...textSettings,
                      color: e.target.value
                    })}
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={textSettings.fontWeight === 'bold' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTextSettings({
                      ...textSettings,
                      fontWeight: textSettings.fontWeight === 'bold' ? 'normal' : 'bold'
                    })}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={textSettings.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTextSettings({
                      ...textSettings,
                      fontStyle: textSettings.fontStyle === 'italic' ? 'normal' : 'italic'
                    })}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Element Properties */}
          {selectedElementData && !readOnly && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Propiedades</h3>
              <div className="space-y-2">
                {selectedElementData.type === 'text' && (
                  <div>
                    <label className="text-xs text-gray-600">Texto</label>
                    <textarea
                      value={selectedElementData.text || ''}
                      onChange={(e) => updateSelectedElement({ text: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      rows={3}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">X</label>
                    <Input
                      type="number"
                      value={Math.round(selectedElementData.x)}
                      onChange={(e) => updateSelectedElement({ x: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Y</label>
                    <Input
                      type="number"
                      value={Math.round(selectedElementData.y)}
                      onChange={(e) => updateSelectedElement({ y: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Ancho</label>
                    <Input
                      type="number"
                      value={Math.round(selectedElementData.width)}
                      onChange={(e) => updateSelectedElement({ width: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Alto</label>
                    <Input
                      type="number"
                      value={Math.round(selectedElementData.height)}
                      onChange={(e) => updateSelectedElement({ height: Number(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-600">Rotación</label>
                  <Input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedElementData.rotation}
                    onChange={(e) => updateSelectedElement({ rotation: Number(e.target.value) })}
                  />
                  <span className="text-xs text-gray-500">{selectedElementData.rotation}°</span>
                </div>
              </div>
            </div>
          )}

          {/* Effects Panel */}
          {selectedElement && !readOnly && (
            <EffectsPanel
              selectedElement={selectedElementData}
              onUpdateElement={updateSelectedElement}
            />
          )}

          {/* Alignment Tools */}
          {(selectedElement || selectedElements.length > 0) && !readOnly && (
            <AlignmentTools
              selectedElements={selectedElements}
              allElements={elements}
              canvasSize={canvasSize}
              onUpdateElements={updateMultipleElements}
              onMoveElement={moveElementLayer}
            />
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(3, zoom + 0.1))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {!readOnly && (
              <>
                <Button variant="outline" size="sm" onClick={saveDesign}>
                  <Save className="w-4 h-4 mr-1" />
                  Guardar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowExportModal(true)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Exportar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={canvasSize.width * zoom}
              height={canvasSize.height * zoom}
              onClick={handleCanvasClick}
              className="border border-gray-300 bg-white shadow-lg cursor-crosshair"
              style={{
                cursor: tool === 'select' ? 'default' : 'crosshair'
              }}
            />
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={applyTemplate}
      />

      {/* Image Library Modal */}
      <ImageLibrary
        isOpen={showImageLibrary}
        onClose={() => setShowImageLibrary(false)}
        onSelectImage={handleImageSelect}
        allowUpload={!readOnly}
      />

      {/* Shapes Library Modal */}
      <ShapesLibrary
        isOpen={showShapesLibrary}
        onClose={() => setShowShapesLibrary(false)}
        onSelectShape={handleShapeSelect}
        currentShapeSettings={shapeSettings}
        onUpdateSettings={setShapeSettings}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        canvasRef={canvasRef}
        elements={elements}
        canvasSize={canvasSize}
        canvasBackground={canvasBackground}
      />
    </div>
  )
}