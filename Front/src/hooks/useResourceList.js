import { useCallback, useEffect, useState } from 'react'

/**
 * Trae una lista desde la API y expone su estado (cargando / ok / error)
 * más `reload` para volver a pedirla (ej. después de un alta o baja).
 * Lo usan las secciones públicas y el panel de administración.
 *
 * `loader` debe ser una función estable (definida fuera del componente
 * o envuelta en useCallback): si cambiara en cada render, el efecto
 * volvería a pedir los datos en un bucle infinito.
 */
export function useResourceList(loader, errorMessage = 'No se pudieron cargar los datos.') {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      setItems(await loader())
      setStatus('success')
    } catch (err) {
      setError(err)
      setStatus('error')
    }
  }, [loader])

  useEffect(() => {
    load()
  }, [load])

  return { items, status, error, errorMessage: error ? error.message || errorMessage : '', reload: load }
}
