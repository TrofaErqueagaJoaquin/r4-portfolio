// Validaciones puras (sin dependencias de React) para el formulario de
// contacto. Se reutilizan desde useContactForm y son fáciles de probar
// de forma aislada. El backend repite estas reglas de forma independiente
// porque nunca hay que confiar en la validación del cliente por seguridad.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateName(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Ingresá tu nombre.'
  if (trimmed.length < 2) return 'El nombre es demasiado corto.'
  if (trimmed.length > 80) return 'El nombre es demasiado largo.'
  return ''
}

export function validateEmail(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Ingresá tu email.'
  if (!EMAIL_REGEX.test(trimmed)) return 'Ingresá un email válido.'
  return ''
}

export function validateMessage(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Escribí un mensaje.'
  if (trimmed.length < 10) return 'Contame un poco más (mínimo 10 caracteres).'
  if (trimmed.length > 2000) return 'El mensaje es demasiado largo (máximo 2000 caracteres).'
  return ''
}

export function validateContactForm(values) {
  return {
    name: validateName(values.name),
    email: validateEmail(values.email),
    message: validateMessage(values.message),
  }
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean)
}
