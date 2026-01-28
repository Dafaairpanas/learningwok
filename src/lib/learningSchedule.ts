// Daily learning modules for JLPT N5 and N4
// Each day has specific topics to learn

export interface LearningDay {
  day: number;
  title: string;
  topics: DayTopic[];
}

export interface DayTopic {
  type: 'kanji' | 'kosakata' | 'grammar' | 'pola_kalimat';
  title: string;
  items: SlideItem[];
}

export interface SlideItem {
  id: string;
  content: {
    main: string;
    reading?: string;
    meaning: string;
    examples?: { text: string; translation: string }[];
    notes?: string;
  };
}

// N5 Learning Schedule (60 days / 2 months)
export const n5Schedule: LearningDay[] = [
  {
    day: 1,
    title: 'Perkenalan Dasar',
    topics: [
      {
        type: 'kosakata',
        title: 'Salam & Sapaan',
        items: [
          { id: 'v1', content: { main: 'おはよう', meaning: 'Selamat pagi (informal)' } },
          { id: 'v2', content: { main: 'おはようございます', meaning: 'Selamat pagi (formal)' } },
          { id: 'v3', content: { main: 'こんにちは', meaning: 'Selamat siang/Halo' } },
          { id: 'v4', content: { main: 'こんばんは', meaning: 'Selamat malam' } },
          { id: 'v5', content: { main: 'さようなら', meaning: 'Selamat tinggal' } },
        ]
      },
      {
        type: 'pola_kalimat',
        title: 'Perkenalan Diri',
        items: [
          { 
            id: 'p1', 
            content: { 
              main: 'はじめまして', 
              meaning: 'Salam kenal',
              examples: [{ text: 'はじめまして、田中です。', translation: 'Salam kenal, saya Tanaka.' }]
            } 
          },
          { 
            id: 'p2', 
            content: { 
              main: '私は〜です', 
              meaning: 'Saya adalah ~',
              examples: [{ text: '私は学生です。', translation: 'Saya adalah murid.' }]
            } 
          },
        ]
      }
    ]
  },
  {
    day: 2,
    title: 'Kanji Angka Dasar',
    topics: [
      {
        type: 'kanji',
        title: 'Angka 1-5',
        items: [
          { id: 'k1', content: { main: '一', reading: 'いち / ひと(つ)', meaning: 'Satu', examples: [{ text: '一つ', translation: 'Satu buah' }] } },
          { id: 'k2', content: { main: '二', reading: 'に / ふた(つ)', meaning: 'Dua', examples: [{ text: '二人', translation: 'Dua orang' }] } },
          { id: 'k3', content: { main: '三', reading: 'さん / み(つ)', meaning: 'Tiga', examples: [{ text: '三月', translation: 'Bulan Maret' }] } },
          { id: 'k4', content: { main: '四', reading: 'し・よん / よ(つ)', meaning: 'Empat', examples: [{ text: '四時', translation: 'Jam 4' }] } },
          { id: 'k5', content: { main: '五', reading: 'ご / いつ(つ)', meaning: 'Lima', examples: [{ text: '五日', translation: 'Tanggal 5' }] } },
        ]
      }
    ]
  },
  {
    day: 3,
    title: 'Kanji Angka Lanjutan',
    topics: [
      {
        type: 'kanji',
        title: 'Angka 6-10',
        items: [
          { id: 'k6', content: { main: '六', reading: 'ろく / む(つ)', meaning: 'Enam' } },
          { id: 'k7', content: { main: '七', reading: 'しち・なな / なな(つ)', meaning: 'Tujuh' } },
          { id: 'k8', content: { main: '八', reading: 'はち / や(つ)', meaning: 'Delapan' } },
          { id: 'k9', content: { main: '九', reading: 'きゅう・く / ここの(つ)', meaning: 'Sembilan' } },
          { id: 'k10', content: { main: '十', reading: 'じゅう / とお', meaning: 'Sepuluh' } },
        ]
      },
      {
        type: 'kosakata',
        title: 'Menghitung',
        items: [
          { id: 'v6', content: { main: '百', reading: 'ひゃく', meaning: 'Seratus' } },
          { id: 'v7', content: { main: '千', reading: 'せん', meaning: 'Seribu' } },
          { id: 'v8', content: { main: '万', reading: 'まん', meaning: 'Sepuluh ribu' } },
        ]
      }
    ]
  },
  {
    day: 4,
    title: 'Hari dalam Seminggu',
    topics: [
      {
        type: 'kanji',
        title: 'Kanji Hari',
        items: [
          { id: 'k11', content: { main: '日', reading: 'にち / ひ', meaning: 'Hari, Matahari', examples: [{ text: '日曜日', translation: 'Hari Minggu' }] } },
          { id: 'k12', content: { main: '月', reading: 'げつ / つき', meaning: 'Bulan', examples: [{ text: '月曜日', translation: 'Hari Senin' }] } },
          { id: 'k13', content: { main: '火', reading: 'か / ひ', meaning: 'Api', examples: [{ text: '火曜日', translation: 'Hari Selasa' }] } },
          { id: 'k14', content: { main: '水', reading: 'すい / みず', meaning: 'Air', examples: [{ text: '水曜日', translation: 'Hari Rabu' }] } },
          { id: 'k15', content: { main: '木', reading: 'もく / き', meaning: 'Pohon', examples: [{ text: '木曜日', translation: 'Hari Kamis' }] } },
        ]
      },
      {
        type: 'kanji',
        title: 'Kanji Hari (lanjutan)',
        items: [
          { id: 'k16', content: { main: '金', reading: 'きん / かね', meaning: 'Emas, Uang', examples: [{ text: '金曜日', translation: 'Hari Jumat' }] } },
          { id: 'k17', content: { main: '土', reading: 'ど / つち', meaning: 'Tanah', examples: [{ text: '土曜日', translation: 'Hari Sabtu' }] } },
        ]
      }
    ]
  },
  {
    day: 5,
    title: 'Grammar: Partikel は dan です',
    topics: [
      {
        type: 'grammar',
        title: 'Partikel は (Topic Marker)',
        items: [
          { 
            id: 'g1', 
            content: { 
              main: 'は', 
              meaning: 'Menandai topik pembicaraan (dibaca "wa")',
              examples: [
                { text: '私は学生です。', translation: 'Saya adalah murid.' },
                { text: '今日は暑いです。', translation: 'Hari ini panas.' }
              ],
              notes: 'Partikel は dibaca "wa" bukan "ha" ketika digunakan sebagai topic marker.'
            } 
          },
        ]
      },
      {
        type: 'grammar',
        title: 'Copula です',
        items: [
          { 
            id: 'g2', 
            content: { 
              main: 'です', 
              meaning: 'Adalah (bentuk sopan)',
              examples: [
                { text: 'これは本です。', translation: 'Ini adalah buku.' },
                { text: '田中さんは先生です。', translation: 'Pak Tanaka adalah guru.' }
              ]
            } 
          },
        ]
      }
    ]
  },
  {
    day: 6,
    title: 'Kata Kerja Dasar (Grup 1)',
    topics: [
      {
        type: 'kosakata',
        title: 'Kata Kerja -masu',
        items: [
          { id: 'v9', content: { main: '食べます', reading: 'たべます', meaning: 'Makan', examples: [{ text: 'ご飯を食べます', translation: 'Saya makan nasi.' }] } },
          { id: 'v10', content: { main: '飲みます', reading: 'のみます', meaning: 'Minum', examples: [{ text: 'お茶を飲みます', translation: 'Saya minum teh.' }] } },
          { id: 'v11', content: { main: '見ます', reading: 'みます', meaning: 'Melihat', examples: [{ text: 'テレビを見ます', translation: 'Saya menonton TV.' }] } },
          { id: 'v12', content: { main: '聞きます', reading: 'ききます', meaning: 'Mendengar', examples: [{ text: '音楽を聞きます', translation: 'Saya mendengar musik.' }] } },
          { id: 'v13', content: { main: '読みます', reading: 'よみます', meaning: 'Membaca', examples: [{ text: '本を読みます', translation: 'Saya membaca buku.' }] } },
        ]
      }
    ]
  },
  {
    day: 7,
    title: 'Review Minggu 1',
    topics: [
      {
        type: 'pola_kalimat',
        title: 'Latihan Pola Kalimat',
        items: [
          { id: 'r1', content: { main: '私は〜を〜ます', meaning: 'Saya [verb] [object]', examples: [{ text: '私は本を読みます', translation: 'Saya membaca buku.' }] } },
          { id: 'r2', content: { main: '今日は〜曜日です', meaning: 'Hari ini adalah hari ~', examples: [{ text: '今日は月曜日です', translation: 'Hari ini adalah hari Senin.' }] } },
        ]
      }
    ]
  },
  // More days would continue...
];

// N4 Learning Schedule
export const n4Schedule: LearningDay[] = [
  {
    day: 1,
    title: 'Review N5 & Pengantar N4',
    topics: [
      {
        type: 'grammar',
        title: 'Review です/ます',
        items: [
          { id: 'n4g1', content: { main: 'ます形 → て形', meaning: 'Konversi masu-form ke te-form', examples: [{ text: '食べます → 食べて', translation: 'tabemasu → tabete' }] } },
        ]
      }
    ]
  },
  {
    day: 2,
    title: 'Bentuk て (Te-form)',
    topics: [
      {
        type: 'grammar',
        title: 'Te-form Rules',
        items: [
          { id: 'n4g2', content: { main: '〜ています', meaning: 'Sedang melakukan ~', examples: [{ text: '今、食べています', translation: 'Sekarang sedang makan.' }] } },
          { id: 'n4g3', content: { main: '〜てください', meaning: 'Tolong ~', examples: [{ text: '見てください', translation: 'Tolong lihat.' }] } },
        ]
      }
    ]
  },
];

// Get schedule by level
export function getSchedule(level: 'N5' | 'N4'): LearningDay[] {
  return level === 'N5' ? n5Schedule : n4Schedule;
}

// Get specific day
export function getDay(level: 'N5' | 'N4', dayNumber: number): LearningDay | undefined {
  const schedule = getSchedule(level);
  return schedule.find(d => d.day === dayNumber);
}

// Get total days
export function getTotalDays(level: 'N5' | 'N4'): number {
  return getSchedule(level).length;
}
