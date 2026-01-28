import { atom, map } from 'nanostores';
import { supabase } from '../lib/supabase';
import { calculateNextReview, getQualityFromAction } from '../lib/spaced-repetition';

export type ContentType = 'kanji' | 'kosakata' | 'grammar' | 'pola_kalimat';

export interface ProgressItem {
  contentType: ContentType;
  contentId: string;
  masteryLevel: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
  lastReviewed: string | null;
  nextReview: string | null;
  reviewCount: number;
}

// Store for all progress items
export const progressStore = map<Record<string, ProgressItem>>({});

// Stats store
export const statsStore = atom({
  totalReviewed: 0,
  dueToday: 0,
  mastered: 0
});

// Initialize progress from localStorage
export function initProgress() {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem('learningProgress');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      progressStore.set(parsed);
      updateStats();
    } catch {
      console.error('Failed to parse progress from localStorage');
    }
  }
}

// Get progress for a specific item
export function getProgress(contentType: ContentType, contentId: string): ProgressItem | null {
  const key = `${contentType}:${contentId}`;
  return progressStore.get()[key] || null;
}

// Record a review
export function recordReview(
  contentType: ContentType,
  contentId: string,
  action: 'again' | 'hard' | 'good' | 'easy'
) {
  const key = `${contentType}:${contentId}`;
  const current = progressStore.get()[key] || {
    contentType,
    contentId,
    masteryLevel: 0,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0
  };
  
  const quality = getQualityFromAction(action);
  const result = calculateNextReview(
    quality,
    current.repetitions,
    current.easeFactor,
    current.interval
  );
  
  // Calculate mastery level (0-5 based on repetitions and ease factor)
  const masteryLevel = Math.min(5, Math.floor(result.newRepetitions / 2) + (result.newEaseFactor > 2.5 ? 1 : 0));
  
  const updated: ProgressItem = {
    ...current,
    masteryLevel,
    easeFactor: result.newEaseFactor,
    interval: result.newInterval,
    repetitions: result.newRepetitions,
    lastReviewed: new Date().toISOString(),
    nextReview: result.nextReview.toISOString(),
    reviewCount: current.reviewCount + 1
  };
  
  progressStore.setKey(key, updated);
  saveProgress();
  updateStats();
  
  // Sync to Supabase if available
  syncToSupabase(updated);
}

// Save progress to localStorage
function saveProgress() {
  if (typeof window === 'undefined') return;
  localStorage.setItem('learningProgress', JSON.stringify(progressStore.get()));
}

// Update stats
function updateStats() {
  const progress = progressStore.get();
  const now = new Date();
  
  let totalReviewed = 0;
  let dueToday = 0;
  let mastered = 0;
  
  Object.values(progress).forEach(item => {
    if (item.reviewCount > 0) totalReviewed++;
    if (item.masteryLevel >= 4) mastered++;
    
    if (item.nextReview) {
      const nextDate = new Date(item.nextReview);
      if (nextDate <= now) dueToday++;
    } else {
      dueToday++; // Never reviewed items are due
    }
  });
  
  statsStore.set({ totalReviewed, dueToday, mastered });
}

// Sync to Supabase (if configured)
async function syncToSupabase(item: ProgressItem) {
  if (!supabase) return;
  
  const anonId = localStorage.getItem('anonUserId');
  if (!anonId) return;
  
  try {
    await supabase.from('user_progress').upsert({
      anonymous_id: anonId,
      content_type: item.contentType,
      content_id: item.contentId,
      mastery_level: item.masteryLevel,
      last_reviewed: item.lastReviewed,
      next_review: item.nextReview,
      review_count: item.reviewCount
    }, {
      onConflict: 'anonymous_id,content_type,content_id'
    });
  } catch (error) {
    console.error('Failed to sync to Supabase:', error);
  }
}

// Get items due for review
export function getDueItems(contentType?: ContentType): ProgressItem[] {
  const progress = progressStore.get();
  const now = new Date();
  
  return Object.values(progress).filter(item => {
    if (contentType && item.contentType !== contentType) return false;
    if (!item.nextReview) return true;
    return new Date(item.nextReview) <= now;
  });
}

// Get items by mastery level
export function getItemsByMasteryLevel(level: number): ProgressItem[] {
  return Object.values(progressStore.get()).filter(item => item.masteryLevel === level);
}
