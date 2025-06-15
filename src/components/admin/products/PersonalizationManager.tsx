"use client"

import React, { useState } from "react"
import { Plus, Edit2, Trash2, Save, X, Palette, Square, Circle, Type, Image as ImageIcon, Paintbrush } from "lucide-react"
import PersonalizationEditor from "./PersonalizationEditor"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { ColoredSwitch } from "@/components/ui/ColoredSwitch"
import { toast } from "react-hot-toast"

interface PersonalizationArea {
  id?: string
  name: string
  type: 'text' | 'image' | 'shape' | 'logo'
  x: number
  y: number
  width: number
  height: number
  maxWidth?: number
  maxHeight?: number
  allowResize: boolean
  allowMove: boolean
  defaultValue?: string
  placeholderText?: string
  fontOptions?: string[]
  colorOptions?: string[]
  price: number
  isRequired: boolean
  order: number
}

interface PersonalizationTemplate {
  id?: string
  name: string
  description?: string
  templateData: string // JSON stringified canvas data
  previewImage?: string
  isActive: boolean
}

interface PersonalizationManagerProps {
  productId: string
  personalizationAreas: PersonalizationArea[]
  templates: PersonalizationTemplate[]
  basePersonalizationPrice: number
  onPersonalizationChange?: (data: any) => void
}

export default function PersonalizationManager({
  productId,
  personalizationAreas: initialAreas = [],
  templates: initialTemplates = [],
  basePersonalizationPrice,
  onPersonalizationChange
}: PersonalizationManagerProps) {
  const [personalizationAreas, setPersonalizationAreas] = useState<PersonalizationArea[]>(initialAreas)
  const [templates, setTemplates] = useState<PersonalizationTemplate[]>(initialTemplates)
  const [activeTab, setActiveTab] = useState<'areas' | 'editor' | 'templates' | 'settings'>('areas')
  const [isEditingArea, setIsEditingArea] = useState(false)
  const [editingArea, setEditingArea] = useState<PersonalizationArea | null>(null)
  const [newArea, setNewArea] = useState<PersonalizationArea>({
    name: '',
    type: 'text',
    x: 50,
    y: 50,
    width: 200,
    height: 50,
    allowResize: true,
    allowMove: true,
    price: 0,
    isRequired: false,
    order: 0
  })

  const [personalizationSettings, setPersonalizationSettings] = useState({
    enablePersonalization: true,
    maxPersonalizationAreas: 5,
    defaultFont: 'Arial',
    defaultFontSize: 16,
    defaultTextColor: '#000000',
    allowCustomColors: true,
    allowCustomFonts: true,
    allowImageUpload: true,
    maxImageSize: 5, // MB
    allowedImageTypes: ['jpg', 'png', 'gif'],
    previewEnabled: true,
    autoSaveEnabled: true
  })

  const areaTypes = [
    { value: 'text', label: 'Texto', icon: Type, description: 'Área para texto personalizable' },
    { value: 'image', label: 'Imagen', icon: ImageIcon, description: 'Área para subir imágenes' },
    { value: 'shape', label: 'Forma', icon: Square, description: 'Área para formas geométricas' },
    { value: 'logo', label: 'Logo', icon: Circle, description: 'Área específica para logos' }
  ]

  const fontOptions = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 
    'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
    'Trebuchet MS', 'Arial Black', 'Impact'
  ]

  const colorOptions = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#808080'
  ]

  const handleAddArea = () => {
    if (!newArea.name.trim()) {
      toast.error('El nombre del área es obligatorio')
      return
    }

    const area = {
      ...newArea,
      id: Date.now().toString(),
      order: personalizationAreas.length
    }

    setPersonalizationAreas([...personalizationAreas, area])
    setNewArea({
      name: '',
      type: 'text',
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      allowResize: true,
      allowMove: true,
      price: 0,
      isRequired: false,
      order: 0
    })
    setIsEditingArea(false)
    toast.success('Área de personalización agregada')
  }

  const handleEditArea = (area: PersonalizationArea) => {
    setEditingArea({ ...area })
  }

  const handleUpdateArea = () => {
    if (!editingArea) return

    setPersonalizationAreas(personalizationAreas.map(area => 
      area.id === editingArea.id ? editingArea : area
    ))
    setEditingArea(null)
    toast.success('Área actualizada')
  }

  const handleDeleteArea = (areaId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta área?')) {
      setPersonalizationAreas(personalizationAreas.filter(area => area.id !== areaId))
      toast.success('Área eliminada')
    }
  }

  const AreaForm = ({ 
    area, 
    onChange, 
    onSave, 
    onCancel, 
    isNew = false 
  }: {
    area: PersonalizationArea
    onChange: (area: PersonalizationArea) => void
    onSave: () => void
    onCancel: () => void
    isNew?: boolean
  }) => (
    <Card className="border-2 border-dashed border-green-300">
      <CardHeader>
        <CardTitle className="text-lg">
          {isNew ? '➕ Nueva Área de Personalización' : '✏️ Editar Área'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="areaName">Nombre del Área *</Label>
            <Input
              id="areaName"
              value={area.name}
              onChange={(e) => onChange({ ...area, name: e.target.value })}
              placeholder="Ej: Texto frontal, Logo pecho..."
            />
          </div>
          <div>
            <Label htmlFor="areaType">Tipo de Personalización</Label>
            <select
              id="areaType"
              value={area.type}
              onChange={(e) => onChange({ ...area, type: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              {areaTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {areaTypes.find(t => t.value === area.type)?.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="areaX">Posición X (%)</Label>
            <Input
              id="areaX"
              type="number"
              value={area.x}
              onChange={(e) => onChange({ ...area, x: parseFloat(e.target.value) || 0 })}
              min="0"
              max="100"
            />
          </div>
          <div>
            <Label htmlFor="areaY">Posición Y (%)</Label>
            <Input
              id="areaY"
              type="number"
              value={area.y}
              onChange={(e) => onChange({ ...area, y: parseFloat(e.target.value) || 0 })}
              min="0"
              max="100"
            />
          </div>
          <div>
            <Label htmlFor="areaWidth">Ancho (px)</Label>
            <Input
              id="areaWidth"
              type="number"
              value={area.width}
              onChange={(e) => onChange({ ...area, width: parseFloat(e.target.value) || 0 })}
              min="10"
            />
          </div>
          <div>
            <Label htmlFor="areaHeight">Alto (px)</Label>
            <Input
              id="areaHeight"
              type="number"
              value={area.height}
              onChange={(e) => onChange({ ...area, height: parseFloat(e.target.value) || 0 })}
              min="10"
            />
          </div>
        </div>

        {area.type === 'text' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="placeholderText">Texto de Ejemplo</Label>
              <Input
                id="placeholderText"
                value={area.placeholderText || ''}
                onChange={(e) => onChange({ ...area, placeholderText: e.target.value })}
                placeholder="Texto que aparecerá como ejemplo"
              />
            </div>
            <div>
              <Label>Fuentes Disponibles</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {fontOptions.map(font => (
                  <label key={font} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={area.fontOptions?.includes(font) || false}
                      onChange={(e) => {
                        const fonts = area.fontOptions || []
                        if (e.target.checked) {
                          onChange({ ...area, fontOptions: [...fonts, font] })
                        } else {
                          onChange({ ...area, fontOptions: fonts.filter(f => f !== font) })
                        }
                      }}
                    />
                    <span style={{ fontFamily: font }}>{font}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="areaPrice">Precio Extra (€)</Label>
            <Input
              id="areaPrice"
              type="number"
              step="0.01"
              value={area.price}
              onChange={(e) => onChange({ ...area, price: parseFloat(e.target.value) || 0 })}
              min="0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <ColoredSwitch
              checked={area.allowResize}
              onCheckedChange={(checked) => onChange({ ...area, allowResize: checked })}
              activeColor="green"
              inactiveColor="gray"
            />
            <Label>Redimensionable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <ColoredSwitch
              checked={area.allowMove}
              onCheckedChange={(checked) => onChange({ ...area, allowMove: checked })}
              activeColor="green"
              inactiveColor="gray"
            />
            <Label>Movible</Label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ColoredSwitch
            checked={area.isRequired}
            onCheckedChange={(checked) => onChange({ ...area, isRequired: checked })}
            activeColor="orange"
            inactiveColor="gray"
          />
          <Label>Área Obligatoria</Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            {isNew ? 'Agregar' : 'Actualizar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'areas', label: '🎯 Áreas', count: personalizationAreas.length },
          { key: 'editor', label: '🎨 Editor Visual', count: null },
          { key: 'templates', label: '📐 Templates', count: templates.length },
          { key: 'settings', label: '⚙️ Configuración', count: null }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <Badge variant="secondary" className="ml-2">{tab.count}</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Areas Tab */}
      {activeTab === 'areas' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Áreas de Personalización</h3>
            <Button onClick={() => setIsEditingArea(true)} disabled={isEditingArea}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Área
            </Button>
          </div>

          {/* New Area Form */}
          {isEditingArea && (
            <AreaForm
              area={newArea}
              onChange={setNewArea}
              onSave={handleAddArea}
              onCancel={() => setIsEditingArea(false)}
              isNew={true}
            />
          )}

          {/* Edit Area Form */}
          {editingArea && (
            <AreaForm
              area={editingArea}
              onChange={setEditingArea}
              onSave={handleUpdateArea}
              onCancel={() => setEditingArea(null)}
            />
          )}

          {/* Areas List */}
          {personalizationAreas.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {personalizationAreas.map((area) => (
                <Card key={area.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {areaTypes.find(t => t.value === area.type)?.icon && 
                            React.createElement(areaTypes.find(t => t.value === area.type)!.icon, { className: "h-4 w-4" })
                          }
                          {area.name}
                          {area.isRequired && <Badge variant="secondary">Obligatorio</Badge>}
                        </h4>
                        {area.price > 0 && (
                          <p className="text-sm text-green-600 font-medium">+€{area.price}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditArea(area)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => area.id && handleDeleteArea(area.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{area.type.toUpperCase()}</Badge>
                        <Badge variant="outline">{area.width}×{area.height}px</Badge>
                        <Badge variant="outline">({area.x}%, {area.y}%)</Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div className="flex gap-4">
                          <span>Redimensionable: {area.allowResize ? '✅' : '❌'}</span>
                          <span>Movible: {area.allowMove ? '✅' : '❌'}</span>
                        </div>
                        {area.placeholderText && (
                          <p className="mt-1 italic">"{area.placeholderText}"</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No hay áreas de personalización configuradas</p>
                <p className="text-sm text-gray-400">
                  Agrega áreas donde los clientes podrán personalizar el producto
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Editor Visual Tab */}
      {activeTab === 'editor' && (
        <PersonalizationEditor
          productId={productId}
          productImages={[]} // TODO: Obtener imágenes del producto
          onSave={(elements) => {
            console.log('Editor elements saved:', elements)
            // TODO: Guardar el diseño
          }}
        />
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Templates de Personalización</h3>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Template
            </Button>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-medium text-yellow-900 mb-2">🚧 En Desarrollo</h4>
                <p className="text-yellow-700">
                  El sistema de templates estará disponible próximamente. 
                  Permitirá crear plantillas predefinidas para personalización rápida.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Configuración de Personalización</h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Habilitar personalización</Label>
                  <ColoredSwitch
                    checked={personalizationSettings.enablePersonalization}
                    onCheckedChange={(checked) => 
                      setPersonalizationSettings(prev => ({ ...prev, enablePersonalization: checked }))
                    }
                    activeColor="green"
                    inactiveColor="red"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Permitir colores personalizados</Label>
                  <ColoredSwitch
                    checked={personalizationSettings.allowCustomColors}
                    onCheckedChange={(checked) => 
                      setPersonalizationSettings(prev => ({ ...prev, allowCustomColors: checked }))
                    }
                    activeColor="green"
                    inactiveColor="gray"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Permitir fuentes personalizadas</Label>
                  <ColoredSwitch
                    checked={personalizationSettings.allowCustomFonts}
                    onCheckedChange={(checked) => 
                      setPersonalizationSettings(prev => ({ ...prev, allowCustomFonts: checked }))
                    }
                    activeColor="green"
                    inactiveColor="gray"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Permitir subida de imágenes</Label>
                  <ColoredSwitch
                    checked={personalizationSettings.allowImageUpload}
                    onCheckedChange={(checked) => 
                      setPersonalizationSettings(prev => ({ ...prev, allowImageUpload: checked }))
                    }
                    activeColor="green"
                    inactiveColor="gray"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  💡 <strong>Próximamente:</strong> Editor visual de personalización, 
                  preview en tiempo real, configuración avanzada de precios por personalización.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}