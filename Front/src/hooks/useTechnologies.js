// QUÉ HACE: Trae la lista de tecnologías desde la API (con estado de carga
// y error).
import { apiClient } from '../lib/apiClient.js'
import { useResourceList } from './useResourceList.js'

const loadTechnologies = () => apiClient.get('/api/technologies')

export function useTechnologies() {
  const { items, status, errorMessage, reload } = useResourceList(loadTechnologies, 'No se pudieron cargar las tecnologías.')
  return { technologies: items, status, error: errorMessage, reload }
}
