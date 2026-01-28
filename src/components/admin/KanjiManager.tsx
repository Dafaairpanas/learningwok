import React, { useState, useEffect } from 'react';
import { KanjiService } from '../../lib/services/kanjiService';
import { DataTable } from './DataTable';
import { Plus } from 'lucide-react';
import type { Kanji } from '../../lib/supabase';
import { toast } from 'sonner';
import { Modal } from '../../ui/Modal';
import { KanjiForm } from './forms/KanjiForm';
import Badge from '../../ui/Badge';

export const KanjiManager = () => {
  const [data, setData] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ jlpt_level: '', character: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Kanji | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: kanjiData, count } = await KanjiService.getAll(page, 10, {
        jlpt_level: filters.jlpt_level as any || undefined,
        character: filters.character || undefined
      });
      setData(kanjiData);
      setTotal(count || 0);
    } catch (error) {
      console.error('Error fetching kanji:', error);
      toast.error('Gagal mengambil data Kanji');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  const handleDelete = async (item: Kanji) => {
    if (!window.confirm(`Hapus Kanji "${item.character}"?`)) return;
    
    try {
      await KanjiService.delete(item.id);
      toast.success('Kanji berhasil dihapus');
      fetchData();
    } catch (error) {
      toast.error('Gagal menghapus kanji');
    }
  };

  const handleEdit = (item: Kanji) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingItem(undefined);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    fetchData();
  };

  const columns = [
    { header: 'Kanji', accessorKey: 'character', className: 'font-jp text-lg' },
    { header: 'Arti', accessorKey: 'meaning' },
    { header: 'Onyomi', accessorKey: 'onyomi', className: 'font-jp text-gray-600' },
    { header: 'Kunyomi', accessorKey: 'kunyomi', className: 'font-jp text-gray-600' },
    { header: 'Level', accessorKey: 'jlpt_level', 
      cell: (item: Kanji) => (
        <Badge level={item.jlpt_level} size="sm" />
      )
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-canvas p-4 rounded-lg border border-border-line shadow-sm">
        <h2 className="text-xl font-bold text-ink">Manajemen Kanji</h2>
        <button 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={handleCreate}
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kanji</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-canvas p-4 rounded-lg border border-border-line shadow-sm">
        <input 
          type="text" 
          placeholder="Cari Kanji..." 
          className="border border-border-line rounded px-3 py-2 text-sm w-64 bg-surface text-ink placeholder:text-subtle"
          value={filters.character}
          onChange={(e) => setFilters(prev => ({ ...prev, character: e.target.value }))}
        />
        <select 
          className="border border-border-line rounded px-3 py-2 text-sm w-32 bg-surface text-ink"
          value={filters.jlpt_level}
          onChange={(e) => setFilters(prev => ({ ...prev, jlpt_level: e.target.value }))}
        >
          <option value="">Semua Level</option>
          <option value="N5">N5</option>
          <option value="N4">N4</option>
          <option value="N3">N3</option>
        </select>
        <button 
          onClick={() => { setPage(1); fetchData(); }}
          className="bg-surface hover:bg-border-line text-ink border border-border-line px-4 py-2 rounded text-sm transition-colors"
        >
          Filter
        </button>
      </div>

      <DataTable 
        data={data}
        columns={columns}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        totalItems={total}
        itemsPerPage={10}
        currentPage={page}
        onPageChange={setPage}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? 'Edit Kanji' : 'Tambah Kanji Baru'}
      >
        <KanjiForm
          initialData={editingItem}
          onSuccess={handleSuccess}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};
