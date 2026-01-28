import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);

async function check() {
    console.log("Checking for 'note' column...");
    const { data, error } = await supabase.from('learning_topic_kanji').select('note').limit(1);
    
    if (error) {
        console.error("❌ Schema Error:", error.message);
        console.log("⚠️ You MUST run 'supabase/seedbaru/11_add_note_columns.sql' in your Supabase SQL Editor!");
    } else {
        console.log("✅ Schema is correct. 'note' column exists.");
    }
}

check();
