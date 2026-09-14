import { apiClient } from '../lib/apiClient.js'

export const skillsService = {
  getAll: () => apiClient.get('/api/skills'),
}
