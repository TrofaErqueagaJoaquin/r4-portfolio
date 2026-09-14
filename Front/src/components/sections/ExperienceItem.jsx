import { Briefcase, GraduationCap, Rocket } from 'lucide-react'
import { formatDateRange } from '../../lib/format.js'
import { Badge } from '../common/Badge.jsx'
import styles from './ExperienceItem.module.css'

const TYPE_META = {
  trabajo: { label: 'Trabajo', icon: Briefcase },
  educacion: { label: 'Educación', icon: GraduationCap },
  proyecto: { label: 'Proyecto', icon: Rocket },
}

export function ExperienceItem({ experience, isLast }) {
  const { label, icon: Icon } = TYPE_META[experience.type] || TYPE_META.proyecto

  return (
    <li className={styles.item}>
      <div className={styles.markerColumn}>
        <span className={styles.marker}>
          <Icon size={16} aria-hidden="true" />
        </span>
        {!isLast && <span className={styles.line} aria-hidden="true" />}
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <Badge tone="primary">{label}</Badge>
          <time className={styles.date}>{formatDateRange(experience.start_date, experience.end_date)}</time>
        </div>
        <h3 className={styles.title}>{experience.title}</h3>
        <p className={styles.organization}>{experience.organization}</p>
        <p className={styles.description}>{experience.description}</p>
      </div>
    </li>
  )
}
