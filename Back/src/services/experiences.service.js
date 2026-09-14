import { supabase } from '../config/supabaseClient.js'

export const experiencesService = {
  async list() {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) throw error
    return data
  },
}
