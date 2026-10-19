function isValidId(id) {
  return /^\d+$/.test(id)
}

function sendError(res, error, fallback) {
  res.status(error.status || 500).json({ message: error.status ? error.message : fallback })
}

/**
 * Controlador genérico de ABML. Cada recurso aporta su service, su
 * validador y `toRow` (convierte el body recibido en las columnas que se
 * guardan: recorta textos, convierte números, vacío -> null, etc.).
 */
export function createCrudController({ service, validate, toRow, label }) {
  return {
    async list(req, res) {
      try {
        res.json(await service.list())
      } catch (error) {
        sendError(res, error, `No se pudo obtener ${label}.`)
      }
    },

    async create(req, res) {
      const errors = validate(req.body)
      if (Object.keys(errors).length > 0) return res.status(400).json({ message: 'Revisá los datos ingresados.', errors })
      try {
        res.status(201).json(await service.create(toRow(req.body)))
      } catch (error) {
        sendError(res, error, `No se pudo crear ${label}.`)
      }
    },

    async update(req, res) {
      if (!isValidId(req.params.id)) return res.status(400).json({ message: 'ID inválido.' })
      const errors = validate(req.body)
      if (Object.keys(errors).length > 0) return res.status(400).json({ message: 'Revisá los datos ingresados.', errors })
      try {
        res.json(await service.update(req.params.id, toRow(req.body)))
      } catch (error) {
        sendError(res, error, `No se pudo actualizar ${label}.`)
      }
    },

    async remove(req, res) {
      if (!isValidId(req.params.id)) return res.status(400).json({ message: 'ID inválido.' })
      try {
        await service.remove(req.params.id)
        res.status(204).send()
      } catch (error) {
        sendError(res, error, `No se pudo eliminar ${label}.`)
      }
    },
  }
}
