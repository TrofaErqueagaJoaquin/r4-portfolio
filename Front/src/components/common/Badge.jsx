import styles from './Badge.module.css'

export function Badge({ children, tone = 'neutral', className = '' }) {
  return <span className={[styles.badge, styles[tone], className].filter(Boolean).join(' ')}>{children}</span>
}
