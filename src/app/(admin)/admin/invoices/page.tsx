"use client"

import { useState, useEffect } from "react"
import { Eye, Download, Mail, Plus, Search, FileText } from "lucide-react"

interface Invoice {
  id: string
  invoiceNumber: string
  status: string
  totalAmount: number
  issueDate: string
  dueDate: string
  paidDate?: string
  customerName: string
  customerEmail: string
  order: {
    orderNumber: string
    id: string
  }
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  SENT: "bg-blue-100 text-blue-800", 
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  DRAFT: "bg-gray-100 text-gray-600"
}

const statusLabels = {
  PENDING: "Pendiente",
  SENT: "Enviada", 
  PAID: "Pagada",
  OVERDUE: "Vencida",
  CANCELLED: "Cancelada",
  DRAFT: "Borrador"
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20"
      })
      
      if (statusFilter) params.append("status", statusFilter)
      
      const response = await fetch(`/api/invoices?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setInvoices(data.invoices)
        setTotalPages(data.pagination.pages)
      } else {
        console.error("Error fetching invoices:", data.error)
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [page, statusFilter])

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const handleUpdateStatus = async (invoiceId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        fetchInvoices() // Refrescar lista
      }
    } catch (error) {
      console.error("Error updating invoice status:", error)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturas</h1>
          <p className="text-gray-600 mt-1">Gestión de facturas automáticas del sistema</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Nueva Factura Manual
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Facturas</div>
          <div className="text-2xl font-bold">{invoices.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-sm font-medium text-gray-600 mb-2">Pendientes</div>
          <div className="text-2xl font-bold text-yellow-600">
            {invoices.filter(i => i.status === 'PENDING').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-sm font-medium text-gray-600 mb-2">Pagadas</div>
          <div className="text-2xl font-bold text-green-600">
            {invoices.filter(i => i.status === 'PAID').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-sm font-medium text-gray-600 mb-2">Importe Total</div>
          <div className="text-2xl font-bold">
            {formatCurrency(invoices.reduce((sum, inv) => sum + inv.totalAmount, 0))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por número, cliente, email o pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="SENT">Enviada</option>
            <option value="PAID">Pagada</option>
            <option value="OVERDUE">Vencida</option>
            <option value="CANCELLED">Cancelada</option>
            <option value="DRAFT">Borrador</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Lista de Facturas</h3>
          </div>
          <p className="text-gray-600">
            {filteredInvoices.length} factura{filteredInvoices.length !== 1 ? 's' : ''} encontrada{filteredInvoices.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Número</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Pedido</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Cliente</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Fecha Emisión</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Vencimiento</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Importe</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Estado</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      {invoice.order.orderNumber}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{invoice.customerName}</div>
                      <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {new Date(invoice.issueDate).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-4 px-6">
                    {new Date(invoice.dueDate).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status as keyof typeof statusColors]}`}>
                        {statusLabels[invoice.status as keyof typeof statusLabels]}
                      </span>
                      <select
                        value={invoice.status}
                        onChange={(e) => handleUpdateStatus(invoice.id, e.target.value)}
                        className="block w-full text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="PENDING">Pendiente</option>
                        <option value="SENT">Enviada</option>
                        <option value="PAID">Pagada</option>
                        <option value="OVERDUE">Vencida</option>
                        <option value="CANCELLED">Cancelada</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-center gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Anterior
              </button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Página {page} de {totalPages}
              </span>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}