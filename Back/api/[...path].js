// Punto de entrada para Vercel Serverless Functions. El nombre de archivo
// [...path].js es una ruta "catch-all": Vercel enruta cualquier pedido a
// /api/* hacia esta función. La app de Express ya sabe resolver esas
// rutas (ver src/app.js), así que solo hace falta reexportarla: Vercel
// invoca el export default como handler(req, res), y una app de Express
// es, precisamente, una función (req, res) => void.
import { app } from '../src/app.js'

export default app
