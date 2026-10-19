// QUÉ HACE: Habla con Supabase Auth para comprobar email y contraseña; si
// son correctos devuelve el token de sesión.
import { createSupabaseClient } from '../config/supabaseClient.js'

export const authService = {
  async login(email, password) {
    // IMPORTANTE: el login se hace con una conexión NUEVA y descartable, no
    // con la conexión compartida del backend. Si se iniciara sesión en la
    // compartida, Supabase pasaría a usar el token de ese usuario en todas
    // las consultas siguientes (en vez de la clave de administrador), y las
    // políticas de seguridad bloquearían cualquier escritura con el error
    // "new row violates row-level security policy". Pasó en producción.
    const authClient = createSupabaseClient()
    const { data, error } = await authClient.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
      const invalidCredentials = new Error('Email o contraseña incorrectos.')
      invalidCredentials.status = 401
      throw invalidCredentials
    }

    return {
      token: data.session.access_token,
      user: { id: data.user.id, email: data.user.email },
    }
  },
}
