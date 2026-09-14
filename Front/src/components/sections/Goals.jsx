import { SectionHeading } from '../common/SectionHeading.jsx'
import { ScrollReveal } from '../common/ScrollReveal.jsx'
import { goals } from '../../data/goals.js'
import styles from './Goals.module.css'

export function Goals() {
  return (
    <section id="objetivos" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Hacia dónde voy"
          title="Objetivos e intereses"
          description="Lo que más me motiva a seguir aprendiendo y en qué tipo de problemas me gusta meter mano."
        />
        <div className={styles.grid}>
          {goals.map(({ id, icon: Icon, title, description }, index) => (
            <ScrollReveal key={id} delay={index * 0.08} className={styles.card}>
              <span className={styles.iconWrapper}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDescription}>{description}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
