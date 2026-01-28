
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Calculate page window
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        if (i >= 2 && i < totalPages) {
            range.push(i);
        }
    }
    if (totalPages > 1) range.push(totalPages);

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <div className={`flex justify-center items-center gap-1 md:gap-2 ${className}`}>
      {/* First Page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-1 md:p-2 border border-border-line hover:bg-ink hover:text-canvas disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink transition-colors"
        title="First Page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>

      {/* Previous Page */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-1 md:p-2 border border-border-line text-ink hover:bg-ink hover:text-canvas disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink transition-colors"
        title="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 mx-1 md:mx-2">
        {pages.map((p, index) => (
            typeof p === 'number' ? (
                <button
                    key={index}
                    onClick={() => onPageChange(p)}
                    className={`w-8 h-8 md:w-10 md:h-10 border border-border-line font-bold transition-all text-sm md:text-base ${
                        p === currentPage
                            ? 'bg-ink text-canvas'
                            : 'bg-canvas hover:bg-surface'
                    }`}
                >
                    {p}
                </button>
            ) : (
                <span key={index} className="w-6 md:w-8 text-center text-subtle font-bold text-xs md:text-base">
                    ...
                </span>
            )
        ))}
      </div>

      {/* Next Page */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-1 md:p-2 border border-border-line text-ink hover:bg-ink hover:text-canvas disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink transition-colors"
        title="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Last Page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-1 md:p-2 border border-border-line hover:bg-ink hover:text-canvas disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink transition-colors"
        title="Last Page"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
}
