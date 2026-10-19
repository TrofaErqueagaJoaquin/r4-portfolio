import { uploadImage } from '../services/storage.service.js'

export const uploadsController = {
  async create(req, res) {
    try {
      const url = await uploadImage(req.body || {})
      res.status(201).json({ url })
    } catch (error) {
      res.status(error.status || 500).json({ message: error.status ? error.message : 'No se pudo subir la imagen.' })
    }
  },
}
