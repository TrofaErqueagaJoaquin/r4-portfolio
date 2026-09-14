import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

/**
 * Envoltorio reutilizable para la animación "aparecer al hacer scroll"
 * (whileInView). Evita repetir la misma configuración de Framer Motion
 * en cada sección de la landing.
 */
export function ScrollReveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
