import React, { useMemo } from 'react';
import { marked } from 'marked';

interface Props {
  content: string;
  className?: string;
}

// Configure marked for inline rendering (no <p> wrapper)
marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function MarkdownRenderer({ content, className = '' }: Props) {
  const html = useMemo(() => {
    if (!content) return '';

    // Handle escaped newlines from DB
    const normalized = content.replace(/\\n/g, '\n');
    
    // Parse markdown to HTML
    const parsed = marked.parse(normalized, { async: false }) as string;
    
    return parsed;
  }, [content]);

  return (
    <div
      className={`prose prose-sm max-w-none 
        prose-headings:text-ink prose-headings:font-black
        prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
        prose-strong:text-ink prose-strong:font-black 
        prose-ul:list-disc prose-ul:pl-4
        prose-code:bg-ink/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-brand-orange prose-code:font-bold prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-surface prose-pre:border prose-pre:border-ink prose-pre:text-ink
        dark:prose-p:text-gray-100 dark:prose-li:text-gray-100 dark:prose-strong:text-white
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
