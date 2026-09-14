import { Router } from 'express'
import { technologiesController } from '../controllers/technologies.controller.js'

export const technologiesRouter = Router()
technologiesRouter.get('/', technologiesController.list)
