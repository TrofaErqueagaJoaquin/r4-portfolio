import { Pencil, Star, Trash2 } from 'lucide-react'
import { ProjectThumbnail } from '../../components/projects/ProjectThumbnail.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { IconButton } from '../../components/common/IconButton.jsx'
import styles from './ProjectsTable.module.css'

export function ProjectsTable({ projects, onEdit, onDelete }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Proyecto</th>
            <th scope="col">Categoría</th>
            <th scope="col">Tecnologías</th>
            <th scope="col">Destacado</th>
            <th scope="col">
              <span className="visually-hidden">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>
                <div className={styles.projectCell}>
                  <div className={styles.thumb}>
                    <ProjectThumbnail project={project} />
                  </div>
                  <span>{project.title}</span>
                </div>
              </td>
              <td>{project.category}</td>
              <td>
                <div className={styles.techCell}>
                  {project.technologies?.map((tech) => (
                    <Badge key={tech.id}>{tech.name}</Badge>
                  ))}
                </div>
              </td>
              <td>
                {project.featured ? (
                  <Star size={16} aria-hidden="true" className={styles.featuredIcon} fill="currentColor" />
                ) : (
                  <span className={styles.dash} aria-hidden="true">
                    —
                  </span>
                )}
                <span className="visually-hidden">{project.featured ? 'Destacado' : 'No destacado'}</span>
              </td>
              <td>
                <div className={styles.actions}>
                  <IconButton icon={Pencil} label={`Editar ${project.title}`} onClick={() => onEdit(project)} />
                  <IconButton icon={Trash2} label={`Eliminar ${project.title}`} onClick={() => onDelete(project)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
