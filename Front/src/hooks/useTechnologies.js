import { useCallback, useEffect, useState } from 'react'
import { technologiesService } from '../services/technologiesService.js'

/** Lista de tecnologías existentes, usada por ProjectForm para armar el
 * selector de tecnologías del proyecto (relación muchos a muchos). */
export function useTechnologies() {
  const [technologies, setTechnologies] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      const data = await technologiesService.getAll()
      setTechnologies(data)
      setStatus('success')
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las tecnologías.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { technologies, status, error, reload: load }
}
