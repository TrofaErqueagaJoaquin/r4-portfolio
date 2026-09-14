import { motion } from 'framer-motion'
import styles from './SectionHeading.module.css'

/**
 * Encabezado reutilizado por cada sección de la landing (eyebrow + título
 * + descripción opcional), con la misma animación de entrada al hacer
 * scroll para que toda la página se sienta consistente.
 */
export function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <motion.div
      className={styles.heading}
      data-align={align}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </motion.div>
  )
}
