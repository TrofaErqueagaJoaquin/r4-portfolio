import { useState } from 'react'
import { ExternalLink, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { Button } from '../../components/common/Button.jsx'
import { ResourceManager } from './ResourceManager.jsx'
import { MessagesPanel } from './MessagesPanel.jsx'
import { ADMIN_RESOURCES } from './adminResources.jsx'
import styles from './AdminDashboardPage.module.css'

const TABS = [...ADMIN_RESOURCES.map((resource) => ({ key: resource.key, label: resource.title })), { key: 'messages', label: 'Mensajes' }]

export function AdminDashboardPage() {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState(TABS[0].key)
  const activeResource = ADMIN_RESOURCES.find((resource) => resource.key === activeTab)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerRow}>
            <div>
              <p className={styles.eyebrow}>Panel de administración</p>
              <h1 className={styles.title}>Contenido del portfolio</h1>
            </div>
            <div className={styles.headerActions}>
              <Button variant="secondary" href="/" target="_blank" rel="noreferrer">
                <ExternalLink size={16} aria-hidden="true" /> Ver sitio
              </Button>
              <Button variant="ghost" onClick={logout}>
                <LogOut size={16} aria-hidden="true" /> Cerrar sesión
              </Button>
            </div>
          </div>

          <nav className={styles.tabs} role="tablist" aria-label="Secciones del panel">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                id={`tab-${tab.key}`}
                aria-selected={activeTab === tab.key}
                aria-controls="admin-tabpanel"
                className={styles.tab}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main id="admin-tabpanel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="container">
        {/* key: al cambiar de pestaña se monta un ResourceManager nuevo
            (con su propio listado y estado) en vez de reutilizar el anterior. */}
        {activeResource ? <ResourceManager key={activeResource.key} config={activeResource} /> : <MessagesPanel />}
      </main>
    </div>
  )
}
