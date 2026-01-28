import type { Kanji, Kosakata, Grammar, PolaKalimat } from './supabase';

// Mock Kanji Data
export const mockKanji: Kanji[] = [
  {
    id: '1',
    character: '日',
    meaning: 'Day, Sun',
    onyomi: 'ニチ、ジツ',
    kunyomi: 'ひ、び、か',
    jlpt_level: 'N5',
    category: 'time',
    stroke_count: 4,
    examples: [
      { kanji: '日本', reading: 'にほん', meaning: 'Japan' },
      { kanji: '今日', reading: 'きょう', meaning: 'Today' },
      { kanji: '日曜日', reading: 'にちようび', meaning: 'Sunday' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    character: '月',
    meaning: 'Moon, Month',
    onyomi: 'ゲツ、ガツ',
    kunyomi: 'つき',
    jlpt_level: 'N5',
    category: 'time',
    stroke_count: 4,
    examples: [
      { kanji: '月曜日', reading: 'げつようび', meaning: 'Monday' },
      { kanji: '一月', reading: 'いちがつ', meaning: 'January' },
      { kanji: '月', reading: 'つき', meaning: 'Moon' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    character: '火',
    meaning: 'Fire',
    onyomi: 'カ',
    kunyomi: 'ひ',
    jlpt_level: 'N5',
    category: 'nature',
    stroke_count: 4,
    examples: [
      { kanji: '火曜日', reading: 'かようび', meaning: 'Tuesday' },
      { kanji: '火事', reading: 'かじ', meaning: 'Fire (disaster)' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    character: '水',
    meaning: 'Water',
    onyomi: 'スイ',
    kunyomi: 'みず',
    jlpt_level: 'N5',
    category: 'nature',
    stroke_count: 4,
    examples: [
      { kanji: '水曜日', reading: 'すいようび', meaning: 'Wednesday' },
      { kanji: '水', reading: 'みず', meaning: 'Water' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    character: '木',
    meaning: 'Tree, Wood',
    onyomi: 'モク、ボク',
    kunyomi: 'き',
    jlpt_level: 'N5',
    category: 'nature',
    stroke_count: 4,
    examples: [
      { kanji: '木曜日', reading: 'もくようび', meaning: 'Thursday' },
      { kanji: '木', reading: 'き', meaning: 'Tree' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    character: '金',
    meaning: 'Gold, Money',
    onyomi: 'キン、コン',
    kunyomi: 'かね、かな',
    jlpt_level: 'N5',
    category: 'objects',
    stroke_count: 8,
    examples: [
      { kanji: '金曜日', reading: 'きんようび', meaning: 'Friday' },
      { kanji: 'お金', reading: 'おかね', meaning: 'Money' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    character: '土',
    meaning: 'Earth, Soil',
    onyomi: 'ド、ト',
    kunyomi: 'つち',
    jlpt_level: 'N5',
    category: 'nature',
    stroke_count: 3,
    examples: [
      { kanji: '土曜日', reading: 'どようび', meaning: 'Saturday' },
      { kanji: '土', reading: 'つち', meaning: 'Soil' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    character: '一',
    meaning: 'One',
    onyomi: 'イチ、イツ',
    kunyomi: 'ひと(つ)',
    jlpt_level: 'N5',
    category: 'numbers',
    stroke_count: 1,
    examples: [
      { kanji: '一つ', reading: 'ひとつ', meaning: 'One (thing)' },
      { kanji: '一人', reading: 'ひとり', meaning: 'One person' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '9',
    character: '二',
    meaning: 'Two',
    onyomi: 'ニ',
    kunyomi: 'ふた(つ)',
    jlpt_level: 'N5',
    category: 'numbers',
    stroke_count: 2,
    examples: [
      { kanji: '二つ', reading: 'ふたつ', meaning: 'Two (things)' },
      { kanji: '二人', reading: 'ふたり', meaning: 'Two people' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '10',
    character: '三',
    meaning: 'Three',
    onyomi: 'サン',
    kunyomi: 'み(つ)',
    jlpt_level: 'N5',
    category: 'numbers',
    stroke_count: 3,
    examples: [
      { kanji: '三つ', reading: 'みっつ', meaning: 'Three (things)' },
      { kanji: '三人', reading: 'さんにん', meaning: 'Three people' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '11',
    character: '人',
    meaning: 'Person, People',
    onyomi: 'ジン、ニン',
    kunyomi: 'ひと',
    jlpt_level: 'N5',
    category: 'people',
    stroke_count: 2,
    examples: [
      { kanji: '日本人', reading: 'にほんじん', meaning: 'Japanese person' },
      { kanji: '人', reading: 'ひと', meaning: 'Person' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '12',
    character: '大',
    meaning: 'Big, Large',
    onyomi: 'ダイ、タイ',
    kunyomi: 'おお(きい)',
    jlpt_level: 'N5',
    category: 'adjectives',
    stroke_count: 3,
    examples: [
      { kanji: '大きい', reading: 'おおきい', meaning: 'Big' },
      { kanji: '大学', reading: 'だいがく', meaning: 'University' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '13',
    character: '学',
    meaning: 'Study, Learning',
    onyomi: 'ガク',
    kunyomi: 'まな(ぶ)',
    jlpt_level: 'N5',
    category: 'education',
    stroke_count: 8,
    examples: [
      { kanji: '学生', reading: 'がくせい', meaning: 'Student' },
      { kanji: '学校', reading: 'がっこう', meaning: 'School' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '14',
    character: '食',
    meaning: 'Eat, Food',
    onyomi: 'ショク',
    kunyomi: 'た(べる)',
    jlpt_level: 'N5',
    category: 'actions',
    stroke_count: 9,
    examples: [
      { kanji: '食べる', reading: 'たべる', meaning: 'To eat' },
      { kanji: '食事', reading: 'しょくじ', meaning: 'Meal' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '15',
    character: '見',
    meaning: 'See, Look',
    onyomi: 'ケン',
    kunyomi: 'み(る)',
    jlpt_level: 'N5',
    category: 'actions',
    stroke_count: 7,
    examples: [
      { kanji: '見る', reading: 'みる', meaning: 'To see' },
      { kanji: '意見', reading: 'いけん', meaning: 'Opinion' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '16',
    character: '行',
    meaning: 'Go',
    onyomi: 'コウ、ギョウ',
    kunyomi: 'い(く)、ゆ(く)',
    jlpt_level: 'N5',
    category: 'actions',
    stroke_count: 6,
    examples: [
      { kanji: '行く', reading: 'いく', meaning: 'To go' },
      { kanji: '銀行', reading: 'ぎんこう', meaning: 'Bank' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '17',
    character: '書',
    meaning: 'Write',
    onyomi: 'ショ',
    kunyomi: 'か(く)',
    jlpt_level: 'N4',
    category: 'actions',
    stroke_count: 10,
    examples: [
      { kanji: '書く', reading: 'かく', meaning: 'To write' },
      { kanji: '辞書', reading: 'じしょ', meaning: 'Dictionary' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '18',
    character: '読',
    meaning: 'Read',
    onyomi: 'ドク、トク',
    kunyomi: 'よ(む)',
    jlpt_level: 'N4',
    category: 'actions',
    stroke_count: 14,
    examples: [
      { kanji: '読む', reading: 'よむ', meaning: 'To read' },
      { kanji: '読書', reading: 'どくしょ', meaning: 'Reading' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '19',
    character: '話',
    meaning: 'Talk, Story',
    onyomi: 'ワ',
    kunyomi: 'はな(す)、はなし',
    jlpt_level: 'N4',
    category: 'actions',
    stroke_count: 13,
    examples: [
      { kanji: '話す', reading: 'はなす', meaning: 'To speak' },
      { kanji: '電話', reading: 'でんわ', meaning: 'Telephone' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '20',
    character: '語',
    meaning: 'Language, Word',
    onyomi: 'ゴ',
    kunyomi: 'かた(る)',
    jlpt_level: 'N4',
    category: 'language',
    stroke_count: 14,
    examples: [
      { kanji: '日本語', reading: 'にほんご', meaning: 'Japanese language' },
      { kanji: '英語', reading: 'えいご', meaning: 'English' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock Vocabulary Data
export const mockKosakata: Kosakata[] = [
  {
    id: '1',
    word: 'おはよう',
    reading: 'おはよう',
    meaning: 'Good morning (informal)',
    jlpt_level: 'N5',
    category: 'greetings',
    example_sentence: 'おはよう、元気？',
    example_translation: "Good morning, how are you?",
    related_kanji: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    word: 'こんにちは',
    reading: 'こんにちは',
    meaning: 'Hello, Good afternoon',
    jlpt_level: 'N5',
    category: 'greetings',
    example_sentence: 'こんにちは、田中さん。',
    example_translation: "Hello, Mr. Tanaka.",
    related_kanji: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    word: 'ありがとう',
    reading: 'ありがとう',
    meaning: 'Thank you (informal)',
    jlpt_level: 'N5',
    category: 'greetings',
    example_sentence: 'ありがとう、助かりました。',
    example_translation: "Thank you, you helped me out.",
    related_kanji: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    word: '食べる',
    reading: 'たべる',
    meaning: 'To eat',
    jlpt_level: 'N5',
    category: 'verbs',
    example_sentence: '朝ごはんを食べる。',
    example_translation: "I eat breakfast.",
    related_kanji: ['14'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    word: '飲む',
    reading: 'のむ',
    meaning: 'To drink',
    jlpt_level: 'N5',
    category: 'verbs',
    example_sentence: 'お茶を飲む。',
    example_translation: "I drink tea.",
    related_kanji: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    word: '見る',
    reading: 'みる',
    meaning: 'To see, to watch',
    jlpt_level: 'N5',
    category: 'verbs',
    example_sentence: 'テレビを見る。',
    example_translation: "I watch TV.",
    related_kanji: ['15'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    word: '行く',
    reading: 'いく',
    meaning: 'To go',
    jlpt_level: 'N5',
    category: 'verbs',
    example_sentence: '学校に行く。',
    example_translation: "I go to school.",
    related_kanji: ['16'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    word: '大きい',
    reading: 'おおきい',
    meaning: 'Big, Large',
    jlpt_level: 'N5',
    category: 'i-adjectives',
    example_sentence: 'この家は大きいです。',
    example_translation: "This house is big.",
    related_kanji: ['12'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '9',
    word: '小さい',
    reading: 'ちいさい',
    meaning: 'Small',
    jlpt_level: 'N5',
    category: 'i-adjectives',
    example_sentence: 'この犬は小さいです。',
    example_translation: "This dog is small.",
    related_kanji: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '10',
    word: '便利',
    reading: 'べんり',
    meaning: 'Convenient',
    jlpt_level: 'N4',
    category: 'na-adjectives',
    example_sentence: 'このアプリは便利です。',
    example_translation: "This app is convenient.",
    related_kanji: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock Grammar Data
export const mockGrammar: Grammar[] = [
  {
    id: '1',
    pattern: 'です / だ',
    meaning: 'Polite / casual copula (is, am, are)',
    usage: 'Used at the end of sentences to indicate politeness or state of being',
    jlpt_level: 'N5',
    category: 'copula',
    examples: [
      { sentence: '私は学生です。', translation: 'I am a student.' },
      { sentence: 'これは本だ。', translation: 'This is a book.' }
    ],
    notes: 'です is polite, だ is casual/plain form',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    pattern: 'は (Topic Marker)',
    meaning: 'Marks the topic of the sentence',
    usage: 'Placed after a noun to indicate what the sentence is about',
    jlpt_level: 'N5',
    category: 'particles',
    examples: [
      { sentence: '私は日本人です。', translation: 'I am Japanese.' },
      { sentence: '今日は暑いです。', translation: 'Today is hot.' }
    ],
    notes: 'The particle は is pronounced "wa" not "ha" when used as topic marker',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    pattern: 'が (Subject Marker)',
    meaning: 'Marks the grammatical subject',
    usage: 'Used to mark the subject, especially for new information or emphasis',
    jlpt_level: 'N5',
    category: 'particles',
    examples: [
      { sentence: '猫がいます。', translation: 'There is a cat.' },
      { sentence: '誰が来ましたか？', translation: 'Who came?' }
    ],
    notes: 'が emphasizes what comes before it, while は sets the topic',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    pattern: 'を (Object Marker)',
    meaning: 'Marks the direct object of a verb',
    usage: 'Placed after the object that receives the action',
    jlpt_level: 'N5',
    category: 'particles',
    examples: [
      { sentence: 'りんごを食べます。', translation: 'I eat an apple.' },
      { sentence: '本を読みます。', translation: 'I read a book.' }
    ],
    notes: 'Always used with transitive verbs',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    pattern: 'に (Direction/Time)',
    meaning: 'Indicates direction, time, or indirect object',
    usage: 'Multiple uses: location, time, recipient',
    jlpt_level: 'N5',
    category: 'particles',
    examples: [
      { sentence: '学校に行きます。', translation: 'I go to school.' },
      { sentence: '7時に起きます。', translation: 'I wake up at 7 o\'clock.' }
    ],
    notes: 'One of the most versatile particles in Japanese',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    pattern: '〜ている',
    meaning: 'Progressive action or state',
    usage: 'Shows ongoing action or resulting state',
    jlpt_level: 'N5',
    category: 'verb-forms',
    examples: [
      { sentence: '今、食べています。', translation: 'I am eating now.' },
      { sentence: '彼は結婚している。', translation: 'He is married.' }
    ],
    notes: 'Formed by te-form + いる',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    pattern: '〜たい',
    meaning: 'Want to do ~',
    usage: 'Express desire to do something',
    jlpt_level: 'N5',
    category: 'verb-forms',
    examples: [
      { sentence: '日本に行きたいです。', translation: 'I want to go to Japan.' },
      { sentence: '何を食べたい？', translation: 'What do you want to eat?' }
    ],
    notes: 'Conjugates like i-adjective',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    pattern: '〜てから',
    meaning: 'After doing ~',
    usage: 'Indicates sequence of actions',
    jlpt_level: 'N4',
    category: 'conjunctions',
    examples: [
      { sentence: 'ご飯を食べてから、勉強します。', translation: 'After eating, I will study.' },
      { sentence: '日本に来てから、日本語が上手になった。', translation: 'After coming to Japan, my Japanese improved.' }
    ],
    notes: 'Emphasizes the completion of the first action before the second',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock Pola Kalimat Data
export const mockPolaKalimat: PolaKalimat[] = [
  {
    id: '1',
    pattern: '[名詞]は[名詞]です',
    meaning: '[Noun] is [Noun]',
    usage: 'Basic sentence pattern for identifying or equating things',
    jlpt_level: 'N5',
    category: 'basic',
    examples: [
      { sentence: '私は学生です。', translation: 'I am a student.' },
      { sentence: 'これは本です。', translation: 'This is a book.' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    pattern: '[場所]に[物]があります/います',
    meaning: 'There is [thing] at [place]',
    usage: 'Indicates existence of something at a location',
    jlpt_level: 'N5',
    category: 'existence',
    examples: [
      { sentence: '机の上に本があります。', translation: 'There is a book on the desk.' },
      { sentence: '公園に子供がいます。', translation: 'There are children in the park.' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    pattern: '[動詞ます形]たいです',
    meaning: 'I want to [verb]',
    usage: 'Expresses desire to do something',
    jlpt_level: 'N5',
    category: 'desire',
    examples: [
      { sentence: '日本語を勉強したいです。', translation: 'I want to study Japanese.' },
      { sentence: 'ラーメンを食べたいです。', translation: 'I want to eat ramen.' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    pattern: '[動詞て形]ください',
    meaning: 'Please [verb]',
    usage: 'Making polite requests',
    jlpt_level: 'N5',
    category: 'requests',
    examples: [
      { sentence: 'ここに名前を書いてください。', translation: 'Please write your name here.' },
      { sentence: 'ちょっと待ってください。', translation: 'Please wait a moment.' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    pattern: '[動詞て形]もいいですか',
    meaning: 'May I [verb]?',
    usage: 'Asking for permission',
    jlpt_level: 'N5',
    category: 'permission',
    examples: [
      { sentence: '写真を撮ってもいいですか。', translation: 'May I take a photo?' },
      { sentence: 'ここに座ってもいいですか。', translation: 'May I sit here?' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    pattern: '[名詞]より[名詞]のほうが〜',
    meaning: '[B] is more ~ than [A]',
    usage: 'Making comparisons',
    jlpt_level: 'N4',
    category: 'comparison',
    examples: [
      { sentence: '電車よりバスのほうが便利です。', translation: 'The bus is more convenient than the train.' },
      { sentence: '肉より魚のほうが好きです。', translation: 'I like fish more than meat.' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper functions to get data
export function getKanjiById(id: string): Kanji | undefined {
  return mockKanji.find(k => k.id === id);
}

export function getKosakataById(id: string): Kosakata | undefined {
  return mockKosakata.find(k => k.id === id);
}

export function getGrammarById(id: string): Grammar | undefined {
  return mockGrammar.find(g => g.id === id);
}

export function getPolaById(id: string): PolaKalimat | undefined {
  return mockPolaKalimat.find(p => p.id === id);
}

// Filter functions
export function filterByJlptLevel<T extends { jlpt_level: string }>(items: T[], level: string): T[] {
  if (!level || level === 'all') return items;
  return items.filter(item => item.jlpt_level === level);
}

export function filterByCategory<T extends { category: string | null }>(items: T[], category: string): T[] {
  if (!category || category === 'all') return items;
  return items.filter(item => item.category === category);
}

export function searchItems<T extends Record<string, unknown>>(items: T[], query: string, fields: (keyof T)[]): T[] {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    fields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerQuery);
      }
      return false;
    })
  );
}
