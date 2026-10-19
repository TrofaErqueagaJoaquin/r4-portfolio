import { Code2, Database, Network, Cpu, Wrench, Terminal, Users } from 'lucide-react'
import { SectionHeading } from '../common/SectionHeading.jsx'
import { ScrollReveal } from '../common/ScrollReveal.jsx'
import { Spinner } from '../common/Spinner.jsx'
import { ErrorMessage } from '../common/ErrorMessage.jsx'
import { EmptyState } from '../common/EmptyState.jsx'
import { Badge } from '../common/Badge.jsx'
import { useSkills } from '../../hooks/useSkills.js'
import { SKILL_CATEGORIES } from '../../lib/constants.js'
import styles from './Skills.module.css'

// Las categorías se guardan en la base como slugs estables (sin acentos);
// la etiqueta sale de lib/constants.js (la misma que usa el panel admin)
// y acá solo se le asigna un ícono a cada una.
const CATEGORY_ICONS = {
  'desarrollo-web': Code2,
  'bases-de-datos': Database,
  redes: Network,
  electronica: Cpu,
  mantenimiento: Wrench,
  herramientas: Terminal,
  blandas: Users,
}

const CATEGORY_META = Object.fromEntries(
  SKILL_CATEGORIES.map(({ value, label }) => [value, { label, icon: CATEGORY_ICONS[value] || Code2 }]),
)

// Orden de presentación fijo (categorías técnicas primero, en progresión
// lógica, habilidades personales al final) en vez del orden alfabético
// que devolvería Object.entries por defecto.
const CATEGORY_ORDER = Object.keys(CATEGORY_META)

function groupByCategory(skills) {
  const groups = skills.reduce((acc, skill) => {
    const key = skill.category || 'otros'
    ;(acc[key] = acc[key] || []).push(skill)
    return acc
  }, {})

  const knownKeys = CATEGORY_ORDER.filter((key) => groups[key])
  const unknownKeys = Object.keys(groups).filter((key) => !CATEGORY_ORDER.includes(key))
  return [...knownKeys, ...unknownKeys].map((key) => [key, groups[key]])
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
          description="Formación técnica en informática, complementada con experiencia práctica fuera del aula."
        />

        {status === 'loading' && <Spinner label="Cargando habilidades…" />}
        {status === 'error' && <ErrorMessage onRetry={reload}>{error}</ErrorMessage>}
        {status === 'success' && skills.length === 0 && (
          <EmptyState title="Todavía no hay habilidades cargadas." description="Se agregarán desde el panel de administración." />
        )}

        {status === 'success' && skills.length > 0 && (
          <div className={styles.groups}>
            {groups.map(([category, items], index) => {
              const { label, icon: CategoryIcon } = CATEGORY_META[category] || { label: category, icon: Code2 }
              return (
                <ScrollReveal key={category} delay={index * 0.06} className={styles.group}>
                  <h3 className={styles.groupTitle}>
                    <CategoryIcon size={18} aria-hidden="true" />
                    {label}
                  </h3>
                  <div className={styles.chips}>
                    {items.map((skill) => (
                      <Badge key={skill.id}>{skill.name}</Badge>
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
