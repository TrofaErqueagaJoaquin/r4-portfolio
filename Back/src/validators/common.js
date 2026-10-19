// Reglas chicas reutilizadas por los validadores de cada recurso.
// Las listas de valores permitidos son las mismas que los CHECK del
// esquema SQL (database/schema.sql): la base es la última barrera, el
// backend la primera, para devolver mensajes claros.

export const SKILL_CATEGORIES = ['desarrollo-web', 'bases-de-datos', 'redes', 'electronica', 'mantenimiento', 'herramientas', 'blandas']
export const EXPERIENCE_TYPES = ['trabajo', 'educacion', 'proyecto']
export const MESSAGE_STATUSES = ['new', 'read', 'archived']

export function requiredText(value, maxLength, label) {
  if (typeof value !== 'string' || !value.trim()) return `${label} es obligatorio.`
  if (value.trim().length > maxLength) return `${label} no puede superar los ${maxLength} caracteres.`
  return ''
}

export function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
}

export function collect(entries) {
  return Object.fromEntries(entries.filter(([, message]) => message))
}
