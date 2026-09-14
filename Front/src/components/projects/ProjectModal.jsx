import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Code2, ExternalLink, X } from 'lucide-react'
import { Badge } from '../common/Badge.jsx'
import { Button } from '../common/Button.jsx'
import { ProjectThumbnail } from './ProjectThumbnail.jsx'
import styles from './ProjectModal.module.css'

/**
 * Modal de detalle accesible: foco se mueve al botón de cerrar al abrir,
 * Escape cierra, un click en el fondo cierra, y aria-modal + role="dialog"
 * describen el patrón para lectores de pantalla. Se monta en un portal
 * (document.body) para no heredar overflow/z-index de contenedores padre.
 */
export function ProjectModal({ project, onClose }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!project) return undefined

    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [project, onClose])

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" ref={closeButtonRef} className={styles.closeButton} onClick={onClose} aria-label="Cerrar detalle del proyecto">
              <X size={20} aria-hidden="true" />
            </button>

            <ProjectThumbnail project={project} className={styles.thumbnail} />

            <div className={styles.content}>
              <h3 id="project-modal-title" className={styles.title}>
                {project.title}
              </h3>
              <p className={styles.description}>{project.description}</p>

              {project.technologies?.length > 0 && (
                <ul className={styles.techList}>
                  {project.technologies.map((tech) => (
                    <li key={tech.id}>
                      <Badge tone="primary">{tech.name}</Badge>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.actions}>
                {project.repository_url && (
                  <Button href={project.repository_url} variant="secondary" target="_blank" rel="noreferrer">
                    <Code2 size={16} aria-hidden="true" /> Ver repositorio
                  </Button>
                )}
                {project.live_url && (
                  <Button href={project.live_url} target="_blank" rel="noreferrer">
                    <ExternalLink size={16} aria-hidden="true" /> Ver en vivo
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
