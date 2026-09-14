import { useCallback, useEffect, useState } from 'react'
import { skillsService } from '../services/skillsService.js'

export function useSkills() {
  const [skills, setSkills] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      const data = await skillsService.getAll()
      setSkills(data)
      setStatus('success')
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las habilidades.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { skills, status, error, reload: load }
}
