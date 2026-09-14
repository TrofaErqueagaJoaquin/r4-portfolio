// Contenido estático de la sección "Objetivos e intereses". No requiere
// base de datos: es texto de presentación, no un recurso que se liste,
// filtre o administre (a diferencia de proyectos, habilidades o experiencia).
import { Cpu, Workflow, Lightbulb, GraduationCap } from 'lucide-react'

export const goals = [
  {
    id: 'automatizacion',
    icon: Workflow,
    title: 'Automatización',
    description: 'Detectar tareas repetitivas y resolverlas con scripts o pequeñas herramientas a medida.',
  },
  {
    id: 'tecnologia',
    icon: Cpu,
    title: 'Tecnología',
    description: 'Entender cómo funcionan las herramientas que uso, no solo usarlas de forma superficial.',
  },
  {
    id: 'soluciones',
    icon: Lightbulb,
    title: 'Soluciones prácticas',
    description: 'Priorizar que las cosas funcionen y resuelvan un problema real por sobre la complejidad innecesaria.',
  },
  {
    id: 'aprendizaje',
    icon: GraduationCap,
    title: 'Aprendizaje continuo',
    description: 'Seguir formándome después de la secundaria, en tecnologías nuevas y en las bases que no cambian.',
  },
]
