import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { emailService } from '@/lib/email-service'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params

    // Mapear IDs a tipos de template
    const templateTypeMap: Record<string, string> = {
      'order_confirmation': 'ORDER_CONFIRMATION',
      'order_shipped': 'ORDER_SHIPPED',
      'welcome': 'WELCOME',
      'password_reset': 'PASSWORD_RESET'
    }

    const templateType = templateTypeMap[id]
    if (!templateType) {
      return NextResponse.json({ error: 'Template no encontrado' }, { status: 404 })
    }

    const template = await emailService.getTemplate(templateType)
    if (!template) {
      return NextResponse.json({ error: 'Template no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ template })

  } catch (error) {
    console.error('Error getting email template:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params
    const { 
      name, 
      subject, 
      htmlContent, 
      textContent, 
      isActive 
    } = await req.json()

    // Validaciones básicas
    if (!name || !subject || !htmlContent) {
      return NextResponse.json({ 
        error: 'Campos requeridos: nombre, asunto y contenido HTML' 
      }, { status: 400 })
    }

    // TODO: Implementar actualización en base de datos cuando se añada el modelo EmailTemplate
    // const template = await db.emailTemplate.update({
    //   where: { id },
    //   data: {
    //     name,
    //     subject,
    //     htmlContent,
    //     textContent,
    //     isActive: isActive ?? true,
    //     updatedAt: new Date()
    //   }
    // })

    return NextResponse.json({
      success: true,
      message: 'Template actualizado exitosamente',
      template: {
        id,
        name,
        subject,
        htmlContent,
        textContent,
        isActive: isActive ?? true,
        lastModified: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error updating email template:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params

    // No permitir eliminar templates por defecto
    const defaultTemplates = ['order_confirmation', 'order_shipped', 'welcome', 'password_reset']
    if (defaultTemplates.includes(id)) {
      return NextResponse.json({ 
        error: 'No se pueden eliminar templates por defecto' 
      }, { status: 400 })
    }

    // TODO: Implementar eliminación en base de datos cuando se añada el modelo EmailTemplate
    // await db.emailTemplate.delete({
    //   where: { id }
    // })

    return NextResponse.json({
      success: true,
      message: 'Template eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error deleting email template:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}