import { apiClient } from '../lib/apiClient.js'

export const technologiesService = {
  getAll: () => apiClient.get('/api/technologies'),
}
