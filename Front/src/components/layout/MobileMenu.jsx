import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_LINKS } from '../../lib/constants.js'
import styles from './MobileMenu.module.css'

/**
 * Panel del menú móvil. Cierra con Escape (evento de teclado, requisito
 * de accesibilidad) y bloquea el scroll del body mientras está abierto
 * para que no queden dos capas desplazándose a la vez.
 */
export function MobileMenu({ isOpen, onClose, activeId }) {
  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          className={styles.panel}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <ul className={styles.list}>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className={styles.link} data-active={activeId === link.id} onClick={onClose}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
