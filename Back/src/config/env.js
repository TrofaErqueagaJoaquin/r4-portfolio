import 'dotenv/config'

const missing = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'].filter((key) => !process.env[key])

if (missing.length > 0) {
  console.warn(
    `⚠️  Faltan variables de entorno: ${missing.join(', ')}. Los endpoints que dependen de Supabase van a responder 503 hasta que se configuren (ver .env.example).`,
  )
}

export const env = {
  port: Number(process.env.PORT) || 3001,
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((origin) => origin.trim()),

  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  isSupabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),

  resendApiKey: process.env.RESEND_API_KEY || '',
  contactToEmail: process.env.CONTACT_TO_EMAIL || '',
  contactFromEmail: process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev',
  isEmailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL),
}
