import { useState, useMemo } from 'react';
import { Search, Volume2 } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Pagination from '../ui/Pagination';
import { playAudio } from '../../lib/tts';
import type { KosakataWithLevel } from '../../services/materi';

interface KosakataListProps {
  initialKosakata: KosakataWithLevel[];
}

const jlptOptions = [
  { value: 'all', label: 'Semua Level' },
  { value: 'N5', label: 'JLPT N5' },
  { value: 'N4', label: 'JLPT N4' },
  { value: 'N3', label: 'JLPT N3' },
];

const categoryOptions = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'time', label: 'Waktu' },
  { value: 'family', label: 'Keluarga' },
  { value: 'nature', label: 'Alam & Cuaca' },
  { value: 'body', label: 'Tubuh & Kesehatan' },
  { value: 'food', label: 'Makanan & Minuman' },
  { value: 'places', label: 'Tempat & Bangunan' },
  { value: 'colors', label: 'Warna' },
  { value: 'transportation', label: 'Transportasi' },
  { value: 'clothing', label: 'Pakaian' },
  { value: 'numbers', label: 'Angka' },
  { value: 'greetings', label: 'Sapaan' },
  { value: 'verbs', label: 'Kata Kerja' },
  { value: 'i-adjectives', label: 'Kata Sifat -i' },
  { value: 'na-adjectives', label: 'Kata Sifat -na' },
  { value: 'nouns', label: 'Kata Benda' },
];

const ITEMS_PER_PAGE = 24;

export default function KosakataList({ initialKosakata }: KosakataListProps) {
  const [search, setSearch] = useState('');
  const [jlptLevel, setJlptLevel] = useState('all');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const filteredKosakata = useMemo(() => {
    let result = [...initialKosakata];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (k) =>
          k.kanji.includes(search) ||
          k.hiragana.includes(search) ||
          k.meaning.toLowerCase().includes(searchLower)
      );
    }

    if (jlptLevel !== 'all') {
      result = result.filter((k) => k.jlpt_level === jlptLevel);
    }

    if (category !== 'all') {
      result = result.filter((k) => k.categories?.slug === category);
    }

    return result;
  }, [initialKosakata, search, jlptLevel, category]);

  const totalPages = Math.ceil(filteredKosakata.length / ITEMS_PER_PAGE);
  const paginatedKosakata = filteredKosakata.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-0">
      {/* Filters */}
      <div className="border-b border-border-line bg-canvas p-6">
        <div className="max-w-7xl mx-auto grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Cari kosakata..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            icon={<Search className="h-4 w-4" />}
          />
          <Select
            options={jlptOptions}
            value={jlptLevel}
            onChange={(e) => {
              setJlptLevel(e.target.value);
              setPage(1);
            }}
          />
          <Select
            options={categoryOptions}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto mt-4 px-1">
             <p className="text-xs font-bold tracking-widest uppercase text-subtle">
                Displaying {paginatedKosakata.length} of {filteredKosakata.length} items
            </p>
        </div>
      </div>

      {/* Vocabulary Grid */}
      {paginatedKosakata.length > 0 ? (
        <div className="swiss-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto border-x border-border-line">
          {paginatedKosakata.map((kosa) => (
            <div
              key={kosa.id}
              className="group bg-canvas p-6 border-b border-r border-border-line hover:bg-inv-canvas hover:text-inv-ink transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                 <span className="text-xs font-bold tracking-widest uppercase border border-ink text-ink group-hover:border-inv-ink group-hover:text-inv-ink transition-colors px-1.5 py-0.5">
                   {kosa.jlpt_level || 'N/A'}
                 </span>
                 <button
                    onClick={(e) => {
                    e.stopPropagation();
                    playAudio(kosa.kanji || kosa.hiragana);
                    }}
                    className="p-2 hover:bg-ink hover:text-white transition-colors border border-border-line"
                    title="Play Audio"
                >
                    <Volume2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="font-jp text-3xl font-bold text-ink group-hover:text-inv-ink">
                        {kosa.kanji}
                    </p>
                  </div>
                  <p className="font-jp text-lg text-subtle font-medium group-hover:text-inv-ink">
                    {kosa.hiragana}
                  </p>
              </div>
              
              <div className="border-t border-border-line pt-4 mt-4 group-hover:border-inv-ink/20">
                <p className="font-bold text-lg text-ink leading-snug group-hover:text-inv-ink">
                    {kosa.meaning}
                </p>
                {kosa.categories && (
                    <span className="mt-2 inline-block text-xs font-bold uppercase tracking-widest text-subtle group-hover:text-inv-ink/70">
                    {kosa.categories.name}
                    </span>
                )}
              </div>
              
              {kosa.example_sentence && (
                <div className="mt-4 p-4 bg-surface border border-border-line group-hover:bg-canvas group-hover:border-transparent group-hover:text-ink">
                  <p className="font-jp font-medium mb-1">{kosa.example_sentence}</p>
                  <p className="text-sm text-subtle italic group-hover:text-ink/70">
                    {kosa.example_translation}
                  </p>
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
        className="border-b border-border-line p-8"
      />
    </div>
  );
}
