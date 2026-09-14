import { Loader2 } from 'lucide-react'
import styles from './Spinner.module.css'

/** Indicador de carga accesible: el texto para lectores de pantalla no
 * depende del color ni de la animación (que además se reduce
 * automáticamente para usuarios con prefers-reduced-motion). */
export function Spinner({ label = 'Cargando…', size = 22 }) {
  return (
    <div className={styles.wrapper} role="status">
      <Loader2 className={styles.icon} size={size} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  )
}
