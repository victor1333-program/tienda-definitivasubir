"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { toast } from "react-hot-toast"
import { 
  FileText, 
  Search, 
  Filter,
  Download,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  User,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"

interface FinancialLog {
  id: string
  timestamp: string
  type: 'income' | 'expense' | 'transfer' | 'adjustment' | 'refund'
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'pay'
  amount: number
  description: string
  category: string
  reference: string
  userId: string
  userName: string
  previousAmount?: number
  newAmount?: number
  metadata?: {
    orderId?: string
    customerId?: string
    invoiceId?: string
    expenseId?: string
    reason?: string
  }
}

export default function FinancialLogsPage() {
  const [logs, setLogs] = useState<FinancialLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<FinancialLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedAction, setSelectedAction] = useState("all")
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d'>('30d')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockLogs: FinancialLog[] = [
      {
        id: "LOG-001",
        timestamp: "2025-06-13T14:30:00Z",
        type: "income",
        action: "create",
        amount: 89.50,
        description: "Nueva venta online - Pedido #ORD-1234",
        category: "Ventas",
        reference: "ORD-1234",
        userId: "USER-001",
        userName: "Sistema",
        metadata: {
          orderId: "ORD-1234",
          customerId: "CUST-123"
        }
      },
      {
        id: "LOG-002",
        timestamp: "2025-06-13T12:15:00Z",
        type: "expense",
        action: "approve",
        amount: 450.00,
        description: "Aprobado gasto de materiales - Algodón orgánico",
        category: "Materiales",
        reference: "EXP-001",
        userId: "USER-002",
        userName: "Ana García",
        metadata: {
          expenseId: "EXP-001",
          reason: "Material necesario para producción"
        }
      },
      {
        id: "LOG-003",
        timestamp: "2025-06-13T10:45:00Z",
        type: "income",
        action: "update",
        amount: 156.80,
        description: "Actualizada factura - Cambio de importe",
        category: "Ventas",
        reference: "INV-002",
        userId: "USER-003",
        userName: "Carlos López",
        previousAmount: 150.00,
        newAmount: 156.80,
        metadata: {
          invoiceId: "INV-002",
          reason: "Corrección impuestos"
        }
      },
      {
        id: "LOG-004",
        timestamp: "2025-06-13T09:20:00Z",
        type: "refund",
        action: "create",
        amount: -75.00,
        description: "Reembolso procesado - Devolución producto",
        category: "Devoluciones",
        reference: "REF-001",
        userId: "USER-001",
        userName: "Sistema",
        metadata: {
          orderId: "ORD-1120",
          customerId: "CUST-089",
          reason: "Producto defectuoso"
        }
      },
      {
        id: "LOG-005",
        timestamp: "2025-06-12T16:30:00Z",
        type: "expense",
        action: "pay",
        amount: 180.50,
        description: "Pagada factura de servicios - Electricidad",
        category: "Servicios",
        reference: "EXP-002",
        userId: "USER-002",
        userName: "Ana García",
        metadata: {
          expenseId: "EXP-002"
        }
      },
      {
        id: "LOG-006",
        timestamp: "2025-06-12T14:15:00Z",
        type: "transfer",
        action: "create",
        amount: 1000.00,
        description: "Transferencia a cuenta de ahorros",
        category: "Transferencias",
        reference: "TRF-001",
        userId: "USER-004",
        userName: "María Rodríguez",
        metadata: {
          reason: "Reserva emergencia"
        }
      },
      {
        id: "LOG-007",
        timestamp: "2025-06-12T11:45:00Z",
        type: "adjustment",
        action: "create",
        amount: 25.00,
        description: "Ajuste contable - Diferencia inventario",
        category: "Ajustes",
        reference: "ADJ-001",
        userId: "USER-003",
        userName: "Carlos López",
        metadata: {
          reason: "Corrección diferencia stock"
        }
      },
      {
        id: "LOG-008",
        timestamp: "2025-06-11T17:20:00Z",
        type: "income",
        action: "delete",
        amount: 0,
        description: "Eliminada factura duplicada",
        category: "Ventas",
        reference: "INV-005",
        userId: "USER-002",
        userName: "Ana García",
        previousAmount: 120.00,
        metadata: {
          invoiceId: "INV-005",
          reason: "Factura duplicada por error"
        }
      },
      {
        id: "LOG-009",
        timestamp: "2025-06-11T15:10:00Z",
        type: "expense",
        action: "reject",
        amount: 0,
        description: "Rechazado gasto de marketing - Presupuesto excedido",
        category: "Marketing",
        reference: "EXP-010",
        userId: "USER-004",
        userName: "María Rodríguez",
        metadata: {
          expenseId: "EXP-010",
          reason: "Presupuesto mensual excedido"
        }
      },
      {
        id: "LOG-010",
        timestamp: "2025-06-11T13:30:00Z",
        type: "income",
        action: "create",
        amount: 340.25,
        description: "Nueva venta en tienda física",
        category: "Ventas",
        reference: "ORD-1233",
        userId: "USER-001",
        userName: "Sistema",
        metadata: {
          orderId: "ORD-1233",
          customerId: "CUST-234"
        }
      }
    ]
    
    setLogs(mockLogs)
    setFilteredLogs(mockLogs)
    setIsLoading(false)
  }, [])

  // Filtrar logs
  useEffect(() => {
    let filtered = logs.filter(log => {
      const matchesSearch = 
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === "all" || log.type === selectedType
      const matchesAction = selectedAction === "all" || log.action === selectedAction
      
      // Filtro por fecha
      const logDate = new Date(log.timestamp)
      const now = new Date()
      let dateMatch = true
      
      switch (dateRange) {
        case 'today':
          dateMatch = logDate.toDateString() === now.toDateString()
          break
        case '7d':
          dateMatch = (now.getTime() - logDate.getTime()) <= 7 * 24 * 60 * 60 * 1000
          break
        case '30d':
          dateMatch = (now.getTime() - logDate.getTime()) <= 30 * 24 * 60 * 60 * 1000
          break
        case '90d':
          dateMatch = (now.getTime() - logDate.getTime()) <= 90 * 24 * 60 * 60 * 1000
          break
      }
      
      return matchesSearch && matchesType && matchesAction && dateMatch
    })
    
    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    setFilteredLogs(filtered)
  }, [logs, searchTerm, selectedType, selectedAction, dateRange])

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      income: { label: "Ingreso", color: "bg-green-100 text-green-800", icon: Plus },
      expense: { label: "Gasto", color: "bg-red-100 text-red-800", icon: Minus },
      transfer: { label: "Transferencia", color: "bg-blue-100 text-blue-800", icon: RefreshCw },
      adjustment: { label: "Ajuste", color: "bg-yellow-100 text-yellow-800", icon: Edit },
      refund: { label: "Reembolso", color: "bg-purple-100 text-purple-800", icon: ArrowDownRight }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.income
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getActionBadge = (action: string) => {
    const actionConfig = {
      create: { label: "Crear", color: "bg-blue-100 text-blue-800" },
      update: { label: "Actualizar", color: "bg-yellow-100 text-yellow-800" },
      delete: { label: "Eliminar", color: "bg-red-100 text-red-800" },
      approve: { label: "Aprobar", color: "bg-green-100 text-green-800" },
      reject: { label: "Rechazar", color: "bg-red-100 text-red-800" },
      pay: { label: "Pagar", color: "bg-purple-100 text-purple-800" }
    }
    
    const config = actionConfig[action as keyof typeof actionConfig] || actionConfig.create
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDateRangeLabel = (range: string) => {
    const labels = {
      'today': 'Hoy',
      '7d': 'Últimos 7 días',
      '30d': 'Últimos 30 días',
      '90d': 'Últimos 90 días'
    }
    return labels[range as keyof typeof labels]
  }

  const calculateStats = () => {
    const totalIncome = filteredLogs
      .filter(log => log.type === 'income' && log.action !== 'delete')
      .reduce((sum, log) => sum + log.amount, 0)
    
    const totalExpenses = filteredLogs
      .filter(log => log.type === 'expense' && log.action !== 'reject')
      .reduce((sum, log) => sum + log.amount, 0)
    
    const totalRefunds = filteredLogs
      .filter(log => log.type === 'refund')
      .reduce((sum, log) => sum + Math.abs(log.amount), 0)
    
    const totalTransfers = filteredLogs
      .filter(log => log.type === 'transfer')
      .reduce((sum, log) => sum + log.amount, 0)

    return { totalIncome, totalExpenses, totalRefunds, totalTransfers }
  }

  const stats = calculateStats()

  const exportLogs = (format: 'csv' | 'pdf' | 'excel') => {
    toast.success(`Exportando historial en formato ${format.toUpperCase()}`)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Historial Financiero</h1>
            <p className="text-gray-600">Registro completo de todas las operaciones financieras</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportLogs('csv')}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => exportLogs('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={() => exportLogs('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos Registrados</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gastos Registrados</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reembolsos</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRefunds)}</p>
              </div>
              <ArrowDownRight className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transferencias</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalTransfers)}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por descripción, referencia o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="today">Hoy</option>
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Todos los tipos</option>
                <option value="income">Ingresos</option>
                <option value="expense">Gastos</option>
                <option value="transfer">Transferencias</option>
                <option value="adjustment">Ajustes</option>
                <option value="refund">Reembolsos</option>
              </select>
              
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Todas las acciones</option>
                <option value="create">Crear</option>
                <option value="update">Actualizar</option>
                <option value="delete">Eliminar</option>
                <option value="approve">Aprobar</option>
                <option value="reject">Rechazar</option>
                <option value="pay">Pagar</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de logs */}
      <Card>
        <CardHeader>
          <CardTitle>
            Historial de Operaciones ({filteredLogs.length})
            <span className="text-sm text-gray-500 font-normal ml-2">
              - {getDateRangeLabel(dateRange)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando historial...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros</h3>
              <p className="text-gray-600">No se encontraron operaciones que coincidan con los filtros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha/Hora</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Acción</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Descripción</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Referencia</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Importe</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDateTime(log.timestamp)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getTypeBadge(log.type)}
                      </td>
                      <td className="py-3 px-4">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{log.description}</p>
                          <p className="text-sm text-gray-600">{log.category}</p>
                          {log.metadata?.reason && (
                            <p className="text-xs text-gray-500 mt-1">
                              <Info className="w-3 h-3 inline mr-1" />
                              {log.metadata.reason}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{log.reference}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          {log.action === 'update' && log.previousAmount !== undefined ? (
                            <div>
                              <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(log.previousAmount)}
                              </span>
                              <span className="font-semibold block">
                                {formatCurrency(log.newAmount || log.amount)}
                              </span>
                            </div>
                          ) : log.action === 'delete' || log.action === 'reject' ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <span className={`font-semibold ${
                              log.type === 'income' ? 'text-green-600' : 
                              log.type === 'expense' ? 'text-red-600' : 
                              log.type === 'refund' ? 'text-purple-600' : 
                              'text-blue-600'
                            }`}>
                              {log.type === 'refund' && log.amount > 0 ? '-' : ''}
                              {formatCurrency(Math.abs(log.amount))}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{log.userName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline" title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}