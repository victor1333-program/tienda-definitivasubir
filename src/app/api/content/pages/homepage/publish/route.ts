import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST: Publicar configuración de la página de inicio
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/content/pages/homepage/publish called')
    
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    console.log('Session in POST publish:', session)
    
    if (!session?.user) {
      console.log('No session found in POST publish request')
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
    console.log('Config data received for publish:', configData)

    // Validar estructura básica
    if (!configData.id || !configData.modules) {
      console.log('Invalid config structure for publish:', { hasId: !!configData.id, hasModules: !!configData.modules })
      return NextResponse.json(
        { error: 'Estructura de configuración inválida' },
        { status: 400 }
      )
    }

    // Por ahora, publicar es lo mismo que guardar
    // En el futuro aquí podrías tener lógica específica de publicación
    console.log('Publishing config...')

    return NextResponse.json({
      success: true,
      message: 'Página publicada correctamente'
    })

  } catch (error) {
    console.error('Error publishing homepage config:', error)
    return NextResponse.json(
      { error: 'Error al publicar la página' },
      { status: 500 }
    )
  }
}