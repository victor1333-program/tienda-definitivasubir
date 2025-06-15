// Utilidades para manejar temas dinámicos

interface ThemeConfig {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    success: string
    warning: string
    error: string
    gray: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
    background: string
    surface: string
    textPrimary: string
    textSecondary: string
    textMuted: string
  }
  typography: {
    fontFamily: {
      sans: string[]
      serif: string[]
      mono: string[]
    }
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
      '5xl': string
      '6xl': string
    }
    fontWeight: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
  borderRadius: {
    none: string
    sm: string
    md: string
    lg: string
    full: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  site: {
    headerStyle: 'simple' | 'centered' | 'mega'
    footerStyle: 'minimal' | 'detailed' | 'newsletter'
    buttonStyle: 'rounded' | 'sharp' | 'pill'
    cardStyle: 'flat' | 'shadow' | 'border'
    animationsEnabled: boolean
    darkModeEnabled: boolean
  }
}

/**
 * Genera variables CSS personalizadas basadas en el tema
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  return `
    :root {
      /* Colores */
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-success: ${theme.colors.success};
      --color-warning: ${theme.colors.warning};
      --color-error: ${theme.colors.error};
      
      /* Grises */
      --color-gray-50: ${theme.colors.gray[50]};
      --color-gray-100: ${theme.colors.gray[100]};
      --color-gray-200: ${theme.colors.gray[200]};
      --color-gray-300: ${theme.colors.gray[300]};
      --color-gray-400: ${theme.colors.gray[400]};
      --color-gray-500: ${theme.colors.gray[500]};
      --color-gray-600: ${theme.colors.gray[600]};
      --color-gray-700: ${theme.colors.gray[700]};
      --color-gray-800: ${theme.colors.gray[800]};
      --color-gray-900: ${theme.colors.gray[900]};
      
      /* Fondos */
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      
      /* Textos */
      --color-text-primary: ${theme.colors.textPrimary};
      --color-text-secondary: ${theme.colors.textSecondary};
      --color-text-muted: ${theme.colors.textMuted};
      
      /* Tipografía */
      --font-sans: ${theme.typography.fontFamily.sans.join(', ')};
      --font-serif: ${theme.typography.fontFamily.serif.join(', ')};
      --font-mono: ${theme.typography.fontFamily.mono.join(', ')};
      
      /* Tamaños de fuente */
      --text-xs: ${theme.typography.fontSize.xs};
      --text-sm: ${theme.typography.fontSize.sm};
      --text-base: ${theme.typography.fontSize.base};
      --text-lg: ${theme.typography.fontSize.lg};
      --text-xl: ${theme.typography.fontSize.xl};
      --text-2xl: ${theme.typography.fontSize['2xl']};
      --text-3xl: ${theme.typography.fontSize['3xl']};
      --text-4xl: ${theme.typography.fontSize['4xl']};
      --text-5xl: ${theme.typography.fontSize['5xl']};
      --text-6xl: ${theme.typography.fontSize['6xl']};
      
      /* Pesos de fuente */
      --font-normal: ${theme.typography.fontWeight.normal};
      --font-medium: ${theme.typography.fontWeight.medium};
      --font-semibold: ${theme.typography.fontWeight.semibold};
      --font-bold: ${theme.typography.fontWeight.bold};
      
      /* Bordes */
      --radius-none: ${theme.borderRadius.none};
      --radius-sm: ${theme.borderRadius.sm};
      --radius-md: ${theme.borderRadius.md};
      --radius-lg: ${theme.borderRadius.lg};
      --radius-full: ${theme.borderRadius.full};
      
      /* Sombras */
      --shadow-sm: ${theme.shadows.sm};
      --shadow-md: ${theme.shadows.md};
      --shadow-lg: ${theme.shadows.lg};
      --shadow-xl: ${theme.shadows.xl};
    }
    
    /* Clases de utilidad para botones */
    .btn-primary {
      background-color: var(--color-primary);
      color: white;
      border-radius: ${
        theme.site.buttonStyle === 'rounded' ? 'var(--radius-lg)' :
        theme.site.buttonStyle === 'sharp' ? 'var(--radius-none)' :
        'var(--radius-full)'
      };
      transition: all 0.2s ease-in-out;
    }
    
    .btn-primary:hover {
      filter: brightness(0.9);
    }
    
    .btn-secondary {
      background-color: var(--color-secondary);
      color: white;
      border-radius: ${
        theme.site.buttonStyle === 'rounded' ? 'var(--radius-lg)' :
        theme.site.buttonStyle === 'sharp' ? 'var(--radius-none)' :
        'var(--radius-full)'
      };
      transition: all 0.2s ease-in-out;
    }
    
    .btn-secondary:hover {
      filter: brightness(0.9);
    }
    
    /* Clases para tarjetas */
    .card {
      background-color: var(--color-background);
      border-radius: var(--radius-lg);
      ${theme.site.cardStyle === 'shadow' ? 'box-shadow: var(--shadow-md);' : ''}
      ${theme.site.cardStyle === 'border' ? 'border: 1px solid var(--color-gray-200);' : ''}
    }
    
    /* Animaciones */
    ${theme.site.animationsEnabled ? `
    * {
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
    }
    
    .hover-scale:hover {
      transform: scale(1.02);
    }
    
    .hover-lift:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    ` : ''}
  `
}

/**
 * Aplica el tema a la página actual
 */
export function applyThemeToPage(theme: ThemeConfig): void {
  // Crear o actualizar el elemento style con las variables del tema
  let styleElement = document.getElementById('dynamic-theme-styles')
  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = 'dynamic-theme-styles'
    document.head.appendChild(styleElement)
  }
  
  styleElement.textContent = generateThemeCSS(theme)
  
  // Actualizar favicon si está definido
  if (theme.logo?.favicon) {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (favicon) {
      favicon.href = theme.logo.favicon
    }
  }
  
  // Actualizar título del documento con el nombre del tema
  if (theme.name) {
    const titleSuffix = ` - ${theme.name}`
    if (!document.title.includes(titleSuffix)) {
      document.title += titleSuffix
    }
  }
}

/**
 * Convierte un color hex a RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Genera variaciones de un color (más claro/oscuro)
 */
export function generateColorVariations(baseColor: string) {
  const rgb = hexToRgb(baseColor)
  if (!rgb) return {}
  
  const variations = {
    50: `rgb(${Math.min(255, rgb.r + 40)}, ${Math.min(255, rgb.g + 40)}, ${Math.min(255, rgb.b + 40)})`,
    100: `rgb(${Math.min(255, rgb.r + 30)}, ${Math.min(255, rgb.g + 30)}, ${Math.min(255, rgb.b + 30)})`,
    200: `rgb(${Math.min(255, rgb.r + 20)}, ${Math.min(255, rgb.g + 20)}, ${Math.min(255, rgb.b + 20)})`,
    300: `rgb(${Math.min(255, rgb.r + 10)}, ${Math.min(255, rgb.g + 10)}, ${Math.min(255, rgb.b + 10)})`,
    400: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    500: baseColor,
    600: `rgb(${Math.max(0, rgb.r - 10)}, ${Math.max(0, rgb.g - 10)}, ${Math.max(0, rgb.b - 10)})`,
    700: `rgb(${Math.max(0, rgb.r - 20)}, ${Math.max(0, rgb.g - 20)}, ${Math.max(0, rgb.b - 20)})`,
    800: `rgb(${Math.max(0, rgb.r - 30)}, ${Math.max(0, rgb.g - 30)}, ${Math.max(0, rgb.b - 30)})`,
    900: `rgb(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)})`
  }
  
  return variations
}

/**
 * Calcula el contraste entre dos colores
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 0
  
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Sugiere un color de texto basado en el fondo
 */
export function getOptimalTextColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, '#ffffff')
  const blackContrast = getContrastRatio(backgroundColor, '#000000')
  
  return whiteContrast > blackContrast ? '#ffffff' : '#000000'
}

/**
 * Genera un tema completo a partir de un color primario
 */
export function generateThemeFromPrimaryColor(primaryColor: string, themeName: string): Partial<ThemeConfig> {
  const primaryRgb = hexToRgb(primaryColor)
  if (!primaryRgb) throw new Error('Color primario inválido')
  
  // Generar color secundario (complementario)
  const secondaryColor = `hsl(${(180 + primaryRgb.r) % 360}, 70%, 20%)`
  
  // Generar colores del sistema
  const colors = {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: primaryColor,
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    background: '#ffffff',
    surface: '#f9fafb',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af'
  }
  
  return {
    name: themeName,
    colors,
    typography: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace']
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem'
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    borderRadius: {
      none: '0px',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
    },
    site: {
      headerStyle: 'centered' as const,
      footerStyle: 'detailed' as const,
      buttonStyle: 'rounded' as const,
      cardStyle: 'shadow' as const,
      animationsEnabled: true,
      darkModeEnabled: false
    }
  }
}