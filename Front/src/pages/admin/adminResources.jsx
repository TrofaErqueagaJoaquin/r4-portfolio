import { Star } from 'lucide-react'
import { Badge } from '../../components/common/Badge.jsx'
import { ProjectThumbnail } from '../../components/projects/ProjectThumbnail.jsx'
import { adminServices } from '../../services/adminService.js'
import { EXPERIENCE_TYPES, PROJECT_CATEGORIES, SKILL_CATEGORIES, labelFor } from '../../lib/constants.js'
import { formatDateRange } from '../../lib/format.js'
import styles from './ResourceManager.module.css'

/**
 * Configuración del ABML de cada recurso. ResourceManager y ResourceForm
 * son genéricos: todo lo específico de cada tabla vive acá.
 *   - columns:   qué se muestra en la tabla del listado.
 *   - fields:    qué campos tiene el formulario de alta/modificación.
 *   - toForm:    registro de la API -> valores del formulario (edición).
 *   - toPayload: valores del formulario -> body que se manda a la API.
 * Para administrar una tabla nueva alcanza con sumar un objeto a esta lista
 * (y sus rutas en el backend).
 */
export const ADMIN_RESOURCES = [
  {
    key: 'projects',
    title: 'Proyectos',
    singular: 'proyecto',
    service: adminServices.projects,
    describe: (item) => item.title,
    columns: [
      {
        label: 'Proyecto',
        render: (item) => (
          <div className={styles.titleCell}>
            <div className={styles.thumb}>
              <ProjectThumbnail project={item} />
            </div>
            <span>{item.title}</span>
          </div>
        ),
      },
      { label: 'Categoría', render: (item) => labelFor(PROJECT_CATEGORIES, item.category) },
      {
        label: 'Tecnologías',
        render: (item) => (
          <div className={styles.badges}>
            {item.technologies?.map((tech) => (
              <Badge key={tech.id}>{tech.name}</Badge>
            ))}
          </div>
        ),
      },
      {
        label: 'Destacado',
        render: (item) =>
          item.featured ? (
            <span className={styles.featured}>
              <Star size={14} fill="currentColor" aria-hidden="true" /> Sí
            </span>
          ) : (
            'No'
          ),
      },
    ],
    fields: [
      { name: 'title', label: 'Título', required: true, maxLength: 120 },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true, maxLength: 600 },
      { name: 'image_url', label: 'Imagen', type: 'image' },
      { name: 'category', label: 'Categoría', type: 'select', options: PROJECT_CATEGORIES },
      { name: 'technology_ids', label: 'Tecnologías', type: 'technologies' },
      { name: 'repository_url', label: 'Link al repositorio (opcional)', type: 'url', placeholder: 'https://github.com/…' },
      { name: 'live_url', label: 'Link al proyecto publicado (opcional)', type: 'url', placeholder: 'https://…' },
      { name: 'featured', label: 'Marcar como proyecto destacado', type: 'checkbox' },
    ],
    toForm: (item) => ({
      title: item?.title || '',
      description: item?.description || '',
      image_url: item?.image_url || '',
      category: item?.category || PROJECT_CATEGORIES[0].value,
      technology_ids: item?.technologies?.map((tech) => tech.id) || [],
      repository_url: item?.repository_url || '',
      live_url: item?.live_url || '',
      featured: Boolean(item?.featured),
    }),
    // Vacío -> null para que en la base quede "sin dato" y no un texto vacío.
    toPayload: (values) => ({
      ...values,
      image_url: values.image_url.trim() || null,
      repository_url: values.repository_url.trim() || null,
      live_url: values.live_url.trim() || null,
    }),
  },
  {
    key: 'skills',
    title: 'Habilidades',
    singular: 'habilidad',
    service: adminServices.skills,
    describe: (item) => item.name,
    columns: [
      { label: 'Nombre', render: (item) => <strong>{item.name}</strong> },
      { label: 'Categoría', render: (item) => labelFor(SKILL_CATEGORIES, item.category) },
      { label: 'Nivel', render: (item) => `${item.level} / 5` },
    ],
    fields: [
      { name: 'name', label: 'Nombre', required: true, maxLength: 80 },
      { name: 'category', label: 'Categoría', type: 'select', options: SKILL_CATEGORIES },
      {
        name: 'level',
        label: 'Nivel (1 a 5)',
        type: 'number',
        min: 1,
        max: 5,
        required: true,
        hint: 'No se muestra en la web: solo ordena las habilidades de más a menos desarrollada dentro de su categoría.',
      },
    ],
    toForm: (item) => ({ name: item?.name || '', category: item?.category || SKILL_CATEGORIES[0].value, level: String(item?.level ?? 3) }),
    toPayload: (values) => ({ ...values, level: Number(values.level) }),
  },
  {
    key: 'experiences',
    title: 'Experiencia',
    singular: 'experiencia',
    service: adminServices.experiences,
    describe: (item) => item.title,
    columns: [
      { label: 'Título', render: (item) => <strong>{item.title}</strong> },
      { label: 'Organización', render: (item) => item.organization },
      { label: 'Fechas', render: (item) => formatDateRange(item.start_date, item.end_date) },
      { label: 'Tipo', render: (item) => <Badge tone="primary">{labelFor(EXPERIENCE_TYPES, item.type)}</Badge> },
    ],
    fields: [
      { name: 'title', label: 'Título / puesto', required: true, maxLength: 120 },
      { name: 'organization', label: 'Organización / institución', required: true, maxLength: 120 },
      { name: 'type', label: 'Tipo', type: 'select', options: EXPERIENCE_TYPES },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true, maxLength: 1000 },
      { name: 'start_date', label: 'Fecha de inicio', type: 'date', required: true },
      { name: 'end_date', label: 'Fecha de fin', type: 'date', hint: 'Dejala vacía si sigue en curso: en la web se muestra "Presente".' },
    ],
    toForm: (item) => ({
      title: item?.title || '',
      organization: item?.organization || '',
      type: item?.type || EXPERIENCE_TYPES[0].value,
      description: item?.description || '',
      start_date: item?.start_date || '',
      end_date: item?.end_date || '',
    }),
    toPayload: (values) => ({ ...values, end_date: values.end_date || null }),
  },
  {
    key: 'technologies',
    title: 'Tecnologías',
    singular: 'tecnología',
    service: adminServices.technologies,
    describe: (item) => item.name,
    deleteWarning: 'También se va a quitar de todos los proyectos que la usen.',
    columns: [
      { label: 'Nombre', render: (item) => <strong>{item.name}</strong> },
      { label: 'Identificador (slug)', render: (item) => <code>{item.slug}</code> },
    ],
    fields: [{ name: 'name', label: 'Nombre', required: true, maxLength: 50, hint: 'El identificador (slug) se genera solo a partir del nombre.' }],
    toForm: (item) => ({ name: item?.name || '' }),
    toPayload: (values) => values,
  },
]
