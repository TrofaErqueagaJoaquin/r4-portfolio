import { skillsService } from '../services/skills.service.js'
import { env } from '../config/env.js'

export const skillsController = {
  async list(req, res) {
    if (!env.isSupabaseConfigured) {
      return res.status(503).json({ message: 'Supabase no está configurado en el servidor.' })
    }
    try {
      const skills = await skillsService.list()
      res.json(skills)
    } catch (error) {
      res.status(500).json({ message: 'No se pudieron obtener las habilidades.', detail: error.message })
    }
  },
}
