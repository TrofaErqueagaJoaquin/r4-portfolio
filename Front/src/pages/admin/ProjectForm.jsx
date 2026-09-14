import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { PROJECT_CATEGORIES } from '../../lib/constants.js'
import { useTechnologies } from '../../hooks/useTechnologies.js'
import { FormField } from '../../components/contact/FormField.jsx'
import { Button } from '../../components/common/Button.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import styles from './ProjectForm.module.css'

const emptyValues = {
  title: '',
  description: '',
  image_url: '',
  repository_url: '',
  live_url: '',
  category: PROJECT_CATEGORIES[0].value,
  featured: false,
  technology_ids: [],
}

function toFormValues(project) {
  if (!project) return emptyValues
  return {
    title: project.title || '',
    description: project.description || '',
    image_url: project.image_url || '',
    repository_url: project.repository_url || '',
    live_url: project.live_url || '',
    category: project.category || PROJECT_CATEGORIES[0].value,
    featured: Boolean(project.featured),
    technology_ids: project.technologies?.map((tech) => tech.id) || [],
  }
}

function validate(values) {
  const errors = {}
  if (!values.title.trim()) errors.title = 'El título es obligatorio.'
  if (!values.description.trim()) errors.description = 'La descripción es obligatoria.'
  else if (values.description.trim().length > 600) errors.description = 'Máximo 600 caracteres.'
  return errors
}

/** Formulario de alta/edición de proyectos. `project` en null significa
 * "crear nuevo"; con un proyecto precarga sus valores para editarlo. */
export function ProjectForm({ project, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toFormValues(project))
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { technologies, status: techStatus } = useTechnologies()

  useEffect(() => {
    setValues(toFormValues(project))
    setErrors({})
    setSubmitError('')
  }, [project])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleToggleTechnology(id) {
    setValues((prev) => ({
      ...prev,
      technology_ids: prev.technology_ids.includes(id)
        ? prev.technology_ids.filter((techId) => techId !== id)
        : [...prev.technology_ids, id],
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSaving(true)
    setSubmitError('')
    try {
      await onSubmit(values)
    } catch (err) {
      setSubmitError(err.message || 'No se pudo guardar el proyecto.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <FormField label="Título" name="title" value={values.title} onChange={handleChange} error={errors.title} />

      <FormField
        label="Descripción"
        name="description"
        as="textarea"
        rows={4}
        value={values.description}
        onChange={handleChange}
        error={errors.description}
      />

      <FormField
        label="URL de imagen (opcional)"
        name="image_url"
        value={values.image_url}
        onChange={handleChange}
        placeholder="https://…"
      />

      <div className={styles.row}>
        <FormField
          label="Repositorio (opcional)"
          name="repository_url"
          value={values.repository_url}
          onChange={handleChange}
          placeholder="https://github.com/…"
        />
        <FormField
          label="Demo en vivo (opcional)"
          name="live_url"
          value={values.live_url}
          onChange={handleChange}
          placeholder="https://…"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="category" className={styles.label}>
          Categoría
        </label>
        <select id="category" name="category" value={values.category} onChange={handleChange} className={styles.select}>
          {PROJECT_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>Tecnologías</legend>
        {techStatus === 'loading' && (
          <p className={styles.techLoading}>
            <Loader2 size={14} className={styles.spinIcon} aria-hidden="true" /> Cargando tecnologías…
          </p>
        )}
        {techStatus === 'success' && (
          <div className={styles.techGrid}>
            {technologies.map((tech) => (
              <label key={tech.id} className={styles.techOption}>
                <input type="checkbox" checked={values.technology_ids.includes(tech.id)} onChange={() => handleToggleTechnology(tech.id)} />
                {tech.name}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(event) => setValues((prev) => ({ ...prev, featured: event.target.checked }))}
        />
        Marcar como proyecto destacado
      </label>

      {submitError && <ErrorMessage>{submitError}</ErrorMessage>}

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSaving} disabled={isSaving}>
          {project ? 'Guardar cambios' : 'Crear proyecto'}
        </Button>
      </div>
    </form>
  )
}
