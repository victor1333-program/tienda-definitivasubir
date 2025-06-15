"use client"

import { useState, useEffect } from "react"
import { Save, Package, DollarSign, Tag, Type, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ColoredSwitch } from "@/components/ui/ColoredSwitch"
import { toast } from "react-hot-toast"

interface Product {
  id: string
  name: string
  sku: string
  slug: string
  description?: string
  basePrice: number
  comparePrice?: number
  costPrice?: number
  customizationPrice?: number
  weight?: number
  dimensions?: string
  materialType?: string
  personalizationType?: string
  isActive: boolean
  featured: boolean
  metaTitle?: string
  metaDescription?: string
  tags?: string
}

interface GeneralProductEditorProps {
  product: Product
  onProductChange?: (product: Product) => void
}

export default function GeneralProductEditor({
  product: initialProduct,
  onProductChange
}: GeneralProductEditorProps) {
  const [product, setProduct] = useState<Product>(initialProduct)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setProduct(initialProduct)
  }, [initialProduct])

  const handleChange = (field: keyof Product, value: any) => {
    const updatedProduct = { ...product, [field]: value }
    setProduct(updatedProduct)
    setHasChanges(true)
    
    if (onProductChange) {
      onProductChange(updatedProduct)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (name: string) => {
    handleChange('name', name)
    // Auto-generar slug si está vacío o coincide con el anterior
    if (!product.slug || product.slug === generateSlug(product.name)) {
      handleChange('slug', generateSlug(name))
    }
  }

  const handleSave = async () => {
    if (!hasChanges) {
      toast.success('No hay cambios para guardar')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })

      if (response.ok) {
        setHasChanges(false)
        toast.success('Producto actualizado correctamente')
      } else {
        toast.error('Error al actualizar el producto')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Error al guardar los cambios')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nombre del producto"
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={product.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                placeholder="Código único del producto"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="slug">Slug (URL amigable)</Label>
            <Input
              id="slug"
              value={product.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="url-amigable-del-producto"
            />
            <p className="text-sm text-gray-500 mt-1">
              URL: /productos/{product.slug || 'slug-del-producto'}
            </p>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={product.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descripción detallada del producto"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="materialType">Tipo de Material</Label>
              <select
                id="materialType"
                value={product.materialType || ''}
                onChange={(e) => handleChange('materialType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Seleccionar material</option>
                <option value="Algodón">Algodón</option>
                <option value="Poliéster">Poliéster</option>
                <option value="Mezcla">Mezcla</option>
                <option value="Lino">Lino</option>
                <option value="Seda">Seda</option>
                <option value="Lana">Lana</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <Label htmlFor="personalizationType">Tipo de Personalización</Label>
              <select
                id="personalizationType"
                value={product.personalizationType || ''}
                onChange={(e) => handleChange('personalizationType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Sin personalización</option>
                <option value="Bordado">Bordado</option>
                <option value="Serigrafía">Serigrafía</option>
                <option value="Vinilo">Vinilo</option>
                <option value="Sublimación">Sublimación</option>
                <option value="Láser">Grabado láser</option>
                <option value="Digital">Impresión digital</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Precios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Gestión de Precios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="basePrice">Precio Base (€) *</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                value={product.basePrice}
                onChange={(e) => handleChange('basePrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="comparePrice">Precio de Comparación (€)</Label>
              <Input
                id="comparePrice"
                type="number"
                step="0.01"
                value={product.comparePrice || ''}
                onChange={(e) => handleChange('comparePrice', parseFloat(e.target.value) || null)}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Para mostrar descuentos</p>
            </div>
            <div>
              <Label htmlFor="costPrice">Precio de Coste (€)</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                value={product.costPrice || ''}
                onChange={(e) => handleChange('costPrice', parseFloat(e.target.value) || null)}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Para cálculo de margen</p>
            </div>
            <div>
              <Label htmlFor="customizationPrice">Precio Personalización (€)</Label>
              <Input
                id="customizationPrice"
                type="number"
                step="0.01"
                value={product.customizationPrice || ''}
                onChange={(e) => handleChange('customizationPrice', parseFloat(e.target.value) || null)}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Coste base de personalizar</p>
            </div>
          </div>

          {/* Cálculo de margen */}
          {product.costPrice && product.basePrice > product.costPrice && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm font-medium text-green-800">
                Margen de beneficio: €{(product.basePrice - product.costPrice).toFixed(2)} 
                ({(((product.basePrice - product.costPrice) / product.costPrice) * 100).toFixed(1)}%)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dimensiones y Peso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Dimensiones y Características Físicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Peso (gramos)</Label>
              <Input
                id="weight"
                type="number"
                value={product.weight || ''}
                onChange={(e) => handleChange('weight', parseFloat(e.target.value) || null)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="dimensions">Dimensiones (L x A x An cm)</Label>
              <Input
                id="dimensions"
                value={product.dimensions || ''}
                onChange={(e) => handleChange('dimensions', e.target.value)}
                placeholder="20 x 30 x 5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado y Visibilidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Estado y Visibilidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Producto Activo</Label>
                <p className="text-sm text-gray-500">
                  El producto estará visible en la tienda
                </p>
              </div>
              <ColoredSwitch
                checked={product.isActive}
                onCheckedChange={(checked) => handleChange('isActive', checked)}
                activeColor="green"
                inactiveColor="red"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Producto Destacado</Label>
                <p className="text-sm text-gray-500">
                  Aparecerá en la página principal
                </p>
              </div>
              <ColoredSwitch
                checked={product.featured}
                onCheckedChange={(checked) => handleChange('featured', checked)}
                activeColor="purple"
                inactiveColor="gray"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Optimización SEO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Título SEO</Label>
            <Input
              id="metaTitle"
              value={product.metaTitle || ''}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
              placeholder={product.name}
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {(product.metaTitle || '').length}/60 caracteres
            </p>
          </div>
          <div>
            <Label htmlFor="metaDescription">Descripción SEO</Label>
            <Textarea
              id="metaDescription"
              value={product.metaDescription || ''}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              placeholder="Descripción breve para motores de búsqueda"
              maxLength={160}
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              {(product.metaDescription || '').length}/160 caracteres
            </p>
          </div>
          <div>
            <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
            <Input
              id="tags"
              value={product.tags || ''}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="camiseta, personalizable, algodón"
            />
          </div>
        </CardContent>
      </Card>

      {/* Botón de Guardar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  )
}