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
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  RefreshCw
} from "lucide-react"

interface Quote {
  id: string
  number: string
  customerId: string
  customerName: string
  customerEmail: string
  issueDate: string
  expiryDate: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted'
  subtotal: number
  tax: number
  total: number
  items: QuoteItem[]
  notes?: string
  validityDays: number
}

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false)

  // Mock data
  useEffect(() => {
    const mockQuotes: Quote[] = [
      {
        id: "QUO-001",
        number: "PRES-2025-001",
        customerId: "CUST-001",
        customerName: "Empresa ABC S.L.",
        customerEmail: "contacto@empresaabc.com",
        issueDate: "2025-06-10",
        expiryDate: "2025-06-25",
        status: "sent",
        subtotal: 450.00,
        tax: 94.50,
        total: 544.50,
        validityDays: 15,
        items: [
          {
            id: "ITEM-001",
            description: "Lote 50 camisetas corporativas con logo",
            quantity: 50,
            unitPrice: 9.00,
            total: 450.00
          }
        ],
        notes: "Incluye diseño personalizado y configuración inicial"
      },
      {
        id: "QUO-002", 
        number: "PRES-2025-002",
        customerId: "CUST-002",
        customerName: "María Rodríguez",
        customerEmail: "maria.rodriguez@email.com",
        issueDate: "2025-06-08",
        expiryDate: "2025-06-23",
        status: "accepted",
        subtotal: 125.00,
        tax: 26.25,
        total: 151.25,
        validityDays: 15,
        items: [
          {
            id: "ITEM-002",
            description: "Sudadera personalizada - Diseño premium",
            quantity: 3,
            unitPrice: 35.00,
            total: 105.00
          },
          {
            id: "ITEM-003",
            description: "Servicio diseño gráfico",
            quantity: 1,
            unitPrice: 20.00,
            total: 20.00
          }
        ]
      },
      {
        id: "QUO-003",
        number: "PRES-2025-003",
        customerId: "CUST-003",
        customerName: "Carlos Gómez",
        customerEmail: "carlos@ejemplo.com",
        issueDate: "2025-05-25",
        expiryDate: "2025-06-09",
        status: "expired",
        subtotal: 280.00,
        tax: 58.80,
        total: 338.80,
        validityDays: 15,
        items: [
          {
            id: "ITEM-004",
            description: "Pack regalo personalizado",
            quantity: 10,
            unitPrice: 28.00,
            total: 280.00
          }
        ]
      },
      {
        id: "QUO-004",
        number: "PRES-2025-004",
        customerId: "CUST-004",
        customerName: "Ana López",
        customerEmail: "ana.lopez@empresa.com",
        issueDate: "2025-06-12",
        expiryDate: "2025-06-27",
        status: "draft",
        subtotal: 650.00,
        tax: 136.50,
        total: 786.50,
        validityDays: 15,
        items: [
          {
            id: "ITEM-005",
            description: "Uniformes de trabajo personalizados",
            quantity: 25,
            unitPrice: 26.00,
            total: 650.00
          }
        ],
        notes: "Pendiente confirmación de tallas y colores"
      },
      {
        id: "QUO-005",
        number: "PRES-2025-005",
        customerId: "CUST-005", 
        customerName: "Tech Solutions",
        customerEmail: "info@techsolutions.com",
        issueDate: "2025-06-05",
        expiryDate: "2025-06-20",
        status: "converted",
        subtotal: 890.00,
        tax: 186.90,
        total: 1076.90,
        validityDays: 15,
        items: [
          {
            id: "ITEM-006",
            description: "Material promocional evento - Pack completo",
            quantity: 1,
            unitPrice: 890.00,
            total: 890.00
          }
        ]
      }
    ]
    
    setQuotes(mockQuotes)
    setFilteredQuotes(mockQuotes)
    setIsLoading(false)
  }, [])

  // Filtrar presupuestos
  useEffect(() => {
    let filtered = quotes.filter(quote => {
      const matchesSearch = 
        quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === "all" || quote.status === selectedStatus
      
      return matchesSearch && matchesStatus
    })
    
    setFilteredQuotes(filtered)
  }, [quotes, searchTerm, selectedStatus])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Borrador", color: "bg-gray-100 text-gray-800", icon: Edit },
      sent: { label: "Enviado", color: "bg-blue-100 text-blue-800", icon: Send },
      accepted: { label: "Aceptado", color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { label: "Rechazado", color: "bg-red-100 text-red-800", icon: XCircle },
      expired: { label: "Expirado", color: "bg-orange-100 text-orange-800", icon: Clock },
      converted: { label: "Convertido", color: "bg-purple-100 text-purple-800", icon: RefreshCw }
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
    const total = quotes.length
    const sent = quotes.filter(q => q.status === 'sent').length
    const accepted = quotes.filter(q => q.status === 'accepted').length
    const converted = quotes.filter(q => q.status === 'converted').length
    const expired = quotes.filter(q => q.status === 'expired').length
    const totalAmount = quotes.reduce((sum, q) => sum + q.total, 0)
    const acceptedAmount = quotes.filter(q => q.status === 'accepted' || q.status === 'converted').reduce((sum, q) => sum + q.total, 0)
    
    return { total, sent, accepted, converted, expired, totalAmount, acceptedAmount }
  }

  const stats = calculateStats()

  const handleSendQuote = (quoteId: string) => {
    setQuotes(quotes.map(quote => 
      quote.id === quoteId ? { ...quote, status: 'sent' as const } : quote
    ))
    toast.success("Presupuesto enviado correctamente")
  }

  const handleAcceptQuote = (quoteId: string) => {
    setQuotes(quotes.map(quote => 
      quote.id === quoteId ? { ...quote, status: 'accepted' as const } : quote
    ))
    toast.success("Presupuesto marcado como aceptado")
  }

  const handleConvertToInvoice = (quoteId: string) => {
    setQuotes(quotes.map(quote => 
      quote.id === quoteId ? { ...quote, status: 'converted' as const } : quote
    ))
    toast.success("Presupuesto convertido a factura")
  }

  const handleDuplicateQuote = (quoteId: string) => {
    const originalQuote = quotes.find(q => q.id === quoteId)
    if (originalQuote) {
      const newQuote = {
        ...originalQuote,
        id: `QUO-${Date.now()}`,
        number: `PRES-2025-${String(quotes.length + 1).padStart(3, '0')}`,
        status: 'draft' as const,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
      setQuotes([...quotes, newQuote])
      toast.success("Presupuesto duplicado")
    }
  }

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays > 0
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Presupuestos</h1>
            <p className="text-gray-600">Administra y controla todos los presupuestos</p>
          </div>
          <Button 
            onClick={() => setShowNewQuoteModal(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Presupuesto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
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
                <p className="text-sm text-gray-600">Enviados</p>
                <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aceptados</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Convertidos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.converted}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expirados</p>
                <p className="text-2xl font-bold text-orange-600">{stats.expired}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
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
                <p className="text-sm text-gray-600">Valor Total Presupuestado</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Aceptado/Convertido</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.acceptedAmount)}</p>
                <p className="text-sm text-gray-500">
                  Tasa conversión: {stats.total > 0 ? ((stats.accepted + stats.converted) / stats.total * 100).toFixed(1) : 0}%
                </p>
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
                <option value="sent">Enviados</option>
                <option value="accepted">Aceptados</option>
                <option value="rejected">Rechazados</option>
                <option value="expired">Expirados</option>
                <option value="converted">Convertidos</option>
              </select>
              
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de presupuestos */}
      <Card>
        <CardHeader>
          <CardTitle>Presupuestos ({filteredQuotes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando presupuestos...</p>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay presupuestos</h3>
              <p className="text-gray-600">No se encontraron presupuestos que coincidan con los filtros.</p>
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
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm font-medium">{quote.number}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{quote.customerName}</p>
                          <p className="text-sm text-gray-600">{quote.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">{formatDate(quote.issueDate)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{formatDate(quote.expiryDate)}</span>
                          {isExpiringSoon(quote.expiryDate) && quote.status === 'sent' && (
                            <AlertTriangle className="w-4 h-4 text-orange-500" title="Expira pronto" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(quote.status)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold">{formatCurrency(quote.total)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" title="Ver detalles">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Editar">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Duplicar">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Descargar PDF">
                            <Download className="w-4 h-4" />
                          </Button>
                          {quote.status === 'draft' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendQuote(quote.id)}
                              title="Enviar presupuesto"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          {quote.status === 'sent' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAcceptQuote(quote.id)}
                              title="Marcar como aceptado"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {quote.status === 'accepted' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleConvertToInvoice(quote.id)}
                              title="Convertir a factura"
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <RefreshCw className="w-4 h-4" />
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