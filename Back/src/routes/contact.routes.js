// QUÉ HACE: Dirección del formulario de contacto: POST /api/contact
// (pública).
import { Router } from 'express'
import { contactController } from '../controllers/contact.controller.js'

export const contactRouter = Router()
contactRouter.post('/', contactController.create)
