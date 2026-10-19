// QUÉ HACE: Acceso a la tabla "technologies" (usa el service genérico de
// crud.service.js).
import { createCrudService } from './crud.service.js'

export const technologiesService = createCrudService({ table: 'technologies', order: [['name', true]] })
