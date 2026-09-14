import { supabase } from '../config/supabaseClient.js'

export const technologiesService = {
  async list() {
    const { data, error } = await supabase.from('technologies').select('*').order('name', { ascending: true })
    if (error) throw error
    return data
  },
}
