import { createContext } from 'react'

// Objeto de contexto en su propio archivo (sin JSX ni el componente
// proveedor) para que tanto AuthProvider como useAuth lo importen sin
// crear un ciclo, y para que cada archivo exporte un único tipo de cosa
// (mejor soporte de Fast Refresh en desarrollo).
export const AuthContext = createContext(null)
