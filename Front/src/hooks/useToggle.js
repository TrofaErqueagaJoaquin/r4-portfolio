import { useCallback, useState } from 'react'

/**
 * Hook genérico open/close/toggle. Se reutiliza para el menú móvil y para
 * el modal de detalle de proyecto: ambos necesitan exactamente el mismo
 * estado booleano con las mismas tres acciones.
 */
export function useToggle(initialValue = false) {
  const [isOpen, setIsOpen] = useState(initialValue)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((current) => !current), [])

  return { isOpen, open, close, toggle }
}
