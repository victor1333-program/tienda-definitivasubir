import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET: Obtener configuración de la página de inicio
export async function GET() {
  try {
    console.log('GET /api/content/pages/homepage called')
    
    let pageData = null
    
    try {
      // Buscar la configuración guardada en la base de datos
      pageData = await db.setting.findFirst({
        where: { key: 'homepage_config' }
      })
      console.log('Found pageData:', pageData)
    } catch (dbError) {
      console.error('Database error in GET:', dbError)
    }
    
    const defaultConfig = {
      id: 'homepage',
      modules: [
        {
          id: 'hero-1',
          type: 'hero-banner',
          isVisible: true,
          order: 1,
          props: {
            backgroundImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            title: 'Productos Personalizados Únicos',
            subtitle: 'Crea recuerdos especiales con nuestros productos personalizados para bodas, comuniones, bautizos y más',
            buttonText: 'Ver Productos',
            buttonLink: '/productos',
            height: 'large',
            textAlign: 'center',
            overlay: 0.4,
            textColor: '#ffffff',
            buttonStyle: 'primary',
            showButton: true
          }
        },
        {
          id: 'featured-categories-1',
          type: 'featured-categories',
          isVisible: true,
          order: 2,
          props: {
            title: 'Nuestras Categorías',
            subtitle: 'Encuentra el producto perfecto para tu evento especial',
            categories: [],
            columns: 3,
            showDescription: true,
            style: 'cards',
            maxCategories: 6
          }
        },
        {
          id: 'rich-text-1',
          type: 'rich-text',
          isVisible: true,
          order: 3,
          props: {
            content: '<div class="text-center py-12"><h2 class="text-3xl font-bold text-gray-900 mb-4">Bienvenido a Lovilike</h2><p class="text-lg text-gray-600 max-w-2xl mx-auto">Somos especialistas en productos personalizados para tus eventos más especiales. Desde bodas hasta baby showers, creamos recuerdos únicos que durarán toda la vida.</p></div>',
            width: 'normal',
            textAlign: 'center',
            padding: 'medium'
          }
        }
      ],
      theme: {
        primaryColor: '#f97316',
        secondaryColor: '#1f2937',
        fontFamily: 'Inter'
      },
      seo: {
        title: 'Inicio - Lovilike',
        description: 'Bienvenido a Lovilike - Productos personalizados únicos',
        keywords: 'productos personalizados, regalos, impresión'
      }
    }

    const config = pageData ? pageData.value : defaultConfig
    console.log('Returning config:', config)

    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('GET /api/content/pages/homepage error:', error)
    return NextResponse.json(
      { error: 'Error al obtener la configuración de la página' },
      { status: 500 }
    )
  }
}

// PUT: Actualizar configuración de la página de inicio
export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/content/pages/homepage called')
    
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    console.log('Session in PUT:', session)
    
    if (!session?.user) {
      console.log('No session found in PUT request')
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }
    
    // Verificar que no sea solo cliente
    if (session.user.role === 'CUSTOMER') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const configData = await request.json()
    console.log('Config data received:', configData)

    // Validar estructura básica
    if (!configData.id || !configData.modules) {
      console.log('Invalid config structure:', { hasId: !!configData.id, hasModules: !!configData.modules })
      return NextResponse.json(
        { error: 'Estructura de configuración inválida' },
        { status: 400 }
      )
    }

    console.log('Saving config to database...')
    
    // Guardar o actualizar configuración en la base de datos
    const result = await db.setting.upsert({
      where: { key: 'homepage_config' },
      update: {
        value: configData,
        updatedAt: new Date()
      },
      create: {
        key: 'homepage_config',
        value: configData
      }
    })
    
    console.log('Database save result:', result)

    return NextResponse.json({
      success: true,
      message: 'Configuración de página guardada correctamente'
    })

  } catch (error) {
    console.error('Error saving homepage config:', error)
    return NextResponse.json(
      { error: 'Error al guardar la configuración de la página' },
      { status: 500 }
    )
  }
}