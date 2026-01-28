import { materiService } from '../src/services/materi';
import path from 'path';

// Env loaded via node --env-file flag

async function verify() {
  console.log('--- Verifying Supabase Integration ---');

  try {
    // 1. Fetch Kanji
    console.log('\nFetching Kanji (limit 1)...');
    const kanji = await materiService.getKanji(1);
    if (kanji.length > 0) {
      console.log('✅ Kanji Fetched');
      console.log('   Character:', kanji[0].character);
      console.log('   Review JLPT Level:', kanji[0].jlpt_levels?.name, kanji[0].jlpt_levels?.color);
      console.log('   Review Examples (Array Check):', Array.isArray(kanji[0].examples), kanji[0].examples);
    } else {
      console.warn('⚠️ No Kanji found in database. Seed data might be missing.');
    }

    // 2. Fetch Bunpo
    console.log('\nFetching Bunpo (limit 1)...');
    const bunpo = await materiService.getBunpo(1);
    if (bunpo.length > 0) {
      console.log('✅ Bunpo Fetched');
      console.log('   Pattern:', bunpo[0].pattern);
      console.log('   Review JLPT Level:', bunpo[0].jlpt_levels?.name);
      console.log('   Review Examples (Array Check):', Array.isArray(bunpo[0].examples), bunpo[0].examples);
    } else {
      console.warn('⚠️ No Bunpo found in database.');
    }

    // 3. Fetch Kosakata
     console.log('\nFetching Kosakata (limit 1)...');
    const kosakata = await materiService.getKosakata(1);
    if (kosakata.length > 0) {
       console.log('✅ Kosakata Fetched');
       console.log('   Word:', kosakata[0].kanji);
       console.log('   Example:', kosakata[0].example_sentence);
    } else {
       console.warn('⚠️ No Kosakata found.');
    }

  } catch (error) {
    console.error('❌ Verification Failed:', error);
  }
}

verify();
