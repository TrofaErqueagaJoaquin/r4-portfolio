import { apiClient } from '../lib/apiClient.js'
import { useResourceList } from './useResourceList.js'

const loadSkills = () => apiClient.get('/api/skills')

export function useSkills() {
  const { items, status, errorMessage, reload } = useResourceList(loadSkills, 'No se pudieron cargar las habilidades.')
  return { skills: items, status, error: errorMessage, reload }
}
