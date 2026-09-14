import { Router } from 'express'
import { projectsController } from '../controllers/projects.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const projectsRouter = Router()

// Lectura pública (la landing la usa sin sesión). Escritura protegida:
// solo un admin autenticado puede crear/editar/eliminar (ver requireAuth).
projectsRouter.get('/', projectsController.list)
projectsRouter.post('/', requireAuth, projectsController.create)
projectsRouter.put('/:id', requireAuth, projectsController.update)
projectsRouter.delete('/:id', requireAuth, projectsController.remove)
