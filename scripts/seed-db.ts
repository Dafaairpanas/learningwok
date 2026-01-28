import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Helper to get env vars (copied from lib/supabase or reused if exported, but safer to inline for script)
const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnv('PUBLIC_SUPABASE_URL');
// CRITICAL: Use Service Role Key for seeding to bypass RLS
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Cannot seed.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const SEED_DIR = path.resolve(process.cwd(), 'supabase/seedbaru');

async function parseAndInsert(filename: string, table: string, columns: string[]) {
  console.log(`\nProcessing ${filename}...`);
  const filePath = path.join(SEED_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Regex to match values inside parentheses: ('val1', 'val2', ...)
  // This is a naive regex and might break on complex nested quotes, but sufficient for these seed files.
  // We'll split by `),` which is the typical separator in multi-value inserts.
  
  // First, extract the VALUES part.
  const valueBlocks = content.split('VALUES');
  if (valueBlocks.length < 2) {
      console.warn('No VALUES clause found or formatted unexpectedly.');
      return;
  }

  // Combine all blocks after the first one (in case VALUES appears in text, though unlikely in these seeds)
  // Actually, these files might have multiple INSERT statements.
  // Better approach: Match "INSERT INTO ... VALUES ... ;" blocks.
  
  // Implementation strategy:
  // 1. Remove comments
  // 2. Split by semicolon to get statements
  // 3. For each statement, extract values.
  
  const statements = content
    .replace(/--.*$/gm, '') // Remove comments
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.toUpperCase().startsWith('INSERT INTO'));

  let totalInserted = 0;

  for (const stmt of statements) {
      const valuesMatch = stmt.match(/VALUES\s*([\s\S]*)/i);
      if (!valuesMatch) continue;

      let valuesStr = valuesMatch[1].trim();
      
      // Remove trailing bracket if any
      // Now parse the tuples. 
      // We can use a regex to capture each (...) group. 
      // But dealing with commas inside strings is hard with simple regex.
      // e.g. ('A, B', 'C')
      
      // Let's use a simple character walker since we have time or refine regex.
      // Regex: /\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g  <-- recursive matching is hard in JS regex
      
      // Simple regex for these specific seeds:
      // ('val', 'val', ...),?
      // Strings are single quoted.
      
      // Let's rely on the file consistency.
      // 01_kanji: ('一', 'イチ', 'ひと', 'satu', '["一人（ひとり）"]', 'N5')
      
      const rows: any[] = [];
      
      // Super naive parser: match parens that start a row
      const rowMatches = valuesStr.match(/\((?:[^()]|'[^']*')+\)/g);
      
      if (!rowMatches) continue;

      for (const rowStr of rowMatches) {
          // Remove outer parens
          const inner = rowStr.slice(1, -1);
          
          // Split by comma, respecting quotes
          // Regex to split by comma ONLY if not inside quotes
          const parts = inner.split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map(p => {
              let val = p.trim();
              if (val.startsWith("'") && val.endsWith("'")) {
                  val = val.slice(1, -1);
                  // Unescape represented quotes if any (Postgres uses '')
                  val = val.replace(/''/g, "'");
              } else if (val === 'NULL') {
                  val = null as any;
              } else if (!isNaN(Number(val))) {
                   // keep as string for now if destination confuses, but JS number is fine
              }
              return val;
          });
          
          // Map to object keys
          const rowObj: any = {};
          columns.forEach((col, idx) => {
              let val = parts[idx];
              // Special handling for JSONB columns which might be strings in SQL
              if (col === 'examples' && typeof val === 'string') {
                  // The seed has '["..."]'. It's already a JSON string.
                  try {
                       // Supabase client might expect the array object, not the string?
                       // Actually if the column is jsonb, passing an object/array is best.
                       val = JSON.parse(val); 
                  } catch (e) {
                      // leave as string if parse fails
                  }
              }
               // Clean up empty strings for nullable fields if needed? 
               // No, keep as is.
              rowObj[col] = val;
          });
          rows.push(rowObj);
      }
      
      if (rows.length > 0) {
          const { error } = await supabase.from(table).upsert(rows, { onConflict: columns[0] }); // Assuming first col is unique ID or using what?
          // Wait, the seeds for kanji don't include ID, but 'character'.
          // onConflict should effectively use the unique constraint.
          // schema.sql: kanji(character) UNIQUE
          // schema.sql: kosakata(kanji) UNIQUE -> "kanji TEXT NOT NULL UNIQUE"
          // schema.sql: bunpo(pattern) ... not unique? 
          // Bunpo does not have a unique constraint on pattern in schema.sql?
          // schema.sql:
          // CREATE TABLE IF NOT EXISTS bunpo ( ... pattern TEXT NOT NULL, ... );
          // No unique constraint on pattern!
          // But duplicate inserts will create duplicates.
          // However, `upsert` without `onConflict` acts like insert.
          // For kanji and kosakata, we have unique keys.
          
          let conflictTarget: string | undefined = undefined;
          if (table === 'kanji') conflictTarget = 'character';
          if (table === 'kosakata') conflictTarget = 'kanji';
          // For bunpo, we might duplicate if we run multiple times. 
          // We should ideally check if exists? Or truncating?
          // "TRUNCATE" is in the start of some sql files?
          
          // For this task, upsert on primary unique keys is best.
          // For Bunpo, maybe we skip conflict handling and just insert?
          // Or we try to use `pattern` as conflict target if unique index existed.
          // Let's check schema.sql for Bunpo unique.
          
          const { error: insertError } = await supabase.from(table).upsert(rows, 
             conflictTarget ? { onConflict: conflictTarget } : undefined
          );
          
          if (insertError) {
              console.error(`Error inserting into ${table}:`, insertError.message);
          } else {
              totalInserted += rows.length;
          }
      }
  }
  console.log(`Inserted ${totalInserted} rows into ${table}.`);
}

async function seed() {
  console.log('--- Seeding Database ---');
  
  // Kanji N5
  await parseAndInsert('01_kanji_n5.sql', 'kanji', 
      ['character', 'onyomi', 'kunyomi', 'meaning', 'examples', 'jlpt_level']
  );

  // Kosakata N5
  await parseAndInsert('02_kosakata_n5.sql', 'kosakata',
      ['kanji', 'hiragana', 'meaning', 'jlpt_level']
  );
  
  // Bunpo N5
  await parseAndInsert('03_bunpo_n5.sql', 'bunpo',
      ['pattern', 'meaning', 'examples', 'jlpt_level']
  );
  
  // N4 Files?
  // User listed: 05_kanji_n4.sql, 06_kosakata_n4.sql, 07_bunpo_n4.sql
  await parseAndInsert('05_kanji_n4.sql', 'kanji', 
      ['character', 'onyomi', 'kunyomi', 'meaning', 'examples', 'jlpt_level']
  );
   await parseAndInsert('06_kosakata_n4.sql', 'kosakata',
      ['kanji', 'hiragana', 'meaning', 'jlpt_level']
  );
   await parseAndInsert('07_bunpo_n4.sql', 'bunpo',
      ['pattern', 'meaning', 'examples', 'jlpt_level']
  );

  console.log('--- Seeding Complete ---');
}

seed();
