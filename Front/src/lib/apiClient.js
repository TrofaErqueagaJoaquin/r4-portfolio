// Envoltorio delgado sobre fetch para hablar con el backend (Express).
// Centraliza la URL base, el parseo de JSON y el formato de errores para
// que los servicios (src/services) no repitan ese código en cada llamada.

const API_URL = import.meta.env.VITE_API_URL || ''

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

async function request(path, { method = 'GET', body, token, headers } = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Verificá tu conexión.', 0)
  }

  // 204 (ej. DELETE) legítimamente no trae cuerpo.
  if (response.status === 204) return null

  // Si la respuesta no es JSON, se trata como error aunque el status HTTP
  // sea 200: en producción, si VITE_API_URL apunta mal, el rewrite de SPA
  // (vercel.json) puede devolver el index.html con status 200 en vez de
  // fallar la petición — sin este chequeo, ese HTML se interpretaba como
  // "éxito sin datos" (null) y los componentes reventaban al tratar de
  // iterar un array que en realidad era null, tirando abajo toda la app
  // (no hay Error Boundary global a propósito, ver ErrorBoundary.jsx).
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json().catch(() => null) : null

  if (!response.ok || !isJson) {
    const message = data?.message || `Error ${response.status} al conectar con el servidor.`
    throw new ApiError(message, response.status, data?.errors)
  }

  return data
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
