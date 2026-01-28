import { useState, useCallback } from 'react';
import { RotateCcw, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { Kanji } from '../../lib/supabase';
import { recordReview } from '../../stores/progressStore';

interface KanjiFlashcardProps {
  kanji: Kanji[];
}

export default function KanjiFlashcard({ kanji }: KanjiFlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const currentKanji = kanji[currentIndex];
  // Calculate progress percentage
  const progress = ((currentIndex) / kanji.length) * 100;

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleReview = useCallback(
    (action: 'again' | 'hard' | 'good' | 'easy') => {
      // Record the review
      recordReview('kanji', currentKanji.id, action);
      setReviewedCount((prev) => prev + 1);

      // Move to next card
      if (currentIndex < kanji.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      }
    },
    [currentIndex, currentKanji, kanji.length]
  );

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
  }, []);

  if (!currentKanji) {
    return (
      <div className="swiss-card flex min-h-[400px] items-center justify-center">
        <p className="text-subtle font-bold tracking-widest uppercase">Tidak ada kanji untuk di-review</p>
      </div>
    );
  }

  // Show completion screen
  if (currentIndex >= kanji.length - 1 && reviewedCount > 0 && !isFlipped) {
     // Logic tweak: simple completion state check could be improved, but sticking to basic flow
  }

  // Completion View
  if (currentIndex === kanji.length - 1 && reviewedCount === kanji.length) {
      return (
      <div className="swiss-card flex min-h-[500px] flex-col items-center justify-center gap-8 text-center">
        <span className="text-8xl">🎉</span>
        <div>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
            Selesai!
            </h2>
            <p className="text-subtle font-medium">
            {reviewedCount} kartu telah dipelajari.
            </p>
        </div>
        <button onClick={handleRestart} className="btn-swiss">
          <RotateCcw className="h-4 w-4 mr-2" />
          Ulangi Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar & Stats */}
      <div className="flex items-end justify-between border-b border-border-line pb-4">
         <div>
            <span className="text-label block mb-1">Progress</span>
            <div className="text-4xl font-black leading-none">
                {String(currentIndex + 1).padStart(2, '0')}
                <span className="text-lg text-subtle font-medium">/{kanji.length}</span>
            </div>
         </div>
         <div className="text-right">
             <span className="text-label block mb-1">Completed</span>
             <span className="text-xl font-bold">{Math.round(progress)}%</span>
         </div>
      </div>
      
      <div className="h-1 w-full bg-border-line">
          <div 
            className="h-full bg-brand-neon transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
      </div>

      {/* Flashcard */}
      <div
        className="group cursor-pointer perspective-1000"
        onClick={handleFlip}
        style={{ minHeight: '500px' }}
      >
        <div
          className={`relative w-full h-[500px] transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front - Kanji Character */}
          <div className="absolute inset-0 backface-hidden swiss-card flex flex-col items-center justify-center bg-canvas border border-border-line">
            <div className="absolute top-6 left-6">
                <span className="text-label border border-border-line px-2 py-1">N{currentKanji.jlpt_level || '5'}</span>
            </div>
            
            <span className="font-jp text-[10rem] leading-none font-bold text-ink transition-transform duration-300 group-hover:scale-105">
              {currentKanji.character}
            </span>
            
            <p className="absolute bottom-8 text-subtle font-bold tracking-widest uppercase text-xs animate-pulse">
              Klik untuk membalik
            </p>
          </div>

          {/* Back - Answer */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 swiss-card flex flex-col items-center justify-center bg-ink text-canvas border border-ink">
            <span className="font-jp text-6xl font-bold mb-6">
              {currentKanji.character}
            </span>
            
            <h3 className="text-4xl font-bold mb-8 text-brand-neon">
              {currentKanji.meaning}
            </h3>

            <div className="grid grid-cols-2 gap-8 w-full max-w-md text-center border-t border-canvas/20 pt-8">
              {currentKanji.onyomi && (
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase text-canvas/50 block mb-2">Onyomi</span>
                  <span className="font-jp text-2xl font-medium">{currentKanji.onyomi}</span>
                </div>
              )}
              {currentKanji.kunyomi && (
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase text-canvas/50 block mb-2">Kunyomi</span>
                  <span className="font-jp text-2xl font-medium">{currentKanji.kunyomi}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Buttons */}
      {isFlipped && (
        <div className="grid grid-cols-4 gap-4 pt-4">
          <button
            onClick={(e) => { e.stopPropagation(); handleReview('again'); }}
            className="flex flex-col items-center justify-center p-4 border border-border-line hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all duration-200"
          >
            <span className="text-lg mb-1">😰</span>
            <span className="text-xs font-bold uppercase tracking-wider">Lupa</span>
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); handleReview('hard'); }}
            className="flex flex-col items-center justify-center p-4 border border-border-line hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 transition-all duration-200"
          >
             <span className="text-lg mb-1">😓</span>
            <span className="text-xs font-bold uppercase tracking-wider">Susah</span>
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); handleReview('good'); }}
            className="flex flex-col items-center justify-center p-4 border border-border-line hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-all duration-200"
          >
             <span className="text-lg mb-1">🙂</span>
            <span className="text-xs font-bold uppercase tracking-wider">Ingat</span>
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); handleReview('easy'); }}
            className="flex flex-col items-center justify-center p-4 border border-border-line hover:bg-brand-neon hover:border-brand-neon hover:text-ink transition-all duration-200"
          >
             <span className="text-lg mb-1">😎</span>
            <span className="text-xs font-bold uppercase tracking-wider">Mudah</span>
          </button>
        </div>
      )}
      
       <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
