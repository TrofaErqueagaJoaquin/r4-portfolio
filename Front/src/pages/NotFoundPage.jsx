import { Button } from '../components/common/Button.jsx'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <main className={styles.wrapper}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Esta página no existe.</h1>
      <p className={styles.description}>Puede que el link esté roto o la página se haya movido.</p>
      <Button href="/">Volver al inicio</Button>
    </main>
  )
}
