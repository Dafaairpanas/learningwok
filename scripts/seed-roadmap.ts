import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// --- CONFIG ---
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check your .env file.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
});

const BASE_DIR = path.resolve(process.cwd(), 'supabase/seedbaru');

// --- TYPES ---
interface RoadmapDay {
    level: string;
    day: number;
    title: string;
    desc: string;
    time: number;
    kanjiItems: { char: string; note: string; order: number }[];
    vocabItems: { word: string; note: string; order: number }[];
    bunpoItems: { pattern: string; note: string; order: number }[];
}

// --- PARSER ---
function parseSQLFile(filename: string): RoadmapDay[] {
    const filePath = path.join(BASE_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filename}`);
        return [];
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const days: RoadmapDay[] = [];

    // Split by "DO $$" blocks which represent each Day
    const blocks = content.split('DO $$');

    for (const block of blocks) {
        // Extract Day Info
        // INSERT INTO learning_days ... VALUES ('N5', 1, 'Day 1: ...', 'Desc...', 120)
        const dayMatch = block.match(/INSERT INTO learning_days.*?VALUES\s*\('([^']+)',\s*(\d+),\s*'([^']+)',\s*'([^']+)',\s*(\d+)\)/);
        
        if (!dayMatch) continue;

        const level = dayMatch[1];
        const day = parseInt(dayMatch[2]);
        const title = dayMatch[3];
        const desc = dayMatch[4];
        const time = parseInt(dayMatch[5]);

        const kanjiItems: { char: string; note: string; order: number }[] = [];
        const vocabItems: { word: string; note: string; order: number }[] = [];
        const bunpoItems: { pattern: string; note: string; order: number }[] = [];

        // Parsing Items using Regex Global Matching on the block

        // Kanji
        // INSERT INTO learning_topic_kanji ... SELECT ..., 'Note', 1 FROM kanji WHERE character = 'Char'
        const kanjiRegex = /INSERT INTO learning_topic_kanji.*?SELECT.*?,\s*'([^']*)',\s*(\d+)\s*FROM\s*kanji\s*WHERE\s*character\s*=\s*'([^']*)'/g;
        let kMatch;
        while ((kMatch = kanjiRegex.exec(block)) !== null) {
            kanjiItems.push({ note: kMatch[1], order: parseInt(kMatch[2]), char: kMatch[3] });
        }

        // Kosakata
        // INSERT INTO learning_topic_kosakata ... SELECT ..., 'Note', 1 FROM kosakata WHERE kanji = 'Word'
        const vocabRegex = /INSERT INTO learning_topic_kosakata.*?SELECT.*?,\s*'([^']*)',\s*(\d+)\s*FROM\s*kosakata\s*WHERE\s*kanji\s*=\s*'([^']*)'/g;
        let vMatch;
        while ((vMatch = vocabRegex.exec(block)) !== null) {
            vocabItems.push({ note: vMatch[1], order: parseInt(vMatch[2]), word: vMatch[3] });
        }

        // Bunpo
        // INSERT INTO learning_topic_bunpo ... SELECT ..., 'Note', 1 FROM bunpo WHERE pattern = 'Pattern'
        const bunpoRegex = /INSERT INTO learning_topic_bunpo.*?SELECT.*?,\s*'([^']*)',\s*(\d+)\s*FROM\s*bunpo\s*WHERE\s*pattern\s*=\s*'([^']*)'/g;
        let bMatch;
        while ((bMatch = bunpoRegex.exec(block)) !== null) {
            bunpoItems.push({ note: bMatch[1], order: parseInt(bMatch[2]), pattern: bMatch[3] });
        }

        days.push({ level, day, title, desc, time, kanjiItems, vocabItems, bunpoItems });
    }

    return days;
}

// --- SEEDER ---
async function seedRoadmap() {
    console.log("🚀 Starting Roadmap Seeder...");

    // Check for 'note' column existence implicitly by doing a small check/insert?
    // We'll just try to insert and catch error.

    // 1. Parse Files
    const n5Days = parseSQLFile('09_roadmap_n5.sql');
    const n4Days = parseSQLFile('10_roadmap_n4.sql');
    
    const allDays = [...n5Days, ...n4Days];
    console.log(`📊 Found ${allDays.length} days to process.`);

    for (const d of allDays) {
        console.log(`Processing ${d.level} Day ${d.day}...`);

        // A. Upsert Day
        const { data: dayData, error: dayError } = await supabase
            .from('learning_days')
            .upsert({
                jlpt_level: d.level,
                day_number: d.day,
                title: d.title,
                description: d.desc,
                estimated_minutes: d.time
            }, { onConflict: 'jlpt_level, day_number' })
            .select()
            .single();

        if (dayError) {
            console.error(`❌ Error inserting Day ${d.day}:`, dayError.message);
            continue;
        }

        const dayId = dayData.id;

        // B. Insert Topics (We assume fixed 3 topics for now: Kanji, Kosakata, Bunpo)
        // Check if topics exist
        const { data: existingTopics } = await supabase.from('learning_day_topics').select('*').eq('learning_day_id', dayId);
        
        let kanjiTopicId, vocabTopicId, bunpoTopicId;

        // Kanji Topic
        const existingKanji = existingTopics?.find(t => t.content_type === 'kanji');
        if (existingKanji) kanjiTopicId = existingKanji.id;
        else {
            const { data: t } = await supabase.from('learning_day_topics').insert({ learning_day_id: dayId, title: `Kanji Day ${d.day}`, content_type: 'kanji', sort_order: 1 }).select().single();
            kanjiTopicId = t?.id;
        }

        // Vocab Topic
        const existingVocab = existingTopics?.find(t => t.content_type === 'kosakata');
        if (existingVocab) vocabTopicId = existingVocab.id;
        else {
            const { data: t } = await supabase.from('learning_day_topics').insert({ learning_day_id: dayId, title: `Kosakata Day ${d.day}`, content_type: 'kosakata', sort_order: 2 }).select().single();
            vocabTopicId = t?.id;
        }

        // Bunpo Topic
        const existingBunpo = existingTopics?.find(t => t.content_type === 'bunpo');
        if (existingBunpo) bunpoTopicId = existingBunpo.id;
        else {
            const { data: t } = await supabase.from('learning_day_topics').insert({ learning_day_id: dayId, title: `Bunpo Day ${d.day}`, content_type: 'bunpo', sort_order: 3 }).select().single();
            bunpoTopicId = t?.id;
        }

        // C. Process Items
        // 1. Kanji
        if (kanjiTopicId && d.kanjiItems.length > 0) {
            for (const item of d.kanjiItems) {
                // Find Kanji ID
                const { data: k } = await supabase.from('kanji').select('id').eq('character', item.char).eq('jlpt_level', d.level).single();
                if (k) {
                    await supabase.from('learning_topic_kanji').upsert({
                        topic_id: kanjiTopicId,
                        kanji_id: k.id,
                        note: item.note,
                        sort_order: item.order
                    }, { onConflict: 'topic_id, kanji_id' }); // Assuming composite key
                    // If no composite key, this might duplicate. The SQL used ON CONFLICT DO NOTHING.
                    // Schema check: create table ... PRIMARY KEY (topic_id, kanji_id)?
                    // If not, we might create specific duplicates if we run this multiple times. 
                }
            }
        }

        // 2. Kosakata
        if (vocabTopicId && d.vocabItems.length > 0) {
             for (const item of d.vocabItems) {
                const { data: v } = await supabase.from('kosakata').select('id').eq('kanji', item.word).eq('jlpt_level', d.level).single();
                if (v) {
                    await supabase.from('learning_topic_kosakata').upsert({
                        topic_id: vocabTopicId,
                        kosakata_id: v.id,
                        note: item.note,
                        sort_order: item.order
                    });
                }
            }
        }

        // 3. Bunpo
        if (bunpoTopicId && d.bunpoItems.length > 0) {
             for (const item of d.bunpoItems) {
                // Bunpo pattern matching might be tricky due to formatting
                const { data: b } = await supabase.from('bunpo').select('id').eq('pattern', item.pattern).eq('jlpt_level', d.level).single();
                if (b) {
                     await supabase.from('learning_topic_bunpo').upsert({
                        topic_id: bunpoTopicId,
                        bunpo_id: b.id,
                        note: item.note,
                        sort_order: item.order
                    });
                }
            }
        }
    }
    
    console.log("✅ Roadmap Seeding Completed!");
}

seedRoadmap();
