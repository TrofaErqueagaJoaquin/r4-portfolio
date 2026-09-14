import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { Button } from '../../components/common/Button.jsx'
import { FormField } from '../../components/contact/FormField.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import styles from './AdminLoginPage.module.css'

export function AdminLoginPage() {
  const { login, isAuthenticated, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/admin'
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const success = await login(email, password)
    if (success) navigate('/admin', { replace: true })
  }

  return (
    <main className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.icon}>
          <Lock size={22} aria-hidden="true" />
        </div>
        <h1 className={styles.title}>Acceso administrador</h1>
        <p className={styles.description}>Solo para gestionar los proyectos del portfolio.</p>

        <FormField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          required
        />
        <FormField
          label="Contraseña"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit" isLoading={isLoading} disabled={isLoading} className={styles.submit}>
          Ingresar
        </Button>

        <a href="/" className={styles.backLink}>
          Volver al portfolio
        </a>
      </form>
    </main>
  )
}
