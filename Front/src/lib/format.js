// Formateo de fechas para Experiencia. Se usa getUTCMonth/getUTCFullYear
// (no getMonth/getFullYear) porque las fechas llegan como 'YYYY-MM-DD':
// parseadas como UTC medianoche, leerlas en hora local podría mostrar el
// mes anterior en husos horarios negativos.
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function formatMonthYear(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function formatDateRange(start, end) {
  return `${formatMonthYear(start)} – ${end ? formatMonthYear(end) : 'Presente'}`
}
