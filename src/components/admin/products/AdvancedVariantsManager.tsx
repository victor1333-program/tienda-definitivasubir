"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Save, X, Settings, Eye, EyeOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { ColoredSwitch } from "@/components/ui/ColoredSwitch"
import { toast } from "react-hot-toast"

// Definición de una opción dentro de un grupo
interface VariantOption {
  id: string
  name: string
  value: string
  colorHex?: string // Solo para colores
}

// Definición de un grupo de variantes (ej: Tallas, Colores)
interface VariantGroup {
  id: string
  name: string
  type: 'size' | 'color' | 'custom'
  options: VariantOption[]
}

// Definición de una combinación individual editable
interface VariantCombination {
  id: string
  groupCombinations: { groupId: string, optionId: string }[] // Las opciones seleccionadas
  sku: string
  stock: number
  price: number
  isActive: boolean
  displayName: string // Nombre generado automáticamente ej: "XL - Blanco"
}

interface AdvancedVariantsManagerProps {
  productId: string
  initialGroups?: VariantGroup[]
  initialCombinations?: VariantCombination[]
  basePrice: number
  onVariantsChange?: (groups: VariantGroup[], combinations: VariantCombination[]) => void
}

export default function AdvancedVariantsManager({
  productId,
  initialGroups = [],
  initialCombinations = [],
  basePrice,
  onVariantsChange
}: AdvancedVariantsManagerProps) {
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>(initialGroups)
  const [combinations, setCombinations] = useState<VariantCombination[]>(initialCombinations)
  const [activeTab, setActiveTab] = useState<'groups' | 'combinations'>('groups')
  
  // Estados para crear grupos
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [newGroup, setNewGroup] = useState<Omit<VariantGroup, 'id' | 'options'>>({
    name: '',
    type: 'custom'
  })

  // Estados para editar combinaciones
  const [editingCombination, setEditingCombination] = useState<string | null>(null)

  // Colores predefinidos para el selector
  const colorPresets = [
    { name: 'Negro', hex: '#000000' },
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Rojo', hex: '#DC2626' },
    { name: 'Azul', hex: '#2563EB' },
    { name: 'Verde', hex: '#16A34A' },
    { name: 'Amarillo', hex: '#EAB308' },
    { name: 'Rosa', hex: '#EC4899' },
    { name: 'Morado', hex: '#9333EA' },
    { name: 'Naranja', hex: '#EA580C' },
    { name: 'Gris', hex: '#6B7280' }
  ]

  // Tallas predefinidas
  const sizePresets = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL']

  // Generar ID único
  const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Crear nuevo grupo
  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) {
      toast.error('El nombre del grupo es obligatorio')
      return
    }

    const group: VariantGroup = {
      ...newGroup,
      id: generateId(),
      options: []
    }

    setVariantGroups([...variantGroups, group])
    setNewGroup({ name: '', type: 'custom' })
    setIsAddingGroup(false)
    toast.success('Grupo creado correctamente')
  }

  // Agregar opción a un grupo
  const addOptionToGroup = (groupId: string, option: Omit<VariantOption, 'id'>) => {
    if (!option.name.trim()) {
      toast.error('El nombre de la opción es obligatorio')
      return
    }

    const newOption: VariantOption = {
      ...option,
      id: generateId()
    }

    setVariantGroups(variantGroups.map(group =>
      group.id === groupId
        ? { ...group, options: [...group.options, newOption] }
        : group
    ))

    toast.success('Opción agregada')
  }

  // Eliminar opción de un grupo
  const removeOptionFromGroup = (groupId: string, optionId: string) => {
    setVariantGroups(variantGroups.map(group =>
      group.id === groupId
        ? { ...group, options: group.options.filter(opt => opt.id !== optionId) }
        : group
    ))

    // También eliminar las combinaciones que usen esta opción
    setCombinations(combinations.filter(combo =>
      !combo.groupCombinations.some(gc => gc.optionId === optionId)
    ))

    toast.success('Opción eliminada')
  }

  // Eliminar grupo completo
  const removeGroup = (groupId: string) => {
    if (!confirm('¿Estás seguro? Esto eliminará todas las combinaciones que usen este grupo.')) {
      return
    }

    setVariantGroups(variantGroups.filter(g => g.id !== groupId))
    
    // Eliminar combinaciones que usen este grupo
    setCombinations(combinations.filter(combo =>
      !combo.groupCombinations.some(gc => gc.groupId === groupId)
    ))

    toast.success('Grupo eliminado')
  }

  // Generar todas las combinaciones posibles
  const generateAllCombinations = () => {
    if (variantGroups.length === 0) {
      toast.error('Necesitas al menos un grupo con opciones')
      return
    }

    const groupsWithOptions = variantGroups.filter(g => g.options.length > 0)
    
    if (groupsWithOptions.length === 0) {
      toast.error('Los grupos necesitan tener opciones')
      return
    }

    // Generar combinaciones cartesianas
    const generateCartesian = (groups: VariantGroup[]): VariantCombination[] => {
      if (groups.length === 0) return []
      if (groups.length === 1) {
        return groups[0].options.map(option => {
          const displayName = option.name
          return {
            id: generateId(),
            groupCombinations: [{ groupId: groups[0].id, optionId: option.id }],
            sku: `${productId}-${option.value.toLowerCase()}`,
            stock: 0,
            price: basePrice,
            isActive: true,
            displayName
          }
        })
      }

      const [firstGroup, ...restGroups] = groups
      const restCombinations = generateCartesian(restGroups)
      const result: VariantCombination[] = []

      firstGroup.options.forEach(option => {
        if (restCombinations.length === 0) {
          // Solo hay un grupo
          result.push({
            id: generateId(),
            groupCombinations: [{ groupId: firstGroup.id, optionId: option.id }],
            sku: `${productId}-${option.value.toLowerCase()}`,
            stock: 0,
            price: basePrice,
            isActive: true,
            displayName: option.name
          })
        } else {
          // Combinar con el resto
          restCombinations.forEach(restCombo => {
            const displayName = `${option.name} - ${restCombo.displayName}`
            const skuParts = [
              productId,
              option.value.toLowerCase(),
              ...restCombo.groupCombinations.map(gc => {
                const group = variantGroups.find(g => g.id === gc.groupId)
                const opt = group?.options.find(o => o.id === gc.optionId)
                return opt?.value.toLowerCase() || ''
              })
            ].filter(Boolean)

            result.push({
              id: generateId(),
              groupCombinations: [
                { groupId: firstGroup.id, optionId: option.id },
                ...restCombo.groupCombinations
              ],
              sku: skuParts.join('-'),
              stock: 0,
              price: basePrice,
              isActive: true,
              displayName
            })
          })
        }
      })

      return result
    }

    const newCombinations = generateCartesian(groupsWithOptions)
    
    // Solo agregar combinaciones que no existan ya
    const existingCombinationKeys = new Set(
      combinations.map(combo => 
        combo.groupCombinations
          .map(gc => `${gc.groupId}:${gc.optionId}`)
          .sort()
          .join('|')
      )
    )

    const uniqueNewCombinations = newCombinations.filter(combo => {
      const key = combo.groupCombinations
        .map(gc => `${gc.groupId}:${gc.optionId}`)
        .sort()
        .join('|')
      return !existingCombinationKeys.has(key)
    })

    if (uniqueNewCombinations.length === 0) {
      toast.info('Todas las combinaciones ya existen')
      return
    }

    setCombinations([...combinations, ...uniqueNewCombinations])
    toast.success(`${uniqueNewCombinations.length} combinaciones generadas`)
    setActiveTab('combinations')
  }

  // Actualizar combinación individual
  const updateCombination = (id: string, updates: Partial<VariantCombination>) => {
    setCombinations(combinations.map(combo =>
      combo.id === id ? { ...combo, ...updates } : combo
    ))
  }

  // Eliminar combinación
  const removeCombination = (id: string) => {
    setCombinations(combinations.filter(combo => combo.id !== id))
    toast.success('Combinación eliminada')
  }

  // Obtener el nombre de una opción por IDs
  const getOptionDisplay = (groupId: string, optionId: string) => {
    const group = variantGroups.find(g => g.id === groupId)
    const option = group?.options.find(o => o.id === optionId)
    return {
      groupName: group?.name || 'Grupo',
      optionName: option?.name || 'Opción',
      colorHex: option?.colorHex
    }
  }

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onVariantsChange) {
      onVariantsChange(variantGroups, combinations)
    }
  }, [variantGroups, combinations, onVariantsChange])

  return (
    <div className="space-y-6">
      {/* Header con tabs */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('groups')}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'groups'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏷️ Grupos ({variantGroups.length})
          </button>
          <button
            onClick={() => setActiveTab('combinations')}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'combinations'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔄 Combinaciones ({combinations.length})
          </button>
        </div>

        {activeTab === 'groups' && (
          <Button onClick={() => setIsAddingGroup(true)} disabled={isAddingGroup}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Grupo
          </Button>
        )}

        {activeTab === 'combinations' && (
          <Button onClick={generateAllCombinations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Generar Combinaciones
          </Button>
        )}
      </div>

      {/* Tab: Grupos */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          {/* Formulario nuevo grupo */}
          {isAddingGroup && (
            <Card className="border-2 border-dashed border-green-300">
              <CardHeader>
                <CardTitle>➕ Crear Nuevo Grupo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre del Grupo *</Label>
                    <Input
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      placeholder="Ej: Tallas, Colores, Acabados..."
                    />
                  </div>
                  <div>
                    <Label>Tipo de Grupo</Label>
                    <select
                      value={newGroup.type}
                      onChange={(e) => setNewGroup({ ...newGroup, type: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="custom">Personalizado</option>
                      <option value="size">Tallas</option>
                      <option value="color">Colores</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingGroup(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateGroup}>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Grupo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de grupos */}
          {variantGroups.length > 0 ? (
            <div className="space-y-4">
              {variantGroups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  colorPresets={colorPresets}
                  sizePresets={sizePresets}
                  onAddOption={(option) => addOptionToGroup(group.id, option)}
                  onRemoveOption={(optionId) => removeOptionFromGroup(group.id, optionId)}
                  onRemoveGroup={() => removeGroup(group.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No hay grupos de variantes</p>
                <p className="text-sm text-gray-400">
                  Crea grupos como "Tallas" o "Colores" para organizar las opciones
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tab: Combinaciones */}
      {activeTab === 'combinations' && (
        <div className="space-y-6">
          {combinations.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  🔄 Tabla de Combinaciones ({combinations.filter(c => c.isActive).length} activas de {combinations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-3 font-medium">Combinación</th>
                        <th className="text-left p-3 font-medium">SKU</th>
                        <th className="text-left p-3 font-medium">Stock</th>
                        <th className="text-left p-3 font-medium">Precio (€)</th>
                        <th className="text-left p-3 font-medium">Estado</th>
                        <th className="text-left p-3 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {combinations.map(combination => (
                        <CombinationRow
                          key={combination.id}
                          combination={combination}
                          isEditing={editingCombination === combination.id}
                          variantGroups={variantGroups}
                          onUpdate={(updates) => updateCombination(combination.id, updates)}
                          onEdit={() => setEditingCombination(combination.id)}
                          onSave={() => setEditingCombination(null)}
                          onCancel={() => setEditingCombination(null)}
                          onRemove={() => removeCombination(combination.id)}
                          getOptionDisplay={getOptionDisplay}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No hay combinaciones generadas</p>
                <p className="text-sm text-gray-400 mb-4">
                  Primero crea grupos con opciones, luego genera las combinaciones
                </p>
                <Button onClick={generateAllCombinations} disabled={variantGroups.length === 0}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generar Combinaciones
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Información del proceso */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Cómo usar este sistema</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Paso 1:</strong> Crea grupos (ej: "Tallas", "Colores")</p>
            <p><strong>Paso 2:</strong> Agrega opciones a cada grupo (ej: XL, Rojo)</p>
            <p><strong>Paso 3:</strong> Genera todas las combinaciones automáticamente</p>
            <p><strong>Paso 4:</strong> Edita cada combinación individual (stock, precio, SKU)</p>
            <p><strong>Resultado:</strong> Control total sobre cada variante específica</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para gestionar un grupo individual
function GroupCard({
  group,
  colorPresets,
  sizePresets,
  onAddOption,
  onRemoveOption,
  onRemoveGroup
}: {
  group: VariantGroup
  colorPresets: Array<{ name: string; hex: string }>
  sizePresets: string[]
  onAddOption: (option: Omit<VariantOption, 'id'>) => void
  onRemoveOption: (optionId: string) => void
  onRemoveGroup: () => void
}) {
  const [isAddingOption, setIsAddingOption] = useState(false)
  const [newOption, setNewOption] = useState<Omit<VariantOption, 'id'>>({
    name: '',
    value: '',
    colorHex: '#000000'
  })

  const handleAddOption = () => {
    if (!newOption.name.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }

    onAddOption(newOption)
    setNewOption({ name: '', value: '', colorHex: '#000000' })
    setIsAddingOption(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              {group.type === 'size' && '📏'}
              {group.type === 'color' && '🎨'}
              {group.type === 'custom' && '🏷️'}
              {group.name}
            </CardTitle>
            <p className="text-sm text-gray-500">{group.options.length} opciones</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setIsAddingOption(true)}>
              <Plus className="h-3 w-3 mr-1" />
              Opción
            </Button>
            <Button size="sm" variant="outline" onClick={onRemoveGroup}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulario nueva opción */}
        {isAddingOption && (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 space-y-4">
            <h4 className="font-medium">➕ Nueva Opción</h4>

            {/* Opciones rápidas para tallas */}
            {group.type === 'size' && (
              <div>
                <Label>Tallas Rápidas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizePresets.map(size => (
                    <Button
                      key={size}
                      variant="outline"
                      size="sm"
                      onClick={() => setNewOption({
                        name: size,
                        value: size.toLowerCase(),
                        colorHex: newOption.colorHex
                      })}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Opciones rápidas para colores */}
            {group.type === 'color' && (
              <div>
                <Label>Colores Rápidos</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorPresets.map(color => (
                    <button
                      key={color.hex}
                      onClick={() => setNewOption({
                        name: color.name,
                        value: color.name.toLowerCase(),
                        colorHex: color.hex
                      })}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-500"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nombre *</Label>
                <Input
                  value={newOption.name}
                  onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                  placeholder="Nombre de la opción"
                />
              </div>
              <div>
                <Label>Valor</Label>
                <Input
                  value={newOption.value}
                  onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                  placeholder="Valor para SKU (automático si está vacío)"
                />
              </div>
            </div>

            {group.type === 'color' && (
              <div>
                <Label>Color Personalizado</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newOption.colorHex}
                    onChange={(e) => setNewOption({ ...newOption, colorHex: e.target.value })}
                    className="w-16"
                  />
                  <Input
                    value={newOption.colorHex}
                    onChange={(e) => setNewOption({ ...newOption, colorHex: e.target.value })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingOption(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleAddOption}>
                <Save className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
        )}

        {/* Lista de opciones */}
        {group.options.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.options.map(option => (
              <div key={option.id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {option.colorHex && (
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: option.colorHex }}
                      />
                    )}
                    <span className="font-medium">{option.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemoveOption(option.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                {option.value && (
                  <p className="text-xs text-gray-500 mt-1">
                    Valor: {option.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No hay opciones en este grupo</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente para una fila de combinación en la tabla
function CombinationRow({
  combination,
  isEditing,
  variantGroups,
  onUpdate,
  onEdit,
  onSave,
  onCancel,
  onRemove,
  getOptionDisplay
}: {
  combination: VariantCombination
  isEditing: boolean
  variantGroups: VariantGroup[]
  onUpdate: (updates: Partial<VariantCombination>) => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onRemove: () => void
  getOptionDisplay: (groupId: string, optionId: string) => {
    groupName: string
    optionName: string
    colorHex?: string
  }
}) {
  const [editData, setEditData] = useState(combination)

  useEffect(() => {
    if (isEditing) {
      setEditData(combination)
    }
  }, [isEditing, combination])

  const handleSave = () => {
    onUpdate(editData)
    onSave()
  }

  return (
    <tr className={`border-b hover:bg-gray-50 ${!combination.isActive ? 'opacity-50' : ''}`}>
      {/* Combinación */}
      <td className="p-3">
        <div className="flex flex-wrap gap-1">
          {combination.groupCombinations.map((gc, index) => {
            const display = getOptionDisplay(gc.groupId, gc.optionId)
            return (
              <div key={index} className="flex items-center gap-1">
                {display.colorHex && (
                  <div
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: display.colorHex }}
                  />
                )}
                <Badge variant="outline" className="text-xs">
                  {display.optionName}
                </Badge>
              </div>
            )
          })}
        </div>
      </td>

      {/* SKU */}
      <td className="p-3">
        {isEditing ? (
          <Input
            value={editData.sku}
            onChange={(e) => setEditData({ ...editData, sku: e.target.value })}
            className="text-xs"
          />
        ) : (
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {combination.sku}
          </code>
        )}
      </td>

      {/* Stock */}
      <td className="p-3">
        {isEditing ? (
          <Input
            type="number"
            value={editData.stock}
            onChange={(e) => setEditData({ ...editData, stock: parseInt(e.target.value) || 0 })}
            className="w-20"
            min="0"
          />
        ) : (
          <span className={combination.stock < 5 ? 'text-red-600 font-medium' : ''}>
            {combination.stock}
          </span>
        )}
      </td>

      {/* Precio */}
      <td className="p-3">
        {isEditing ? (
          <Input
            type="number"
            step="0.01"
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
            className="w-24"
            min="0"
          />
        ) : (
          <span className="font-medium">
            €{combination.price.toFixed(2)}
          </span>
        )}
      </td>

      {/* Estado */}
      <td className="p-3">
        {isEditing ? (
          <ColoredSwitch
            checked={editData.isActive}
            onCheckedChange={(checked) => setEditData({ ...editData, isActive: checked })}
            activeColor="green"
            inactiveColor="red"
          />
        ) : (
          <Badge variant={combination.isActive ? 'default' : 'secondary'}>
            {combination.isActive ? 'Activa' : 'Inactiva'}
          </Badge>
        )}
      </td>

      {/* Acciones */}
      <td className="p-3">
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={onRemove}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}