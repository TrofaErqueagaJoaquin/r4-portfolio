// QUÉ HACE: Trae la lista de experiencia desde la API (con estado de carga
// y error).
import { apiClient } from '../lib/apiClient.js'
import { useResourceList } from './useResourceList.js'

const loadExperiences = () => apiClient.get('/api/experiences')

export function useExperiences() {
  const { items, status, errorMessage, reload } = useResourceList(loadExperiences, 'No se pudo cargar la experiencia.')
  return { experiences: items, status, error: errorMessage, reload }
}
