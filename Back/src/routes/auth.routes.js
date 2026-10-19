// QUÉ HACE: Dirección del login: POST /api/auth/login.
import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'

export const authRouter = Router()
authRouter.post('/login', authController.login)
