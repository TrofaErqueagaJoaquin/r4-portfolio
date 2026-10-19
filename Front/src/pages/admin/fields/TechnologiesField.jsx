import { Loader2 } from 'lucide-react'
import { useTechnologies } from '../../../hooks/useTechnologies.js'
import styles from '../ResourceForm.module.css'

/** Selección múltiple de tecnologías para un proyecto: es la relación
 * muchos a muchos (project_technologies) vista desde el formulario. */
export function TechnologiesField({ field, value, onChange }) {
  const { technologies, status } = useTechnologies()

  function toggle(id) {
    onChange(field.name, value.includes(id) ? value.filter((techId) => techId !== id) : [...value, id])
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.label}>{field.label}</legend>
      {status === 'loading' && (
        <p className={styles.muted}>
          <Loader2 size={14} className={styles.spinIcon} aria-hidden="true" /> Cargando tecnologías…
        </p>
      )}
      {status === 'error' && <p className={styles.muted}>No se pudieron cargar las tecnologías.</p>}
      {status === 'success' && (
        <div className={styles.checkGrid}>
          {technologies.map((tech) => (
            <label key={tech.id} className={styles.checkOption}>
              <input type="checkbox" checked={value.includes(tech.id)} onChange={() => toggle(tech.id)} />
              {tech.name}
            </label>
          ))}
        </div>
      )}
      <p className={styles.muted}>¿Falta alguna? Creala en la pestaña "Tecnologías" y volvé a abrir este formulario.</p>
    </fieldset>
  )
}
