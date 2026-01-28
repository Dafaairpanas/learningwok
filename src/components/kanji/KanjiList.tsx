import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import KanjiCard from './KanjiCard';
import Pagination from '../ui/Pagination';
import Input from '../ui/Input';
import Select from '../ui/Select';
import type { KanjiWithLevel } from '../../services/materi';

interface KanjiListProps {
  initialKanji: KanjiWithLevel[];
}

const jlptOptions = [
  { value: 'all', label: 'Semua Level' },
  { value: 'N5', label: 'JLPT N5' },
  { value: 'N4', label: 'JLPT N4' },
  { value: 'N3', label: 'JLPT N3' },
];

const categoryOptions = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'numbers', label: 'Angka' },
  { value: 'time', label: 'Waktu' },
  { value: 'nature', label: 'Alam' },
  { value: 'people', label: 'Orang' },
  { value: 'actions', label: 'Aksi' },
  { value: 'adjectives', label: 'Kata Sifat' },
  { value: 'education', label: 'Pendidikan' },
  { value: 'objects', label: 'Benda' },
  { value: 'places', label: 'Tempat' },
  { value: 'direction', label: 'Arah' },
  { value: 'colors', label: 'Warna' },
  { value: 'size', label: 'Ukuran & Jumlah' },
];

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'stroke_asc', label: 'Stroke Count ↑' },
  { value: 'stroke_desc', label: 'Stroke Count ↓' },
  { value: 'id_asc', label: 'ID (1-9)' },
  { value: 'category_asc', label: 'Kategori (A-Z)' },
];

const ITEMS_PER_PAGE = 24; // Increased density for Swiss Grid

export default function KanjiList({ initialKanji }: KanjiListProps) {
  const [search, setSearch] = useState('');
  const [jlptLevel, setJlptLevel] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);

  const filteredKanji = useMemo(() => {
    let result = [...initialKanji];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (k) =>
          k.character.includes(search) ||
          k.meaning.toLowerCase().includes(searchLower) ||
          k.onyomi?.includes(search) ||
          k.kunyomi?.includes(search)
      );
    }

    // Filter by JLPT level
    if (jlptLevel !== 'all') {
      result = result.filter((k) => k.jlpt_level === jlptLevel);
    }

    // Filter by category
    if (category !== 'all') {
      result = result.filter((k) => k.categories?.slug === category);
    }

    // Sort
    if (sortBy === 'stroke_asc') {
      result.sort((a, b) => (a.stroke_count || 0) - (b.stroke_count || 0));
    } else if (sortBy === 'stroke_desc') {
      result.sort((a, b) => (b.stroke_count || 0) - (a.stroke_count || 0));
    } else if (sortBy === 'id_asc') {
      result.sort((a, b) => (a.sort_id || 0) - (b.sort_id || 0));
    } else if (sortBy === 'category_asc') {
      result.sort((a, b) => (a.categories?.slug || '').localeCompare(b.categories?.slug || ''));
    }

    return result;
  }, [initialKanji, search, jlptLevel, category, sortBy]);

  const totalPages = Math.ceil(filteredKanji.length / ITEMS_PER_PAGE);
  const paginatedKanji = filteredKanji.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="space-y-0">
      {/* Filters */}
      <div className="border-b border-border-line bg-canvas p-6">
        <div className="max-w-7xl mx-auto grid gap-4 md:grid-cols-4">
          <Input
            placeholder="Cari kanji..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange();
            }}
            icon={<Search className="h-4 w-4" />}
            // Assuming Input component accepts className for override (if not, we might need to modify Input.tsx or accept it as is for now)
            className="rounded-none border-border-line"
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
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
        
        <div className="max-w-7xl mx-auto mt-4 flex justify-between items-center">
            <p className="text-xs font-bold tracking-widest uppercase text-subtle">
            Displaying {paginatedKanji.length} of {filteredKanji.length} items
            </p>
            
            {/* Pagination Controls (Header) */}
            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 border border-border-line hover:bg-ink hover:text-canvas disabled:opacity-50 transition-colors"
                    >
                         ← Prev
                    </button>
                    <span className="text-sm font-bold">{page} / {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 border border-border-line hover:bg-ink hover:text-canvas disabled:opacity-50 transition-colors"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Kanji Grid - Swiss Style */}
      {paginatedKanji.length > 0 ? (
        <div className="swiss-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lx:grid-cols-6 max-w-7xl mx-auto border-x border-border-line">
          {paginatedKanji.map((kanji) => (
            <KanjiCard key={kanji.id} kanji={kanji} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center border-b border-border-line">
          <p className="text-lg font-bold text-subtle uppercase tracking-widest">
            No Records Found
          </p>
        </div>
      )}

      {/* Pagination Footer */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="border-b border-border-line p-8"
      />
    </div>
  );
}
