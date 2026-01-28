import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export type KanjiInsert = Database['public']['Tables']['kanji']['Insert'];
export type KanjiUpdate = Database['public']['Tables']['kanji']['Update'];
export type KosakataInsert = Database['public']['Tables']['kosakata']['Insert'];
export type KosakataUpdate = Database['public']['Tables']['kosakata']['Update'];
export type BunpoInsert = Database['public']['Tables']['bunpo']['Insert'];
export type BunpoUpdate = Database['public']['Tables']['bunpo']['Update'];

// Roadmap Types
export type LearningDayInsert = Database['public']['Tables']['learning_days']['Insert'];
export type LearningDayUpdate = Database['public']['Tables']['learning_days']['Update'];
export type LearningDayRow = Database['public']['Tables']['learning_days']['Row'];
export type LearningTopicInsert = Database['public']['Tables']['learning_day_topics']['Insert'];
export type LearningTopicUpdate = Database['public']['Tables']['learning_day_topics']['Update'];
export type LearningTopicRow = Database['public']['Tables']['learning_day_topics']['Row'];
export type TopicKanjiInsert = Database['public']['Tables']['learning_topic_kanji']['Insert'];
export type TopicKosakataInsert = Database['public']['Tables']['learning_topic_kosakata']['Insert'];
export type TopicBunpoInsert = Database['public']['Tables']['learning_topic_bunpo']['Insert'];

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
  },

  // ============================================
  // Learning Days CRUD
  // ============================================
  async getLearningDays(level?: string) {
    let query = supabase
      .from('learning_days')
      .select(`
        *,
        topics:learning_day_topics(count)
      `)
      .order('jlpt_level', { ascending: false })
      .order('day_number', { ascending: true });
    
    if (level) {
      query = query.eq('jlpt_level', level);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getLearningDayById(id: string) {
    const { data, error } = await supabase
      .from('learning_days')
      .select(`
        *,
        topics:learning_day_topics(
          id, title, content_type, sort_order,
          kanji_items:learning_topic_kanji(id, kanji_id, note, sort_order, kanji:kanji(id, character, meaning)),
          kosakata_items:learning_topic_kosakata(id, kosakata_id, note, sort_order, kosakata:kosakata(id, kanji, hiragana, meaning)),
          bunpo_items:learning_topic_bunpo(id, bunpo_id, note, sort_order, bunpo:bunpo(id, pattern, meaning))
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createLearningDay(day: LearningDayInsert) {
    const { data, error } = await supabase.from('learning_days').insert(day).select().single();
    if (error) throw error;
    return data;
  },

  async updateLearningDay(id: string, updates: LearningDayUpdate) {
    const { data, error } = await supabase.from('learning_days').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteLearningDay(id: string) {
    const { error } = await supabase.from('learning_days').delete().eq('id', id);
    if (error) throw error;
  },

  // ============================================
  // Learning Topics CRUD
  // ============================================
  async createTopic(topic: LearningTopicInsert) {
    const { data, error } = await supabase.from('learning_day_topics').insert(topic).select().single();
    if (error) throw error;
    return data;
  },

  async updateTopic(id: string, updates: LearningTopicUpdate) {
    const { data, error } = await supabase.from('learning_day_topics').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteTopic(id: string) {
    const { error } = await supabase.from('learning_day_topics').delete().eq('id', id);
    if (error) throw error;
  },

  // ============================================
  // Topic Items (Link/Unlink)
  // ============================================
  async addKanjiToTopic(topicId: string, kanjiId: string, note?: string, sortOrder?: number) {
    const { data, error } = await supabase.from('learning_topic_kanji').insert({
      topic_id: topicId,
      kanji_id: kanjiId,
      note: note || null,
      sort_order: sortOrder || 0
    }).select().single();
    if (error) throw error;
    return data;
  },

  async removeKanjiFromTopic(id: string) {
    const { error } = await supabase.from('learning_topic_kanji').delete().eq('id', id);
    if (error) throw error;
  },

  async updateKanjiNote(id: string, note: string) {
    const { error } = await supabase.from('learning_topic_kanji').update({ note }).eq('id', id);
    if (error) throw error;
  },

  async addKosakataToTopic(topicId: string, kosakataId: string, note?: string, sortOrder?: number) {
    const { data, error } = await supabase.from('learning_topic_kosakata').insert({
      topic_id: topicId,
      kosakata_id: kosakataId,
      note: note || null,
      sort_order: sortOrder || 0
    }).select().single();
    if (error) throw error;
    return data;
  },

  async removeKosakataFromTopic(id: string) {
    const { error } = await supabase.from('learning_topic_kosakata').delete().eq('id', id);
    if (error) throw error;
  },

  async updateKosakataNote(id: string, note: string) {
    const { error } = await supabase.from('learning_topic_kosakata').update({ note }).eq('id', id);
    if (error) throw error;
  },

  async addBunpoToTopic(topicId: string, bunpoId: string, note?: string, sortOrder?: number) {
    const { data, error } = await supabase.from('learning_topic_bunpo').insert({
      topic_id: topicId,
      bunpo_id: bunpoId,
      note: note || null,
      sort_order: sortOrder || 0
    }).select().single();
    if (error) throw error;
    return data;
  },

  async removeBunpoFromTopic(id: string) {
    const { error } = await supabase.from('learning_topic_bunpo').delete().eq('id', id);
    if (error) throw error;
  },

  async updateBunpoNote(id: string, note: string) {
    const { error } = await supabase.from('learning_topic_bunpo').update({ note }).eq('id', id);
    if (error) throw error;
  }
};

