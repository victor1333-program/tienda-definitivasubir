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
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Send,
  Calendar,
  DollarSign,
  User,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from "lucide-react"

interface Invoice {
  id: string
  number: string
  customerId: string
  customerName: string
  customerEmail: string
  issueDate: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  subtotal: number
  tax: number
  total: number
  items: InvoiceItem[]
  notes?: string
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false)

  // Mock data
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: "INV-001",
        number: "FAC-2025-001",
        customerId: "CUST-001",
        customerName: "María García",
        customerEmail: "maria@ejemplo.com",
        issueDate: "2025-06-01",
        dueDate: "2025-06-15",
        status: "paid",
        subtotal: 85.00,
        tax: 17.85,
        total: 102.85,
        items: [
          {
            id: "ITEM-001",
            description: "Camiseta personalizada - Diseño A",
            quantity: 2,
            unitPrice: 25.00,
            total: 50.00
          },
          {
            id: "ITEM-002", 
            description: "Taza personalizada",
            quantity: 1,
            unitPrice: 35.00,
            total: 35.00
          }
        ],
        notes: "Entrega urgente solicitada"
      },
      {
        id: "INV-002",
        number: "FAC-2025-002",
        customerId: "CUST-002",
        customerName: "Carlos López",
        customerEmail: "carlos@ejemplo.com",
        issueDate: "2025-06-05",
        dueDate: "2025-06-19",
        status: "sent",
        subtotal: 120.00,
        tax: 25.20,
        total: 145.20,
        items: [
          {
            id: "ITEM-003",
            description: "Sudadera personalizada - Talla L",
            quantity: 3,
            unitPrice: 40.00,
            total: 120.00
          }
        ]
      },
      {
        id: "INV-003",
        number: "FAC-2025-003",
        customerId: "CUST-003",
        customerName: "Ana Martínez",
        customerEmail: "ana@ejemplo.com",
        issueDate: "2025-05-28",
        dueDate: "2025-06-11",
        status: "overdue",
        subtotal: 75.00,
        tax: 15.75,
        total: 90.75,
        items: [
          {
            id: "ITEM-004",
            description: "Gorra personalizada",
            quantity: 5,
            unitPrice: 15.00,
            total: 75.00
          }
        ]
      },
      {
        id: "INV-004",
        number: "FAC-2025-004",
        customerId: "CUST-004",
        customerName: "David Ruiz",
        customerEmail: "david@ejemplo.com",
        issueDate: "2025-06-10",
        dueDate: "2025-06-24",
        status: "draft",
        subtotal: 200.00,
        tax: 42.00,
        total: 242.00,
        items: [
          {
            id: "ITEM-005",
            description: "Pack promocional - 10 camisetas",
            quantity: 1,
            unitPrice: 200.00,
            total: 200.00
          }
        ]
      }
    ]
    
    setInvoices(mockInvoices)
    setFilteredInvoices(mockInvoices)
    setIsLoading(false)
  }, [])

  // Filtrar facturas
  useEffect(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = 
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === "all" || invoice.status === selectedStatus
      
      return matchesSearch && matchesStatus
    })
    
    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, selectedStatus])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Borrador", color: "bg-gray-100 text-gray-800", icon: Edit },
      sent: { label: "Enviada", color: "bg-blue-100 text-blue-800", icon: Send },
      paid: { label: "Pagada", color: "bg-green-100 text-green-800", icon: CheckCircle },
      overdue: { label: "Vencida", color: "bg-red-100 text-red-800", icon: AlertCircle },
      cancelled: { label: "Cancelada", color: "bg-orange-100 text-orange-800", icon: XCircle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const calculateStats = () => {
    const total = invoices.length
    const paid = invoices.filter(inv => inv.status === 'paid').length
    const pending = invoices.filter(inv => inv.status === 'sent').length
    const overdue = invoices.filter(inv => inv.status === 'overdue').length
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0)
    const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0)
    
    return { total, paid, pending, overdue, totalAmount, paidAmount }
  }

  const stats = calculateStats()

  const handleSendInvoice = (invoiceId: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'sent' as const } : inv
    ))
    toast.success("Factura enviada correctamente")
  }

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'paid' as const } : inv
    ))
    toast.success("Factura marcada como pagada")
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Facturas</h1>
            <p className="text-gray-600">Administra y controla todas las facturas</p>
          </div>
          <Button 
            onClick={() => setShowNewInvoiceModal(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Facturas</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencidas</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Importe Total Facturado</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Importe Cobrado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
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
                  placeholder="Buscar por número, cliente o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Todos los estados</option>
                <option value="draft">Borrador</option>
                <option value="sent">Enviadas</option>
                <option value="paid">Pagadas</option>
                <option value="overdue">Vencidas</option>
                <option value="cancelled">Canceladas</option>
              </select>
              
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de facturas */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando facturas...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay facturas</h3>
              <p className="text-gray-600">No se encontraron facturas que coincidan con los filtros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Número</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha Emisión</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Vencimiento</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Importe</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm font-medium">{invoice.number}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.customerName}</p>
                          <p className="text-sm text-gray-600">{invoice.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">{formatDate(invoice.issueDate)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">{formatDate(invoice.dueDate)}</span>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold">{formatCurrency(invoice.total)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" title="Ver detalles">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Editar">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Descargar PDF">
                            <Download className="w-4 h-4" />
                          </Button>
                          {invoice.status === 'draft' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendInvoice(invoice.id)}
                              title="Enviar factura"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          {invoice.status === 'sent' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMarkAsPaid(invoice.id)}
                              title="Marcar como pagada"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
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