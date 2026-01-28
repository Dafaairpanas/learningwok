/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the SuperMemo 2 algorithm used by Anki
 */

export interface ReviewResult {
  nextReview: Date;
  newEaseFactor: number;
  newInterval: number;
  newRepetitions: number;
}

/**
 * Quality ratings:
 * 0 - Complete blackout, wrong answer
 * 1 - Incorrect, but upon seeing correct answer, remembered
 * 2 - Incorrect, but correct answer seemed easy to recall
 * 3 - Correct with serious difficulty
 * 4 - Correct after hesitation
 * 5 - Perfect response
 */
export function calculateNextReview(
  quality: number, // 0-5 (user response quality)
  repetitions: number, // Number of consecutive correct reviews
  easeFactor: number, // Ease factor (default 2.5)
  interval: number // Current interval in days
): ReviewResult {
  // Clamp quality between 0 and 5
  quality = Math.max(0, Math.min(5, quality));
  
  let newRepetitions = repetitions;
  let newInterval = interval;
  let newEaseFactor = easeFactor;
  
  // If quality < 3, reset repetitions (incorrect answer)
  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Correct answer
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions = repetitions + 1;
  }
  
  // Update ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ease factor should not go below 1.3
  newEaseFactor = Math.max(1.3, newEaseFactor);
  
  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);
  
  return {
    nextReview,
    newEaseFactor,
    newInterval,
    newRepetitions
  };
}

/**
 * Get quality rating based on user action
 */
export function getQualityFromAction(action: 'again' | 'hard' | 'good' | 'easy'): number {
  switch (action) {
    case 'again':
      return 0;
    case 'hard':
      return 2;
    case 'good':
      return 4;
    case 'easy':
      return 5;
    default:
      return 3;
  }
}

/**
 * Format interval for display
 */
export function formatInterval(days: number): string {
  if (days < 1) {
    return '< 1 hari';
  } else if (days === 1) {
    return '1 hari';
  } else if (days < 7) {
    return `${days} hari`;
  } else if (days < 30) {
    const weeks = Math.round(days / 7);
    return `${weeks} minggu`;
  } else if (days < 365) {
    const months = Math.round(days / 30);
    return `${months} bulan`;
  } else {
    const years = Math.round(days / 365);
    return `${years} tahun`;
  }
}

/**
 * Check if item is due for review
 */
export function isDueForReview(nextReviewDate: Date | string | null): boolean {
  if (!nextReviewDate) return true;
  
  const reviewDate = new Date(nextReviewDate);
  const now = new Date();
  
  return reviewDate <= now;
}
