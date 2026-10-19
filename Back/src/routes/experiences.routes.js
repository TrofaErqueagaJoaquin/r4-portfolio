// QUÉ HACE: Direcciones de experiencia: ver es público; crear, editar y
// borrar piden sesión (requireAuth).
import { Router } from 'express'
import { experiencesController } from '../controllers/resources.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const experiencesRouter = Router()

experiencesRouter.get('/', experiencesController.list)
experiencesRouter.post('/', requireAuth, experiencesController.create)
experiencesRouter.put('/:id', requireAuth, experiencesController.update)
experiencesRouter.delete('/:id', requireAuth, experiencesController.remove)
