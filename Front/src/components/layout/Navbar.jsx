import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../../lib/constants.js'
import { useActiveSection } from '../../hooks/useActiveSection.js'
import { useToggle } from '../../hooks/useToggle.js'
import { IconButton } from '../common/IconButton.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'
import { MobileMenu } from './MobileMenu.jsx'
import styles from './Navbar.module.css'

const sectionIds = NAV_LINKS.map((link) => link.id)

export function Navbar() {
  const activeId = useActiveSection(sectionIds)
  const mobileMenu = useToggle(false)

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navegación principal">
        <a href="#inicio" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            {'</>'}
          </span>
          Portfolio
        </a>

        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={styles.link}
                data-active={activeId === link.id}
                aria-current={activeId === link.id ? 'true' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <ThemeToggle />
          <IconButton
            icon={mobileMenu.isOpen ? X : Menu}
            label={mobileMenu.isOpen ? 'Cerrar menú' : 'Abrir menú'}
            className={styles.menuButton}
            aria-expanded={mobileMenu.isOpen}
            aria-controls="mobile-menu"
            onClick={mobileMenu.toggle}
          />
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenu.isOpen} onClose={mobileMenu.close} activeId={activeId} />
    </header>
  )
}
