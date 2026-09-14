import { CheckCircle2, XCircle } from 'lucide-react'
import styles from './FormStatusMessage.module.css'

export function FormStatusMessage({ status, errorMessage }) {
  if (status === 'success') {
    return (
      <div className={styles.success} role="status">
        <CheckCircle2 size={20} aria-hidden="true" />
        <span>¡Mensaje enviado! Te voy a responder a la brevedad.</span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={styles.error} role="alert">
        <XCircle size={20} aria-hidden="true" />
        <span>{errorMessage || 'No se pudo enviar el mensaje. Probá de nuevo.'}</span>
      </div>
    )
  }

  return null
}
