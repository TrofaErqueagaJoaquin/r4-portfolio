// QUÉ HACE: Junta todas las direcciones de la API bajo /api (ej.
// /api/projects, /api/skills, /api/auth).
import { Router } from 'express'
import { requireSupabase } from '../middleware/requireSupabase.js'
import { projectsRouter } from './projects.routes.js'
import { skillsRouter } from './skills.routes.js'
import { experiencesRouter } from './experiences.routes.js'
import { technologiesRouter } from './technologies.routes.js'
import { contactRouter } from './contact.routes.js'
import { messagesRouter } from './messages.routes.js'
import { uploadsRouter } from './uploads.routes.js'
import { authRouter } from './auth.routes.js'

export const apiRouter = Router()

// Todas las rutas de la API necesitan Supabase; si falta, 503 de una.
apiRouter.use(requireSupabase)

apiRouter.use('/projects', projectsRouter)
apiRouter.use('/skills', skillsRouter)
apiRouter.use('/experiences', experiencesRouter)
apiRouter.use('/technologies', technologiesRouter)
apiRouter.use('/contact', contactRouter)
apiRouter.use('/messages', messagesRouter)
apiRouter.use('/uploads', uploadsRouter)
apiRouter.use('/auth', authRouter)
