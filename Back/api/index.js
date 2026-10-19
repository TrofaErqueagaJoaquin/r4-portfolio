// Punto de entrada para Vercel Serverless Functions. vercel.json reenvía
// TODAS las rutas /api/... (de cualquier profundidad: /api/skills,
// /api/auth/login, /api/skills/7) a esta única función, y Express decide
// qué controlador atiende cada una (ver src/app.js). Vercel invoca el
// export default como handler(req, res), y una app de Express es,
// precisamente, una función (req, res) => void.
import { app } from '../src/app.js'

export default app
