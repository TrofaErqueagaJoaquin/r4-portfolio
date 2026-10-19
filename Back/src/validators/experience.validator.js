import { EXPERIENCE_TYPES, collect, isIsoDate, requiredText } from './common.js'

export function validateExperience(body = {}) {
  const hasEnd = Boolean(body.end_date)
  let endError = ''
  if (hasEnd && !isIsoDate(body.end_date)) endError = 'Fecha de fin inválida.'
  else if (hasEnd && isIsoDate(body.start_date) && body.end_date < body.start_date) endError = 'La fecha de fin no puede ser anterior al inicio.'

  return collect([
    ['title', requiredText(body.title, 120, 'El título')],
    ['organization', requiredText(body.organization, 120, 'La organización')],
    ['description', requiredText(body.description, 1000, 'La descripción')],
    ['start_date', isIsoDate(body.start_date) ? '' : 'Ingresá una fecha de inicio válida.'],
    ['end_date', endError],
    ['type', EXPERIENCE_TYPES.includes(body.type) ? '' : 'Elegí un tipo válido.'],
  ])
}

export function experienceToRow(body) {
  return {
    title: body.title.trim(),
    organization: body.organization.trim(),
    description: body.description.trim(),
    start_date: body.start_date,
    // Sin fecha de fin = "Presente" en la línea de tiempo.
    end_date: body.end_date || null,
    type: body.type,
  }
}
