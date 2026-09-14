import styles from './IconButton.module.css'

/** Botón de solo-ícono (cerrar modal, toggle de tema, hamburguesa del menú
 * móvil). Exige `label` para armar un aria-label: nunca queda un botón
 * sin nombre accesible para lectores de pantalla. */
export function IconButton({ icon: Icon, label, className = '', size = 20, ...rest }) {
  return (
    <button type="button" className={[styles.button, className].filter(Boolean).join(' ')} aria-label={label} title={label} {...rest}>
      <Icon size={size} aria-hidden="true" />
    </button>
  )
}
