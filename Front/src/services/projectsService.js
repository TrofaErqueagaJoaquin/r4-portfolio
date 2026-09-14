import { apiClient } from '../lib/apiClient.js'

export const projectsService = {
  getAll: () => apiClient.get('/api/projects'),
  create: (payload, token) => apiClient.post('/api/projects', payload, { token }),
  update: (id, payload, token) => apiClient.put(`/api/projects/${id}`, payload, { token }),
  remove: (id, token) => apiClient.delete(`/api/projects/${id}`, { token }),
}
