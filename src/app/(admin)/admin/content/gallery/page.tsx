"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { 
  Upload, Search, Filter, Grid3X3, List, 
  Image as ImageIcon, Video, FileText, Music,
  Edit2, Trash2, Download, Copy, Eye, Move,
  FolderPlus, Folder, ArrowUp, MoreHorizontal,
  CheckSquare, Square, RefreshCw, Settings
} from "lucide-react"
import { toast } from "react-hot-toast"

interface MediaFile {
  id: string
  name: string
  originalName: string
  url: string
  type: 'image' | 'video' | 'document' | 'audio'
  size: number
  width?: number
  height?: number
  duration?: number
  mimeType: string
  folder: string
  tags: string[]
  alt?: string
  description?: string
  uploadedAt: string
  isPublic: boolean
}

interface MediaFolder {
  id: string
  name: string
  path: string
  parentId?: string
  fileCount: number
  createdAt: string
}

export default function GalleryPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([
    {
      id: '1',
      name: 'Productos',
      path: '/productos',
      fileCount: 24,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Banners',
      path: '/banners',
      fileCount: 8,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Testimonios',
      path: '/testimonios',
      fileCount: 12,
      createdAt: '2024-01-20'
    }
  ])
  
  const [currentFolder, setCurrentFolder] = useState<string>('/')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Simular archivos para demostración
  const sampleFiles: MediaFile[] = [
    {
      id: '1',
      name: 'banner-hero.jpg',
      originalName: 'banner-hero.jpg',
      url: '/uploads/banners/banner-hero.jpg',
      type: 'image',
      size: 2048576,
      width: 1920,
      height: 1080,
      mimeType: 'image/jpeg',
      folder: '/banners',
      tags: ['banner', 'hero', 'principal'],
      alt: 'Banner principal de la página',
      description: 'Banner hero para la página principal',
      uploadedAt: '2024-01-15T10:30:00Z',
      isPublic: true
    },
    {
      id: '2',
      name: 'producto-camiseta.jpg',
      originalName: 'camiseta-blanca-premium.jpg',
      url: '/uploads/productos/producto-camiseta.jpg',
      type: 'image',
      size: 1048576,
      width: 800,
      height: 800,
      mimeType: 'image/jpeg',
      folder: '/productos',
      tags: ['producto', 'camiseta', 'blanco'],
      alt: 'Camiseta blanca premium',
      description: 'Imagen principal de la camiseta blanca premium',
      uploadedAt: '2024-01-16T14:20:00Z',
      isPublic: true
    }
  ]

  // Funciones de utilidad
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string, mimeType: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'audio': return <Music className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-green-100 text-green-800'
      case 'video': return 'bg-blue-100 text-blue-800'
      case 'audio': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Manejo de subida de archivos
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', currentFolder)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(progress)
          }
        } as any)

        if (response.ok) {
          const data = await response.json()
          // Actualizar lista de archivos
          toast.success(`${file.name} subido correctamente`)
        } else {
          throw new Error(`Error subiendo ${file.name}`)
        }

        setUploadProgress(((i + 1) / files.length) * 100)
      }

      // Recargar archivos
      loadFiles()
    } catch (error) {
      console.error('Error uploading files:', error)
      toast.error('Error al subir archivos')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Manejo de drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [currentFolder])

  // Cargar archivos
  const loadFiles = async () => {
    try {
      const response = await fetch(`/api/media?folder=${currentFolder}`)
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || sampleFiles)
      }
    } catch (error) {
      console.error('Error loading files:', error)
      setFiles(sampleFiles) // Usar archivos de muestra
    }
  }

  // Crear carpeta
  const createFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('El nombre de la carpeta es obligatorio')
      return
    }

    try {
      const response = await fetch('/api/media/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName,
          parentPath: currentFolder
        })
      })

      if (response.ok) {
        toast.success('Carpeta creada correctamente')
        setNewFolderName('')
        setIsCreatingFolder(false)
        // Recargar carpetas
      } else {
        throw new Error('Error creando carpeta')
      }
    } catch (error) {
      console.error('Error creating folder:', error)
      toast.error('Error al crear la carpeta')
    }
  }

  // Selección de archivos
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const selectAllFiles = () => {
    const allFileIds = filteredFiles.map(file => file.id)
    setSelectedFiles(selectedFiles.length === filteredFiles.length ? [] : allFileIds)
  }

  // Eliminar archivos seleccionados
  const deleteSelectedFiles = async () => {
    if (selectedFiles.length === 0) return
    
    if (!confirm(`¿Estás seguro de eliminar ${selectedFiles.length} archivo(s)?`)) return

    try {
      const response = await fetch('/api/media/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds: selectedFiles })
      })

      if (response.ok) {
        toast.success(`${selectedFiles.length} archivo(s) eliminado(s)`)
        setSelectedFiles([])
        loadFiles()
      } else {
        throw new Error('Error eliminando archivos')
      }
    } catch (error) {
      console.error('Error deleting files:', error)
      toast.error('Error al eliminar archivos')
    }
  }

  // Filtrar archivos
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === 'all' || file.type === typeFilter
    const matchesFolder = currentFolder === '/' || file.folder === currentFolder
    
    return matchesSearch && matchesType && matchesFolder
  })

  // Copiar URL al portapapeles
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copiada al portapapeles')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🖼️ Galería Multimedia</h1>
          <p className="text-gray-600 mt-1">
            Gestiona todos los archivos multimedia de tu sitio web
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsCreatingFolder(true)}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Nueva Carpeta
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Subir Archivos
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Archivos</p>
                <p className="text-2xl font-bold text-gray-900">{files.length}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Imágenes</p>
                <p className="text-2xl font-bold text-green-600">
                  {files.filter(f => f.type === 'image').length}
                </p>
              </div>
              <ImageIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Videos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {files.filter(f => f.type === 'video').length}
                </p>
              </div>
              <Video className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Carpetas</p>
                <p className="text-2xl font-bold text-orange-600">{folders.length}</p>
              </div>
              <Folder className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zona de subida */}
      <Card>
        <CardContent>
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Arrastra archivos aquí o haz clic para seleccionar
            </h3>
            <p className="text-gray-600">
              Soporta imágenes, videos, documentos y audio
            </p>
            
            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Subiendo... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(e.target.files)
              }
            }}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Navegación de carpetas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Navegación</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFolder('/')}
              className="h-6 px-2"
            >
              Inicio
            </Button>
            {currentFolder !== '/' && (
              <>
                <span>/</span>
                <span className="font-medium">
                  {currentFolder.split('/').filter(Boolean).join(' / ')}
                </span>
              </>
            )}
          </div>

          {/* Carpetas */}
          {currentFolder === '/' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setCurrentFolder(folder.path)}
                >
                  <Folder className="w-8 h-8 text-orange-500 mb-2" />
                  <span className="text-sm font-medium text-center">
                    {folder.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {folder.fileCount} archivos
                  </span>
                </div>
              ))}
              
              {/* Crear nueva carpeta */}
              {isCreatingFolder && (
                <div className="flex flex-col items-center p-4 border-2 border-dashed border-blue-300 rounded-lg">
                  <FolderPlus className="w-8 h-8 text-blue-500 mb-2" />
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Nombre de carpeta"
                    className="text-sm mb-2"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') createFolder()
                    }}
                  />
                  <div className="flex gap-1">
                    <Button size="sm" onClick={createFolder}>
                      Crear
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsCreatingFolder(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar archivos por nombre o etiquetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">Todos los tipos</option>
              <option value="image">Imágenes</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="document">Documentos</option>
            </select>

            {selectedFiles.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={deleteSelectedFiles}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar ({selectedFiles.length})
                </Button>
              </div>
            )}

            <Button variant="outline" onClick={loadFiles}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de archivos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Archivos ({filteredFiles.length})
              {selectedFiles.length > 0 && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - {selectedFiles.length} seleccionados
                </span>
              )}
            </CardTitle>
            <Button
              variant="outline"
              onClick={selectAllFiles}
              className="text-sm"
            >
              {selectedFiles.length === filteredFiles.length ? (
                <CheckSquare className="w-4 h-4 mr-1" />
              ) : (
                <Square className="w-4 h-4 mr-1" />
              )}
              {selectedFiles.length === filteredFiles.length ? 'Deseleccionar' : 'Seleccionar'} todo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFiles.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`relative group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                      selectedFiles.includes(file.id) ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    {/* Checkbox de selección */}
                    <div className="absolute top-2 left-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFileSelection(file.id)
                        }}
                        className="w-5 h-5 bg-white rounded border-2 border-gray-300 flex items-center justify-center hover:border-orange-500"
                      >
                        {selectedFiles.includes(file.id) && (
                          <CheckSquare className="w-3 h-3 text-orange-500" />
                        )}
                      </button>
                    </div>

                    {/* Tipo de archivo badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className={getFileTypeColor(file.type)}>
                        {getFileIcon(file.type, file.mimeType)}
                        <span className="ml-1 text-xs">{file.type}</span>
                      </Badge>
                    </div>

                    {/* Preview */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.alt || file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">
                          {getFileIcon(file.type, file.mimeType)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h4 className="font-medium text-sm truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      {file.width && file.height && (
                        <p className="text-xs text-gray-500">
                          {file.width} × {file.height}
                        </p>
                      )}
                      
                      {/* Tags */}
                      {file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {file.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {file.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{file.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Acciones (aparecen en hover) */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 bg-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(file.url, '_blank')
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 bg-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(file.url)
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 bg-white"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Vista de lista
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedFiles.includes(file.id) ? 'bg-orange-50 border-orange-200' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleFileSelection(file.id)}
                      className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center hover:border-orange-500"
                    >
                      {selectedFiles.includes(file.id) && (
                        <CheckSquare className="w-3 h-3 text-orange-500" />
                      )}
                    </button>

                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.alt || file.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        getFileIcon(file.type, file.mimeType)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        {file.width && file.height && (
                          <span>{file.width} × {file.height}</span>
                        )}
                        <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getFileTypeColor(file.type)}>
                        {file.type}
                      </Badge>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(file.url)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No hay archivos</h3>
              <p className="text-sm">
                {searchTerm || typeFilter !== 'all' 
                  ? 'No se encontraron archivos con los filtros aplicados'
                  : 'Sube tu primer archivo para empezar'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}