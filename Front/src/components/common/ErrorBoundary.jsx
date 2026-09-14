import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import styles from './ErrorBoundary.module.css'

/**
 * Red de seguridad ante errores inesperados de render. Es una de las
 * pocas cosas en React que todavía se escribe como clase: no existe un
 * hook equivalente a getDerivedStateFromError/componentDidCatch. Sin
 * esto, un error en CUALQUIER sección tira abajo toda la página (React
 * desmonta el árbol entero) en vez de solo esa sección — ver el bug
 * concreto que motivó agregarlo en lib/apiClient.js.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Error de render capturado por ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrapper} role="alert">
          <AlertTriangle size={20} aria-hidden="true" />
          <p>Esta sección no pudo cargarse. El resto de la página sigue funcionando.</p>
        </div>
      )
    }

    return this.props.children
  }
}
