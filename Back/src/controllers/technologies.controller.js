import { technologiesService } from '../services/technologies.service.js'
import { env } from '../config/env.js'

export const technologiesController = {
  async list(req, res) {
    if (!env.isSupabaseConfigured) {
      return res.status(503).json({ message: 'Supabase no está configurado en el servidor.' })
    }
    try {
      const technologies = await technologiesService.list()
      res.json(technologies)
    } catch (error) {
      res.status(500).json({ message: 'No se pudieron obtener las tecnologías.', detail: error.message })
    }
  },
}
