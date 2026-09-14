/** Convierte un título en un slug URL-safe: "Mi Proyecto Genial" -> "mi-proyecto-genial". */
export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/\p{Mark}/gu, '') // saca acentos: normalize('NFD') separa la letra del diacritico, y \p{Mark} borra el diacritico
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
