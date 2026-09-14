import { useMemo, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { authService } from '../services/authService.js'
import { AUTH_TOKEN_KEY } from '../lib/constants.js'

/**
 * Autenticación del panel admin. Guarda el access token que devuelve
 * Supabase Auth (a través del backend) en localStorage para sobrevivir
 * recargas de página. El token viaja como Bearer en cada petición
 * protegida (ver services/*) y el backend lo valida contra Supabase.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useLocalStorage(AUTH_TOKEN_KEY, null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function login(email, password) {
    setIsLoading(true)
    setError('')
    try {
      const data = await authService.login(email, password)
      setToken(data.token)
      return true
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    setToken(null)
  }

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), login, logout, error, isLoading }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, error, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
