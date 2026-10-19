import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { useResourceList } from '../../hooks/useResourceList.js'
import { useTimedMessage } from '../../hooks/useTimedMessage.js'
import { Button } from '../../components/common/Button.jsx'
import { IconButton } from '../../components/common/IconButton.jsx'
import { Spinner } from '../../components/common/Spinner.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { EmptyState } from '../../components/common/EmptyState.jsx'
import { ConfirmDialog } from './ConfirmDialog.jsx'
import { ResourceForm } from './ResourceForm.jsx'
import styles from './ResourceManager.module.css'

/**
 * ABML genérico de un recurso: Listado (tabla), Alta y Modificación
 * (mismo formulario en un modal) y Baja (con confirmación). Todo lo
 * específico de cada tabla llega por `config` (ver adminResources.jsx).
 */
export function ResourceManager({ config }) {
  const { token, logout } = useAuth()
  const loader = useCallback(() => config.service.list(token), [config, token])
  const { items, status, error, errorMessage, reload } = useResourceList(loader)
  const { message, show } = useTimedMessage()
  const [editing, setEditing] = useState(null) // null | 'new' | registro a editar
  const [deleting, setDeleting] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // El token de Supabase vence a la hora: si la API responde 401, se cierra
  // la sesión y ProtectedRoute lleva al login.
  useEffect(() => {
    if (error?.status === 401) logout()
  }, [error, logout])

  function handleAuthError(err) {
    if (err.status === 401) logout()
  }

  async function handleSave(values) {
    const payload = config.toPayload(values)
    try {
      if (editing === 'new') {
        await config.service.create(payload, token)
        show('success', 'Se agregó correctamente.')
      } else {
        await config.service.update(editing.id, payload, token)
        show('success', 'Cambios guardados.')
      }
    } catch (err) {
      handleAuthError(err)
      throw err // ResourceForm muestra el error dentro del formulario
    }
    setEditing(null)
    reload()
  }

  async function handleConfirmDelete() {
    setIsDeleting(true)
    try {
      await config.service.remove(deleting.id, token)
      show('success', `"${config.describe(deleting)}" se eliminó.`)
      setDeleting(null)
      reload()
    } catch (err) {
      handleAuthError(err)
      show('error', err.message || 'No se pudo eliminar.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Mientras se recarga después de un cambio se sigue mostrando la tabla
  // anterior (en vez de parpadear con el spinner).
  const showSpinner = status === 'loading' && items.length === 0
  const isNew = editing === 'new'

  return (
    <section aria-labelledby={`admin-${config.key}-title`}>
      <div className={styles.toolbar}>
        <h2 id={`admin-${config.key}-title`} className={styles.sectionTitle}>
          {config.title} {status === 'success' && <span className={styles.count}>({items.length})</span>}
        </h2>
        <Button onClick={() => setEditing('new')}>
          <Plus size={16} aria-hidden="true" /> Agregar {config.singular}
        </Button>
      </div>

      {message && (
        <div className={styles.banner} data-type={message.type} role="status">
          {message.text}
        </div>
      )}

      {showSpinner && <Spinner label={`Cargando ${config.title.toLowerCase()}…`} />}
      {status === 'error' && <ErrorMessage onRetry={reload}>{errorMessage}</ErrorMessage>}
      {status !== 'error' && !showSpinner && items.length === 0 && (
        <EmptyState title={`Todavía no hay ${config.title.toLowerCase()}.`} description={`Usá "Agregar ${config.singular}" para cargar el primero.`} />
      )}

      {items.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th key={column.label} scope="col">
                    {column.label}
                  </th>
                ))}
                <th scope="col">
                  <span className="visually-hidden">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {config.columns.map((column) => (
                    <td key={column.label}>{column.render(item)}</td>
                  ))}
                  <td>
                    <div className={styles.rowActions}>
                      <IconButton icon={Pencil} label={`Editar "${config.describe(item)}"`} onClick={() => setEditing(item)} />
                      <IconButton icon={Trash2} label={`Eliminar "${config.describe(item)}"`} onClick={() => setDeleting(item)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-form-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={styles.panel}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <h2 id="resource-form-title" className={styles.panelTitle}>
                {isNew ? `Agregar ${config.singular}` : `Editar "${config.describe(editing)}"`}
              </h2>
              <ResourceForm
                // key: al pasar de editar un registro a otro, el formulario se
                // reinicia con los valores nuevos en vez de conservar los viejos.
                key={isNew ? 'new' : editing.id}
                fields={config.fields}
                initialValues={config.toForm(isNew ? null : editing)}
                submitLabel={isNew ? 'Crear' : 'Guardar cambios'}
                onSubmit={handleSave}
                onCancel={() => setEditing(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        title={`¿Eliminar ${config.singular}?`}
        description={deleting ? `Se va a eliminar "${config.describe(deleting)}" de forma permanente. ${config.deleteWarning || ''}` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
        isLoading={isDeleting}
      />
    </section>
  )
}
