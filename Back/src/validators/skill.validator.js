// QUÉ HACE: Reglas de una habilidad (nombre, categoría válida, nivel del 1
// al 5) y cómo se guarda en la base.
import { SKILL_CATEGORIES, collect, requiredText } from './common.js'

export function validateSkill(body = {}) {
  const level = Number(body.level)
  return collect([
    ['name', requiredText(body.name, 80, 'El nombre')],
    ['category', SKILL_CATEGORIES.includes(body.category) ? '' : 'Elegí una categoría válida.'],
    ['level', Number.isInteger(level) && level >= 1 && level <= 5 ? '' : 'El nivel debe ser un número del 1 al 5.'],
  ])
}

export function skillToRow(body) {
  return { name: body.name.trim(), category: body.category, level: Number(body.level) }
}
