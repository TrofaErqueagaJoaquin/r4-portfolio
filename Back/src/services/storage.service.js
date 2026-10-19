import { supabase } from '../config/supabaseClient.js'
import { ServiceError } from '../utils/ServiceError.js'
import { slugify } from '../utils/slugify.js'

const BUCKET = 'imagenes'
const ALLOWED_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
// Vercel limita el cuerpo de cada petición a ~4.5 MB y el base64 agranda
// el archivo un 33%: 3 MB reales es el máximo seguro.
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024

/** Sube una imagen (recibida en base64) a Supabase Storage y devuelve su
 * URL pública, que es lo que se guarda en la columna image_url. */
export async function uploadImage({ fileName, contentType, data }) {
  const extension = ALLOWED_TYPES[contentType]
  if (!extension) throw new ServiceError('Formato no permitido. Usá JPG, PNG, WEBP o GIF.', 400)
  if (typeof data !== 'string' || !data) throw new ServiceError('No llegó ningún archivo.', 400)

  const buffer = Buffer.from(data, 'base64')
  if (buffer.length > MAX_UPLOAD_BYTES) throw new ServiceError('La imagen supera los 3 MB.', 400)

  const baseName = slugify(String(fileName || 'imagen').replace(/\.[^.]+$/, '')) || 'imagen'
  const path = `proyectos/${Date.now()}-${baseName}.${extension}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, { contentType, upsert: false })
  if (error) throw new ServiceError(`No se pudo subir la imagen: ${error.message}`, 500)

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
