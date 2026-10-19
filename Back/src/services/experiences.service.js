// QUÉ HACE: Acceso a la tabla "experiences" (usa el service genérico de
// crud.service.js).
import { createCrudService } from './crud.service.js'

export const experiencesService = createCrudService({ table: 'experiences', order: [['start_date', false]] })
