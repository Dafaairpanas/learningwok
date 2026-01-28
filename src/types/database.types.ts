export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      jlpt_levels: {
        Row: {
          id: string
          name: string
          description: string | null
          difficulty_order: number
          target_vocabulary: number | null
          target_kanji: number | null
          estimated_hours: number | null
          color: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          difficulty_order: number
          target_vocabulary?: number | null
          target_kanji?: number | null
          estimated_hours?: number | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          difficulty_order?: number
          target_vocabulary?: number | null
          target_kanji?: number | null
          estimated_hours?: number | null
          color?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          content_type: 'kanji' | 'kosakata' | 'bunpo' | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          content_type?: 'kanji' | 'kosakata' | 'bunpo' | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          content_type?: 'kanji' | 'kosakata' | 'bunpo' | null
          created_at?: string
        }
      }
      kanji: {
        Row: {
          id: string
          character: string
          meaning: string
          onyomi: string | null
          kunyomi: string | null
          jlpt_level: string | null
          category_id: string | null
          stroke_count: number | null
          examples: string[] | null // Explicitly typed as string array from JSONB
          sort_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          character: string
          meaning: string
          onyomi?: string | null
          kunyomi?: string | null
          jlpt_level?: string | null
          category_id?: string | null
          stroke_count?: number | null
          examples?: string[] | null
          sort_id?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          character?: string
          meaning?: string
          onyomi?: string | null
          kunyomi?: string | null
          jlpt_level?: string | null
          category_id?: string | null
          stroke_count?: number | null
          examples?: string[] | null
          sort_id?: number
          created_at?: string
          updated_at?: string
        }
      }
      kosakata: {
        Row: {
          id: string
          kanji: string
          hiragana: string
          romaji: string | null
          meaning: string
          jlpt_level: string | null
          category_id: string | null
          example_sentence: string | null
          example_translation: string | null
          related_kanji: string[] | null
          audio_url: string | null
          sort_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kanji: string
          hiragana: string
          romaji?: string | null
          meaning: string
          jlpt_level?: string | null
          category_id?: string | null
          example_sentence?: string | null
          example_translation?: string | null
          related_kanji?: string[] | null
          audio_url?: string | null
          sort_id?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kanji?: string
          hiragana?: string
          romaji?: string | null
          meaning?: string
          jlpt_level?: string | null
          category_id?: string | null
          example_sentence?: string | null
          example_translation?: string | null
          related_kanji?: string[] | null
          audio_url?: string | null
          sort_id?: number
          created_at?: string
          updated_at?: string
        }
      }
      bunpo: {
        Row: {
          id: string
          pattern: string
          meaning: string
          usage: string | null
          bunpo_type: 'grammar' | 'sentence_pattern' | null
          jlpt_level: string | null
          category_id: string | null
          examples: string[] | null // Explicitly typed as string array from JSONB
          notes: string | null
          sort_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pattern: string
          meaning: string
          usage?: string | null
          bunpo_type?: 'grammar' | 'sentence_pattern' | null
          jlpt_level?: string | null
          category_id?: string | null
          examples?: string[] | null
          notes?: string | null
          sort_id?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pattern?: string
          meaning?: string
          usage?: string | null
          bunpo_type?: 'grammar' | 'sentence_pattern' | null
          jlpt_level?: string | null
          category_id?: string | null
          examples?: string[] | null
          notes?: string | null
          sort_id?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string | null
          anonymous_id: string | null
          content_type: 'kanji' | 'kosakata' | 'bunpo'
          content_id: string
          mastery_level: number
          last_reviewed: string | null
          next_review: string | null
          review_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          anonymous_id?: string | null
          content_type: 'kanji' | 'kosakata' | 'bunpo'
          content_id: string
          mastery_level?: number
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          anonymous_id?: string | null
          content_type?: 'kanji' | 'kosakata' | 'bunpo'
          content_id?: string
          mastery_level?: number
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number
        created_at?: string
        }
      }
      learning_days: {
        Row: {
          id: string
          jlpt_level: string
          day_number: number
          title: string
          description: string | null
          estimated_minutes: number
          is_review_day: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          jlpt_level: string
          day_number: number
          title: string
          description?: string | null
          estimated_minutes?: number
          is_review_day?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          jlpt_level?: string
          day_number?: number
          title?: string
          description?: string | null
          estimated_minutes?: number
          is_review_day?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      learning_day_topics: {
        Row: {
          id: string
          learning_day_id: string
          title: string
          content_type: 'kanji' | 'kosakata' | 'bunpo'
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          learning_day_id: string
          title: string
          content_type: 'kanji' | 'kosakata' | 'bunpo'
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          learning_day_id?: string
          title?: string
          content_type?: 'kanji' | 'kosakata' | 'bunpo'
          sort_order?: number
          created_at?: string
        }
      }
      learning_topic_kanji: {
        Row: {
          id: string
          topic_id: string
          kanji_id: string
          note: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          topic_id: string
          kanji_id: string
          note?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          topic_id?: string
          kanji_id?: string
          note?: string | null
          sort_order?: number
        }
      }
      learning_topic_kosakata: {
        Row: {
          id: string
          topic_id: string
          kosakata_id: string
          note: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          topic_id: string
          kosakata_id: string
          note?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          topic_id?: string
          kosakata_id?: string
          note?: string | null
          sort_order?: number
        }
      }
      learning_topic_bunpo: {
        Row: {
          id: string
          topic_id: string
          bunpo_id: string
          note: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          topic_id: string
          bunpo_id: string
          note?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          topic_id?: string
          bunpo_id?: string
          note?: string | null
          sort_order?: number
        }
      }
    }
  }
}
