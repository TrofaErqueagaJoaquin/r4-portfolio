// Constantes compartidas por toda la app. Centralizarlas acá evita
// "magic strings" repetidos entre componentes.

export const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'objetivos', label: 'Objetivos' },
  { id: 'contacto', label: 'Contacto' },
]

export const THEME_STORAGE_KEY = 'portfolio-theme'
export const AUTH_TOKEN_KEY = 'portfolio-admin-token'

export const PROJECT_CATEGORIES = [
  { value: 'web', label: 'Desarrollo web' },
  { value: 'automatizacion', label: 'Automatización' },
  { value: 'electronica', label: 'Electrónica' },
  { value: 'otro', label: 'Otro' },
]

// Mismos valores que los CHECK de database/schema.sql y los validadores
// del backend (Back/src/validators/common.js).
export const SKILL_CATEGORIES = [
  { value: 'desarrollo-web', label: 'Desarrollo web' },
  { value: 'bases-de-datos', label: 'Bases de datos' },
  { value: 'redes', label: 'Redes informáticas' },
  { value: 'electronica', label: 'Electrónica y robótica' },
  { value: 'mantenimiento', label: 'Mantenimiento informático' },
  { value: 'herramientas', label: 'Herramientas' },
  { value: 'blandas', label: 'Habilidades personales' },
]

export const EXPERIENCE_TYPES = [
  { value: 'educacion', label: 'Educación' },
  { value: 'trabajo', label: 'Trabajo' },
  { value: 'proyecto', label: 'Proyecto' },
]

export const MESSAGE_STATUSES = [
  { value: 'new', label: 'Nuevo' },
  { value: 'read', label: 'Leído' },
  { value: 'archived', label: 'Archivado' },
]

export function labelFor(options, value) {
  return options.find((option) => option.value === value)?.label || value
}
