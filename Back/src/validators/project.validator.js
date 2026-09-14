const ALLOWED_CATEGORIES = ['web', 'automatizacion', 'electronica', 'otro']
const URL_FIELDS = ['image_url', 'repository_url', 'live_url']

function isValidUrl(value) {
  try {
    // eslint-disable-next-line no-new
    new URL(value)
    return true
  } catch {
    return false
  }
}

/** Nunca hay que confiar en la validación del cliente: el backend repite
 * (de forma independiente) las mismas reglas que ya sugiere la UI. */
export function validateProjectPayload(body = {}) {
  const errors = {}

  if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
    errors.title = 'El título es obligatorio.'
  } else if (body.title.trim().length > 120) {
    errors.title = 'El título no puede superar los 120 caracteres.'
  }

  if (!body.description || typeof body.description !== 'string' || !body.description.trim()) {
    errors.description = 'La descripción es obligatoria.'
  } else if (body.description.trim().length > 600) {
    errors.description = 'La descripción no puede superar los 600 caracteres.'
  }

  if (body.category && !ALLOWED_CATEGORIES.includes(body.category)) {
    errors.category = `Categoría inválida. Debe ser una de: ${ALLOWED_CATEGORIES.join(', ')}.`
  }

  for (const field of URL_FIELDS) {
    if (body[field] && !isValidUrl(body[field])) {
      errors[field] = 'Debe ser una URL válida.'
    }
  }

  if (body.technology_ids !== undefined && !Array.isArray(body.technology_ids)) {
    errors.technology_ids = 'Debe ser una lista de IDs de tecnologías.'
  }

  return errors
}
