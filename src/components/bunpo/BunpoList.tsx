import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Pagination from '../ui/Pagination';
import { playAudio } from '../../lib/tts';
import type { BunpoWithLevel } from '../../services/materi';

const ITEMS_PER_PAGE = 20;

interface BunpoListProps {
  initialBunpo: BunpoWithLevel[];
}

const jlptOptions = [
  { value: 'all', label: 'Semua Level' },
  { value: 'N5', label: 'JLPT N5' },
  { value: 'N4', label: 'JLPT N4' },
  { value: 'N3', label: 'JLPT N3' },
];

const typeOptions = [
  { value: 'all', label: 'Semua Tipe' },
  { value: 'grammar', label: 'Tata Bahasa' },
  { value: 'pola', label: 'Pola Kalimat' },
];

const categoryOptions = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'particles', label: 'Partikel' },
  { value: 'conjugation', label: 'Konjugasi' },
  { value: 'expressions', label: 'Ungkapan' },
  { value: 'time', label: 'Waktu' },
  { value: 'actions', label: 'Aksi' },
];

export default function BunpoList({ initialBunpo }: BunpoListProps) {
  const [search, setSearch] = useState('');
  const [jlptLevel, setJlptLevel] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    let result = [...initialBunpo];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.pattern.includes(search) ||
          item.meaning.toLowerCase().includes(searchLower)
      );
    }

    if (jlptLevel !== 'all') {
      result = result.filter((item) => item.jlpt_level === jlptLevel);
    }

    if (typeFilter !== 'all') {
      const dbType = typeFilter === 'pola' ? 'sentence_pattern' : typeFilter;
      result = result.filter((item) => item.bunpo_type === dbType);
    }

    if (category !== 'all') {
      result = result.filter((item) => item.categories?.slug === category);
    }

    return result;
  }, [initialBunpo, search, jlptLevel, typeFilter, category]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="space-y-0">
       {/* Filters */}
      <div className="border-b border-border-line bg-canvas p-6">
        <div className="max-w-7xl mx-auto grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Cari bunpo..."
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
            options={typeOptions}
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
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
        <div className="max-w-7xl mx-auto mt-4 px-1">
             <p className="text-xs font-bold tracking-widest uppercase text-subtle">
                Displaying {paginatedData.length} of {filteredData.length} items
            </p>
        </div>
      </div>

      {/* Bunpo List */}
      {paginatedData.length > 0 ? (
        <div className="max-w-7xl mx-auto border-x border-border-line">
          {paginatedData.map((item) => (
            <div
              key={item.id}
              className="border-b border-border-line bg-canvas transition-all duration-300"
            >
              {/* Header - Always visible */}
              <div
                className="flex w-full items-center justify-between p-6 text-left hover:bg-inv-canvas hover:text-inv-ink cursor-pointer group"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold tracking-widest uppercase border border-ink text-ink group-hover:border-inv-ink group-hover:text-inv-ink transition-colors px-1.5 py-0.5 whitespace-nowrap">
                   {item.jlpt_level || 'N/A'}
                  </span>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-jp text-2xl font-bold text-ink group-hover:text-inv-ink transition-colors">
                        {item.pattern}
                      </h3>
                      <button
                        onClick={(e) => {
                             e.stopPropagation();
                             playAudio(item.pattern);
                        }}
                        className="p-1 border border-transparent hover:border-border-line text-subtle hover:text-ink group-hover:text-inv-ink group-hover:hover:text-brand-orange transition-colors"
                      >
                         <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-medium text-subtle group-hover:text-inv-ink">
                      {item.meaning}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                     <span className={`hidden md:inline-block text-xs font-bold uppercase tracking-widest px-2 py-1 ${
                        item.bunpo_type === 'grammar' 
                          ? 'text-subtle'
                          : 'text-ink bg-brand-neon'
                      }`}>
                        {item.bunpo_type === 'grammar' ? 'Grammar' : 'Pattern'}
                     </span>
                     {item.categories && (
                        <span className="hidden md:inline-block text-xs font-bold uppercase tracking-widest text-subtle border border-subtle px-2 py-1">
                           {item.categories.name}
                        </span>
                     )}
                    {expandedId === item.id ? (
                    <ChevronUp className="h-5 w-5 text-ink" />
                    ) : (
                    <ChevronDown className="h-5 w-5 text-subtle group-hover:text-inv-ink" />
                    )}
                </div>
              </div>


              {/* Expanded Content */}
              {expandedId === item.id && (
                <div className="border-t border-border-line bg-surface p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        {item.usage && (
                            <div className="mb-6">
                                <h4 className="text-xs font-bold tracking-widest uppercase text-subtle mb-2">Penggunaan</h4>
                                <p className="text-lg text-ink font-medium leading-relaxed">{item.usage}</p>
                            </div>
                        )}
                         {item.notes && (
                            <div className="p-4 bg-brand-orange/10 border-l-2 border-brand-orange">
                                <h4 className="text-xs font-bold tracking-widest uppercase text-brand-orange mb-1">Catatan</h4>
                                <p className="text-sm text-ink">{item.notes}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        {item.examples && item.examples.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold tracking-widest uppercase text-subtle mb-4">Contoh Penggunaan</h4>
                                <ul className="space-y-px bg-border-line border border-border-line">
                                    {item.examples.map((ex, idx) => (
                                    <li key={idx} className="flex justify-between items-center gap-4 p-4 bg-canvas hover:bg-surface transition-colors group/ex">
                                        <span className="font-jp text-lg pr-4">{ex}</span>
                                        <button
                                            onClick={() => playAudio(ex)}
                                            className="text-subtle group-hover/ex:text-ink transition-colors"
                                            title="Listen"
                                        >
                                            <Volume2 className="h-4 w-4" />
                                        </button>
                                    </li>
                                    ))}
                                </ul>
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
        <div className="p-16 text-center border-b border-border-line">
          <p className="text-lg font-bold text-subtle uppercase tracking-widest">
            No Records Found
          </p>
        </div>
      )}

      
      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="border-b border-border-line p-4 md:p-8"
      />
    </div>
  );
}
