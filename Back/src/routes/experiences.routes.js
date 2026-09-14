import { Router } from 'express'
import { experiencesController } from '../controllers/experiences.controller.js'

export const experiencesRouter = Router()
experiencesRouter.get('/', experiencesController.list)
