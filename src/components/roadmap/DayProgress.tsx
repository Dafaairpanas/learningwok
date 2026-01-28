import { useState, useEffect } from 'react';
import { Check, Circle, Lock, Play, RotateCcw } from 'lucide-react';
import Slideshow from './Slideshow';
import type { LearningDay } from '../../lib/learningSchedule';

interface DayProgressProps {
  level: 'N5' | 'N4';
  schedule: LearningDay[];
}

export default function DayProgress({ level, schedule }: DayProgressProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  // Load progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`roadmap-${level}-completed`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompletedDays(new Set(parsed));
      } catch {
        console.error('Failed to parse progress');
      }
    }
  }, [level]);

  // Save progress to localStorage
  const saveProgress = (days: Set<number>) => {
    localStorage.setItem(`roadmap-${level}-completed`, JSON.stringify([...days]));
  };

  const handleDayComplete = (dayNumber: number) => {
    const newCompleted = new Set(completedDays);
    newCompleted.add(dayNumber);
    setCompletedDays(newCompleted);
    saveProgress(newCompleted);
    setSelectedDay(null);
  };

  const handleResetProgress = () => {
    if (confirm('Reset semua progress? Data tidak bisa dikembalikan.')) {
      setCompletedDays(new Set());
      localStorage.removeItem(`roadmap-${level}-completed`);
    }
  };

  const getDayStatus = (dayNumber: number): 'completed' | 'available' | 'locked' => {
    if (completedDays.has(dayNumber)) return 'completed';
    // First day is always available, others need previous day completed
    if (dayNumber === 1 || completedDays.has(dayNumber - 1)) return 'available';
    return 'locked';
  };

  const currentDay = selectedDay ? schedule.find(d => d.day === selectedDay) : null;

  // If viewing a day, show slideshow
  if (currentDay) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedDay(null)}
          className="inline-flex items-center gap-2 text-subtle hover:text-ink transition-colors"
        >
          ← Kembali ke daftar hari
        </button>

        {/* Day Header */}
        <div className="rounded-2xl bg-surface border border-border-line p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-canvas text-2xl font-bold">
              {currentDay.day}
            </span>
            <div>
              <p className="text-sm text-subtle">Hari {currentDay.day}</p>
              <h2 className="text-2xl font-bold text-ink">
                {currentDay.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Slideshow */}
        <Slideshow 
          day={currentDay} 
          onComplete={() => handleDayComplete(currentDay.day)} 
        />
      </div>
    );
  }

  // Day list view
  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="rounded-2xl border border-border-line bg-canvas p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-ink">Progress {level}</h3>
            <p className="text-sm text-subtle">
              {completedDays.size} dari {schedule.length} hari selesai
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-brand-orange">
                {Math.round((completedDays.size / schedule.length) * 100)}%
              </p>
            </div>
            {completedDays.size > 0 && (
              <button
                onClick={handleResetProgress}
                className="rounded-lg p-2 text-subtle hover:bg-surface hover:text-ink"
                title="Reset progress"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-brand-orange transition-all duration-500"
            style={{ width: `${(completedDays.size / schedule.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Day List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {schedule.map((day) => {
          const status = getDayStatus(day.day);
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';

          return (
            <button
              key={day.day}
              onClick={() => !isLocked && setSelectedDay(day.day)}
              disabled={isLocked}
              className={`relative rounded-2xl border p-6 text-left transition-all ${
                isLocked
                  ? 'cursor-not-allowed border-border-line bg-surface opacity-60'
                  : isCompleted
                  ? 'border-brand-neon bg-brand-neon/10'
                  : 'border-border-line bg-canvas hover:border-ink hover:shadow-soft'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${
                    isCompleted
                      ? 'bg-brand-neon text-black'
                      : isLocked
                      ? 'bg-surface text-subtle border border-border-line'
                      : 'bg-ink text-canvas'
                  }`}>
                    {day.day}
                  </span>
                  <div>
                    <p className="text-xs text-subtle">Hari {day.day}</p>
                    <h4 className="font-medium text-ink">{day.title}</h4>
                  </div>
                </div>
                
                <div className="text-right">
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-brand-neon" />
                  ) : isLocked ? (
                    <Lock className="h-5 w-5 text-subtle" />
                  ) : (
                    <Play className="h-5 w-5 text-ink" />
                  )}
                </div>
              </div>

                <div className="mt-4 flex flex-wrap gap-2">
                {day.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      isLocked
                        ? 'bg-surface text-subtle'
                        : 'bg-surface text-ink border border-border-line'
                    }`}
                  >
                    {topic.type === 'kanji' && '漢 '}
                    {topic.type === 'kosakata' && '語 '}
                    {topic.type === 'grammar' && '文 '}
                    {topic.type === 'pola_kalimat' && '例 '}
                    {topic.items.length}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
