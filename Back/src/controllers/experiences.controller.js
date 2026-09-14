import { experiencesService } from '../services/experiences.service.js'
import { env } from '../config/env.js'

export const experiencesController = {
  async list(req, res) {
    if (!env.isSupabaseConfigured) {
      return res.status(503).json({ message: 'Supabase no está configurado en el servidor.' })
    }
    try {
      const experiences = await experiencesService.list()
      res.json(experiences)
    } catch (error) {
      res.status(500).json({ message: 'No se pudo obtener la experiencia.', detail: error.message })
    }
  },
}
