import { createCrudService } from './crud.service.js'

export const technologiesService = createCrudService({ table: 'technologies', order: [['name', true]] })
