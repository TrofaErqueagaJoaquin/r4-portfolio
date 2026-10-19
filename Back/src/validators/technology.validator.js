// QUÉ HACE: Reglas de una tecnología (nombre obligatorio) y cómo se guarda
// (con su slug generado solo).
import { collect, requiredText } from './common.js'
import { slugify } from '../utils/slugify.js'

export function validateTechnology(body = {}) {
  return collect([['name', requiredText(body.name, 50, 'El nombre')]])
}

export function technologyToRow(body) {
  return { name: body.name.trim(), slug: slugify(body.name) }
}
