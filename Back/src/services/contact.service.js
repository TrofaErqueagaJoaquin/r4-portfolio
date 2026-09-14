import { supabase } from '../config/supabaseClient.js'
import { sendContactNotification } from './email.service.js'

export const contactService = {
  async create(payload) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({ name: payload.name.trim(), email: payload.email.trim(), message: payload.message.trim() })
      .select()
      .single()

    if (error) throw error

    // El guardado en la base ya garantizó la persistencia del mensaje.
    // El email es un aviso adicional: si falla, no debe romper la
    // respuesta que ya le vamos a dar a quien completó el formulario.
    sendContactNotification(data).catch((err) => {
      console.error('No se pudo enviar el email de notificación de contacto:', err.message)
    })

    return data
  },
}
