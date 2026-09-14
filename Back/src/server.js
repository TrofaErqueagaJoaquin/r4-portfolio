import { app } from './app.js'
import { env } from './config/env.js'

// Entrada SOLO para desarrollo local (`npm run dev` / `npm start`). En
// Vercel no se usa: la función serverless en api/[...path].js importa
// `app` directamente y Vercel se encarga de escuchar peticiones.
app.listen(env.port, () => {
  console.log(`API escuchando en http://localhost:${env.port}`)
  if (!env.isSupabaseConfigured) {
    console.warn('⚠️  Supabase no configurado: los endpoints que dependen de la base van a responder 503 hasta completar Back/.env')
  }
})
