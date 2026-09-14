import { contactService } from '../services/contact.service.js'
import { validateContactPayload } from '../validators/contact.validator.js'
import { env } from '../config/env.js'

export const contactController = {
  async create(req, res) {
    const errors = validateContactPayload(req.body)
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Revisá los datos del formulario.', errors })
    }

    if (!env.isSupabaseConfigured) {
      return res.status(503).json({ message: 'El servidor todavía no está configurado para guardar mensajes (falta Supabase).' })
    }

    try {
      await contactService.create(req.body)
      res.status(201).json({ message: 'Mensaje enviado correctamente.' })
    } catch (error) {
      res.status(500).json({ message: 'No se pudo guardar el mensaje. Probá de nuevo en unos minutos.', detail: error.message })
    }
  },
}
