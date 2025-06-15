import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { emailService } from '@/lib/email-service'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { testEmail } = await req.json()

    if (!testEmail) {
      return NextResponse.json({ error: 'Email de prueba requerido' }, { status: 400 })
    }

    // Probar conexión SMTP
    const connectionTest = await emailService.testConnection()
    
    if (!connectionTest.success) {
      return NextResponse.json({ 
        success: false, 
        message: connectionTest.message 
      }, { status: 400 })
    }

    // Enviar email de prueba
    const emailSent = await emailService.sendEmail({
      to: testEmail,
      subject: '✅ Prueba de Configuración SMTP - Lovilike',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1>✅ Configuración SMTP Exitosa</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p>¡Excelente! Tu configuración de email SMTP está funcionando correctamente.</p>
            
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #0369a1;">Detalles de la Prueba</h3>
              <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
              <p style="margin: 5px 0;"><strong>Enviado desde:</strong> Sistema de Email Lovilike</p>
              <p style="margin: 5px 0;"><strong>Estado:</strong> Configuración verificada ✅</p>
            </div>
            
            <p>Ahora puedes:</p>
            <ul>
              <li>Enviar emails de confirmación de pedidos automáticamente</li>
              <li>Notificar a clientes sobre actualizaciones de envío</li>
              <li>Gestionar emails de bienvenida y marketing</li>
              <li>Utilizar templates personalizables</li>
            </ul>
            
            <div style="background: #fef3e2; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #9a3412;"><strong>Nota:</strong> Este es un email de prueba generado automáticamente desde el panel de administración de Lovilike.</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>Lovilike Personalizados - Sistema de Email</p>
          </div>
        </div>
      `,
      text: `
Configuración SMTP Exitosa

¡Excelente! Tu configuración de email SMTP está funcionando correctamente.

Fecha: ${new Date().toLocaleString('es-ES')}
Enviado desde: Sistema de Email Lovilike
Estado: Configuración verificada

Ahora puedes:
- Enviar emails de confirmación de pedidos automáticamente
- Notificar a clientes sobre actualizaciones de envío
- Gestionar emails de bienvenida y marketing
- Utilizar templates personalizables

Nota: Este es un email de prueba generado automáticamente desde el panel de administración de Lovilike.

Lovilike Personalizados - Sistema de Email
      `
    })

    if (!emailSent) {
      return NextResponse.json({ 
        success: false, 
        message: 'Error al enviar el email de prueba' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Email de prueba enviado exitosamente a ${testEmail}` 
    })

  } catch (error) {
    console.error('Error testing email:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Error interno del servidor' 
    }, { status: 500 })
  }
}