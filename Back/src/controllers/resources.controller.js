// QUÉ HACE: Arma los controladores de habilidades, experiencia,
// tecnologías y mensajes usando el controlador genérico
// (crud.controller.js).
import { createCrudController } from './crud.controller.js'
import { skillsService } from '../services/skills.service.js'
import { experiencesService } from '../services/experiences.service.js'
import { technologiesService } from '../services/technologies.service.js'
import { messagesService } from '../services/messages.service.js'
import { validateSkill, skillToRow } from '../validators/skill.validator.js'
import { validateExperience, experienceToRow } from '../validators/experience.validator.js'
import { validateTechnology, technologyToRow } from '../validators/technology.validator.js'
import { MESSAGE_STATUSES } from '../validators/common.js'

export const skillsController = createCrudController({
  service: skillsService,
  validate: validateSkill,
  toRow: skillToRow,
  label: 'la habilidad',
})

export const experiencesController = createCrudController({
  service: experiencesService,
  validate: validateExperience,
  toRow: experienceToRow,
  label: 'la experiencia',
})

export const technologiesController = createCrudController({
  service: technologiesService,
  validate: validateTechnology,
  toRow: technologyToRow,
  label: 'la tecnología',
})

// Los mensajes solo se listan, se marcan (nuevo/leído/archivado) o se
// borran: nunca se crean desde el panel (los crea el formulario público).
export const messagesController = createCrudController({
  service: messagesService,
  validate: (body = {}) => (MESSAGE_STATUSES.includes(body.status) ? {} : { status: 'Estado inválido.' }),
  toRow: (body) => ({ status: body.status }),
  label: 'el mensaje',
})
