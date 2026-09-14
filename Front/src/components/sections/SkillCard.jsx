import styles from './SkillCard.module.css'

const LEVEL_LABELS = { 1: 'Inicial', 2: 'Básico', 3: 'Intermedio', 4: 'Avanzado', 5: 'Sólido' }

export function SkillCard({ skill }) {
  const levelLabel = LEVEL_LABELS[skill.level] || ''

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <span className={styles.name}>{skill.name}</span>
        <span className={styles.levelLabel}>{levelLabel}</span>
      </div>
      {/* El nivel nunca se comunica solo con el color de la barra: el
          texto (arriba) y el aria-label (acá) transmiten lo mismo. */}
      <div className={styles.bar} role="img" aria-label={`Nivel: ${levelLabel || skill.level} de 5`}>
        <div className={styles.barFill} style={{ width: `${(skill.level / 5) * 100}%` }} />
      </div>
    </div>
  )
}
