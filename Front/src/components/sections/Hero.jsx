import { motion } from 'framer-motion'
import { ArrowRight, Mail, Sparkles } from 'lucide-react'
import { profile } from '../../data/profile.js'
import { Button } from '../common/Button.jsx'
import styles from './Hero.module.css'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function Hero() {
  return (
    <section id="inicio" className={`section ${styles.hero}`} aria-label="Presentación">
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <motion.div variants={container} initial="hidden" animate="visible" className={styles.content}>
          <motion.span variants={item} className={styles.eyebrow}>
            <Sparkles size={14} aria-hidden="true" />
            Contenido provisorio — proyecto escolar R4
          </motion.span>

          <motion.h1 variants={item} className={styles.title}>
            Hola, soy <span className="gradient-text">{profile.name}</span>
          </motion.h1>

          <motion.p variants={item} className={styles.role}>
            {profile.role}
          </motion.p>

          <motion.p variants={item} className={styles.tagline}>
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className={styles.actions}>
            <Button href="#proyectos" size="lg">
              Ver proyectos <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button href="#contacto" variant="secondary" size="lg">
              <Mail size={18} aria-hidden="true" /> Contactar
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.avatarWrapper}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <div className={styles.avatar} role="img" aria-label={`Foto de perfil provisoria de ${profile.name}`}>
            <span className={styles.avatarInitials}>{getInitials(profile.name)}</span>
          </div>
          <div className={styles.badgeFloating}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Disponible para aprender y sumar
          </div>
        </motion.div>
      </div>
    </section>
  )
}
