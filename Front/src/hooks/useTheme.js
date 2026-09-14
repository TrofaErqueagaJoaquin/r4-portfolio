import { useCallback, useEffect, useState } from 'react'
import { THEME_STORAGE_KEY } from '../lib/constants.js'

function getInitialTheme() {
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Maneja el tema claro/oscuro: estado en memoria + persistencia +
 * sincronización con el atributo data-theme que consume variables.css.
 * El valor inicial ya lo fija un script inline en index.html (evita el
 * "flash" de tema incorrecto); este hook toma el control apenas React
 * monta y expone `toggleTheme` para el botón de la navbar.
 */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Si localStorage no está disponible, el tema simplemente no persiste.
    }
  }, [theme])

  // Si el usuario no eligió un tema manualmente, seguir la preferencia
  // del sistema operativo si cambia mientras la página está abierta.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => {
      const hasManualChoice = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (!hasManualChoice) setTheme(event.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
