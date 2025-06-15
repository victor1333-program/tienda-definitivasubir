'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useNotifications } from '@/hooks/useNotifications'
import { useNotificationActions } from '@/components/admin/notifications/NotificationToastContainer'
import { NotificationType } from '@/lib/notifications'
import { Package, AlertTriangle, Mail, Settings, CheckCheck, User } from 'lucide-react'

const demoNotifications = [
  {
    type: 'NEW_ORDER' as NotificationType,
    title: 'Nuevo Pedido #PED-2024-001',
    message: 'María García ha realizado un pedido por 125.50€',
    priority: 'HIGH' as const,
    icon: Package,
    color: 'blue'
  },
  {
    type: 'LOW_STOCK' as NotificationType,
    title: 'Stock Bajo - Camiseta Básica',
    message: 'Solo quedan 3 unidades en inventario',
    priority: 'MEDIUM' as const,
    icon: AlertTriangle,
    color: 'orange'
  },
  {
    type: 'CONTACT_FORM' as NotificationType,
    title: 'Nueva Consulta de Cliente',
    message: 'Juan Pérez: "¿Tienen diseños personalizados?"',
    priority: 'MEDIUM' as const,
    icon: Mail,
    color: 'green'
  },
  {
    type: 'SYSTEM_ALERT' as NotificationType,
    title: 'Alerta del Sistema',
    message: 'Actualización de seguridad disponible',
    priority: 'LOW' as const,
    icon: Settings,
    color: 'red'
  },
  {
    type: 'NEW_CUSTOMER' as NotificationType,
    title: 'Nuevo Cliente Registrado',
    message: 'Ana Rodríguez se ha registrado en la tienda',
    priority: 'LOW' as const,
    icon: User,
    color: 'purple'
  },
  {
    type: 'PAYMENT_RECEIVED' as NotificationType,
    title: 'Pago Recibido',
    message: 'Pago de 89.99€ confirmado para pedido #PED-2024-002',
    priority: 'HIGH' as const,
    icon: CheckCheck,
    color: 'green'
  }
]

export default function NotificationDemo() {
  const [isCreating, setIsCreating] = useState(false)
  const { createNotification } = useNotifications()
  const { showSuccess, showError, showWarning, showInfo, showToast } = useNotificationActions()

  const createDemoNotification = async (demo: typeof demoNotifications[0]) => {
    setIsCreating(true)
    
    try {
      // Crear notificación en la base de datos
      await createNotification({
        type: demo.type,
        title: demo.title,
        message: demo.message,
        priority: demo.priority
      })

      // Mostrar toast de confirmación
      showSuccess('¡Notificación creada!', 'La notificación se ha enviado correctamente')
      
    } catch (error) {
      showError('Error', 'No se pudo crear la notificación')
      console.error('Error creating demo notification:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const showDemoToasts = () => {
    showSuccess('¡Éxito!', 'Esta es una notificación de éxito')
    
    setTimeout(() => {
      showWarning('Advertencia', 'Esta es una notificación de advertencia')
    }, 1000)
    
    setTimeout(() => {
      showInfo('Información', 'Esta es una notificación informativa')
    }, 2000)
    
    setTimeout(() => {
      showError('Error', 'Esta es una notificación de error')
    }, 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Demo del Sistema de Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Probar Notificaciones del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {demoNotifications.map((demo, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => createDemoNotification(demo)}
                disabled={isCreating}
                className="flex items-center gap-2 p-3 h-auto flex-col"
              >
                <demo.icon className={`w-5 h-5 text-${demo.color}-600`} />
                <div className="text-center">
                  <div className="font-medium text-xs">{demo.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{demo.message}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Probar Notificaciones Toast</h3>
          <Button
            onClick={showDemoToasts}
            className="w-full"
            variant="outline"
          >
            🎯 Mostrar Secuencia de Toasts
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Muestra diferentes tipos de notificaciones toast en secuencia
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            💡 Cómo funciona el sistema
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Las notificaciones se guardan en la base de datos</li>
            <li>• Aparecen en tiempo real en el centro de notificaciones</li>
            <li>• Se pueden mostrar como toasts para eventos inmediatos</li>
            <li>• Los administradores reciben todas las notificaciones</li>
            <li>• Se pueden configurar diferentes canales (email, browser, sonido)</li>
            <li>• Cada tipo de notificación tiene prioridades y estilos únicos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}