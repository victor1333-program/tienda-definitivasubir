"use client"

import { useState } from "react"
import { Settings, Plus, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

interface ProductionStep {
  id?: string
  name: string
  description: string
  estimatedTime: number // in minutes
  requiredMaterials: string[]
  skillLevel: 'basic' | 'intermediate' | 'advanced'
  order: number
}

interface ProductionManagerProps {
  productId: string
  productionSteps: ProductionStep[]
  onStepsChange?: (steps: ProductionStep[]) => void
}

export default function ProductionManager({
  productId,
  productionSteps: initialSteps = [],
  onStepsChange
}: ProductionManagerProps) {
  const [productionSteps, setProductionSteps] = useState<ProductionStep[]>(initialSteps)

  const totalEstimatedTime = productionSteps.reduce((total, step) => total + step.estimatedTime, 0)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getSkillBadgeVariant = (skill: string) => {
    switch (skill) {
      case 'basic': return 'outline'
      case 'intermediate': return 'secondary'
      case 'advanced': return 'default'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-blue-600">
                  {formatTime(totalEstimatedTime)}
                </span>
              </div>
              <p className="text-sm text-gray-600">Tiempo estimado total</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Settings className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-green-600">
                  {productionSteps.length}
                </span>
              </div>
              <p className="text-sm text-gray-600">Pasos configurados</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-2xl font-bold text-purple-600">
                  {productionSteps.filter(s => s.skillLevel === 'advanced').length}
                </span>
              </div>
              <p className="text-sm text-gray-600">Pasos avanzados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production Steps */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>🛠️ Proceso de Producción</CardTitle>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Paso
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {productionSteps.length > 0 ? (
            <div className="space-y-4">
              {productionSteps.map((step, index) => (
                <Card key={step.id || index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-sm">
                          Paso {index + 1}
                        </Badge>
                        <h4 className="font-medium">{step.name}</h4>
                        <Badge variant={getSkillBadgeVariant(step.skillLevel)}>
                          {step.skillLevel}
                        </Badge>
                      </div>
                      <Badge variant="secondary">
                        {formatTime(step.estimatedTime)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {step.description}
                    </p>
                    
                    {step.requiredMaterials.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Materiales requeridos:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {step.requiredMaterials.map((material, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No hay pasos de producción configurados</p>
              <p className="text-sm text-gray-400">
                Define los pasos necesarios para fabricar este producto
              </p>
            </div>
          )}

          {/* Development Notice */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">🚧 En Desarrollo</h4>
                <p className="text-sm text-yellow-700">
                  El sistema completo de gestión de procesos de producción estará disponible próximamente. 
                  Incluirá: gestión de pasos, asignación de trabajadores, control de tiempo, y integración 
                  con el sistema de inventario.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}