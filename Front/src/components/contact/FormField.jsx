import styles from './FormField.module.css'

/** Input/textarea con label asociado, ayuda opcional (`hint`), mensaje de
 * error accesible (aria-describedby + role="alert") y estado visual de
 * campo inválido. Se usa en el formulario de contacto y en el panel admin. */
export function FormField({ label, name, type = 'text', value, onChange, error, hint, as = 'input', ...rest }) {
  const Tag = as
  const fieldId = `field-${name}`
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={styles.field}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>
      <Tag
        id={fieldId}
        name={name}
        type={as === 'input' ? type : undefined}
        value={value}
        onChange={onChange}
        className={styles.input}
        data-invalid={Boolean(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
      />
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
