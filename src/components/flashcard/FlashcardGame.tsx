import React, { useState, useEffect } from 'react';
import { Check, X, RotateCw, Home, Trophy, ArrowRight } from 'lucide-react';
import type { FlashcardItem } from '../../services/flashcard';

interface Props {
  data: FlashcardItem[];
  onExit: () => void;
}

export const FlashcardGame: React.FC<Props> = ({ data, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasPeeked, setHasPeeked] = useState(false); // Track if user peeked for current card

  const currentCard = data[currentIndex];
  const progress = ((currentIndex) / data.length) * 100;

  useEffect(() => {
    // Reset state when index changes
    setIsFlipped(false);
    setHasPeeked(false);
  }, [currentIndex]);

  const handleNext = (correct: boolean) => {
    if (correct) setScore(s => s + 1);

    if (currentIndex + 1 < data.length) {
      setCurrentIndex(c => c + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const handlePeek = () => {
    setIsFlipped(true);
    setHasPeeked(true); // Mark as peeked (automatically wrong)
  };

  if (isGameOver) {
    const percentage = Math.round((score / data.length) * 100);
    return (
      <div className="w-full max-w-lg mx-auto bg-canvas border-2 border-ink p-8 shadow-[8px_8px_0px_0px_var(--color-ink)] text-center">
         <div className="w-20 h-20 bg-brand-neon border-2 border-ink flex items-center justify-center mx-auto mb-6 rounded-full shadow-[4px_4px_0px_0px_var(--color-ink)]">
           <Trophy className="w-10 h-10 text-ink" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-ink mb-2">Session Complete!</h2>
        <p className="text-subtle font-bold uppercase tracking-widest mb-8">Here is your result</p>
        
        <div className="flex justify-center gap-4 mb-8">
            <div className="p-4 border-2 border-border-line bg-surface w-32">
                <p className="text-xs font-black uppercase tracking-widest text-subtle">Score</p>
                <p className="text-3xl font-black text-ink">{score}/{data.length}</p>
            </div>
             <div className="p-4 border-2 border-border-line bg-surface w-32">
                <p className="text-xs font-black uppercase tracking-widest text-subtle">Accuracy</p>
                <p className={`text-3xl font-black ${percentage >= 80 ? 'text-green-600 dark:text-green-400' : percentage >= 50 ? 'text-brand-orange' : 'text-red-500 dark:text-red-400'}`}>
                    {percentage}%
                </p>
            </div>
        </div>

        <button
          onClick={onExit}
          className="w-full flex items-center justify-center gap-2 border-2 border-ink bg-ink text-canvas py-4 font-black uppercase tracking-widest hover:bg-brand-orange hover:text-ink hover:border-ink transition-all"
        >
          <Home className="w-5 h-5" />
          Back to Menu
        </button>
      </div>
    );
  }

  if (!currentCard) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="w-full h-4 border-2 border-ink bg-surface relative rounded-full overflow-hidden">
        <div 
            className="h-full bg-brand-neon transition-all duration-300 border-r-2 border-ink"
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-end px-2">
         <span className="text-sm font-black uppercase tracking-widest text-subtle">Card {currentIndex + 1} of {data.length}</span>
         <span className="px-2 py-1 bg-ink text-canvas text-xs font-bold uppercase tracking-widest">{currentCard.type} • {currentCard.level}</span>
      </div>

      {/* Card Container */}
      <div className="perspective-1000">
        <div className={`relative w-full h-[400px] transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
           
           {/* FRONT */}
           <div className="absolute inset-0 w-full h-full bg-canvas border-2 border-ink shadow-[8px_8px_0px_0px_var(--color-ink)] flex flex-col items-center justify-center p-8 backface-hidden z-20">
              <div className="absolute top-0 right-0 p-4">
                  <span className="w-3 h-3 rounded-full bg-red-500 block border border-ink"></span>
              </div>
              <h3 className="text-6xl md:text-8xl font-black text-ink font-jp text-center leading-tight">
                {currentCard.front}
              </h3>
              <p className="mt-8 text-sm font-bold uppercase tracking-widest text-subtle text-center">
                 Do you know this?
              </p>
           </div>

           {/* BACK */}
            <div className="absolute inset-0 w-full h-full bg-brand-neon border-2 border-ink shadow-[8px_8px_0px_0px_var(--color-ink)] flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180 z-10 overflow-y-auto">
               <div className="text-center space-y-4">
                   <div>
                        <p className="text-xs font-black uppercase tracking-widest text-black/60 mb-1">Meaning</p>
                        <p className="text-2xl font-bold text-black">{currentCard.back.meaning}</p>
                   </div>
                   
                   {currentCard.back.reading && (
                        <div className="border-t border-black/20 pt-4">
                            <p className="text-xs font-black uppercase tracking-widest text-black/60 mb-1">Reading</p>
                            <p className="text-xl font-jp font-medium text-black">{currentCard.back.reading}</p>
                        </div>
                   )}

                   {(currentCard.back.example) && (
                        <div className="border-t border-black/20 pt-4 bg-white/50 p-4 rounded-lg border border-black/10">
                             <p className="text-xs font-black uppercase tracking-widest text-black/60 mb-2">Example</p>
                             <p className="text-lg font-jp text-black mb-1">{currentCard.back.example}</p>
                             <p className="text-sm text-black/80 italic">{currentCard.back.exampleTranslation}</p>
                        </div>
                   )}
                   
                   {currentCard.back.usage && (
                        <div className="border-t border-black/20 pt-4">
                             <p className="text-xs font-black uppercase tracking-widest text-black/60 mb-2">Usage</p>
                             <p className="text-sm text-black">{currentCard.back.usage}</p>
                        </div>
                   )}
               </div>
           </div>

        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 pt-4">
         {!isFlipped ? (
             <>
                <button
                    onClick={handlePeek}
                    className="flex flex-col items-center justify-center p-4 border-2 border-border-line bg-surface hover:bg-red-100 hover:border-red-500 hover:text-red-700 transition-all group"
                >
                    <div className="mb-2 w-10 h-10 rounded-full border-2 border-border-line group-hover:border-red-500 flex items-center justify-center bg-canvas">
                         <RotateCw className="w-5 h-5 text-subtle group-hover:text-red-500" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Lupa / Cek</span>
                    <span className="text-[10px] text-red-500 font-bold mt-1">(Counts as Wrong)</span>
                </button>

                <button
                    onClick={() => handleNext(true)}
                    className="flex flex-col items-center justify-center p-4 border-2 border-border-line bg-surface hover:bg-green-100 hover:border-green-500 hover:text-green-700 transition-all group"
                >
                    <div className="mb-2 w-10 h-10 rounded-full border-2 border-border-line group-hover:border-green-500 flex items-center justify-center bg-canvas">
                         <Check className="w-5 h-5 text-subtle group-hover:text-green-500" />
                    </div>
                     <span className="text-xs font-black uppercase tracking-widest">Paham</span>
                     <span className="text-[10px] text-green-600 font-bold mt-1">(+1 Point)</span>
                </button>
             </>
         ) : (
             <button
                onClick={() => handleNext(false)} // Always false because they peeked
                className="col-span-2 flex items-center justify-center gap-2 border-2 border-ink bg-ink text-canvas py-4 font-black uppercase tracking-widest hover:bg-brand-orange hover:text-ink hover:border-ink transition-all shadow-[4px_4px_0px_0px_var(--color-ink)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
             >
                <ArrowRight className="w-5 h-5" />
                Lanjut (Recorded as Wrong)
             </button>
         )}
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
