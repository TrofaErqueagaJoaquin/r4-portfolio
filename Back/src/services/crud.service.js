import { supabase } from '../config/supabaseClient.js'
import { ServiceError } from '../utils/ServiceError.js'

// Código de Postgres para violación de restricción UNIQUE (ej. dos
// tecnologías con el mismo nombre).
const UNIQUE_VIOLATION = '23505'

function toServiceError(error, fallbackStatus) {
  if (error.code === UNIQUE_VIOLATION) return new ServiceError('Ya existe un registro con ese nombre.', 409)
  return new ServiceError(error.message, fallbackStatus)
}

/**
 * ABML genérico para tablas "simples" (sin relaciones muchos a muchos):
 * habilidades, experiencia, tecnologías y mensajes. Proyectos tiene su
 * propio service porque además sincroniza la tabla puente con tecnologías.
 * `order` es una lista de [columna, ascendente] aplicada en el listado.
 */
export function createCrudService({ table, order = [] }) {
  return {
    async list() {
      let query = supabase.from(table).select('*')
      for (const [column, ascending] of order) query = query.order(column, { ascending })
      const { data, error } = await query
      if (error) throw toServiceError(error, 500)
      return data
    },

    async create(fields) {
      const { data, error } = await supabase.from(table).insert(fields).select().single()
      if (error) throw toServiceError(error, 400)
      return data
    },

    async update(id, fields) {
      const { data, error } = await supabase.from(table).update(fields).eq('id', id).select().maybeSingle()
      if (error) throw toServiceError(error, 400)
      if (!data) throw new ServiceError('Registro no encontrado.', 404)
      return data
    },

    async remove(id) {
      const { data, error } = await supabase.from(table).delete().eq('id', id).select('id').maybeSingle()
      if (error) throw toServiceError(error, 400)
      if (!data) throw new ServiceError('Registro no encontrado.', 404)
    },
  }
}
