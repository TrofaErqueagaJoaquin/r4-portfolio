// QUÉ HACE: Recibe los mensajes del formulario de contacto: los valida y,
// si están bien, los guarda (y avisa por mail).
import { contactService } from '../services/contact.service.js'
import { validateContactPayload } from '../validators/contact.validator.js'

export const contactController = {
  async create(req, res) {
    const errors = validateContactPayload(req.body)
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Revisá los datos del formulario.', errors })
    }

    try {
      await contactService.create(req.body)
      res.status(201).json({ message: 'Mensaje enviado correctamente.' })
    } catch (error) {
      res.status(500).json({ message: 'No se pudo guardar el mensaje. Probá de nuevo en unos minutos.', detail: error.message })
    }
  },
}
