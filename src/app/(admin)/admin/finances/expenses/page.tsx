"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { toast } from "react-hot-toast"
import { 
  TrendingDown, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Receipt,
  Building,
  Truck,
  Zap,
  Coffee,
  Wifi,
  Package,
  Users,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  vendor: string
  status: 'pending' | 'approved' | 'paid' | 'rejected'
  paymentMethod: string
  receiptUrl?: string
  notes?: string
  tags: string[]
}

interface ExpenseCategory {
  id: string
  name: string
  icon: React.ElementType
  budget: number
  spent: number
  color: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false)

  const [categories] = useState<ExpenseCategory[]>([
    {
      id: "materials",
      name: "Materiales",
      icon: Package,
      budget: 15000,
      spent: 12450,
      color: "blue"
    },
    {
      id: "utilities",
      name: "Servicios",
      icon: Zap,
      budget: 2500,
      spent: 1850,
      color: "yellow"
    },
    {
      id: "shipping",
      name: "Envíos",
      icon: Truck,
      budget: 3000,
      spent: 2340,
      color: "green"
    },
    {
      id: "office",
      name: "Oficina",
      icon: Building,
      budget: 1500,
      spent: 980,
      color: "purple"
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: Users,
      budget: 5000,
      spent: 3200,
      color: "orange"
    },
    {
      id: "other",
      name: "Otros",
      icon: FileText,
      budget: 2000,
      spent: 580,
      color: "gray"
    }
  ])

  // Mock data
  useEffect(() => {
    const mockExpenses: Expense[] = [
      {
        id: "EXP-001",
        description: "Compra de algodón orgánico - Lote 50kg",
        amount: 450.00,
        category: "materials",
        date: "2025-06-12",
        vendor: "Textiles Ecológicos S.L.",
        status: "paid",
        paymentMethod: "Transferencia",
        receiptUrl: "/receipts/exp-001.pdf",
        notes: "Material premium para nueva línea",
        tags: ["algodón", "orgánico", "premium"]
      },
      {
        id: "EXP-002",
        description: "Factura electricidad local comercial",
        amount: 180.50,
        category: "utilities",
        date: "2025-06-10",
        vendor: "Iberdrola",
        status: "pending",
        paymentMethod: "Domiciliación",
        tags: ["electricidad", "local"]
      },
      {
        id: "EXP-003",
        description: "Envíos express - Lote pedidos urgentes",
        amount: 125.80,
        category: "shipping",
        date: "2025-06-11",
        vendor: "Mensajería Express",
        status: "approved",
        paymentMethod: "Tarjeta",
        tags: ["envío", "urgente"]
      },
      {
        id: "EXP-004",
        description: "Licencia software diseño gráfico",
        amount: 89.99,
        category: "office",
        date: "2025-06-09",
        vendor: "Adobe Inc.",
        status: "paid",
        paymentMethod: "Tarjeta",
        tags: ["software", "diseño", "licencia"]
      },
      {
        id: "EXP-005",
        description: "Campaña publicitaria redes sociales",
        amount: 350.00,
        category: "marketing",
        date: "2025-06-08",
        vendor: "Facebook Ads",
        status: "paid",
        paymentMethod: "Tarjeta",
        notes: "Campaña promocional camisetas verano",
        tags: ["publicidad", "redes sociales", "campaña"]
      },
      {
        id: "EXP-006",
        description: "Reparación impresora industrial",
        amount: 220.00,
        category: "office",
        date: "2025-06-07",
        vendor: "TechService Pro",
        status: "approved",
        paymentMethod: "Efectivo",
        tags: ["reparación", "impresora", "mantenimiento"]
      },
      {
        id: "EXP-007",
        description: "Materia prima - Tintas textiles ecológicas",
        amount: 680.75,
        category: "materials",
        date: "2025-06-06",
        vendor: "EcoTintas Solutions",
        status: "paid",
        paymentMethod: "Transferencia",
        receiptUrl: "/receipts/exp-007.pdf",
        tags: ["tintas", "ecológico", "textil"]
      }
    ]
    
    setExpenses(mockExpenses)
    setFilteredExpenses(mockExpenses)
    setIsLoading(false)
  }, [])

  // Filtrar gastos
  useEffect(() => {
    let filtered = expenses.filter(expense => {
      const matchesSearch = 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory
      const matchesStatus = selectedStatus === "all" || expense.status === selectedStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })
    
    setFilteredExpenses(filtered)
  }, [expenses, searchTerm, selectedCategory, selectedStatus])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
      approved: { label: "Aprobado", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      paid: { label: "Pagado", color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { label: "Rechazado", color: "bg-red-100 text-red-800", icon: AlertCircle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[categories.length - 1]
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

  const calculateStats = () => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const pendingExpenses = expenses.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0)
    const paidExpenses = expenses.filter(exp => exp.status === 'paid').reduce((sum, exp) => sum + exp.amount, 0)
    const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)
    
    return { totalExpenses, pendingExpenses, paidExpenses, totalBudget }
  }

  const stats = calculateStats()

  const handleApproveExpense = (expenseId: string) => {
    setExpenses(expenses.map(exp => 
      exp.id === expenseId ? { ...exp, status: 'approved' as const } : exp
    ))
    toast.success("Gasto aprobado")
  }

  const handleMarkAsPaid = (expenseId: string) => {
    setExpenses(expenses.map(exp => 
      exp.id === expenseId ? { ...exp, status: 'paid' as const } : exp
    ))
    toast.success("Gasto marcado como pagado")
  }

  const handleRejectExpense = (expenseId: string) => {
    setExpenses(expenses.map(exp => 
      exp.id === expenseId ? { ...exp, status: 'rejected' as const } : exp
    ))
    toast.success("Gasto rechazado")
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Gastos</h1>
            <p className="text-gray-600">Controla y administra todos los gastos de la empresa</p>
          </div>
          <Button 
            onClick={() => setShowNewExpenseModal(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Gasto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Gastos</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</p>
                <p className="text-xs text-gray-500">
                  {((stats.totalExpenses / stats.totalBudget) * 100).toFixed(1)}% del presupuesto
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendingExpenses)}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagados</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidExpenses)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Presupuesto Total</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalBudget)}</p>
                <p className="text-xs text-gray-500">
                  Disponible: {formatCurrency(stats.totalBudget - stats.totalExpenses)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Presupuesto por categorías */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Presupuesto por Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const percentage = (category.spent / category.budget) * 100
              const isOverBudget = percentage > 100
              
              return (
                <div key={category.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 bg-${category.color}-100 rounded-full`}>
                      <category.icon className={`w-5 h-5 text-${category.color}-600`} />
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        isOverBudget ? 'bg-red-500' : `bg-${category.color}-500`
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${
                    isOverBudget ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {percentage.toFixed(1)}% usado
                    {isOverBudget && " (Excedido)"}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por descripción, proveedor o etiquetas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="paid">Pagado</option>
                <option value="rejected">Rechazado</option>
              </select>
              
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de gastos */}
      <Card>
        <CardHeader>
          <CardTitle>Gastos ({filteredExpenses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando gastos...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay gastos</h3>
              <p className="text-gray-600">No se encontraron gastos que coincidan con los filtros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Descripción</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Categoría</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Proveedor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Importe</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => {
                    const categoryInfo = getCategoryInfo(expense.category)
                    const CategoryIcon = categoryInfo.icon
                    
                    return (
                      <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{expense.description}</p>
                            {expense.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {expense.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <CategoryIcon className={`w-4 h-4 text-${categoryInfo.color}-600`} />
                            <span className="text-sm">{categoryInfo.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{expense.vendor}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{formatDate(expense.date)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(expense.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" title="Ver detalles">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Editar">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {expense.receiptUrl && (
                              <Button size="sm" variant="outline" title="Ver recibo">
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            {expense.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleApproveExpense(expense.id)}
                                  title="Aprobar gasto"
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleRejectExpense(expense.id)}
                                  title="Rechazar gasto"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {expense.status === 'approved' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleMarkAsPaid(expense.id)}
                                title="Marcar como pagado"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <DollarSign className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}