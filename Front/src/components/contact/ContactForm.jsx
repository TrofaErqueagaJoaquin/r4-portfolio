import { Send } from 'lucide-react'
import { useContactForm } from '../../hooks/useContactForm.js'
import { Button } from '../common/Button.jsx'
import { FormField } from './FormField.jsx'
import { FormStatusMessage } from './FormStatusMessage.jsx'
import styles from './ContactForm.module.css'

export function ContactForm() {
  const { values, errors, status, serverError, handleChange, handleSubmit } = useContactForm()
  const isSubmitting = status === 'submitting'

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <FormField label="Nombre" name="name" value={values.name} onChange={handleChange} error={errors.name} autoComplete="name" />
      <FormField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
      />
      <FormField
        label="Mensaje"
        name="message"
        as="textarea"
        rows={5}
        value={values.message}
        onChange={handleChange}
        error={errors.message}
      />

      <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
        {!isSubmitting && <Send size={16} aria-hidden="true" />}
        {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
      </Button>

      <FormStatusMessage status={status} errorMessage={serverError} />
    </form>
  )
}
