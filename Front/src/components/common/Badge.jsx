// QUÉ HACE: Etiqueta chica redondeada (ej. el nombre de una tecnología o
// de una habilidad).
import styles from './Badge.module.css'

export function Badge({ children, tone = 'neutral', className = '' }) {
  return <span className={[styles.badge, styles[tone], className].filter(Boolean).join(' ')}>{children}</span>
}
