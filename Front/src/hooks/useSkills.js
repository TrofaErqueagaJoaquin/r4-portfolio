// QUÉ HACE: Trae la lista de habilidades desde la API (con estado de carga
// y error).
import { apiClient } from '../lib/apiClient.js'
import { useResourceList } from './useResourceList.js'

const loadSkills = () => apiClient.get('/api/skills')

export function useSkills() {
  const { items, status, errorMessage, reload } = useResourceList(loadSkills, 'No se pudieron cargar las habilidades.')
  return { skills: items, status, error: errorMessage, reload }
}
