import styles from './FormField.module.css'

/** Input/textarea con label asociado, mensaje de error accesible
 * (aria-describedby + role="alert") y estado visual de campo inválido. */
export function FormField({ label, name, type = 'text', value, onChange, error, as = 'input', ...rest }) {
  const Tag = as
  const fieldId = `field-${name}`
  const errorId = `${fieldId}-error`

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
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
