import { createClient } from '@supabase/supabase-js'
import { env } from './env.js'

/**
 * Cliente único del backend hacia Supabase, usando la Service Role Key.
 * Esa key ignora Row Level Security, así que TODA la validación de datos
 * y de autenticación pasa por este servidor antes de tocar la base — el
 * frontend nunca habla con Supabase directamente (ver docs/base-de-datos.md).
 * Si faltan las variables de entorno queda en null: los controladores lo
 * chequean y responden 503 en vez de tirar abajo el proceso.
 */
export const supabase = env.isSupabaseConfigured
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null
