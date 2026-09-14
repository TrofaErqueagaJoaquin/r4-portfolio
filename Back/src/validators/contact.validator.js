const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactPayload(body = {}) {
  const errors = {}

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.name = 'El nombre es obligatorio (mínimo 2 caracteres).'
  } else if (body.name.trim().length > 80) {
    errors.name = 'El nombre no puede superar los 80 caracteres.'
  }

  if (!body.email || typeof body.email !== 'string' || !EMAIL_REGEX.test(body.email.trim())) {
    errors.email = 'Ingresá un email válido.'
  }

  if (!body.message || typeof body.message !== 'string' || body.message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres.'
  } else if (body.message.trim().length > 2000) {
    errors.message = 'El mensaje no puede superar los 2000 caracteres.'
  }

  return errors
}
