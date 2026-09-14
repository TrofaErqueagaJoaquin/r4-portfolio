import { CheckCircle2 } from 'lucide-react'
import { SectionHeading } from '../common/SectionHeading.jsx'
import { ScrollReveal } from '../common/ScrollReveal.jsx'
import { profile } from '../../data/profile.js'
import styles from './About.module.css'

// Enfoque personal: distinto del contenido de la sección "Objetivos e
// intereses" (más abajo), que lista focos temáticos concretos. Acá se
// prioriza la forma de encarar el trabajo y el aprendizaje.
const highlights = [
  'Prefiero entender el problema antes de escribir la primera línea de código.',
  'Aprendo haciendo: un proyecto chico funcionando enseña más que solo teoría.',
  'Cómodo tanto armando una interfaz prolija como resolviendo lógica de backend.',
]

export function About() {
  return (
    <section id="sobre-mi" className="section">
      <div className="container">
        <SectionHeading eyebrow="Quién soy" title="Sobre mí" />
        <div className={styles.grid}>
          <ScrollReveal className={styles.bio}>
            {profile.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </ScrollReveal>

          <ScrollReveal delay={0.15} className={styles.highlights}>
            <ul>
              {highlights.map((text) => (
                <li key={text}>
                  <CheckCircle2 size={18} aria-hidden="true" className={styles.highlightIcon} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
