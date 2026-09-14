import { projectsService } from '../services/projects.service.js'
import { validateProjectPayload } from '../validators/project.validator.js'
import { env } from '../config/env.js'

function ensureSupabaseConfigured(res) {
  if (!env.isSupabaseConfigured) {
    res.status(503).json({ message: 'Supabase no está configurado en el servidor (ver .env.example).' })
    return false
  }
  return true
}

function isValidId(id) {
  return /^\d+$/.test(id)
}

export const projectsController = {
  async list(req, res) {
    if (!ensureSupabaseConfigured(res)) return
    try {
      const projects = await projectsService.list()
      res.json(projects)
    } catch (error) {
      res.status(500).json({ message: 'No se pudieron obtener los proyectos.', detail: error.message })
    }
  },

  async create(req, res) {
    if (!ensureSupabaseConfigured(res)) return

    const errors = validateProjectPayload(req.body)
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Revisá los datos del proyecto.', errors })
    }

    try {
      const project = await projectsService.create(req.body)
      res.status(201).json(project)
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message || 'No se pudo crear el proyecto.' })
    }
  },

  async update(req, res) {
    if (!ensureSupabaseConfigured(res)) return
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'ID de proyecto inválido.' })

    const errors = validateProjectPayload(req.body)
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Revisá los datos del proyecto.', errors })
    }

    try {
      const project = await projectsService.update(req.params.id, req.body)
      res.json(project)
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message || 'No se pudo actualizar el proyecto.' })
    }
  },

  async remove(req, res) {
    if (!ensureSupabaseConfigured(res)) return
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'ID de proyecto inválido.' })

    try {
      await projectsService.remove(req.params.id)
      res.status(204).send()
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message || 'No se pudo eliminar el proyecto.' })
    }
  },
}
