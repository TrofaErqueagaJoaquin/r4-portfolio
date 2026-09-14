// Contenido estático de la sección "Objetivos e intereses". No requiere
// base de datos: es texto de presentación, no un recurso que se liste,
// filtre o administre (a diferencia de proyectos, habilidades o experiencia).
import { Code2, Cpu, Lightbulb, GraduationCap } from 'lucide-react'

export const goals = [
  {
    id: 'desarrollo-web',
    icon: Code2,
    title: 'Desarrollo web',
    description: 'Seguir mejorando en desarrollo web, construyendo interfaces claras y sistemas que la gente realmente use.',
  },
  {
    id: 'automatizacion-electronica',
    icon: Cpu,
    title: 'Automatización y electrónica',
    description: 'Explorar la relación entre informática, electrónica y automatización: de Arduino a la automatización de espacios y dispositivos.',
  },
  {
    id: 'impacto-real',
    icon: Lightbulb,
    title: 'Proyectos con impacto real',
    description: 'Priorizar soluciones útiles para organizaciones, empresas y usuarios reales antes que ejercicios de práctica sin destino.',
  },
  {
    id: 'aprendizaje-continuo',
    icon: GraduationCap,
    title: 'Aprendizaje continuo',
    description: 'Aprender de quienes saben más y, a futuro, animarme a desarrollar proyectos propios o sumarme a un emprendimiento.',
  },
]
