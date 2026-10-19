import { useRef, useState } from 'react'
import { ImageUp, Loader2 } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth.js'
import { uploadImage } from '../../../services/adminService.js'
import { FormField } from '../../../components/contact/FormField.jsx'
import styles from '../ResourceForm.module.css'

/** URL de imagen editable a mano, o completada sola al subir un archivo
 * (se guarda en Supabase Storage y acá queda la URL pública). */
export function ImageField({ field, value, onChange, error }) {
  const { token } = useAuth()
  const inputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setIsUploading(true)
    setUploadError('')
    try {
      onChange(field.name, await uploadImage(file, token))
    } catch (err) {
      setUploadError(err.message || 'No se pudo subir la imagen.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={styles.imageField}>
      <FormField
        label={field.label}
        name={field.name}
        type="url"
        value={value}
        onChange={(event) => onChange(field.name, event.target.value)}
        error={error || uploadError}
        hint="Pegá una URL o subí un archivo (JPG, PNG, WEBP o GIF, hasta 3 MB)."
        placeholder="https://…"
      />
      <div className={styles.imageActions}>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={handleFile} />
        <button type="button" className={styles.uploadButton} onClick={() => inputRef.current?.click()} disabled={isUploading}>
          {isUploading ? <Loader2 size={16} className={styles.spinIcon} aria-hidden="true" /> : <ImageUp size={16} aria-hidden="true" />}
          {isUploading ? 'Subiendo…' : 'Subir imagen'}
        </button>
        {value && <img src={value} alt="Vista previa de la imagen del proyecto" className={styles.preview} />}
      </div>
    </div>
  )
}
