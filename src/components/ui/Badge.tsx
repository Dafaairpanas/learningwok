import { clsx, type ClassValue } from 'clsx';

interface BadgeProps {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const levelColors: Record<string, string> = {
  N5: 'bg-jlpt-n5/10 text-jlpt-n5 border-jlpt-n5/20',
  N4: 'bg-jlpt-n4/10 text-jlpt-n4 border-jlpt-n4/20',
  N3: 'bg-jlpt-n3/10 text-jlpt-n3 border-jlpt-n3/20',
  N2: 'bg-jlpt-n2/10 text-jlpt-n2 border-jlpt-n2/20',
  N1: 'bg-jlpt-n1/10 text-jlpt-n1 border-jlpt-n1/20',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({ level, size = 'md', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium border',
        levelColors[level] || 'bg-surface text-subtle border-border-line',
        sizeClasses[size],
        className
      )}
    >
      {level}
    </span>
  );
}
