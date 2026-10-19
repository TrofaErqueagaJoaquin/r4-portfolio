import { createCrudService } from './crud.service.js'

// Dentro de cada categoría, de más a menos desarrollada (el nivel no se
// muestra en la web, pero sí define el orden).
export const skillsService = createCrudService({ table: 'skills', order: [['category', true], ['level', false], ['name', true]] })
