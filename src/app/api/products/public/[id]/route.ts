import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Obtener parámetros de query
    const url = new URL(request.url)
    const includeVariants = url.searchParams.get('include')?.includes('variants')
    const includeReviews = url.searchParams.get('include')?.includes('reviews')
    const includeCategory = url.searchParams.get('include')?.includes('category')

    const product = await db.product.findFirst({
      where: {
        id,
        isActive: true
      },
      include: {
        variants: includeVariants ? {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        } : false,
        categories: includeCategory ? {
          include: {
            category: true
          }
        } : false
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    // Formatear datos para el frontend
    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      comparePrice: product.comparePrice,
      images: JSON.parse(product.images),
      videos: JSON.parse(product.videos || '[]'),
      isCustomizable: product.canCustomize,
      customizationPrice: product.customizationPrice,
      materialType: product.materialType,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      featured: product.featured,
      tags: [], // Agregar lógica para tags si es necesario
      variants: includeVariants ? product.variants.map(variant => ({
        id: variant.id,
        sku: variant.sku,
        name: `${variant.size ? variant.size : ''}${variant.colorName ? ` - ${variant.colorName}` : ''}${variant.material ? ` (${variant.material})` : ''}`.trim() || 'Variante estándar',
        price: variant.price || product.basePrice,
        stock: variant.stock,
        size: variant.size,
        color: variant.colorName,
        colorHex: variant.colorHex,
        material: variant.material
      })) : [],
      category: includeCategory && product.categories.length > 0 ? {
        id: product.categories[0].category.id,
        name: product.categories[0].category.name,
        slug: product.categories[0].category.slug
      } : null,
      specifications: {
        material: product.materialType,
        // Agregar más especificaciones según sea necesario
      },
      // Mock data para rating y reviews por ahora
      rating: 4.5,
      reviewCount: 12,
      reviews: includeReviews ? [] : undefined
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error("Error al obtener producto:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}