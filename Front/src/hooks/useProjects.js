import { apiClient } from '../lib/apiClient.js'
import { useResourceList } from './useResourceList.js'

const loadProjects = () => apiClient.get('/api/projects')

export function useProjects() {
  const { items, status, errorMessage, reload } = useResourceList(loadProjects, 'No se pudieron cargar los proyectos.')
  return { projects: items, status, error: errorMessage, reload }
}
