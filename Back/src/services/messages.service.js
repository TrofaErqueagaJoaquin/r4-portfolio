import { createCrudService } from './crud.service.js'

// Bandeja de mensajes del formulario de contacto (solo admin).
export const messagesService = createCrudService({ table: 'contact_messages', order: [['created_at', false]] })
