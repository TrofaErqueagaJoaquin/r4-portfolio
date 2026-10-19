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

    // Se ESPERA al envío del mail antes de responder: en Vercel la función
    // se congela apenas se envía la respuesta, así que una promesa "suelta"
    // nunca llegaba a mandar el mail (bug real: ningún aviso se había
    // enviado). Igual se atrapa el error: si el mail falla, el mensaje ya
    // quedó guardado y el formulario no debe mostrar error por eso.
    try {
      await sendContactNotification(data)
    } catch (err) {
      console.error('No se pudo enviar el email de notificación de contacto:', err.message)
    }

    return data
  },
}
