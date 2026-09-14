import { createClient } from '@supabase/supabase-js'
import WebSocket from 'ws'
import { env } from './env.js'

/**
 * Cliente único del backend hacia Supabase, usando la Service Role Key.
 * Esa key ignora Row Level Security, así que TODA la validación de datos
 * y de autenticación pasa por este servidor antes de tocar la base — el
 * frontend nunca habla con Supabase directamente (ver docs/base-de-datos.md).
 * Si faltan las variables de entorno queda en null: los controladores lo
 * chequean y responden 503 en vez de tirar abajo el proceso.
 *
 * `realtime.transport`: este proyecto no usa Supabase Realtime (no hay
 * suscripciones en vivo), pero createClient() igual intenta inicializar
 * ese cliente internamente y, en Node < 22, revienta al arrancar porque
 * no existe el WebSocket nativo global. Pasarle la implementación de la
 * librería `ws` evita ese chequeo sin necesitar Node 22.
 */
export const supabase = env.isSupabaseConfigured
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: WebSocket },
    })
  : null
