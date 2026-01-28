import { supabase, type Grammar } from '../supabase';

export const BunpoService = {
  async getAll(page = 1, limit = 50, filters?: Partial<Grammar>) {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    let query = supabase
      .from('bunpo')
      .select('*', { count: 'exact' });

    if (filters) {
      if (filters.jlpt_level) query = query.eq('jlpt_level', filters.jlpt_level);
      if (filters.pattern) query = query.ilike('pattern', `%${filters.pattern}%`);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { data: data as Grammar[], count };
  },

  async getById(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    const { data, error } = await supabase
      .from('bunpo')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Grammar;
  },

  async create(bunpo: Omit<Grammar, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase
      .from('bunpo')
      .insert(bunpo)
      .select()
      .single();

    if (error) throw error;
    return data as Grammar;
  },

  async update(id: string, updates: Partial<Omit<Grammar, 'id' | 'created_at'>>) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase
      .from('bunpo')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Grammar;
  },

  async delete(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase
      .from('bunpo')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
