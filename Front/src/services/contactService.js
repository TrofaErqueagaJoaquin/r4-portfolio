import { apiClient } from '../lib/apiClient.js'

export const contactService = {
  send: (payload) => apiClient.post('/api/contact', payload),
}
