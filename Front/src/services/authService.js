// QUÉ HACE: Pedido de login al backend.
import { apiClient } from '../lib/apiClient.js'

export const authService = {
  login: (email, password) => apiClient.post('/api/auth/login', { email, password }),
}
