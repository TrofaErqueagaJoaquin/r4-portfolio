import { useCallback, useEffect, useState } from 'react'
import { Archive, Mail, MailOpen, Trash2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { useResourceList } from '../../hooks/useResourceList.js'
import { useTimedMessage } from '../../hooks/useTimedMessage.js'
import { messagesService } from '../../services/adminService.js'
import { MESSAGE_STATUSES, labelFor } from '../../lib/constants.js'
import { Badge } from '../../components/common/Badge.jsx'
import { Spinner } from '../../components/common/Spinner.jsx'
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx'
import { EmptyState } from '../../components/common/EmptyState.jsx'
import { ConfirmDialog } from './ConfirmDialog.jsx'
import styles from './MessagesPanel.module.css'

const STATUS_TONE = { new: 'accent', read: 'neutral', archived: 'neutral' }

function formatDateTime(value) {
  return new Date(value).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

/** Bandeja de los mensajes que llegan por el formulario de contacto. No
 * tiene "alta" (los crea el formulario público): se listan, se cambian de
 * estado (nuevo / leído / archivado) y se eliminan. */
export function MessagesPanel() {
  const { token, logout } = useAuth()
  const loader = useCallback(() => messagesService.list(token), [token])
  const { items, status, error, errorMessage, reload } = useResourceList(loader)
  const { message, show } = useTimedMessage()
  const [filter, setFilter] = useState('active') // active = nuevos + leídos
  const [deleting, setDeleting] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (error?.status === 401) logout()
  }, [error, logout])

  async function setStatus(item, nextStatus) {
    try {
      await messagesService.setStatus(item.id, nextStatus, token)
      reload()
    } catch (err) {
      if (err.status === 401) logout()
      show('error', err.message || 'No se pudo actualizar el mensaje.')
    }
  }

  async function handleConfirmDelete() {
    setIsDeleting(true)
    try {
      await messagesService.remove(deleting.id, token)
      show('success', 'Mensaje eliminado.')
      setDeleting(null)
      reload()
    } catch (err) {
      if (err.status === 401) logout()
      show('error', err.message || 'No se pudo eliminar el mensaje.')
    } finally {
      setIsDeleting(false)
    }
  }

  const visible = items.filter((item) => (filter === 'archived' ? item.status === 'archived' : item.status !== 'archived'))
  const unread = items.filter((item) => item.status === 'new').length

  return (
    <section aria-labelledby="admin-messages-title">
      <div className={styles.toolbar}>
        <h2 id="admin-messages-title" className={styles.sectionTitle}>
          Mensajes {unread > 0 && <Badge tone="accent">{unread} sin leer</Badge>}
        </h2>
        <div className={styles.filters} role="group" aria-label="Filtrar mensajes">
          <button type="button" data-active={filter === 'active'} aria-pressed={filter === 'active'} onClick={() => setFilter('active')}>
            Bandeja
          </button>
          <button type="button" data-active={filter === 'archived'} aria-pressed={filter === 'archived'} onClick={() => setFilter('archived')}>
            Archivados
          </button>
        </div>
      </div>

      {message && (
        <div className={styles.banner} data-type={message.type} role="status">
          {message.text}
        </div>
      )}

      {status === 'loading' && items.length === 0 && <Spinner label="Cargando mensajes…" />}
      {status === 'error' && <ErrorMessage onRetry={reload}>{errorMessage}</ErrorMessage>}
      {status === 'success' && visible.length === 0 && (
        <EmptyState icon={Mail} title={filter === 'archived' ? 'No hay mensajes archivados.' : 'No hay mensajes nuevos.'} />
      )}

      <ul className={styles.list}>
        {visible.map((item) => (
          <li key={item.id} className={styles.card} data-unread={item.status === 'new'}>
            <div className={styles.cardHead}>
              <div>
                <p className={styles.name}>{item.name}</p>
                <a className={styles.email} href={`mailto:${item.email}`}>
                  {item.email}
                </a>
              </div>
              <div className={styles.meta}>
                <Badge tone={STATUS_TONE[item.status]}>{labelFor(MESSAGE_STATUSES, item.status)}</Badge>
                <time dateTime={item.created_at}>{formatDateTime(item.created_at)}</time>
              </div>
            </div>
            <p className={styles.body}>{item.message}</p>
            <div className={styles.actions}>
              {item.status === 'new' ? (
                <button type="button" onClick={() => setStatus(item, 'read')}>
                  <MailOpen size={15} aria-hidden="true" /> Marcar como leído
                </button>
              ) : (
                <button type="button" onClick={() => setStatus(item, 'new')}>
                  <Mail size={15} aria-hidden="true" /> Marcar como no leído
                </button>
              )}
              {item.status !== 'archived' ? (
                <button type="button" onClick={() => setStatus(item, 'archived')}>
                  <Archive size={15} aria-hidden="true" /> Archivar
                </button>
              ) : (
                <button type="button" onClick={() => setStatus(item, 'read')}>
                  <Archive size={15} aria-hidden="true" /> Sacar de archivados
                </button>
              )}
              <button type="button" className={styles.danger} onClick={() => setDeleting(item)}>
                <Trash2 size={15} aria-hidden="true" /> Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        title="¿Eliminar mensaje?"
        description={deleting ? `Se va a eliminar el mensaje de ${deleting.name} de forma permanente.` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
        isLoading={isDeleting}
      />
    </section>
  )
}
