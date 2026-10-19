import { Router } from 'express'
import { messagesController } from '../controllers/resources.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'

// Todo el router es privado: los mensajes tienen datos personales de
// quienes escriben. Se crean desde POST /api/contact (público).
export const messagesRouter = Router()

messagesRouter.use(requireAuth)
messagesRouter.get('/', messagesController.list)
messagesRouter.patch('/:id', messagesController.update)
messagesRouter.delete('/:id', messagesController.remove)
