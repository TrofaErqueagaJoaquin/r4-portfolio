// QUÉ HACE: Cartel que se muestra cuando una lista está vacía (ej.
// "Todavía no hay proyectos").
import styles from './EmptyState.module.css'

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className={styles.wrapper}>
      {Icon && <Icon className={styles.icon} size={32} aria-hidden="true" />}
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </div>
  )
}
