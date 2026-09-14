import { Resend } from 'resend'
import { env } from '../config/env.js'

const resend = env.isEmailConfigured ? new Resend(env.resendApiKey) : null

function escapeHtml(value) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return value.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Notificación por email de un nuevo mensaje de contacto. Es un "extra":
 * si RESEND_API_KEY / CONTACT_TO_EMAIL no están configuradas, se omite
 * en silencio (con un aviso en consola) — el mensaje ya quedó guardado
 * en Supabase de todas formas, que es lo que realmente importa.
 */
export async function sendContactNotification(message) {
  if (!resend) {
    console.warn('Envío de email no configurado (faltan RESEND_API_KEY / CONTACT_TO_EMAIL). El mensaje quedó guardado en la base igual.')
    return
  }

  await resend.emails.send({
    from: env.contactFromEmail,
    to: env.contactToEmail,
    subject: `Nuevo mensaje de contacto de ${message.name}`,
    html: `
      <p><strong>Nombre:</strong> ${escapeHtml(message.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(message.email)}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${escapeHtml(message.message).replace(/\n/g, '<br />')}</p>
    `,
  })
}
