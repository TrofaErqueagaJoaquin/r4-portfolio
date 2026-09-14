import { CheckCircle2 } from 'lucide-react'
import { SectionHeading } from '../common/SectionHeading.jsx'
import { ScrollReveal } from '../common/ScrollReveal.jsx'
import { profile } from '../../data/profile.js'
import styles from './About.module.css'

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
              {profile.highlights.map((text) => (
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
