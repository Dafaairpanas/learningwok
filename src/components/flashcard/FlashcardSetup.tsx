import React, { useState } from 'react';
import { Play, Settings2, BookOpen, Languages, ScrollText } from 'lucide-react';

export const FlashcardSetup: React.FC = () => {
  const [type, setType] = useState('kanji');
  const [level, setLevel] = useState('N5');
  const [count, setCount] = useState(10);

  const categories = [
    { id: 'kanji', label: 'Kanji', icon: Languages, color: 'bg-brand-orange' },
    { id: 'kosakata', label: 'Kosakata', icon: BookOpen, color: 'bg-brand-blue' }, // Assuming brand-blue exists, or fallback
    { id: 'bunpo', label: 'Bunpo', icon: ScrollText, color: 'bg-brand-purple' },
  ];

  const levels = ['N5', 'N4'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/flashcards/play?type=${type}&level=${level}&count=${count}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-canvas border-2 border-ink p-8 shadow-[8px_8px_0px_0px_var(--color-ink)] relative">
      <div className="mb-8 text-center relative z-10">
        <div className="w-16 h-16 bg-brand-neon border-2 border-ink flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_var(--color-ink)]">
           <Settings2 className="w-8 h-8 text-ink" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-ink">Game Setup</h2>
        <p className="text-sm font-bold uppercase tracking-widest text-subtle mt-2">Configure your session</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        
        {/* Type Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-3">Topic</label>
          <div className="grid grid-cols-3 gap-4">
             {categories.map((cat) => (
                <button
                    key={cat.id}
                    type="button"
                    onClick={() => setType(cat.id)}
                    className={`
                        relative flex flex-col items-center justify-center p-4 border-2 transition-all cursor-pointer group
                        ${type === cat.id 
                            ? 'border-ink bg-ink text-canvas shadow-[4px_4px_0px_0px_var(--color-ink)] -translate-y-1' 
                            : 'border-border-line bg-surface text-subtle hover:border-ink hover:text-ink hover:bg-canvas'}
                    `}
                >
                    <cat.icon className={`mb-2 w-6 h-6 ${type === cat.id ? 'text-brand-neon' : 'text-current'}`} />
                    <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
                    
                    {/* Active Indicator */}
                    {type === cat.id && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-neon"></div>
                    )}
                </button>
             ))}
          </div>
        </div>

        {/* Level Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-3">Level</label>
          <div className="flex gap-4">
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`
                    flex-1 p-3 border-2 font-black uppercase tracking-widest transition-all cursor-pointer
                    ${level === l
                        ? 'border-ink bg-brand-neon text-ink shadow-[4px_4px_0px_0px_var(--color-ink)] -translate-y-1'
                        : 'border-border-line bg-surface text-subtle hover:border-ink hover:text-ink hover:bg-canvas'}
                `}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Count Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-3">Quantity: {count} Cards</label>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full h-2 bg-border-line rounded-lg appearance-none cursor-pointer accent-ink"
          />
          <div className="flex justify-between text-xs font-mono text-subtle mt-2">
            <span>5</span>
            <span>25</span>
            <span>50</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border-line">
            <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 border-2 border-ink bg-ink text-canvas py-4 font-black uppercase tracking-widest hover:bg-brand-orange hover:text-ink hover:border-ink transition-all shadow-[4px_4px_0px_0px_var(--color-ink)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
            <Play className="w-5 h-5" />
            Start Session
            </button>
        </div>
      </form>
    </div>
  );
};
