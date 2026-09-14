import { useCallback, useEffect, useState } from 'react'
import { projectsService } from '../services/projectsService.js'

/**
 * Estado de carga/éxito/error de la lista de proyectos, obtenida desde el
 * backend (que a su vez la lee de Supabase). Se usa tanto en la sección
 * pública de Proyectos como en el panel de administración: en ambos casos
 * hace falta la misma lista y la posibilidad de refrescarla (`reload`,
 * por ejemplo después de crear/editar/eliminar un proyecto).
 */
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      const data = await projectsService.getAll()
      setProjects(data)
      setStatus('success')
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los proyectos.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { projects, status, error, reload: load }
}
