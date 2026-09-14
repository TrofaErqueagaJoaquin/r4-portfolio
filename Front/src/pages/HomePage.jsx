import { Layout } from '../components/layout/Layout.jsx'
import { Hero } from '../components/sections/Hero.jsx'
import { About } from '../components/sections/About.jsx'
import { Skills } from '../components/sections/Skills.jsx'
import { Experience } from '../components/sections/Experience.jsx'
import { ProjectsSection } from '../components/projects/ProjectsSection.jsx'
import { Goals } from '../components/sections/Goals.jsx'
import { Contact } from '../components/sections/Contact.jsx'

export function HomePage() {
  return (
    <Layout>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <ProjectsSection />
      <Goals />
      <Contact />
    </Layout>
  )
}
