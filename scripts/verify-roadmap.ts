import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);

async function check() {
    console.log("Checking Roadmap Data...");
    const { count, error } = await supabase.from('learning_days').select('*', { count: 'exact', head: true });
    
    if (error) {
        console.error("❌ DB Error:", error.message);
    } else {
        console.log(`✅ Total Learning Days found: ${count}`);
    }
}

check();
