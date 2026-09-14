import { Router } from 'express'
import { projectsRouter } from './projects.routes.js'
import { skillsRouter } from './skills.routes.js'
import { experiencesRouter } from './experiences.routes.js'
import { technologiesRouter } from './technologies.routes.js'
import { contactRouter } from './contact.routes.js'
import { authRouter } from './auth.routes.js'

export const apiRouter = Router()

apiRouter.use('/projects', projectsRouter)
apiRouter.use('/skills', skillsRouter)
apiRouter.use('/experiences', experiencesRouter)
apiRouter.use('/technologies', technologiesRouter)
apiRouter.use('/contact', contactRouter)
apiRouter.use('/auth', authRouter)
