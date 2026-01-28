export interface Kanji {
  id: string;
  character: string;
  onyomi: string;
  kunyomi: string;
  meaning: string;
}

export interface Kosakata {
  id: string;
  kanji: string;
  hiragana: string;
  romaji?: string;
  meaning: string;
}

export interface Bunpo {
  id: string;
  pattern: string;
  meaning: string;
}

// Tipe Junction (Item + Note dari Sensei)
export interface TopicItemKanji {
  ka_id: string; // ID Item Kanji
  character?: string; // Flattened
  meaning?: string;
  onyomi?: string;
  kunyomi?: string;
  note: string; // "Sensei Mode" Note
  sort_order: number;
  // Raw relation from Supabase response might need mapping
  kanji?: Kanji;
}

export interface TopicItemKosakata {
  ko_id: string;
  kanji?: string;
  hiragana?: string;
  meaning?: string;
  note: string;
  sort_order: number;
  kosakata?: Kosakata;
}

export interface TopicItemBunpo {
  bu_id: string;
  pattern?: string;
  meaning?: string;
  note: string;
  sort_order: number;
  bunpo?: Bunpo;
}

// Tipe Topik
export interface LearningTopic {
  id: string;
  title: string;
  content_type: "kanji" | "kosakata" | "bunpo";
  sort_order: number;
  kanji_items: TopicItemKanji[];
  kosakata_items: TopicItemKosakata[];
  bunpo_items: TopicItemBunpo[];
}

// Tipe Learning Day (Utama)
export interface LearningDay {
  id: string;
  jlpt_level: "N5" | "N4";
  day_number: number;
  title: string;
  description: string;
  estimated_minutes: number;
  topics?: LearningTopic[]; 
}
