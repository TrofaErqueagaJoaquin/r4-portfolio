import { SectionHeading } from '../common/SectionHeading.jsx'
import { ScrollReveal } from '../common/ScrollReveal.jsx'
import { Spinner } from '../common/Spinner.jsx'
import { ErrorMessage } from '../common/ErrorMessage.jsx'
import { EmptyState } from '../common/EmptyState.jsx'
import { useExperiences } from '../../hooks/useExperiences.js'
import { ExperienceItem } from './ExperienceItem.jsx'
import styles from './Experience.module.css'

export function Experience() {
  const { experiences, status, error, reload } = useExperiences()

  return (
    <section id="experiencia" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Recorrido"
          title="Experiencia"
          description="Formación técnica y experiencia laboral hasta ahora."
        />

        {status === 'loading' && <Spinner label="Cargando experiencia…" />}
        {status === 'error' && <ErrorMessage onRetry={reload}>{error}</ErrorMessage>}
        {status === 'success' && experiences.length === 0 && <EmptyState title="Todavía no hay experiencia cargada." />}

        {status === 'success' && experiences.length > 0 && (
          <ScrollReveal>
            <ol className={styles.timeline}>
              {experiences.map((experience, index) => (
                <ExperienceItem key={experience.id} experience={experience} isLast={index === experiences.length - 1} />
              ))}
            </ol>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
