import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// ================================
// ESQUEMAS DE VALIDACIÓN BASE
// ================================

export const emailSchema = z
  .string()
  .email('Email inválido')
  .min(5, 'Email muy corto')
  .max(255, 'Email muy largo')
  .transform(email => email.toLowerCase().trim())

export const phoneSchema = z
  .string()
  .regex(/^[+]?[0-9\s\-()]{9,20}$/, 'Teléfono inválido')
  .transform(phone => phone.replace(/\s/g, ''))

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(128, 'La contraseña es demasiado larga')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe tener al menos una mayúscula, una minúscula y un número')

export const nameSchema = z
  .string()
  .min(2, 'Nombre muy corto')
  .max(100, 'Nombre muy largo')
  .regex(/^[a-zA-ZÀ-ÿ\s\-'\.]+$/, 'Nombre contiene caracteres inválidos')
  .transform(name => name.trim())

export const addressSchema = z
  .string()
  .min(5, 'Dirección muy corta')
  .max(255, 'Dirección muy larga')
  .transform(addr => addr.trim())

export const postalCodeSchema = z
  .string()
  .regex(/^[0-9]{5}$/, 'Código postal debe tener 5 dígitos')

export const priceSchema = z
  .number()
  .positive('El precio debe ser positivo')
  .max(999999.99, 'Precio demasiado alto')
  .refine(val => Number.isFinite(val), 'Precio inválido')

export const quantitySchema = z
  .number()
  .int('La cantidad debe ser un número entero')
  .positive('La cantidad debe ser positiva')
  .max(1000, 'Cantidad máxima: 1000')

// ================================
// ESQUEMAS PARA ENTIDADES
// ================================

export const userRegistrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Contraseña requerida')
})

export const customerInfoSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  dni: z.string().regex(/^[0-9]{8}[A-Z]$/, 'DNI inválido').optional(),
  isCompany: z.boolean().default(false),
  companyName: z.string().max(255).optional(),
  companyVat: z.string().regex(/^[A-Z][0-9]{8}$/, 'CIF inválido').optional()
}).refine(data => {
  if (data.isCompany) {
    return data.companyName && data.companyVat
  }
  return true
}, {
  message: 'Datos de empresa requeridos',
  path: ['companyName']
})

export const addressInfoSchema = z.object({
  address: addressSchema,
  city: nameSchema,
  postalCode: postalCodeSchema,
  province: nameSchema,
  country: z.string().default('España'),
  notes: z.string().max(500).optional()
})

export const productSchema = z.object({
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(255).regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  description: z.string().max(2000).optional(),
  basePrice: priceSchema,
  comparePrice: priceSchema.optional(),
  costPrice: priceSchema.optional(),
  materialType: z.string().max(100).optional(),
  featured: z.boolean().default(false),
  canCustomize: z.boolean().default(true),
  customizationPrice: priceSchema.default(0)
})

export const orderItemSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  quantity: quantitySchema,
  unitPrice: priceSchema,
  customizationData: z.any().optional()
})

export const orderSchema = z.object({
  customerInfo: customerInfoSchema,
  shippingAddress: addressInfoSchema.optional(),
  billingAddress: addressInfoSchema.optional(),
  shippingMethod: z.enum(['pickup', 'standard', 'express']),
  paymentMethod: z.enum(['card', 'transfer', 'paypal', 'cash']),
  items: z.array(orderItemSchema).min(1, 'Pedido vacío'),
  specialInstructions: z.string().max(1000).optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Debes aceptar los términos'),
  acceptPrivacy: z.boolean().refine(val => val === true, 'Debes aceptar la política de privacidad')
})

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(5).max(255),
  message: z.string().min(10).max(2000),
  orderType: z.string().max(100).optional()
})

// ================================
// FUNCIONES DE SANITIZACIÓN
// ================================

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p'],
    ALLOWED_ATTR: []
  })
}

export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/\s+/g, ' ') // Normalizar espacios
    .replace(/[<>\"'&]/g, '') // Remover caracteres peligrosos
    .slice(0, 1000) // Limitar longitud
}

export function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      )
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

// ================================
// VALIDADORES ESPECÍFICOS
// ================================

export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Archivo demasiado grande (máximo 5MB)' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de archivo no permitido' }
  }
  
  return { valid: true }
}

export function validateCreditCard(cardNumber: string): { valid: boolean; type?: string } {
  // Remover espacios y guiones
  const cleaned = cardNumber.replace(/[\s-]/g, '')
  
  // Verificar que solo contenga números
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false }
  }
  
  // Algoritmo de Luhn
  let sum = 0
  let alternate = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let n = parseInt(cleaned.charAt(i), 10)
    
    if (alternate) {
      n *= 2
      if (n > 9) {
        n = (n % 10) + 1
      }
    }
    
    sum += n
    alternate = !alternate
  }
  
  const valid = sum % 10 === 0
  
  // Detectar tipo de tarjeta
  let type = 'unknown'
  if (cleaned.startsWith('4')) type = 'visa'
  else if (cleaned.startsWith('5') || cleaned.startsWith('2')) type = 'mastercard'
  else if (cleaned.startsWith('3')) type = 'amex'
  
  return { valid, type }
}

export function validateSpanishDNI(dni: string): boolean {
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE'
  const regex = /^[0-9]{8}[A-Z]$/
  
  if (!regex.test(dni)) return false
  
  const numbers = dni.slice(0, 8)
  const letter = dni.charAt(8)
  const expectedLetter = letters[parseInt(numbers, 10) % 23]
  
  return letter === expectedLetter
}

export function validateSpanishCIF(cif: string): boolean {
  const regex = /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/
  return regex.test(cif)
}

// ================================
// MIDDLEWARE DE VALIDACIÓN
// ================================

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (body: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
    try {
      const sanitized = typeof body === 'object' && body !== null 
        ? sanitizeObject(body as Record<string, unknown>)
        : body
      
      const data = schema.parse(sanitized)
      return { success: true, data }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        return { success: false, errors }
      }
      return { success: false, errors: ['Error de validación desconocido'] }
    }
  }
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (query: Record<string, string | string[]>): { success: true; data: T } | { success: false; errors: string[] } => {
    try {
      const data = schema.parse(query)
      return { success: true, data }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        return { success: false, errors }
      }
      return { success: false, errors: ['Error de validación de query'] }
    }
  }
}