import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, Volume2, Maximize, Minimize, ArrowRight, Home, RotateCcw } from 'lucide-react';
import type { LearningDay } from '../../types/roadmap';
import { playAudio } from '../../lib/tts';
import MarkdownRenderer from '../common/MarkdownRenderer';

interface Props {
  dayData: LearningDay;
  level: string;
}

type SlideType = 'intro' | 'kanji' | 'kosakata' | 'bunpo' | 'outro';

interface Slide {
  id: string;
  type: SlideType;
  title?: string;
  description?: string;
  content?: any;
  note?: string;
  topicTitle?: string;
  indexInTopic?: number;
  totalInTopic?: number;
}

export default function RoadmapSlideshow({ dayData, level }: Props) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten data into slides
  useEffect(() => {
    const generatedSlides: Slide[] = [];

    // 1. Intro Slide
    generatedSlides.push({
      id: 'intro',
      type: 'intro',
      title: dayData.title,
      description: dayData.description
    });

    // 2. Process Topics
    if (dayData.topics) {
      dayData.topics.sort((a, b) => a.sort_order - b.sort_order).forEach(topic => {
        const type = topic.content_type;
        let items: any[] = [];
        
        if (type === 'kanji' && topic.kanji_items) items = topic.kanji_items;
        else if (type === 'kosakata' && topic.kosakata_items) items = topic.kosakata_items;
        else if (type === 'bunpo' && topic.bunpo_items) items = topic.bunpo_items;

        items.sort((a, b) => a.sort_order - b.sort_order).forEach((item, idx) => {
          generatedSlides.push({
            id: `${type}-${item.id || idx}`,
            type: type as SlideType, // dangerous cast but we know the structure
            content: item, 
            note: item.note,
            topicTitle: topic.title,
            indexInTopic: idx + 1,
            totalInTopic: items.length
          });
        });
      });
    }

    // 3. Outro Slide
    generatedSlides.push({
      id: 'outro',
      type: 'outro',
      title: 'COMPLETE',
      description: `You have mastered Day ${dayData.day_number}.`
    });

    setSlides(generatedSlides);
  }, [dayData]);

  // Navigation
  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [currentSlideIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  }, [currentSlideIndex]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowLeft', ' '].includes(e.key)) {
         // Prevent default scrolling only if not composing text (rare here)
      }

      if (e.key === 'ArrowRight' || e.key === ' ') {
         e.preventDefault();
         nextSlide();
      }
      else if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
        setIsFullscreen(true);
    } else {
        document.exitFullscreen();
        setIsFullscreen(false);
    }
  };

  useEffect(() => {
      const handleFullscreenChange = () => {
          setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);


  if (slides.length === 0) return null;

  const currentSlide = slides[currentSlideIndex];
  
  // Swiss layout wrapper
  return (
    <div 
        ref={containerRef}
        className={`bg-canvas text-ink font-sans flex flex-col md:flex-row overflow-hidden border border-ink ${isFullscreen ? 'fixed inset-0 z-[200] w-full h-full' : 'h-[800px] w-full max-w-7xl mx-auto shadow-2xl'}`}
    >
      
      {/* SIDEBAR (Progress & Info) */}
      <aside className="w-full md:w-[220px] lg:w-[320px] flex-shrink-0 bg-surface border-b md:border-b-0 md:border-r border-ink flex flex-row md:flex-col justify-between p-4 md:p-6 lg:p-8">
         {/* Top Section */}
         <div className="flex flex-col justify-center">
             <div className="flex items-baseline gap-1 mb-2 md:mb-6">
                 <span className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-none text-ink">
                    {String(currentSlideIndex + 1).padStart(2, '0')}
                 </span>
                 <span className="text-sm md:text-2xl lg:text-3xl text-ink/60 dark:text-ink/80 font-light leading-none">
                    /{String(slides.length).padStart(2, '0')}
                 </span>
             </div>
             
             <div className="hidden md:block">
                <h1 className="text-3xl font-black uppercase leading-[0.9] tracking-tight mb-4 text-ink">
                    {level}<br/>DAY {dayData.day_number}
                </h1>
                <p className="text-sm font-medium text-ink/60 uppercase tracking-widest border-t border-ink/20 pt-4 mt-2">
                    {currentSlide.topicTitle || "Introduction"}
                </p>
             </div>
         </div>

         {/* Bottom Control Section (Desktop) */}
         <div className="hidden md:flex flex-col gap-4">
             <div className="flex gap-0 border border-ink">
                 <button onClick={prevSlide} disabled={currentSlideIndex === 0} className="flex-1 py-4 hover:bg-ink hover:text-canvas transition-colors disabled:opacity-20 border-r border-ink flex justify-center text-ink">
                    <ChevronLeft />
                 </button>
                 <button onClick={nextSlide} disabled={currentSlideIndex === slides.length - 1} className="flex-1 py-4 hover:bg-brand-neon hover:text-ink transition-colors disabled:opacity-20 flex justify-center text-ink">
                    <ChevronRight />
                 </button>
             </div>
             <button onClick={toggleFullscreen} className="text-xs uppercase font-bold tracking-widest text-center hover:underline text-ink">
                {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
             </button>
         </div>

         {/* Mobile Topic Title & Fullscreen (Visible only on mobile) */}
         <div className="md:hidden flex items-center gap-4">
             <div className="flex flex-col justify-center text-right">
                 <span className="text-xs font-bold uppercase tracking-widest text-ink/50">{level} DAY {dayData.day_number}</span>
                 <span className="font-bold uppercase truncate max-w-[150px] text-ink">{currentSlide.topicTitle || "Intro"}</span>
             </div>
             <button onClick={toggleFullscreen} className="p-2 border border-ink bg-canvas text-ink active:bg-ink active:text-canvas transition-colors">
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
             </button>
         </div>
      </aside>

      {/* MAIN CONTENT CANVAS */}
      <main className="flex-1 bg-canvas relative overflow-y-auto md:overflow-hidden flex flex-col">
        
        {/* INTRO SLIDE */}
        {currentSlide.type === 'intro' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-[url('/grid-pattern.svg')] bg-[length:40px_40px]">
                 <div className="max-w-2xl border-2 border-ink p-6 md:p-12 bg-canvas shadow-[8px_8px_0px_0px_var(--color-ink)]">
                    <h2 className="text-4xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-6 tracking-tighter uppercase leading-none text-ink">
                        Start<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-brand-orange">Mission</span>
                    </h2>
                    <p className="text-xl font-medium text-ink/70 mb-12 leading-relaxed">
                        {currentSlide.description}
                    </p>
                    <button onClick={nextSlide} className="btn-swiss btn-swiss-primary w-full text-xl py-6">
                        Begin <ArrowRight className="ml-2" />
                    </button>
                 </div>
            </div>
        )}

        {/* KANJI SLIDE (BENTO GRID) */}
        {currentSlide.type === 'kanji' && (
            <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_1fr] md:grid-rows-2">
                {/* Hero Cell: Character */}
                <div className="md:row-span-2 bg-surface flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-ink p-6 md:p-12 relative overflow-hidden group min-h-[220px] md:min-h-0">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--color-ink)_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-ink/40 dark:text-gray-400 w-full text-center md:text-left mb-1 md:mb-0 md:absolute md:top-6 md:left-6 md:w-auto">Kanji Character</span>
                    
                    <h2 className="text-[5rem] md:text-[14rem] font-jp font-bold leading-none z-10 group-hover:scale-110 transition-transform duration-500 ease-out py-2 md:py-0">
                        {currentSlide.content.kanji?.character}
                    </h2>
                    <p className="text-lg md:text-2xl font-bold mt-2 md:mt-4 font-jp bg-ink text-canvas px-3 py-0.5 md:px-4 md:py-1 rounded-sm">
                        {currentSlide.content.kanji?.meaning}
                    </p>
                </div>

                {/* Top Right: Readings */}
                <div className="bg-canvas p-6 md:p-8 border-b border-ink flex flex-col justify-center relative">
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-ink/60 dark:text-gray-400 mb-3 md:mb-6 block">Readings</span>
                    
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-baseline justify-between group cursor-pointer hover:bg-brand-neon/10 -mx-4 px-4 py-1 md:py-2 transition-colors" onClick={() => playAudio(currentSlide.content.kanji?.onyomi)}>
                             <div>
                                <span className="text-[10px] md:text-xs font-bold uppercase text-ink/60 dark:text-gray-400 mr-4 w-8 md:w-12 inline-block">ON</span>
                                <span className="text-xl md:text-3xl font-bold font-jp text-ink dark:text-white">{currentSlide.content.kanji?.onyomi}</span>
                             </div>
                             <Volume2 className="text-ink/20 group-hover:text-ink transition-colors" size={18} />
                        </div>
                        <div className="flex items-baseline justify-between group cursor-pointer hover:bg-brand-orange/10 -mx-4 px-4 py-1 md:py-2 transition-colors" onClick={() => playAudio(currentSlide.content.kanji?.kunyomi)}>
                             <div>
                                <span className="text-[10px] md:text-xs font-bold uppercase text-ink/60 dark:text-gray-400 mr-4 w-8 md:w-12 inline-block">KUN</span>
                                <span className="text-xl md:text-3xl font-bold font-jp text-ink dark:text-white">{currentSlide.content.kanji?.kunyomi}</span>
                             </div>
                             <Volume2 className="text-ink/20 group-hover:text-ink transition-colors" size={18} />
                        </div>
                    </div>
                </div>

                {/* Bottom Right: Note */}
                <div className="bg-canvas p-8 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-brand-neon"></div>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-ink/100">Sensei Note</span>
                    </div>
                    {currentSlide.note && (
                        <MarkdownRenderer content={currentSlide.note} className="font-sans text-ink/80" />
                    )}
                </div>
            </div>
        )}

        {/* KOSAKATA SLIDE (HORIZONTAL SPLIT) */}
        {currentSlide.type === 'kosakata' && (
            <div className="h-full w-full flex flex-col">
                <div className="flex-1 bg-surface flex flex-col items-center justify-center p-6 md:p-12 border-b border-ink relative cursor-pointer group min-h-[220px]" onClick={() => playAudio(currentSlide.content.kosakata?.kanji)}>
                     <span className="absolute top-4 left-4 md:top-6 md:left-6 text-[10px] md:text-xs font-bold tracking-widest uppercase text-ink/40 dark:text-gray-400">Flashcard</span>
                     <Volume2 className="absolute top-4 right-4 md:top-6 md:right-6 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                     
                     <h2 className="text-5xl md:text-9xl font-jp font-bold mb-2 md:mb-4 text-ink">{currentSlide.content.kosakata?.kanji}</h2>
                     {currentSlide.content.kosakata?.kanji !== currentSlide.content.kosakata?.hiragana && (
                        <p className="text-xl md:text-3xl font-jp font-medium opacity-60 text-ink">{currentSlide.content.kosakata?.hiragana}</p>
                     )}
                     {currentSlide.content.kosakata?.romaji && (
                        <p className="text-sm md:text-lg font-medium opacity-60 text-ink dark:text-gray-300 mt-1 md:mt-2">{currentSlide.content.kosakata.romaji}</p>
                     )}
                </div>
                
                <div className="h-[40%] flex flex-col md:flex-row">
                    <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-ink flex flex-col justify-center items-center text-center bg-canvas">
                         <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-ink/40 dark:text-gray-400 mb-1 md:mb-2">Meaning</span>
                         <p className="text-2xl md:text-4xl font-bold text-ink dark:text-white">{currentSlide.content.kosakata?.meaning}</p>
                    </div>
                    <div className="flex-[1.5] p-8 bg-surface overflow-y-auto">
                        <span className="text-xs font-bold tracking-widest uppercase text-ink/40 dark:text-gray-400 mb-4 block">Context & Notes</span>
                        {currentSlide.note && (
                            <MarkdownRenderer content={currentSlide.note} className="text-lg leading-relaxed text-ink dark:text-gray-300" />
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* BUNPO SLIDE */}
        {currentSlide.type === 'bunpo' && (
             <div className="w-full flex flex-col md:h-full">
                 <div className="bg-surface flex flex-col items-center justify-center p-6 md:p-12 border-b border-ink relative group min-h-[300px] md:flex-1 md:min-h-0">
                      <span className="absolute top-4 left-4 md:top-6 md:left-6 text-[10px] md:text-xs font-bold tracking-widest uppercase text-ink/40 dark:text-gray-400">Grammar</span>
                      
                      <h2 className="text-4xl md:text-7xl font-jp font-bold mb-4 md:mb-6 flex items-center gap-4 cursor-pointer hover:text-brand-orange transition-colors text-ink" onClick={() => playAudio(currentSlide.content.bunpo?.pattern)}>
                          {currentSlide.content.bunpo?.pattern}
                          <Volume2 className="text-ink/20 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 md:w-10 md:h-10" />
                      </h2>
                      
                      <p className="text-xl md:text-3xl font-bold text-ink/80 dark:text-white text-center max-w-4xl">
                          {currentSlide.content.bunpo?.meaning}
                      </p>
                 </div>

                 <div className="flex flex-col md:flex-row md:h-[45%]">
                      {currentSlide.content.bunpo?.examples && Array.isArray(currentSlide.content.bunpo.examples) && currentSlide.content.bunpo.examples.length > 0 && (
                        <div className="p-6 md:p-8 bg-canvas border-b md:border-b-0 md:border-r border-ink md:flex-1 md:overflow-y-auto">
                           <span className="text-xs font-bold tracking-widest uppercase text-ink/40 dark:text-gray-400 mb-4 block">Examples</span>
                           <div className="space-y-4">
                                {currentSlide.content.bunpo.examples.map((ex: string, i: number) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">{i+1}</div>
                                        <p className="text-lg font-jp text-ink dark:text-white leading-relaxed">{ex}</p>
                                    </div>
                                ))}
                           </div>
                        </div>
                      )}

                      <div className="p-6 md:p-8 bg-surface md:flex-1 md:overflow-y-auto">
                          <span className="text-xs font-bold tracking-widest uppercase text-ink/40 dark:text-gray-400 mb-4 block">Explanation</span>
                          {currentSlide.note && (
                              <MarkdownRenderer content={currentSlide.note} className="prose-base md:prose-lg text-ink dark:text-gray-300" />
                          )}
                      </div>
                 </div>
             </div>
        )}

        {/* OUTRO SLIDE */}
        {currentSlide.type === 'outro' && (
             <div className="h-full flex flex-col items-center justify-center bg-brand-neon text-black p-8 text-center">
                 <h1 className="text-[12rem] leading-none font-black opacity-20 select-none absolute">DONE</h1>
                 
                 <div className="relative z-10 bg-canvas text-ink border-2 border-ink p-12 shadow-[12px_12px_0px_0px_var(--color-ink)] max-w-lg w-full">
                     <h2 className="text-4xl font-black uppercase mb-4">Mission Complete</h2>
                     <p className="text-xl font-medium mb-8">Day {dayData.day_number} cleared successfully.</p>
                     
                     <div className="space-y-3">
                         <button onClick={() => window.location.href = `/roadmap`} className="btn-swiss btn-swiss-primary w-full py-4 flex items-center justify-center gap-2">
                             <Home size={18} /> Return to Base
                         </button>
                         <button onClick={() => setCurrentSlideIndex(0)} className="btn-swiss w-full py-4 flex items-center justify-center gap-2">
                             <RotateCcw size={18} /> Replay Mission
                         </button>
                     </div>
                 </div>
             </div>
        )}

      </main>

      {/* Mobile Footer NAV */}
      <div className="md:hidden border-t border-ink flex divide-x divide-ink bg-canvas h-16">
          <button onClick={prevSlide} disabled={currentSlideIndex === 0} className="flex-1 flex items-center justify-center disabled:opacity-30 active:bg-surface">
              <ChevronLeft />
          </button>
          <div className="flex-1 flex items-center justify-center font-bold font-mono text-sm">
              {currentSlideIndex + 1} / {slides.length}
          </div>
          <button onClick={nextSlide} disabled={currentSlideIndex === slides.length - 1} className="flex-1 flex items-center justify-center disabled:opacity-30 active:bg-surface">
              <ChevronRight />
          </button>
      </div>

    </div>
  );
}
