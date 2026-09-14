import { Briefcase, Camera, Code2 } from 'lucide-react'
import { profile } from '../../data/profile.js'
import { NAV_LINKS } from '../../lib/constants.js'
import styles from './Footer.module.css'

// La versión instalada de lucide-react ya no incluye íconos de marcas
// (GitHub/LinkedIn/Instagram se retiraron del paquete). Se usan íconos
// genéricos equivalentes; el nombre real de la red queda igual en el
// aria-label, así que la información para lectores de pantalla no se pierde.
const SOCIAL_ICONS = { github: Code2, linkedin: Briefcase, instagram: Camera }

export function Footer() {
  const year = new Date().getFullYear()
  const socialEntries = Object.entries(profile.social).filter(([, url]) => url)

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.brand}>{profile.name}</p>
          <p className={styles.tagline}>{profile.role}</p>
        </div>

        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className={styles.social}>
          {socialEntries.length > 0 ? (
            socialEntries.map(([key, url]) => {
              const Icon = SOCIAL_ICONS[key]
              return (
                <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}>
                  <Icon size={18} aria-hidden="true" />
                </a>
              )
            })
          ) : (
            <span className={styles.placeholder}>Redes sociales próximamente</span>
          )}
        </div>
      </div>

      <p className={styles.copyright}>
        © {year} {profile.name}. Proyecto escolar R4.
      </p>
    </footer>
  )
}
