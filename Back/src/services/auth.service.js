import { supabase } from '../config/supabaseClient.js'

export const authService = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

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
