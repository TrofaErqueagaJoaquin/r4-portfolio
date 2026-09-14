import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FolderKanban } from 'lucide-react'
import { SectionHeading } from '../common/SectionHeading.jsx'
import { Spinner } from '../common/Spinner.jsx'
import { ErrorMessage } from '../common/ErrorMessage.jsx'
import { EmptyState } from '../common/EmptyState.jsx'
import { useProjects } from '../../hooks/useProjects.js'
import { ProjectFilter } from './ProjectFilter.jsx'
import { ProjectCard } from './ProjectCard.jsx'
import { ProjectModal } from './ProjectModal.jsx'
import styles from './ProjectsSection.module.css'

export function ProjectsSection() {
  const { projects, status, error, reload } = useProjects()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openProject, setOpenProject] = useState(null)

  const filteredProjects =
    selectedCategory === 'all' ? projects : projects.filter((project) => project.category === selectedCategory)

  const counts = projects.reduce(
    (acc, project) => {
      acc.all += 1
      acc[project.category] = (acc[project.category] || 0) + 1
      return acc
    },
    { all: 0 },
  )

  return (
    <section id="proyectos" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Lo que fui construyendo"
          title="Proyectos"
          description="Proyectos de ejemplo con datos provisorios. Se van a reemplazar por proyectos reales a medida que estén listos."
        />

        {status === 'loading' && <Spinner label="Cargando proyectos…" />}
        {status === 'error' && <ErrorMessage onRetry={reload}>{error}</ErrorMessage>}

        {status === 'success' && projects.length === 0 && (
          <EmptyState
            icon={FolderKanban}
            title="Todavía no hay proyectos cargados."
            description="Se van a agregar desde el panel de administración (/admin)."
          />
        )}

        {status === 'success' && projects.length > 0 && (
          <>
            <ProjectFilter selected={selectedCategory} onChange={setSelectedCategory} counts={counts} />

            {filteredProjects.length === 0 ? (
              <EmptyState title="No hay proyectos en esta categoría todavía." />
            ) : (
              <div className={styles.grid}>
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} onOpen={setOpenProject} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  )
}
