import { supabase } from "../lib/supabase";
import { cacheData, getCachedData, isOnline } from "../lib/cache";
import type { LearningDay, LearningTopic } from "../types/roadmap";

const CACHE_KEYS = {
  ROADMAP_LIST: 'roadmap_list',
  DAY_DETAIL: (level: string, day: number) => `roadmap_${level}_day_${day}`,
};

export const roadmapService = {
  async getRoadmapList() {
    // Try cache first if offline
    if (!isOnline()) {
      const cached = await getCachedData<LearningDay[]>(CACHE_KEYS.ROADMAP_LIST);
      if (cached) {
        console.log('[Offline] Returning cached roadmap list');
        return cached;
      }
    }

    try {
      const { data, error } = await supabase
        .from("learning_days")
        .select("*")
        .order("jlpt_level", { ascending: false })
        .order("day_number", { ascending: true });

      if (error) {
        throw error;
      }

      const result = data as LearningDay[];
      
      // Cache for offline use
      await cacheData(CACHE_KEYS.ROADMAP_LIST, result);
      
      return result;
    } catch (error) {
      console.error("Network error fetching roadmap list:", error);
      const cached = await getCachedData<LearningDay[]>(CACHE_KEYS.ROADMAP_LIST);
      if (cached) {
        console.log('[Fallback] Returning cached roadmap list');
        return cached;
      }
      return [];
    }
  },

  async getDayDetail(level: string, day: number) {
    const cacheKey = CACHE_KEYS.DAY_DETAIL(level, day);
    
    // Try cache first if offline
    if (!isOnline()) {
      const cached = await getCachedData<LearningDay>(cacheKey);
      if (cached) {
        console.log(`[Offline] Returning cached day ${day} for ${level}`);
        return cached;
      }
    }

    try {
      const { data, error } = await supabase
        .from("learning_days")
        .select(
          `
          *,
          topics:learning_day_topics (
            id,
            title,
            content_type,
            sort_order,
            kanji_items:learning_topic_kanji (
              note,
              sort_order,
              kanji:kanji ( id, character, meaning, onyomi, kunyomi )
            ),
            kosakata_items:learning_topic_kosakata (
              note,
              sort_order,
              kosakata:kosakata ( id, kanji, hiragana, romaji, meaning )
            ),
            bunpo_items:learning_topic_bunpo (
              note,
              sort_order,
              bunpo:bunpo ( id, pattern, meaning )
            )
          )
        `
        )
        .eq("jlpt_level", level)
        .eq("day_number", day)
        .order('sort_order', { foreignTable: 'learning_day_topics', ascending: true })
        .single();

      if (error) {
        throw error;
      }

      // Sort topics and items manually
      if (data && data.topics) {
          data.topics.sort((a: any, b: any) => a.sort_order - b.sort_order);
          
          data.topics.forEach((topic: any) => {
              if (topic.kanji_items) topic.kanji_items.sort((a: any, b: any) => a.sort_order - b.sort_order);
              if (topic.kosakata_items) topic.kosakata_items.sort((a: any, b: any) => a.sort_order - b.sort_order);
              if (topic.bunpo_items) topic.bunpo_items.sort((a: any, b: any) => a.sort_order - b.sort_order);
          });
      }

      const result = data as unknown as LearningDay;
      
      // Cache for offline use
      await cacheData(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error(`Network error fetching day ${day} for ${level}:`, error);
      const cached = await getCachedData<LearningDay>(cacheKey);
      if (cached) {
        console.log(`[Fallback] Returning cached day ${day} for ${level}`);
        return cached;
      }
      return null;
    }
  },
};
