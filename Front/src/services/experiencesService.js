import { apiClient } from '../lib/apiClient.js'

export const experiencesService = {
  getAll: () => apiClient.get('/api/experiences'),
}
