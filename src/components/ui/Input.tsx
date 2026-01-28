import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-bold tracking-wide uppercase text-subtle"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            'w-full border border-border-line bg-canvas px-4 py-2.5',
            'text-ink placeholder:text-subtle',
            'focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink',
            'transition-colors duration-200',
            icon && 'pl-10',
            error && 'border-brand-orange focus:border-brand-orange focus:ring-brand-orange',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-brand-orange font-medium">{error}</p>
      )}
    </div>
  );
}
