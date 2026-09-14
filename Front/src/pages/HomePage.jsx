import { Layout } from '../components/layout/Layout.jsx'
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx'
import { Hero } from '../components/sections/Hero.jsx'
import { About } from '../components/sections/About.jsx'
import { Skills } from '../components/sections/Skills.jsx'
import { Experience } from '../components/sections/Experience.jsx'
import { ProjectsSection } from '../components/projects/ProjectsSection.jsx'
import { Goals } from '../components/sections/Goals.jsx'
import { Contact } from '../components/sections/Contact.jsx'

// Cada sección va envuelta en su propio ErrorBoundary: si una llegara a
// fallar de forma inesperada, las demás siguen funcionando en vez de
// que la página entera quede en blanco.
export function HomePage() {
  return (
    <Layout>
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary>
        <About />
      </ErrorBoundary>
      <ErrorBoundary>
        <Skills />
      </ErrorBoundary>
      <ErrorBoundary>
        <Experience />
      </ErrorBoundary>
      <ErrorBoundary>
        <ProjectsSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <Goals />
      </ErrorBoundary>
      <ErrorBoundary>
        <Contact />
      </ErrorBoundary>
    </Layout>
  )
}
