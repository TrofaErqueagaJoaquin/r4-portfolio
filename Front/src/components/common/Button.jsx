import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import styles from './Button.module.css'

/**
 * Botón único para toda la app: variantes de color, tamaños, estado de
 * carga y la posibilidad de renderizarse como <a> (pasando `href`) sin
 * perder el mismo look & feel. Evita reimplementar estilos de botón en
 * cada sección. Usa forwardRef porque ConfirmDialog necesita enfocar el
 * botón "Cancelar" apenas se abre el diálogo (patrón de accesibilidad).
 */
export const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', href, isLoading = false, className = '', ...rest },
  ref,
) {
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button ref={ref} className={classes} disabled={isLoading || rest.disabled} {...rest}>
      {isLoading && <Loader2 className={styles.spinnerIcon} size={16} aria-hidden="true" />}
      {children}
    </button>
  )
})
