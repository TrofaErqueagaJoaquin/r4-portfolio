// QUÉ HACE: Si alguien pide una dirección de la API que no existe,
// responde "Ruta no encontrada" (404).
export function notFound(req, res) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })
}
