import { env } from '../config/env.js'

/** Corta con 503 cualquier ruta de la API si faltan las credenciales de
 * Supabase, en vez de repetir ese chequeo en cada controlador. */
export function requireSupabase(req, res, next) {
  if (!env.isSupabaseConfigured) {
    return res.status(503).json({ message: 'Supabase no está configurado en el servidor (ver .env.example).' })
  }
  next()
}
