import { Navbar } from './Navbar.jsx'
import { Footer } from './Footer.jsx'
import { SkipToContent } from './SkipToContent.jsx'

/** Estructura común a toda página pública: skip-link + navbar + main + footer. */
export function Layout({ children }) {
  return (
    <>
      <SkipToContent />
      <Navbar />
      <main id="contenido-principal">{children}</main>
      <Footer />
    </>
  )
}
