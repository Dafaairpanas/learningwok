import { supabase, type Kanji } from '../supabase';

export const KanjiService = {
  async getAll(page = 1, limit = 50, filters?: Partial<Kanji>) {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    let query = supabase
      .from('kanji')
      .select('*', { count: 'exact' });

    if (filters) {
      if (filters.jlpt_level) query = query.eq('jlpt_level', filters.jlpt_level);
      if (filters.character) query = query.ilike('character', `%${filters.character}%`);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { data: data as Kanji[], count };
  },

  async getById(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    const { data, error } = await supabase
      .from('kanji')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Kanji;
  },

  async create(kanji: Omit<Kanji, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase
      .from('kanji')
      .insert(kanji)
      .select()
      .single();

    if (error) throw error;
    return data as Kanji;
  },

  async update(id: string, updates: Partial<Omit<Kanji, 'id' | 'created_at'>>) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase
      .from('kanji')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Kanji;
  },

  async delete(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase
      .from('kanji')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
