import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Circle, BookOpen } from 'lucide-react';
import type { LearningDay, DayTopic, SlideItem } from '../../lib/learningSchedule';

interface SlideshowProps {
  day: LearningDay;
  onComplete?: () => void;
}

export default function Slideshow({ day, onComplete }: SlideshowProps) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewedSlides, setViewedSlides] = useState<Set<string>>(new Set());

  const currentTopic = day.topics[currentTopicIndex];
  const currentSlide = currentTopic?.items[currentSlideIndex];
  const totalSlides = day.topics.reduce((acc, t) => acc + t.items.length, 0);
  
  // Calculate overall slide number
  let currentOverallSlide = 0;
  for (let i = 0; i < currentTopicIndex; i++) {
    currentOverallSlide += day.topics[i].items.length;
  }
  currentOverallSlide += currentSlideIndex + 1;

  // Mark current slide as viewed
  useEffect(() => {
    if (currentSlide) {
      setViewedSlides(prev => new Set(prev).add(currentSlide.id));
    }
  }, [currentSlide]);

  const goToNext = () => {
    if (currentSlideIndex < currentTopic.items.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else if (currentTopicIndex < day.topics.length - 1) {
      setCurrentTopicIndex(prev => prev + 1);
      setCurrentSlideIndex(0);
    } else {
      // Completed all slides
      onComplete?.();
    }
  };

  const goToPrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    } else if (currentTopicIndex > 0) {
      setCurrentTopicIndex(prev => prev - 1);
      setCurrentSlideIndex(day.topics[currentTopicIndex - 1].items.length - 1);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'kanji': return '漢';
      case 'kosakata': return '語';
      case 'grammar': return '文';
      case 'pola_kalimat': return '例';
      default: return '📚';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'kanji': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'kosakata': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'grammar': return 'bg-purple-100/50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'pola_kalimat': return 'bg-green-100/50 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-surface text-subtle';
    }
  };

  if (!currentTopic || !currentSlide) {
    return (
      <div className="flex items-center justify-center h-96 text-muted">
        No content available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-subtle">
            Slide {currentOverallSlide} / {totalSlides}
          </span>
          <span className="text-subtle">
            {Math.round((currentOverallSlide / totalSlides) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface border border-border-line">
          <div
            className="h-full rounded-full bg-brand-orange transition-all duration-300"
            style={{ width: `${(currentOverallSlide / totalSlides) * 100}%` }}
          />
        </div>
      </div>

      {/* Topic Badge */}
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl font-jp text-lg font-bold ${getTypeColor(currentTopic.type)}`}>
          {getTypeIcon(currentTopic.type)}
        </span>
        <div>
          <span className="text-xs uppercase tracking-wider text-subtle">
            {currentTopic.type.replace('_', ' ')}
          </span>
          <h3 className="font-semibold text-ink">
            {currentTopic.title}
          </h3>
        </div>
      </div>

      {/* Slide Card */}
      <div className="relative min-h-[400px] overflow-hidden rounded-3xl border border-border-line bg-canvas p-8">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px]">
          {/* Main Word/Kanji */}
          <p className={`font-jp font-bold ${
            currentTopic.type === 'kanji' ? 'text-7xl md:text-8xl' : 'text-4xl md:text-5xl'
          } text-ink`}>
            {currentSlide.content.main}
          </p>

          {/* Reading */}
          {currentSlide.content.reading && (
            <p className="mt-4 font-jp text-xl text-brand-orange">
              {currentSlide.content.reading}
            </p>
          )}

          {/* Meaning */}
          <p className="mt-4 text-xl text-ink">
            {currentSlide.content.meaning}
          </p>

          {/* Examples */}
          {currentSlide.content.examples && currentSlide.content.examples.length > 0 && (
            <div className="mt-8 w-full max-w-md space-y-3">
              <h4 className="text-sm font-medium text-subtle">Contoh:</h4>
              {currentSlide.content.examples.map((ex, idx) => (
                <div key={idx} className="rounded-xl bg-surface p-4 border border-border-line">
                  <p className="font-jp text-lg text-ink">{ex.text}</p>
                  <p className="mt-1 text-sm text-subtle">{ex.translation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {currentSlide.content.notes && (
            <div className="mt-6 rounded-xl bg-surface p-4 text-left border border-brand-orange/20">
              <p className="text-sm text-ink">
                💡 {currentSlide.content.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrev}
          disabled={currentTopicIndex === 0 && currentSlideIndex === 0}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-subtle transition-colors hover:bg-surface hover:text-ink disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
          Sebelumnya
        </button>

        <button
          onClick={goToNext}
          className="inline-flex items-center gap-2 rounded-xl bg-ink text-canvas px-6 py-3 font-medium transition-colors hover:bg-brand-neon hover:text-ink"
        >
          {currentTopicIndex === day.topics.length - 1 && currentSlideIndex === currentTopic.items.length - 1 ? (
            <>
              Selesai
              <Check className="h-5 w-5" />
            </>
          ) : (
            <>
              Selanjutnya
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>

      {/* Topic Indicators */}
      <div className="flex items-center justify-center gap-2">
        {day.topics.map((topic, tIdx) => (
          <div key={tIdx} className="flex items-center gap-1">
            {topic.items.map((item, sIdx) => {
              const isViewed = viewedSlides.has(item.id);
              const isCurrent = tIdx === currentTopicIndex && sIdx === currentSlideIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTopicIndex(tIdx);
                    setCurrentSlideIndex(sIdx);
                  }}
                  className={`h-2 w-2 rounded-full transition-all ${
                    isCurrent
                      ? 'h-3 w-3 bg-brand-orange'
                      : isViewed
                      ? 'bg-brand-orange/50'
                      : 'bg-border-line'
                  }`}
                />
              );
            })}
            {tIdx < day.topics.length - 1 && (
              <div className="mx-1 h-px w-2 bg-border-line" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
