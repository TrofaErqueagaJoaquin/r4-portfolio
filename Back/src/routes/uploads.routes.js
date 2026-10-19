// QUÉ HACE: Dirección para subir imágenes: POST /api/uploads (solo con
// sesión).
import { Router } from 'express'
import { uploadsController } from '../controllers/uploads.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const uploadsRouter = Router()
uploadsRouter.post('/', requireAuth, uploadsController.create)
