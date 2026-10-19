import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { apiRouter } from './routes/index.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

// CORS con lista blanca (en vez de origin: '*'): en producción el
// frontend y el backend son dos proyectos de Vercel distintos, así que
// hace falta permitir explícitamente el dominio del frontend. Las
// peticiones sin header Origin (curl, health checks) se permiten porque
// no representan un navegador de terceros.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientOrigins.includes(origin)) return callback(null, true)
      callback(new Error('Origen no permitido por CORS.'))
    },
  }),
)
// 5 MB: alcanza para una imagen de hasta 3 MB codificada en base64 (POST /api/uploads).
app.use(express.json({ limit: '5mb' }))

app.get('/', (req, res) => {
  res.json({ name: 'R4 Portfolio API', status: 'ok' })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    supabaseConfigured: env.isSupabaseConfigured,
    emailConfigured: env.isEmailConfigured,
  })
})

app.use('/api', apiRouter)

app.use(notFound)
app.use(errorHandler)
