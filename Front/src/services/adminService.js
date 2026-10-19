import { apiClient } from '../lib/apiClient.js'

/** Las 4 operaciones del ABML para un recurso de la API. Todas mandan el
 * token del admin (el listado también, aunque en la mayoría sea público,
 * para que la misma función sirva para recursos privados como mensajes). */
export function createResourceService(path) {
  return {
    list: (token) => apiClient.get(path, { token }),
    create: (payload, token) => apiClient.post(path, payload, { token }),
    update: (id, payload, token) => apiClient.put(`${path}/${id}`, payload, { token }),
    remove: (id, token) => apiClient.delete(`${path}/${id}`, { token }),
  }
}

export const adminServices = {
  projects: createResourceService('/api/projects'),
  skills: createResourceService('/api/skills'),
  experiences: createResourceService('/api/experiences'),
  technologies: createResourceService('/api/technologies'),
}

export const messagesService = {
  list: (token) => apiClient.get('/api/messages', { token }),
  setStatus: (id, status, token) => apiClient.patch(`/api/messages/${id}`, { status }, { token }),
  remove: (id, token) => apiClient.delete(`/api/messages/${id}`, { token }),
}

const MAX_IMAGE_BYTES = 3 * 1024 * 1024

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    // readAsDataURL devuelve "data:image/png;base64,AAAA..."; el backend
    // solo necesita la parte posterior a la coma.
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    reader.readAsDataURL(file)
  })
}

export async function uploadImage(file, token) {
  if (file.size > MAX_IMAGE_BYTES) throw new Error('La imagen supera los 3 MB.')
  const data = await readAsBase64(file)
  const { url } = await apiClient.post('/api/uploads', { fileName: file.name, contentType: file.type, data }, { token })
  return url
}
