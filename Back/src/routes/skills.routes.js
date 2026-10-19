// QUÉ HACE: Direcciones de habilidades: ver es público; crear, editar y
// borrar piden sesión (requireAuth).
import { Router } from 'express'
import { skillsController } from '../controllers/resources.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const skillsRouter = Router()

skillsRouter.get('/', skillsController.list)
skillsRouter.post('/', requireAuth, skillsController.create)
skillsRouter.put('/:id', requireAuth, skillsController.update)
skillsRouter.delete('/:id', requireAuth, skillsController.remove)
