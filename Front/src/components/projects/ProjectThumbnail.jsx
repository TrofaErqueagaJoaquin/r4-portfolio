import { Code2 } from 'lucide-react'
import styles from './ProjectThumbnail.module.css'

const CATEGORY_LABELS = {
  web: 'Desarrollo web',
  automatizacion: 'Automatización',
  electronica: 'Electrónica',
  otro: 'Otro',
}

/**
 * Si el proyecto tiene image_url se muestra la imagen; si no, un
 * placeholder con degradé + ícono y la categoría. Evita depender de
 * imágenes de stock o inventadas mientras no haya capturas reales.
 */
export function ProjectThumbnail({ project, className = '' }) {
  if (project.image_url) {
    return (
      <img
        src={project.image_url}
        alt={`Captura del proyecto ${project.title}`}
        className={[styles.image, className].filter(Boolean).join(' ')}
        loading="lazy"
      />
    )
  }

  return (
    <div className={[styles.placeholder, className].filter(Boolean).join(' ')}>
      <Code2 size={28} aria-hidden="true" />
      <span>{CATEGORY_LABELS[project.category] || 'Proyecto'}</span>
    </div>
  )
}
