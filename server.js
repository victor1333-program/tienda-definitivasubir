const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || 3000

// Configurar Next.js con standalone
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parsear la URL
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      // Manejar solicitudes de archivos estáticos
      if (pathname.startsWith('/_next/static/')) {
        // Los archivos estáticos de Next.js se sirven automáticamente
        await handle(req, res, parsedUrl)
        return
      }

      // Manejar solicitudes de API y páginas
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error handling request:', err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })
  .once('error', (err) => {
    console.error('Server error:', err)
    process.exit(1)
  })
  .listen(port, () => {
    console.log(`🚀 Next.js server ready on http://${hostname}:${port}`)
    console.log(`📦 Environment: ${process.env.NODE_ENV}`)
    console.log(`🎯 Ready for production deployment`)
  })
})

// Manejar señales de cierre limpio
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  process.exit(0)
})