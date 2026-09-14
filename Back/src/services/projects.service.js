import { supabase } from '../config/supabaseClient.js'
import { slugify } from '../utils/slugify.js'

export class ServiceError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// select anidado: PostgREST resuelve la relación proyectos ->
// project_technologies -> technologies en una sola consulta gracias a
// las claves foráneas definidas en el esquema (ver database/schema.sql).
const PROJECT_SELECT = '*, project_technologies(technologies(id, name, slug))'

function mapProject(row) {
  if (!row) return null
  const { project_technologies, ...project } = row
  return {
    ...project,
    technologies: (project_technologies || []).map((relation) => relation.technologies).filter(Boolean),
  }
}

async function uniqueSlug(title) {
  const base = slugify(title) || 'proyecto'
  for (let attempt = 1; attempt <= 50; attempt += 1) {
    const candidate = attempt === 1 ? base : `${base}-${attempt}`
    const { data } = await supabase.from('projects').select('id').eq('slug', candidate).maybeSingle()
    if (!data) return candidate
  }
  return `${base}-${Date.now()}`
}

async function syncTechnologies(projectId, technologyIds) {
  const { error: deleteError } = await supabase.from('project_technologies').delete().eq('project_id', projectId)
  if (deleteError) throw new ServiceError(deleteError.message, 400)

  if (!technologyIds || technologyIds.length === 0) return

  const rows = technologyIds.map((technologyId) => ({ project_id: projectId, technology_id: technologyId }))
  const { error: insertError } = await supabase.from('project_technologies').insert(rows)
  if (insertError) throw new ServiceError(insertError.message, 400)
}

export const projectsService = {
  async list() {
    const { data, error } = await supabase
      .from('projects')
      .select(PROJECT_SELECT)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw new ServiceError(error.message, 500)
    return data.map(mapProject)
  },

  async getById(id) {
    const { data, error } = await supabase.from('projects').select(PROJECT_SELECT).eq('id', id).single()
    if (error) throw new ServiceError('Proyecto no encontrado.', 404)
    return mapProject(data)
  },

  async create(payload) {
    const { technology_ids: technologyIds, ...fields } = payload
    const slug = await uniqueSlug(payload.title)

    const { data, error } = await supabase
      .from('projects')
      .insert({ ...fields, slug, featured: Boolean(payload.featured) })
      .select('id')
      .single()

    if (error) throw new ServiceError(error.message, 400)

    await syncTechnologies(data.id, technologyIds)
    return this.getById(data.id)
  },

  async update(id, payload) {
    const { technology_ids: technologyIds, ...fields } = payload

    const { data, error } = await supabase
      .from('projects')
      .update({ ...fields, featured: Boolean(payload.featured) })
      .eq('id', id)
      .select('id')
      .single()

    if (error || !data) throw new ServiceError('Proyecto no encontrado.', 404)

    await syncTechnologies(id, technologyIds)
    return this.getById(id)
  },

  async remove(id) {
    const { data, error } = await supabase.from('projects').delete().eq('id', id).select('id').single()
    if (error || !data) throw new ServiceError('Proyecto no encontrado.', 404)
  },
}
