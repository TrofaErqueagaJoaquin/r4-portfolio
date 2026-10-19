// Error con código HTTP asociado: lo lanzan los services y lo traducen
// los controllers a una respuesta (status + mensaje) sin acoplarse a
// cómo Supabase reporta cada error.
export class ServiceError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}
