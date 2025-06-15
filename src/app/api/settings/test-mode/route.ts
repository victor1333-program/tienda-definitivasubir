import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const testModeSetting = await prisma.setting.findUnique({
      where: { key: 'test_mode' }
    })

    const isTestMode = testModeSetting?.value === true || false

    return NextResponse.json({ 
      testMode: isTestMode,
      message: isTestMode ? 'Modo prueba activo' : 'Modo producción activo'
    })
  } catch (error) {
    console.error('Error al obtener configuración de modo prueba:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { testMode } = await request.json()

    if (typeof testMode !== 'boolean') {
      return NextResponse.json(
        { error: 'testMode debe ser un valor booleano' },
        { status: 400 }
      )
    }

    await prisma.setting.upsert({
      where: { key: 'test_mode' },
      update: { value: testMode },
      create: {
        key: 'test_mode',
        value: testMode
      }
    })

    return NextResponse.json({
      success: true,
      testMode,
      message: testMode 
        ? 'Modo prueba activado. Los pagos serán simulados.' 
        : 'Modo producción activado. Los pagos serán reales.'
    })
  } catch (error) {
    console.error('Error al actualizar modo prueba:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}