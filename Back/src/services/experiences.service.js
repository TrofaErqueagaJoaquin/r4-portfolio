import { createCrudService } from './crud.service.js'

export const experiencesService = createCrudService({ table: 'experiences', order: [['start_date', false]] })
