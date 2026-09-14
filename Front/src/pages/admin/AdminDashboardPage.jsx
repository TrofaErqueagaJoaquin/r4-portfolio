import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Plus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { useProjects } from '../../hooks/useProjects.js'
import { projectsService } from '../../services/projectsService.js'
import { Button } from '../../components/common/Button.jsx'
import { Spinner } from '../../components/common/Spinner.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { EmptyState } from '../../components/common/EmptyState.jsx'
import { ProjectsTable } from './ProjectsTable.jsx'
import { ProjectForm } from './ProjectForm.jsx'
import { ConfirmDialog } from './ConfirmDialog.jsx'
import styles from './AdminDashboardPage.module.css'

export function AdminDashboardPage() {
  const { token, logout } = useAuth()
  const { projects, status, error, reload } = useProjects()
  const [formState, setFormState] = useState(null) // null | 'create' | <project>
  const [deletingProject, setDeletingProject] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [banner, setBanner] = useState(null) // { type: 'success' | 'error', message }
  const bannerTimeoutRef = useRef(null)

  // useRef (no dispara render) para guardar el id del setTimeout y poder
  // cancelarlo si aparece un nuevo aviso antes de que el anterior expire.
  useEffect(() => () => window.clearTimeout(bannerTimeoutRef.current), [])

  function showBanner(type, message) {
    setBanner({ type, message })
    window.clearTimeout(bannerTimeoutRef.current)
    bannerTimeoutRef.current = window.setTimeout(() => setBanner(null), 4000)
  }

  async function handleFormSubmit(values) {
    const isEditing = formState && formState !== 'create'
    if (isEditing) {
      await projectsService.update(formState.id, values, token)
      showBanner('success', 'Proyecto actualizado correctamente.')
    } else {
      await projectsService.create(values, token)
      showBanner('success', 'Proyecto creado correctamente.')
    }
    setFormState(null)
    reload()
  }

  async function handleConfirmDelete() {
    if (!deletingProject) return
    setIsDeleting(true)
    try {
      await projectsService.remove(deletingProject.id, token)
      showBanner('success', 'Proyecto eliminado.')
      setDeletingProject(null)
      reload()
    } catch (err) {
      showBanner('error', err.message || 'No se pudo eliminar el proyecto.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerRow}>
            <div>
              <p className={styles.eyebrow}>Panel de administración</p>
              <h1 className={styles.title}>Proyectos</h1>
            </div>
            <Button variant="ghost" onClick={logout}>
              <LogOut size={16} aria-hidden="true" /> Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container">
        {banner && (
          <div className={styles.banner} data-type={banner.type} role="status">
            {banner.message}
          </div>
        )}

        <div className={styles.toolbar}>
          <Button onClick={() => setFormState('create')}>
            <Plus size={16} aria-hidden="true" /> Nuevo proyecto
          </Button>
        </div>

        {status === 'loading' && <Spinner label="Cargando proyectos…" />}
        {status === 'error' && <ErrorMessage onRetry={reload}>{error}</ErrorMessage>}
        {status === 'success' && projects.length === 0 && (
          <EmptyState title="Todavía no creaste ningún proyecto." description='Usá el botón "Nuevo proyecto" para cargar el primero.' />
        )}
        {status === 'success' && projects.length > 0 && (
          <ProjectsTable projects={projects} onEdit={setFormState} onDelete={setDeletingProject} />
        )}
      </main>

      <AnimatePresence>
        {formState && (
          <motion.div
            className={styles.formOverlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-form-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={styles.formPanel}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <h2 id="project-form-title" className={styles.formTitle}>
                {formState === 'create' ? 'Nuevo proyecto' : `Editar "${formState.title}"`}
              </h2>
              <ProjectForm
                project={formState === 'create' ? null : formState}
                onSubmit={handleFormSubmit}
                onCancel={() => setFormState(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={Boolean(deletingProject)}
        title="¿Eliminar este proyecto?"
        description={`Esta acción no se puede deshacer. Se va a eliminar "${deletingProject?.title}" de forma permanente.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProject(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}
