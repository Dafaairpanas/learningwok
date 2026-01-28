import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Pagination from '../ui/Pagination';
import type { PolaKalimat } from '../../lib/supabase';

const ITEMS_PER_PAGE = 20;

interface PolaListProps {
  initialPola: PolaKalimat[];
}

const jlptOptions = [
  { value: 'all', label: 'SEMUA LEVEL' },
  { value: 'N5', label: 'JLPT N5' },
  { value: 'N4', label: 'JLPT N4' },
  { value: 'N3', label: 'JLPT N3' },
];

const categoryOptions = [
  { value: 'all', label: 'SEMUA KATEGORI' },
  { value: 'basic', label: 'Dasar' },
  { value: 'existence', label: 'Keberadaan' },
  { value: 'desire', label: 'Keinginan' },
  { value: 'requests', label: 'Permintaan' },
  { value: 'permission', label: 'Izin' },
  { value: 'comparison', label: 'Perbandingan' },
];

export default function PolaList({ initialPola }: PolaListProps) {
  const [search, setSearch] = useState('');
  const [jlptLevel, setJlptLevel] = useState('all');
  const [category, setCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filteredPola = useMemo(() => {
    let result = [...initialPola];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.pattern.includes(search) ||
          p.meaning.toLowerCase().includes(searchLower)
      );
    }

    if (jlptLevel !== 'all') {
      result = result.filter((p) => p.jlpt_level === jlptLevel);
    }

    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    return result;
  }, [initialPola, search, jlptLevel, category]);

  const totalPages = Math.ceil(filteredPola.length / ITEMS_PER_PAGE);
  const paginatedPola = filteredPola.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleFilterChange = () => {
    setPage(1);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="border-b border-border-line bg-canvas p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Input
            placeholder="CARI POLA KALIMAT..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange();
            }}
            icon={<Search className="h-4 w-4" />}
          />
          <Select
            options={jlptOptions}
            value={jlptLevel}
            onChange={(e) => {
              setJlptLevel(e.target.value);
              handleFilterChange();
            }}
          />
          <Select
            options={categoryOptions}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              handleFilterChange();
            }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-bold text-subtle uppercase tracking-widest">
            {filteredPola.length} ITEM DITEMUKAN (Page {page} of {totalPages})
          </p>
        </div>
      </div>

      {/* Pola Kalimat List */}
      <div className="border-x border-border-line">
        {paginatedPola.length > 0 ? (
          <div className="divide-y divide-border-line border-t border-border-line">
            {paginatedPola.map((pola) => (
              <div
                key={pola.id}
                className="group bg-canvas transition-colors"
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpand(pola.id)}
                  className="flex w-full items-center justify-between p-6 text-left hover:bg-inv-canvas hover:text-inv-ink cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <span className={`text-xs font-bold tracking-widest uppercase px-2 py-1 border border-ink bg-canvas text-ink group-hover:border-inv-ink group-hover:text-inv-ink group-hover:bg-inv-canvas`}>
                      {pola.jlpt_level || 'N?'}
                    </span>
                    
                    <div>
                      <h3 className="font-jp text-xl font-bold text-ink mb-1 group-hover:text-inv-ink transition-colors">
                        {pola.pattern}
                      </h3>
                      <p className="font-medium text-subtle uppercase tracking-wide text-sm group-hover:text-inv-ink">
                        {pola.meaning}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 bg-brand-neon/20 text-ink border border-ink group-hover:border-inv-ink group-hover:text-inv-ink">
                        POLA
                      </span>
                    {expandedId === pola.id ? (
                      <ChevronUp className="h-5 w-5 text-ink group-hover:text-inv-ink" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-subtle group-hover:text-inv-ink" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedId === pola.id && (
                  <div className="border-t border-border-line bg-surface p-8 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid gap-8 md:grid-cols-2">
                       {/* Usage Info */}
                       <div className="space-y-6">
                          {pola.usage && (
                            <div className="p-4 border-l-2 border-brand-orange bg-brand-orange/5">
                              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-2">Penggunaan</h4>
                              <p className="text-mk text-sm leading-relaxed">{pola.usage}</p>
                            </div>
                          )}
                       </div>

                       {/* Examples */}
                       <div>
                          {pola.examples && pola.examples.length > 0 && (
                            <div className="space-y-4">
                               <h4 className="text-xs font-bold uppercase tracking-widest text-subtle mb-3 flex items-center gap-2">
                                  Contoh Kalimat
                                  <div className="h-px bg-border-line flex-1"></div>
                               </h4>
                               <div className="grid gap-px bg-border-line border border-border-line">
                                  {pola.examples.map((ex: { sentence: string; translation: string }, idx: number) => (
                                    <div key={idx} className="bg-canvas p-4 hover:bg-surface transition-colors">
                                       <div className="flex justify-between items-start gap-4">
                                          <div>
                                            <p className="font-jp text-lg font-medium text-ink mb-1">{ex.sentence}</p>
                                            <p className="text-sm text-subtle">{ex.translation}</p>
                                          </div>
                                          <button className="p-2 border border-border-line hover:bg-ink hover:text-canvas transition-colors">
                                            <Volume2 className="h-4 w-4" />
                                          </button>
                                       </div>
                                    </div>
                                  ))}
                               </div>
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-t border-border-line p-12 text-center bg-surface">
            <p className="text-lg font-bold text-subtle uppercase tracking-widest">
              TIDAK ADA POLA KALIMAT DITEMUKAN
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="border-b border-border-line p-8"
      />
    </div>
  );
}
