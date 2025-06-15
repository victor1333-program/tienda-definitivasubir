'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  Upload, 
  Search, 
  Grid3X3, 
  List, 
  X, 
  Download,
  Heart,
  Eye,
  Filter,
  Folder,
  Image as ImageIcon
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ImageItem {
  id: string
  url: string
  filename: string
  size: number
  category: string
  tags: string[]
  isStock: boolean
  isFavorite: boolean
  uploadedAt: string
  dimensions: {
    width: number
    height: number
  }
}

interface ImageLibraryProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (image: ImageItem) => void
  allowUpload?: boolean
}

const stockImages: ImageItem[] = [
  {
    id: 'stock-1',
    url: '/images/stock/logo-placeholder.png',
    filename: 'logo-placeholder.png',
    size: 15432,
    category: 'logos',
    tags: ['logo', 'empresa', 'corporativo'],
    isStock: true,
    isFavorite: false,
    uploadedAt: '2024-01-01',
    dimensions: { width: 300, height: 200 }
  },
  {
    id: 'stock-2',
    url: '/images/stock/pattern-dots.png',
    filename: 'pattern-dots.png',
    size: 8765,
    category: 'patterns',
    tags: ['patrón', 'puntos', 'decorativo'],
    isStock: true,
    isFavorite: false,
    uploadedAt: '2024-01-01',
    dimensions: { width: 400, height: 400 }
  },
  {
    id: 'stock-3',
    url: '/images/stock/arrow-right.png',
    filename: 'arrow-right.png',
    size: 3456,
    category: 'icons',
    tags: ['flecha', 'icono', 'dirección'],
    isStock: true,
    isFavorite: false,
    uploadedAt: '2024-01-01',
    dimensions: { width: 100, height: 50 }
  },
  {
    id: 'stock-4',
    url: '/images/stock/star-icon.png',
    filename: 'star-icon.png',
    size: 4567,
    category: 'icons',
    tags: ['estrella', 'icono', 'favorito'],
    isStock: true,
    isFavorite: false,
    uploadedAt: '2024-01-01',
    dimensions: { width: 80, height: 80 }
  },
  {
    id: 'stock-5',
    url: '/images/stock/heart-icon.png',
    filename: 'heart-icon.png',
    size: 3890,
    category: 'icons',
    tags: ['corazón', 'amor', 'like'],
    isStock: true,
    isFavorite: false,
    uploadedAt: '2024-01-01',
    dimensions: { width: 80, height: 80 }
  },
  {
    id: 'stock-6',
    url: '/images/stock/geometric-triangle.png',
    filename: 'geometric-triangle.png',
    size: 5432,
    category: 'shapes',
    tags: ['triángulo', 'geométrico', 'moderno'],
    isStock: true,
    isFavorite: false,
    uploadedAt: '2024-01-01',
    dimensions: { width: 150, height: 150 }
  },
  {
    id: 'stock-7',
    url: '/images/stock/celebration-badge.png',
    filename: 'celebration-badge.png',
    size: 12345,
    category: 'badges',
    tags: ['celebración', 'insignia', 'premio'],
    isStock: true,
    isFavorite: false,
    uploadedAt: '2024-01-01',
    dimensions: { width: 200, height: 200 }
  },
  {
    id: 'stock-8',
    url: '/images/stock/nature-leaf.png',
    filename: 'nature-leaf.png',
    size: 7890,
    category: 'nature',
    tags: ['hoja', 'naturaleza', 'eco'],
    isStock: true,
    isFavorite: false,
    uploadedAt: '2024-01-01',
    dimensions: { width: 120, height: 180 }
  }
]

export default function ImageLibrary({ 
  isOpen, 
  onClose, 
  onSelectImage, 
  allowUpload = true 
}: ImageLibraryProps) {
  const [images, setImages] = useState<ImageItem[]>(stockImages)
  const [filteredImages, setFilteredImages] = useState<ImageItem[]>(stockImages)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const categories = [
    { id: 'all', name: 'Todas', count: images.length },
    { id: 'logos', name: 'Logos', count: images.filter(img => img.category === 'logos').length },
    { id: 'icons', name: 'Iconos', count: images.filter(img => img.category === 'icons').length },
    { id: 'patterns', name: 'Patrones', count: images.filter(img => img.category === 'patterns').length },
    { id: 'shapes', name: 'Formas', count: images.filter(img => img.category === 'shapes').length },
    { id: 'badges', name: 'Insignias', count: images.filter(img => img.category === 'badges').length },
    { id: 'nature', name: 'Naturaleza', count: images.filter(img => img.category === 'nature').length },
  ]

  const filterImages = () => {
    let filtered = images

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredImages(filtered)
  }

  const handleUpload = async (files: FileList) => {
    if (!files.length) return

    setIsUploading(true)
    
    try {
      for (const file of Array.from(files)) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} no es una imagen válida`)
          continue
        }

        // Validar tamaño (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} es demasiado grande (máximo 5MB)`)
          continue
        }

        // Crear preview local
        const url = URL.createObjectURL(file)
        const img = new Image()
        
        await new Promise((resolve) => {
          img.onload = resolve
          img.src = url
        })

        const newImage: ImageItem = {
          id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url,
          filename: file.name,
          size: file.size,
          category: 'uploads',
          tags: ['usuario', 'subido'],
          isStock: false,
          isFavorite: false,
          uploadedAt: new Date().toISOString(),
          dimensions: {
            width: img.naturalWidth,
            height: img.naturalHeight
          }
        }

        // En producción, aquí subirías a Cloudinary o similar
        // const uploadResponse = await uploadToCloudinary(file)
        // newImage.url = uploadResponse.secure_url

        setImages(prev => [newImage, ...prev])
        toast.success(`${file.name} subido correctamente`)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Error al subir imágenes')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files)
    }
  }

  const toggleFavorite = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img
    ))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Aplicar filtros cuando cambien
  useState(() => {
    filterImages()
  }, [searchTerm, selectedCategory, images])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold">Biblioteca de Imágenes</h2>
              <p className="text-sm text-gray-600">
                Selecciona una imagen o sube tus propias imágenes
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {allowUpload && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Subiendo...' : 'Subir Imagen'}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar imágenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categorías</h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      {category.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Vista</h3>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {filteredImages.length} imagen{filteredImages.length !== 1 ? 'es' : ''} encontrada{filteredImages.length !== 1 ? 's' : ''}
                </span>
                {searchTerm && (
                  <Badge variant="secondary">
                    Filtro: "{searchTerm}"
                  </Badge>
                )}
              </div>
            </div>

            {/* Images Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredImages.map(image => (
                  <Card 
                    key={image.id} 
                    className="group cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onSelectImage(image)}
                  >
                    <div className="relative">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="w-full h-32 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/placeholder-image.jpg'
                        }}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-white/90"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(image.id)
                          }}
                        >
                          <Heart 
                            className={`w-4 h-4 ${image.isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                          />
                        </Button>
                      </div>
                      {image.isStock && (
                        <Badge className="absolute bottom-2 left-2 bg-green-600">
                          Stock
                        </Badge>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{image.filename}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>{image.dimensions.width}×{image.dimensions.height}</span>
                        <span>{formatFileSize(image.size)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredImages.map(image => (
                  <Card 
                    key={image.id}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onSelectImage(image)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/placeholder-image.jpg'
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{image.filename}</h4>
                          {image.isStock && (
                            <Badge className="bg-green-600">Stock</Badge>
                          )}
                          {image.isFavorite && (
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{image.dimensions.width} × {image.dimensions.height} px</span>
                          <span>{formatFileSize(image.size)}</span>
                          <span>Categoría: {image.category}</span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {image.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron imágenes
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 
                    `No hay imágenes que coincidan con "${searchTerm}"` :
                    'No hay imágenes en esta categoría'
                  }
                </p>
                {allowUpload && (
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir primera imagen
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}