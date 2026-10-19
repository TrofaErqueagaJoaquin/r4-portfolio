import { Router } from 'express'
import { technologiesController } from '../controllers/resources.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const technologiesRouter = Router()

technologiesRouter.get('/', technologiesController.list)
technologiesRouter.post('/', requireAuth, technologiesController.create)
technologiesRouter.put('/:id', requireAuth, technologiesController.update)
technologiesRouter.delete('/:id', requireAuth, technologiesController.remove)
