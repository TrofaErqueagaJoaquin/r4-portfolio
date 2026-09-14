import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../../components/common/Button.jsx'
import styles from './ConfirmDialog.module.css'

/** Confirmación genérica antes de una acción destructiva (eliminar
 * proyecto). El foco inicial va al botón "Cancelar", la opción menos
 * destructiva, siguiendo el patrón de diálogo de WAI-ARIA. */
export function ConfirmDialog({ isOpen, title, description, confirmLabel = 'Eliminar', onConfirm, onCancel, isLoading }) {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    cancelRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onCancel()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            className={styles.panel}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.icon}>
              <AlertTriangle size={20} aria-hidden="true" />
            </div>
            <h2 id="confirm-dialog-title" className={styles.title}>
              {title}
            </h2>
            <p className={styles.description}>{description}</p>
            <div className={styles.actions}>
              <Button ref={cancelRef} type="button" variant="secondary" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="button" variant="danger" onClick={onConfirm} isLoading={isLoading}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
