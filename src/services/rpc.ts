/**
 * RPC Service - Database-optimized queries using Supabase RPC functions
 * These functions call PL/pgSQL stored procedures for better performance
 */

import { supabase } from '../lib/supabase';

export interface SearchKanjiResult {
  id: string;
  kanji_char: string;
  meaning: string;
  onyomi: string | null;
  kunyomi: string | null;
  stroke_count: number | null;
  jlpt_level: string;
  sort_id: number;
}

export interface SearchKosakataResult {
  id: string;
  kanji: string;
  hiragana: string;
  romaji: string | null;
  meaning: string;
  jlpt_level: string;
  category_id: string | null;
  sort_id: number;
}

export interface SearchBunpoResult {
  id: string;
  pattern: string;
  meaning: string;
  bunpo_type: string;
  jlpt_level: string;
  note: string | null;
  sort_id: number;
}

export interface LearningStats {
  kanji: {
    total: number;
    by_level: Record<string, number>;
  };
  kosakata: {
    total: number;
    by_level: Record<string, number>;
  };
  bunpo: {
    total: number;
    by_level: Record<string, number>;
  };
  learning_days: number;
}

export const rpcService = {
  /**
   * Search kanji using database-level RPC for better performance
   */
  async searchKanji(
    searchTerm: string = '',
    levelFilter?: string,
    limit: number = 50
  ): Promise<SearchKanjiResult[]> {
    const { data, error } = await supabase.rpc('search_kanji', {
      search_term: searchTerm || null,
      level_filter: levelFilter || null,
      result_limit: limit,
    });

    if (error) {
      console.error('RPC search_kanji error:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Search kosakata using database-level RPC
   */
  async searchKosakata(
    searchTerm: string = '',
    levelFilter?: string,
    categoryFilter?: string,
    limit: number = 100
  ): Promise<SearchKosakataResult[]> {
    const { data, error } = await supabase.rpc('search_kosakata', {
      search_term: searchTerm || null,
      level_filter: levelFilter || null,
      category_filter: categoryFilter || null,
      result_limit: limit,
    });

    if (error) {
      console.error('RPC search_kosakata error:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Search bunpo using database-level RPC
   */
  async searchBunpo(
    searchTerm: string = '',
    levelFilter?: string,
    typeFilter?: string,
    limit: number = 50
  ): Promise<SearchBunpoResult[]> {
    const { data, error } = await supabase.rpc('search_bunpo', {
      search_term: searchTerm || null,
      level_filter: levelFilter || null,
      type_filter: typeFilter || null,
      result_limit: limit,
    });

    if (error) {
      console.error('RPC search_bunpo error:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get complete roadmap day with all nested data in one query
   */
  async getRoadmapDay(level: string, day: number): Promise<any> {
    const { data, error } = await supabase.rpc('get_roadmap_day', {
      p_level: level,
      p_day: day,
    });

    if (error) {
      console.error('RPC get_roadmap_day error:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get learning statistics for dashboard
   */
  async getLearningStats(): Promise<LearningStats> {
    const { data, error } = await supabase.rpc('get_learning_stats');

    if (error) {
      console.error('RPC get_learning_stats error:', error);
      throw error;
    }

    return data;
  },
};
