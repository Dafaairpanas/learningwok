import { supabase } from '../lib/supabase';
import type { KanjiWithLevel, KosakataWithLevel, BunpoWithLevel } from './materi';

export type FlashcardType = 'kanji' | 'kosakata' | 'bunpo';

export interface FlashcardItem {
  id: string;
  type: FlashcardType;
  front: string; // The question (Kanji char, Word, Grammar pattern)
  back: {
    meaning: string;
    reading?: string; // Onyomi/Kunyomi or Hiragana
    example?: string;
    exampleTranslation?: string;
    usage?: string; // For grammar
  };
  level: string;
}

export const flashcardService = {
  async getSessionData(
    type: FlashcardType,
    level: string,
    limit: number
  ): Promise<FlashcardItem[]> {
    let data: FlashcardItem[] = [];

    // 1. Fetch Data
    if (type === 'kanji') {
      console.log(`[FlashcardService] Fetching ${type} Level ${level}`);
      const { data: rawData, error } = await supabase
        .from('kanji')
        .select('*')
        .eq('jlpt_level', level);
      
      console.log(`[FlashcardService] Kanji Result:`, { count: rawData?.length, error });

      if (error) throw error;
      
      data = (rawData as any[]).map(item => ({
        id: item.id,
        type: 'kanji',
        front: item.character,
        back: {
          meaning: item.meaning,
          reading: `On: ${item.onyomi || '-'} | Kun: ${item.kunyomi || '-'}`,
        },
        level: item.jlpt_level
      }));

    } else if (type === 'kosakata') {
      const { data: rawData, error } = await supabase
        .from('kosakata')
        .select('*')
        .eq('jlpt_level', level);

      if (error) throw error;

      data = (rawData as any[]).map(item => ({
        id: item.id,
        type: 'kosakata',
        front: item.kanji,
        back: {
          meaning: item.meaning,
          reading: item.hiragana,
          example: item.example_sentence,
          exampleTranslation: item.example_translation
        },
        level: item.jlpt_level
      }));

    } else if (type === 'bunpo') {
       const { data: rawData, error } = await supabase
        .from('bunpo')
        .select('*')
        .eq('jlpt_level', level);

      if (error) throw error;

      data = (rawData as any[]).map(item => ({
        id: item.id,
        type: 'bunpo',
        front: item.pattern,
        back: {
          meaning: item.meaning,
          usage: item.usage,
        },
        level: item.jlpt_level
      }));
    }

    // 2. Randomize (Fisher-Yates Shuffle)
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }

    // 3. Limit
    return data.slice(0, limit);
  }
};
