import { Mail, MapPin } from 'lucide-react'
import { SectionHeading } from '../common/SectionHeading.jsx'
import { ScrollReveal } from '../common/ScrollReveal.jsx'
import { ContactForm } from '../contact/ContactForm.jsx'
import { profile } from '../../data/profile.js'
import styles from './Contact.module.css'

export function Contact() {
  return (
    <section id="contacto" className="section">
      <div className="container">
        <SectionHeading eyebrow="Hablemos" title="Contacto" description="¿Tenés una propuesta, una consulta o simplemente querés saludar? Escribime." />

        <div className={styles.grid}>
          <ScrollReveal className={styles.info}>
            <div className={styles.infoItem}>
              <Mail size={18} aria-hidden="true" />
              <span>{profile.email}</span>
            </div>
            <div className={styles.infoItem}>
              <MapPin size={18} aria-hidden="true" />
              <span>{profile.location}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
