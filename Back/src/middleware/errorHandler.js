// Middleware de error "de última instancia": Express lo reconoce por tener
// 4 parámetros. Cubre errores no controlados explícitamente en un
// controlador (los controladores ya manejan sus propios try/catch, pero
// esto evita que un error inesperado tire el proceso o devuelva HTML).
export function errorHandler(err, req, res, next) {
  console.error(err)
  if (res.headersSent) return next(err)
  const status = err.status || 500
  res.status(status).json({ message: status === 500 ? 'Error interno del servidor.' : err.message })
}
