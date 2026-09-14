import { supabase } from '../config/supabaseClient.js'

/**
 * Protege las rutas de escritura del CRUD de proyectos. Exige un header
 * "Authorization: Bearer <token>" con un access token válido de Supabase
 * Auth (el mismo que devuelve POST /api/auth/login).
 *
 * No hay "roles" separados: cualquier usuario que pueda iniciar sesión en
 * Supabase Auth es, por diseño, el administrador del portfolio. Por eso
 * la alta pública de usuarios queda deshabilitada en el proyecto de
 * Supabase (Authentication > Settings) y el único usuario se crea a mano
 * desde el dashboard — ver database/README.md.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Falta autenticación.' })
  }

  if (!supabase) {
    return res.status(503).json({ message: 'Supabase no está configurado en el servidor.' })
  }

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) {
    return res.status(401).json({ message: 'Sesión inválida o expirada. Volvé a iniciar sesión.' })
  }

  req.user = data.user
  next()
}
