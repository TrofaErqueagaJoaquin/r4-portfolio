// QUÉ HACE: Atajo para leer la sesión del administrador (token, login,
// logout) desde cualquier componente.
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.js'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  return context
}
