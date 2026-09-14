import { useState, useEffect } from 'react'

/**
 * Estado de React persistido en localStorage. Genérico y reutilizable:
 * lo usa useTheme (tema) y AuthContext (token de administrador).
 * Envuelto en try/catch porque localStorage puede fallar (modo privado,
 * cuotas superadas, SSR) y no debería tirar abajo la app.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Almacenamiento no disponible: la app sigue funcionando en memoria.
    }
  }, [key, value])

  return [value, setValue]
}
