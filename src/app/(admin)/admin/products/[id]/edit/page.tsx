"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { 
  ArrowLeft, Save, Settings, Package, FileImage, 
  Palette, Cog, CheckCircle, AlertTriangle, Info
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Badge } from "@/components/ui/Badge"
import fetcher from "@/lib/fetcher"
import { toast } from "react-hot-toast"
import AdvancedVariantsManager from "@/components/admin/products/AdvancedVariantsManager"
import MediaManager from "@/components/admin/products/MediaManager"
import PersonalizationManager from "@/components/admin/products/PersonalizationManager"
import ProductionManager from "@/components/admin/products/ProductionManager"
import GeneralProductEditor from "@/components/admin/products/GeneralProductEditor"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [activeTab, setActiveTab] = useState("general")

  const { data: productData, error } = useSWR(
    productId ? `/api/products/${productId}` : null, 
    fetcher
  )

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar el producto</h1>
          <p className="text-gray-600 mb-4">No se pudo encontrar el producto solicitado.</p>
          <Button asChild>
            <Link href="/admin/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Productos
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const product = productData.product || productData

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">✏️ Configurar Producto</h1>
            <p className="text-gray-600 mt-1">
              Configura las características avanzadas de "{product.name}"
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={product.isActive ? "default" : "secondary"}>
            {product.isActive ? "Activo" : "Inactivo"}
          </Badge>
          <span className="text-sm text-gray-500">ID: {product.id}</span>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">✅ Producto Base Completado</h4>
              <p className="text-sm text-blue-700">
                Ahora puedes configurar las características avanzadas usando las pestañas de abajo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="personalization" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Personalización
          </TabsTrigger>
          <TabsTrigger value="variants" className="flex items-center gap-2">
            <Cog className="w-4 h-4" />
            Variantes
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <FileImage className="w-4 h-4" />
            Multimedia
          </TabsTrigger>
          <TabsTrigger value="production" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Producción
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>📦 Información General del Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <GeneralProductEditor 
                product={product}
                onProductChange={(updatedProduct) => {
                  console.log('Producto actualizado:', updatedProduct)
                  // TODO: Actualizar el producto en el estado
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personalization Tab */}
        <TabsContent value="personalization">
          <Card>
            <CardHeader>
              <CardTitle>🎨 Configuración de Personalización</CardTitle>
            </CardHeader>
            <CardContent>
              <PersonalizationManager
                productId={productId}
                personalizationAreas={[]} // TODO: Obtener del producto
                templates={[]} // TODO: Obtener del producto
                basePersonalizationPrice={product.customizationPrice || 0}
                onPersonalizationChange={(data) => {
                  console.log('Personalization data changed:', data)
                  // TODO: Guardar cambios
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants">
          <Card>
            <CardHeader>
              <CardTitle>📏 Sistema Avanzado de Variantes</CardTitle>
            </CardHeader>
            <CardContent>
              <AdvancedVariantsManager
                productId={productId}
                initialGroups={[]} // TODO: Obtener grupos del producto
                initialCombinations={[]} // TODO: Obtener combinaciones del producto
                basePrice={product.basePrice}
                onVariantsChange={(groups, combinations) => {
                  console.log('Variant groups changed:', groups)
                  console.log('Individual combinations:', combinations)
                  // TODO: Guardar cambios en la base de datos
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>🖼️ Gestión de Multimedia</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaManager
                productId={productId}
                media={(() => {
                  try {
                    const images = JSON.parse(product.images || '[]')
                    return images.map((url: string, index: number) => ({
                      url,
                      type: 'image' as const,
                      name: `Imagen ${index + 1}`,
                      order: index
                    }))
                  } catch {
                    return []
                  }
                })()}
                onMediaChange={(media) => {
                  console.log('Media changed:', media)
                  // TODO: Guardar cambios
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Production Tab */}
        <TabsContent value="production">
          <Card>
            <CardHeader>
              <CardTitle>🛠️ Procesos de Producción</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductionManager
                productId={productId}
                productionSteps={[]} // TODO: Obtener del producto
                onStepsChange={(steps) => {
                  console.log('Production steps changed:', steps)
                  // TODO: Guardar cambios
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/products">
            Volver a Productos
          </Link>
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}