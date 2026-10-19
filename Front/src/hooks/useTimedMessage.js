import { useCallback, useEffect, useRef, useState } from 'react'

/** Aviso temporal (éxito/error) que se oculta solo a los pocos segundos.
 * useRef guarda el id del setTimeout sin provocar renders, para poder
 * cancelarlo si aparece un aviso nuevo antes de que venza el anterior. */
export function useTimedMessage(durationMs = 4000) {
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text }
  const timeoutRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const show = useCallback(
    (type, text) => {
      setMessage({ type, text })
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => setMessage(null), durationMs)
    },
    [durationMs],
  )

  return { message, show }
}
