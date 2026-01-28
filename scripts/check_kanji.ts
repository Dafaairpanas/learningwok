
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking N5 Kanji...');
  const { data, error, count } = await supabase
    .from('kanji')
    .select('*', { count: 'exact' })
    .eq('jlpt_level', 'N5');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`Found ${count} N5 Kanji.`);
    if (data && data.length > 0) {
      console.log('Sample:', data[0]);
    }
  }

  // Also check distinct levels
  const { data: levels, error: levelError } = await supabase
    .from('kanji')
    .select('jlpt_level');
  
  if (levels) {
      const distinct = [...new Set(levels.map(l => l.jlpt_level))];
      console.log('Available Levels:', distinct);
  } else if (levelError) {
      console.error("Error fetching levels:", levelError);
  }
}

check();
