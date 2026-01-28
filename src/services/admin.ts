import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export type KanjiInsert = Database['public']['Tables']['kanji']['Insert'];
export type KanjiUpdate = Database['public']['Tables']['kanji']['Update'];
export type KosakataInsert = Database['public']['Tables']['kosakata']['Insert'];
export type KosakataUpdate = Database['public']['Tables']['kosakata']['Update'];
export type BunpoInsert = Database['public']['Tables']['bunpo']['Insert'];
export type BunpoUpdate = Database['public']['Tables']['bunpo']['Update'];

export const adminService = {
  // Kanji CRUD
  async createKanji(kanji: KanjiInsert) {
    const { data, error } = await supabase.from('kanji').insert(kanji).select().single();
    if (error) throw error;
    return data;
  },
  
  async updateKanji(id: string, updates: KanjiUpdate) {
    const { data, error } = await supabase.from('kanji').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteKanji(id: string) {
    const { error } = await supabase.from('kanji').delete().eq('id', id);
    if (error) throw error;
  },

  // Kosakata CRUD
  async createKosakata(kosakata: KosakataInsert) {
    const { data, error } = await supabase.from('kosakata').insert(kosakata).select().single();
    if (error) throw error;
    return data;
  },

  async updateKosakata(id: string, updates: KosakataUpdate) {
    const { data, error } = await supabase.from('kosakata').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteKosakata(id: string) {
    const { error } = await supabase.from('kosakata').delete().eq('id', id);
    if (error) throw error;
  },

  // Bunpo CRUD
  async createBunpo(bunpo: BunpoInsert) {
    const { data, error } = await supabase.from('bunpo').insert(bunpo).select().single();
    if (error) throw error;
    return data;
  },

  async updateBunpo(id: string, updates: BunpoUpdate) {
    const { data, error } = await supabase.from('bunpo').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteBunpo(id: string) {
    const { error } = await supabase.from('bunpo').delete().eq('id', id);
    if (error) throw error;
  }
};
