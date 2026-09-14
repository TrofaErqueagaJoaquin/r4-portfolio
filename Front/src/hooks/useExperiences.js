import { useCallback, useEffect, useState } from 'react'
import { experiencesService } from '../services/experiencesService.js'

export function useExperiences() {
  const [experiences, setExperiences] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      const data = await experiencesService.getAll()
      setExperiences(data)
      setStatus('success')
    } catch (err) {
      setError(err.message || 'No se pudo cargar la experiencia.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { experiences, status, error, reload: load }
}
