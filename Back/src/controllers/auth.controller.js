import { authService } from '../services/auth.service.js'
import { env } from '../config/env.js'

export const authController = {
  async login(req, res) {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios.' })
    }

    if (!env.isSupabaseConfigured) {
      return res.status(503).json({ message: 'Supabase no está configurado en el servidor.' })
    }

    try {
      const result = await authService.login(email, password)
      res.json(result)
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message || 'No se pudo iniciar sesión.' })
    }
  },
}
