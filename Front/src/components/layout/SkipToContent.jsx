import styles from './SkipToContent.module.css'

/** Link de accesibilidad: invisible hasta recibir foco por teclado,
 * permite saltar la navegación e ir directo al contenido. */
export function SkipToContent() {
  return (
    <a href="#contenido-principal" className={styles.skipLink}>
      Saltar al contenido principal
    </a>
  )
}
