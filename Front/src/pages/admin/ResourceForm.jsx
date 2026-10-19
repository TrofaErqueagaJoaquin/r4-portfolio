// QUÉ HACE: Formulario del panel para agregar o editar cualquier cosa; los
// campos los define adminResources.jsx.
import { useState } from 'react'
import { FormField } from '../../components/contact/FormField.jsx'
import { Button } from '../../components/common/Button.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { ImageField } from './fields/ImageField.jsx'
import { TechnologiesField } from './fields/TechnologiesField.jsx'
import styles from './ResourceForm.module.css'

function isValidUrl(value) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

// Validación genérica a partir de la definición de cada campo. Es la
// primera barrera (respuesta inmediata); el backend vuelve a validar todo.
function validate(fields, values) {
  const errors = {}
  for (const field of fields) {
    const value = values[field.name]
    const text = typeof value === 'string' ? value.trim() : value
    if (field.required && (text === '' || text === null || text === undefined)) {
      errors[field.name] = `${field.label} es obligatorio.`
    } else if (field.maxLength && typeof text === 'string' && text.length > field.maxLength) {
      errors[field.name] = `Máximo ${field.maxLength} caracteres.`
    } else if ((field.type === 'url' || field.type === 'image') && text && !isValidUrl(text)) {
      errors[field.name] = 'Ingresá una URL válida (que empiece con https://).'
    } else if (field.type === 'number' && text !== '' && (Number(text) < field.min || Number(text) > field.max)) {
      errors[field.name] = `Debe estar entre ${field.min} y ${field.max}.`
    }
  }
  return errors
}

/**
 * Formulario de alta/modificación armado a partir de una lista de campos
 * (ver adminResources.jsx). Un mismo componente sirve para proyectos,
 * habilidades, experiencia y tecnologías: solo cambia la configuración.
 */
export function ResourceForm({ fields, initialValues, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function setValue(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validate(fields, values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSaving(true)
    setSubmitError('')
    try {
      await onSubmit(values)
    } catch (err) {
      // Errores por campo que devuelve el backend (400) se muestran en su campo.
      if (err.errors) setErrors(err.errors)
      setSubmitError(err.message || 'No se pudo guardar.')
      setIsSaving(false)
    }
  }

  function renderField(field) {
    const value = values[field.name]
    const error = errors[field.name]
    const onInput = (event) => setValue(field.name, event.target.value)

    switch (field.type) {
      case 'image':
        return <ImageField key={field.name} field={field} value={value} onChange={setValue} error={error} />
      case 'technologies':
        return <TechnologiesField key={field.name} field={field} value={value} onChange={setValue} />
      case 'checkbox':
        return (
          <label key={field.name} className={styles.checkboxRow}>
            <input type="checkbox" checked={value} onChange={(event) => setValue(field.name, event.target.checked)} />
            {field.label}
          </label>
        )
      case 'select':
        return (
          <div key={field.name} className={styles.field}>
            <label htmlFor={`field-${field.name}`} className={styles.label}>
              {field.label}
            </label>
            <select id={`field-${field.name}`} value={value} onChange={onInput} className={styles.select}>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )
      case 'textarea':
        return (
          <FormField key={field.name} as="textarea" rows={field.rows || 4} label={field.label} name={field.name} value={value} onChange={onInput} error={error} hint={field.hint} />
        )
      default:
        return (
          <FormField
            key={field.name}
            type={field.type || 'text'}
            label={field.label}
            name={field.name}
            value={value}
            onChange={onInput}
            error={error}
            hint={field.hint}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
          />
        )
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {fields.map(renderField)}

      {submitError && <ErrorMessage>{submitError}</ErrorMessage>}

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSaving} disabled={isSaving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
