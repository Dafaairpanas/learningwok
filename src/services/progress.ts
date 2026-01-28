import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

const ANONYMOUS_ID_KEY = 'ayokejepang_anon_id';

export const progressService = {
  // Get or create anonymous ID
  getAnonymousId(): string {
    if (typeof localStorage === 'undefined') return ''; // SSH check
    let id = localStorage.getItem(ANONYMOUS_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ANONYMOUS_ID_KEY, id);
    }
    return id;
  },

  // Save progress (Upsert)
  async updateProgress(
    contentId: string,
    contentType: 'kanji' | 'kosakata' | 'bunpo',
    masteryLevel: number
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    const anonymousId = this.getAnonymousId();

    const payload: any = {
      content_id: contentId,
      content_type: contentType,
      mastery_level: masteryLevel,
      last_reviewed: new Date().toISOString(),
      updated_at: new Date().toISOString() // Trigger will handle this usually, but good to be explicit
    };

    if (user) {
      payload.user_id = user.id;
    } else {
      payload.anonymous_id = anonymousId;
    }

    // Upsert based on the unique constraints (user_id/anon_id + content_type + content_id)
    const { error } = await supabase
      .from('user_progress')
      .upsert(payload, { 
        onConflict: user ? 'user_id, content_type, content_id' : 'anonymous_id, content_type, content_id'
      });

    if (error) {
      console.error('Error updating progress:', error);
    }
  },

  // Merge anonymous progress to user account upon login
  async mergeAnonymousProgress() {
    const { data: { user } } = await supabase.auth.getUser();
    const anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);

    if (!user || !anonymousId) return;

    // 1. Get anonymous progress
    const { data: anonProgress, error: fetchError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('anonymous_id', anonymousId);

    if (fetchError || !anonProgress || anonProgress.length === 0) return;

    // 2. Prepare bulk upsert payload with user_id
    const updates = anonProgress.map(p => ({
      ...p,
      id: undefined, // Let DB generate new ID or match existing unique index
      user_id: user.id,
      anonymous_id: null // Clear anonymous ID association for the new/updated row
    }));

    // 3. Upsert into user records
    // Note: This might fail if we want to KEEP the detailed history, but for simple mastery tracking:
    // If a user record already exists, we might want to keep the HIGHER mastery. 
    // For simplicity in this iteration, we'll overwrite or assume Supabase handles upsert gracefully.
    // A more complex strategy would be: Fetch user progress -> Compare -> Update if local is better.
    // Here we will just assign the anon progress to the user. 
    
    // HOWEVER, upsert might conflict if we blindly copy. 
    // Simplest strategy: Update the EXISTING anon rows to have user_id and remove anonymous_id
    
    const { error: updateError } = await supabase
      .from('user_progress')
      .update({ user_id: user.id, anonymous_id: null })
      .eq('anonymous_id', anonymousId);

    if (updateError) {
        // If update fails (e.g., collision with existing user data), we might need a more manual merge.
        // But for a basic "Guest joins" scenario, direct update is often cleaner if no pre-existing user data for those items.
        // If collision occurs (user already learned this word), we might want to ignore the guest data or take max.
        console.error('Merge error (simple update):', updateError);
        
        // Fallback: Manual merge logic could be implemented here if needed.
    } else {
        // Clear local storage if merge successful
        localStorage.removeItem(ANONYMOUS_ID_KEY);
    }
  }
};
