import { Code2, Wrench, Users } from 'lucide-react'
import { SectionHeading } from '../common/SectionHeading.jsx'
import { ScrollReveal } from '../common/ScrollReveal.jsx'
import { Spinner } from '../common/Spinner.jsx'
import { ErrorMessage } from '../common/ErrorMessage.jsx'
import { EmptyState } from '../common/EmptyState.jsx'
import { useSkills } from '../../hooks/useSkills.js'
import { SkillCard } from './SkillCard.jsx'
import styles from './Skills.module.css'

// Las categorías se guardan en la base como slugs estables (sin acentos)
// y acá se mapean a la etiqueta + ícono que se muestran en pantalla.
const CATEGORY_META = {
  tecnologias: { label: 'Tecnologías', icon: Code2 },
  herramientas: { label: 'Herramientas', icon: Wrench },
  blandas: { label: 'Habilidades personales', icon: Users },
}

function groupByCategory(skills) {
  return skills.reduce((groups, skill) => {
    const key = skill.category || 'otros'
    ;(groups[key] = groups[key] || []).push(skill)
    return groups
  }, {})
}

export function Skills() {
  const { skills, status, error, reload } = useSkills()
  const groups = groupByCategory(skills)

  return (
    <section id="habilidades" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Caja de herramientas"
          title="Habilidades"
          description="Organizadas por tipo. Es una base en formación que se irá actualizando con proyectos y experiencia real."
        />

        {status === 'loading' && <Spinner label="Cargando habilidades…" />}
        {status === 'error' && <ErrorMessage onRetry={reload}>{error}</ErrorMessage>}
        {status === 'success' && skills.length === 0 && (
          <EmptyState title="Todavía no hay habilidades cargadas." description="Se agregarán desde el panel de administración." />
        )}

        {status === 'success' && skills.length > 0 && (
          <div className={styles.groups}>
            {Object.entries(groups).map(([category, items], index) => {
              const { label, icon: CategoryIcon } = CATEGORY_META[category] || { label: category, icon: Code2 }
              return (
                <ScrollReveal key={category} delay={index * 0.1} className={styles.group}>
                  <h3 className={styles.groupTitle}>
                    <CategoryIcon size={18} aria-hidden="true" />
                    {label}
                  </h3>
                  <div className={styles.cards}>
                    {items.map((skill) => (
                      <SkillCard key={skill.id} skill={skill} />
                    ))}
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
