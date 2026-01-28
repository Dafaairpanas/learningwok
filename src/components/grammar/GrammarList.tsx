import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Select from '../ui/Select';
import type { Grammar } from '../../lib/supabase';

interface GrammarListProps {
  initialGrammar: Grammar[];
}

const jlptOptions = [
  { value: 'all', label: 'Semua Level' },
  { value: 'N5', label: 'JLPT N5' },
  { value: 'N4', label: 'JLPT N4' },
  { value: 'N3', label: 'JLPT N3' },
];

const categoryOptions = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'copula', label: 'Kopula' },
  { value: 'particles', label: 'Partikel' },
  { value: 'verb-forms', label: 'Bentuk Kata Kerja' },
  { value: 'conjunctions', label: 'Kata Penghubung' },
  { value: 'expressions', label: 'Ekspresi' },
];

export default function GrammarList({ initialGrammar }: GrammarListProps) {
  const [search, setSearch] = useState('');
  const [jlptLevel, setJlptLevel] = useState('all');
  const [category, setCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredGrammar = useMemo(() => {
    let result = [...initialGrammar];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.pattern.includes(search) ||
          g.meaning.toLowerCase().includes(searchLower)
      );
    }

    if (jlptLevel !== 'all') {
      result = result.filter((g) => g.jlpt_level === jlptLevel);
    }

    if (category !== 'all') {
      result = result.filter((g) => g.category === category);
    }

    return result;
  }, [initialGrammar, search, jlptLevel, category]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-2xl border border-border-line bg-canvas p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Cari grammar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
          <Select
            options={jlptOptions}
            value={jlptLevel}
            onChange={(e) => setJlptLevel(e.target.value)}
          />
          <Select
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <p className="mt-4 text-sm text-subtle">
          Menampilkan {filteredGrammar.length} pola grammar
        </p>
      </div>

      {/* Grammar List */}
      {filteredGrammar.length > 0 ? (
        <div className="space-y-4">
          {filteredGrammar.map((grammar) => (
            <div
              key={grammar.id}
              className="group overflow-hidden rounded-2xl border border-border-line bg-canvas transition-all duration-300"
            >
              {/* Header - Always visible */}
              <button
                onClick={() => setExpandedId(expandedId === grammar.id ? null : grammar.id)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-inv-canvas group-hover:bg-inv-canvas"
              >
                <div className="flex items-center gap-4">
                  <Badge level={grammar.jlpt_level} size="md" />
                  <div>
                    <h3 className="font-jp text-xl font-semibold text-ink group-hover:text-inv-ink">
                      {grammar.pattern}
                    </h3>
                    <p className="mt-1 text-subtle group-hover:text-inv-ink">
                      {grammar.meaning}
                    </p>
                  </div>
                </div>
                {expandedId === grammar.id ? (
                  <ChevronUp className="h-5 w-5 text-subtle group-hover:text-inv-ink" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-subtle group-hover:text-inv-ink" />
                )}
              </button>

              {/* Expanded Content */}
              {expandedId === grammar.id && (
                <div className="border-t border-border-line bg-surface p-6">
                  {grammar.usage && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-subtle">Penggunaan</h4>
                      <p className="mt-1 text-ink">{grammar.usage}</p>
                    </div>
                  )}

                  {grammar.examples && grammar.examples.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-subtle mb-3">Contoh</h4>
                      <div className="space-y-3">
                        {grammar.examples.map((ex: { sentence: string; translation: string }, idx: number) => (
                          <div key={idx} className="rounded-xl bg-canvas p-4 border border-border-line">
                            <p className="font-jp text-lg text-ink">{ex.sentence}</p>
                            <p className="mt-1 text-sm text-subtle">
                              {ex.translation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {grammar.notes && (
                    <div className="rounded-xl bg-yellow-400/10 p-4 border border-yellow-400/20">
                      <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">📝 Catatan</h4>
                      <p className="mt-1 text-sm text-yellow-600/90 dark:text-yellow-400/90">{grammar.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border-line bg-canvas p-12 text-center">
          <p className="text-lg text-subtle">
            Tidak ada grammar ditemukan
          </p>
        </div>
      )}
    </div>
  );
}
