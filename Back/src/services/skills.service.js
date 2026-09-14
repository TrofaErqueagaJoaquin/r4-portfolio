import { supabase } from '../config/supabaseClient.js'

export const skillsService = {
  async list() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('level', { ascending: false })

    if (error) throw error
    return data
  },
}
