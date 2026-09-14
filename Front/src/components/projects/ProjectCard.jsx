import { motion } from 'framer-motion'
import { Code2, ExternalLink, Star } from 'lucide-react'
import { Badge } from '../common/Badge.jsx'
import { ProjectThumbnail } from './ProjectThumbnail.jsx'
import styles from './ProjectCard.module.css'

// Se evita anidar <a> dentro de <button> (o viceversa): la miniatura y el
// título son botones que abren el modal, y los links de repo/demo son
// <a> independientes al mismo nivel, no dentro de otro elemento interactivo.
export function ProjectCard({ project, onOpen }) {
  return (
    <motion.article
      className={styles.card}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <button type="button" className={styles.thumbnailButton} onClick={() => onOpen(project)}>
        <ProjectThumbnail project={project} className={styles.thumbnail} />
        {project.featured && (
          <span className={styles.featuredBadge}>
            <Star size={12} aria-hidden="true" fill="currentColor" /> Destacado
          </span>
        )}
      </button>

      <div className={styles.body}>
        <h3 className={styles.title}>
          <button type="button" className={styles.titleButton} onClick={() => onOpen(project)}>
            {project.title}
          </button>
        </h3>
        <p className={styles.description}>{project.description}</p>

        {project.technologies?.length > 0 && (
          <ul className={styles.techList}>
            {project.technologies.map((tech) => (
              <li key={tech.id}>
                <Badge>{tech.name}</Badge>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.links}>
          {project.repository_url && (
            <a href={project.repository_url} target="_blank" rel="noreferrer" className={styles.link}>
              <Code2 size={16} aria-hidden="true" /> Repositorio
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className={styles.link}>
              <ExternalLink size={16} aria-hidden="true" /> Ver en vivo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
