"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { toast } from "react-hot-toast"

interface Variant {
  id?: string
  sku: string
  size?: string
  color?: string
  material?: string
  stock: number
  price?: number
  isActive: boolean
}

interface VariantsManagerProps {
  productId: string
  variants: Variant[]
  basePrice: number
  onVariantsChange?: (variants: Variant[]) => void
}

export default function VariantsManager({ 
  productId, 
  variants: initialVariants = [], 
  basePrice,
  onVariantsChange 
}: VariantsManagerProps) {
  const [variants, setVariants] = useState<Variant[]>(initialVariants)
  const [isEditing, setIsEditing] = useState(false)
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null)
  const [newVariant, setNewVariant] = useState<Variant>({
    sku: '',
    size: '',
    color: '',
    material: '',
    stock: 0,
    price: basePrice,
    isActive: true
  })

  // Predefined options
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL']
  const materialOptions = ['Algodón', 'Poliéster', 'Mezcla', 'Lino', 'Seda', 'Lana']
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

  useEffect(() => {
    if (onVariantsChange) {
      onVariantsChange(variants)
    }
  }, [variants, onVariantsChange])

  const handleAddVariant = async () => {
    if (!newVariant.sku.trim()) {
      toast.error('El SKU es obligatorio')
      return
    }

    // Check for duplicate SKU
    if (variants.some(v => v.sku === newVariant.sku)) {
      toast.error('Ya existe una variante con ese SKU')
      return
    }

    try {
      const response = await fetch('/api/product-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newVariant,
          productId
        })
      })

      if (response.ok) {
        const data = await response.json()
        setVariants([...variants, data.variant])
        setNewVariant({
          sku: '',
          size: '',
          color: '',
          material: '',
          stock: 0,
          price: basePrice,
          isActive: true
        })
        setIsEditing(false)
        toast.success('Variante agregada correctamente')
      } else {
        toast.error('Error al agregar la variante')
      }
    } catch (error) {
      console.error('Error adding variant:', error)
      toast.error('Error al agregar la variante')
    }
  }

  const handleEditVariant = (variant: Variant) => {
    setEditingVariant({ ...variant })
  }

  const handleUpdateVariant = async () => {
    if (!editingVariant) return

    try {
      const response = await fetch(`/api/product-variants/${editingVariant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingVariant)
      })

      if (response.ok) {
        const data = await response.json()
        setVariants(variants.map(v => v.id === editingVariant.id ? data.variant : v))
        setEditingVariant(null)
        toast.success('Variante actualizada correctamente')
      } else {
        toast.error('Error al actualizar la variante')
      }
    } catch (error) {
      console.error('Error updating variant:', error)
      toast.error('Error al actualizar la variante')
    }
  }

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta variante?')) {
      return
    }

    try {
      const response = await fetch(`/api/product-variants/${variantId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setVariants(variants.filter(v => v.id !== variantId))
        toast.success('Variante eliminada correctamente')
      } else {
        toast.error('Error al eliminar la variante')
      }
    } catch (error) {
      console.error('Error deleting variant:', error)
      toast.error('Error al eliminar la variante')
    }
  }

  const VariantForm = ({ 
    variant, 
    onChange, 
    onSave, 
    onCancel, 
    isNew = false 
  }: {
    variant: Variant
    onChange: (variant: Variant) => void
    onSave: () => void
    onCancel: () => void
    isNew?: boolean
  }) => (
    <Card className="border-2 border-dashed border-blue-300">
      <CardHeader>
        <CardTitle className="text-lg">
          {isNew ? '➕ Nueva Variante' : '✏️ Editar Variante'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={variant.sku}
              onChange={(e) => onChange({ ...variant, sku: e.target.value })}
              placeholder="Ej: PROD-001-M-BLK"
            />
          </div>
          <div>
            <Label htmlFor="price">Precio (€)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={variant.price || ''}
              onChange={(e) => onChange({ ...variant, price: parseFloat(e.target.value) || basePrice })}
              placeholder={`Precio base: €${basePrice}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="size">Talla</Label>
            <select
              id="size"
              value={variant.size || ''}
              onChange={(e) => onChange({ ...variant, size: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Sin talla</option>
              {sizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="material">Material</Label>
            <select
              id="material"
              value={variant.material || ''}
              onChange={(e) => onChange({ ...variant, material: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Sin material específico</option>
              {materialOptions.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={variant.stock}
              onChange={(e) => onChange({ ...variant, stock: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={variant.color || ''}
            onChange={(e) => onChange({ ...variant, color: e.target.value })}
            placeholder="Nombre del color (ej: Rojo, Azul marino...)"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {colorPresets.map(color => (
              <button
                key={color.hex}
                type="button"
                onClick={() => onChange({ ...variant, color: color.name })}
                className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-500"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Variantes del Producto</h3>
        <Button onClick={() => setIsEditing(true)} disabled={isEditing}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Variante
        </Button>
      </div>

      {/* New Variant Form */}
      {isEditing && (
        <VariantForm
          variant={newVariant}
          onChange={setNewVariant}
          onSave={handleAddVariant}
          onCancel={() => setIsEditing(false)}
          isNew={true}
        />
      )}

      {/* Edit Variant Form */}
      {editingVariant && (
        <VariantForm
          variant={editingVariant}
          onChange={setEditingVariant}
          onSave={handleUpdateVariant}
          onCancel={() => setEditingVariant(null)}
        />
      )}

      {/* Variants List */}
      {variants.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {variants.map((variant) => (
            <Card key={variant.id || variant.sku}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{variant.sku}</h4>
                    {variant.price && variant.price !== basePrice && (
                      <p className="text-sm text-green-600 font-medium">€{variant.price}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditVariant(variant)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => variant.id && handleDeleteVariant(variant.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {variant.size && (
                      <Badge variant="outline">Talla: {variant.size}</Badge>
                    )}
                    {variant.material && (
                      <Badge variant="outline">{variant.material}</Badge>
                    )}
                    {variant.color && (
                      <Badge variant="outline">{variant.color}</Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Stock: {variant.stock}</span>
                    <span className={variant.isActive ? 'text-green-600' : 'text-red-600'}>
                      {variant.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">No hay variantes configuradas</p>
            <p className="text-sm text-gray-400">
              Agrega variantes para gestionar diferentes tallas, colores o materiales
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}