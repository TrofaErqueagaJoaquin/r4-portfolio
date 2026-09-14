import { AlertTriangle } from 'lucide-react'
import styles from './ErrorMessage.module.css'

/** Mensaje de error inline. Nunca depende solo del color: siempre lleva
 * ícono + texto explícito (requisito de accesibilidad). */
export function ErrorMessage({ children, onRetry }) {
  return (
    <div className={styles.wrapper} role="alert">
      <AlertTriangle size={20} aria-hidden="true" className={styles.icon} />
      <p className={styles.text}>{children}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}
