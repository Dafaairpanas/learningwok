import { supabase, type Kosakata } from '../supabase';

export const KosakataService = {
  async getAll(page = 1, limit = 50, filters?: Partial<Kosakata>) {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    let query = supabase
      .from('kosakata')
      .select('*', { count: 'exact' });

    if (filters) {
      if (filters.jlpt_level) query = query.eq('jlpt_level', filters.jlpt_level);
      // Search by kanji, hiragana, or meaning
      if (filters.kanji) { // borrowing 'kanji' field for general search query if needed, or specific
         query = query.or(`kanji.ilike.%${filters.kanji}%,hiragana.ilike.%${filters.kanji}%,meaning.ilike.%${filters.kanji}%`);
      }
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { data: data as Kosakata[], count };
  },

  async getById(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    const { data, error } = await supabase
      .from('kosakata')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Kosakata;
  },

  async create(kosakata: Omit<Kosakata, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase
      .from('kosakata')
      .insert(kosakata)
      .select()
      .single();

    if (error) throw error;
    return data as Kosakata;
  },

  async update(id: string, updates: Partial<Omit<Kosakata, 'id' | 'created_at'>>) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase
      .from('kosakata')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Kosakata;
  },

  async delete(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase
      .from('kosakata')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
