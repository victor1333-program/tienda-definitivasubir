"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DesignEditorPageSimple() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/designs"
          className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editor de Diseños</h1>
          <p className="text-gray-600 mt-1">Crear y editar diseños personalizados</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Editor de Diseños
          </h2>
          <p className="text-gray-600 mb-4">
            Esta es una versión simplificada para testing.
          </p>
          <p className="text-sm text-gray-500">
            ✅ La navegación funciona correctamente
          </p>
        </div>
      </div>
    </div>
  )
}