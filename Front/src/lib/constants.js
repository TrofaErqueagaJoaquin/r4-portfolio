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
