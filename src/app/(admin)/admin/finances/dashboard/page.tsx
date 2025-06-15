"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  ShoppingCart, 
  Users,
  Calendar,
  FileText,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download
} from "lucide-react"

interface FinancialMetrics {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  orders: {
    current: number
    previous: number
    growth: number
  }
  customers: {
    current: number
    previous: number
    growth: number
  }
  avgOrderValue: {
    current: number
    previous: number
    growth: number
  }
}

interface RecentTransaction {
  id: string
  type: 'income' | 'expense'
  description: string
  amount: number
  date: string
  category: string
  status: 'completed' | 'pending' | 'cancelled'
}

export default function FinancesDashboardPage() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    revenue: { current: 45230, previous: 38950, growth: 16.1 },
    orders: { current: 342, previous: 298, growth: 14.8 },
    customers: { current: 256, previous: 234, growth: 9.4 },
    avgOrderValue: { current: 132.25, previous: 130.70, growth: 1.2 }
  })

  const [recentTransactions] = useState<RecentTransaction[]>([
    {
      id: "TXN-001",
      type: "income",
      description: "Venta online - Pedido #1234",
      amount: 89.50,
      date: "2025-06-13",
      category: "Ventas",
      status: "completed"
    },
    {
      id: "TXN-002", 
      type: "expense",
      description: "Compra materiales - Proveedor ABC",
      amount: -245.00,
      date: "2025-06-12",
      category: "Materiales",
      status: "completed"
    },
    {
      id: "TXN-003",
      type: "income",
      description: "Venta en tienda - Cliente walk-in",
      amount: 156.80,
      date: "2025-06-12",
      category: "Ventas",
      status: "completed"
    },
    {
      id: "TXN-004",
      type: "expense",
      description: "Pago factura electricidad",
      amount: -120.00,
      date: "2025-06-11",
      category: "Servicios",
      status: "pending"
    },
    {
      id: "TXN-005",
      type: "income",
      description: "Devolución - Reembolso proveedor",
      amount: 75.00,
      date: "2025-06-11",
      category: "Devoluciones",
      status: "completed"
    }
  ])

  const getTimeframeLabel = (tf: string) => {
    const labels = {
      '7d': 'Últimos 7 días',
      '30d': 'Últimos 30 días', 
      '90d': 'Últimos 90 días',
      '1y': 'Último año'
    }
    return labels[tf as keyof typeof labels]
  }

  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">+{growth.toFixed(1)}%</span>
        </div>
      )
    } else if (growth < 0) {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDownRight className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{growth.toFixed(1)}%</span>
        </div>
      )
    }
    return (
      <div className="flex items-center text-gray-600">
        <span className="text-sm font-medium">0%</span>
      </div>
    )
  }

  const getTransactionBadge = (status: string) => {
    const config = {
      completed: { label: "Completado", color: "bg-green-100 text-green-800" },
      pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
      cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" }
    }
    
    const conf = config[status as keyof typeof config] || config.pending
    return <Badge className={conf.color}>{conf.label}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Financiero</h1>
            <p className="text-gray-600">Resumen de métricas financieras y rendimiento</p>
          </div>
          
          {/* Filtros de tiempo */}
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'outline'}
                className={timeframe === tf ? 'bg-orange-600 hover:bg-orange-700' : ''}
                onClick={() => setTimeframe(tf)}
              >
                {getTimeframeLabel(tf)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ingresos Totales</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.revenue.current)}</p>
                {getGrowthIndicator(metrics.revenue.growth)}
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pedidos</p>
                <p className="text-2xl font-bold">{metrics.orders.current}</p>
                {getGrowthIndicator(metrics.orders.growth)}
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Clientes Activos</p>
                <p className="text-2xl font-bold">{metrics.customers.current}</p>
                {getGrowthIndicator(metrics.customers.growth)}
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Valor Medio Pedido</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.avgOrderValue.current)}</p>
                {getGrowthIndicator(metrics.avgOrderValue.growth)}
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transacciones recientes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Transacciones Recientes
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? 
                          <TrendingUp className={`w-4 h-4 ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`} /> :
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{transaction.category}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      {getTransactionBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas y reportes */}
        <div className="space-y-6">
          {/* Acciones rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Nueva Factura
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generar Reporte
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Datos
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <PieChart className="w-4 h-4 mr-2" />
                Análisis Detallado
              </Button>
            </CardContent>
          </Card>

          {/* Resumen mensual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Resumen Mensual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Ingresos:</span>
                <span className="font-semibold text-green-600">+{formatCurrency(45230)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gastos:</span>
                <span className="font-semibold text-red-600">-{formatCurrency(18650)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos:</span>
                <span className="font-semibold text-orange-600">-{formatCurrency(4523)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Beneficio Neto:</span>
                <span className="font-bold text-green-600">{formatCurrency(22057)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas Financieras</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Facturas Pendientes</p>
                <p className="text-xs text-yellow-700">3 facturas por valor de {formatCurrency(1580)}</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Próximo Pago</p>
                <p className="text-xs text-blue-700">Proveedor ABC - {formatCurrency(850)} el 20/06</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}