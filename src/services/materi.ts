import { supabase } from '../lib/supabase';
import { cacheData, getCachedData, isOnline } from '../lib/cache';
import type { Database } from '../types/database.types';

export type KanjiWithLevel = Database['public']['Tables']['kanji']['Row'] & {
  jlpt_levels: {
    name: string;
    color: string | null;
  } | null;
  categories: {
    slug: string;
    name: string;
  } | null;
};

export type KosakataWithLevel = Database['public']['Tables']['kosakata']['Row'] & {
  jlpt_levels: {
    name: string;
    color: string | null;
  } | null;
  categories: {
    slug: string;
    name: string;
  } | null;
};

export type BunpoWithLevel = Database['public']['Tables']['bunpo']['Row'] & {
  jlpt_levels: {
    name: string;
    color: string | null;
  } | null;
  categories: {
    slug: string;
    name: string;
  } | null;
};

const CACHE_KEYS = {
  KANJI: 'kanji_all',
  KOSAKATA: 'kosakata_all',
  BUNPO: 'bunpo_all',
};

export const materiService = {
  async getKanji(limit = 10000): Promise<KanjiWithLevel[]> {
    // Try cache first if offline
    if (!isOnline()) {
      const cached = await getCachedData<KanjiWithLevel[]>(CACHE_KEYS.KANJI);
      if (cached) {
        console.log('[Offline] Returning cached kanji data');
        return cached.slice(0, limit);
      }
    }

    try {
      const batchSize = 1000;
      const batchCount = Math.ceil(limit / batchSize);
      
      const promises = Array.from({ length: batchCount }, (_, i) => {
          const from = i * batchSize;
          const to = from + batchSize - 1;
          return supabase
            .from('kanji')
            .select('*, jlpt_levels(name, color), categories(slug, name)')
            .range(from, to);
      });

      const results = await Promise.all(promises);
      
      const allData = results.flatMap(r => {
          if (r.error) {
              console.error('Error fetching kanji batch:', r.error);
              return [];
          }
          return r.data || [];
      });
      
      const data = allData.slice(0, limit) as KanjiWithLevel[];
      
      // Cache for offline use
      await cacheData(CACHE_KEYS.KANJI, data);
      
      return data;
    } catch (error) {
      console.error('Network error fetching kanji:', error);
      // Fallback to cache
      const cached = await getCachedData<KanjiWithLevel[]>(CACHE_KEYS.KANJI);
      if (cached) {
        console.log('[Fallback] Returning cached kanji data');
        return cached.slice(0, limit);
      }
      return [];
    }
  },

  async getKosakata(limit = 5000): Promise<KosakataWithLevel[]> {
    // Try cache first if offline
    if (!isOnline()) {
      const cached = await getCachedData<KosakataWithLevel[]>(CACHE_KEYS.KOSAKATA);
      if (cached) {
        console.log('[Offline] Returning cached kosakata data');
        return cached.slice(0, limit);
      }
    }

    try {
      const batchSize = 1000;
      const batchCount = Math.ceil(limit / batchSize);
      
      const promises = Array.from({ length: batchCount }, (_, i) => {
          const from = i * batchSize;
          const to = from + batchSize - 1;
          return supabase
            .from('kosakata')
            .select('*, jlpt_levels(name, color), categories(slug, name)')
            .range(from, to);
      });

      const results = await Promise.all(promises);
      
      const allData = results.flatMap(r => {
          if (r.error) {
              console.error('Error fetching kosakata batch:', r.error);
              return [];
          }
          return r.data || [];
      });
      
      const data = allData.slice(0, limit) as KosakataWithLevel[];
      
      // Cache for offline use
      await cacheData(CACHE_KEYS.KOSAKATA, data);
      
      return data;
    } catch (error) {
      console.error('Network error fetching kosakata:', error);
      const cached = await getCachedData<KosakataWithLevel[]>(CACHE_KEYS.KOSAKATA);
      if (cached) {
        console.log('[Fallback] Returning cached kosakata data');
        return cached.slice(0, limit);
      }
      return [];
    }
  },

  async getBunpo(limit = 1000): Promise<BunpoWithLevel[]> {
    // Try cache first if offline
    if (!isOnline()) {
      const cached = await getCachedData<BunpoWithLevel[]>(CACHE_KEYS.BUNPO);
      if (cached) {
        console.log('[Offline] Returning cached bunpo data');
        return cached.slice(0, limit);
      }
    }

    try {
      const { data, error } = await supabase
        .from('bunpo')
        .select('*, jlpt_levels(name, color), categories(slug, name)')
        .limit(limit);

      if (error) {
        throw error;
      }

      const result = data as BunpoWithLevel[];
      
      // Cache for offline use
      await cacheData(CACHE_KEYS.BUNPO, result);
      
      return result;
    } catch (error) {
      console.error('Network error fetching bunpo:', error);
      const cached = await getCachedData<BunpoWithLevel[]>(CACHE_KEYS.BUNPO);
      if (cached) {
        console.log('[Fallback] Returning cached bunpo data');
        return cached.slice(0, limit);
      }
      return [];
    }
  },
  
  async getKanjiByLevel(level: string): Promise<KanjiWithLevel[]> {
       const { data, error } = await supabase
      .from('kanji')
      .select('*, jlpt_levels!inner(name, color)')
      .eq('jlpt_level', level);

    if (error) {
      console.error(`Error fetching kanji for level ${level}:`, error);
      return [];
    }
    
    return data as KanjiWithLevel[];
  }
};
