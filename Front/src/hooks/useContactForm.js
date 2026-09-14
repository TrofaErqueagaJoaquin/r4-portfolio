import { useState } from 'react'
import { validateContactForm, hasErrors } from '../lib/validators.js'
import { contactService } from '../services/contactService.js'

const initialValues = { name: '', email: '', message: '' }

/**
 * Estado completo del formulario de contacto: valores, errores de
 * validación por campo, y el estado de envío (idle/submitting/success/error).
 * Mantenerlo en un hook separa esa lógica del JSX de ContactForm.
 */
export function useContactForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverError, setServerError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateContactForm(values)
    setErrors(validationErrors)
    if (hasErrors(validationErrors)) return

    setStatus('submitting')
    setServerError('')
    try {
      await contactService.send(values)
      setStatus('success')
      setValues(initialValues)
    } catch (err) {
      setStatus('error')
      setServerError(err.message || 'No se pudo enviar el mensaje. Probá de nuevo en unos minutos.')
    }
  }

  function resetStatus() {
    setStatus('idle')
  }

  return { values, errors, status, serverError, handleChange, handleSubmit, resetStatus }
}
