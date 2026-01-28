import React, { useState, useEffect } from 'react';
import { BunpoService } from '../../lib/services/bunpoService';
import { DataTable } from './DataTable';
import { Plus } from 'lucide-react';
import type { Grammar } from '../../lib/supabase';
import { toast } from 'sonner';
import { Modal } from '../../ui/Modal';
import { BunpoForm } from './forms/BunpoForm';
import Badge from '../../ui/Badge';

export const BunpoManager = () => {
  const [data, setData] = useState<Grammar[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ jlpt_level: '', pattern: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Grammar | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: bunpoData, count } = await BunpoService.getAll(page, 10, {
        jlpt_level: filters.jlpt_level as any || undefined,
        pattern: filters.pattern || undefined
      });
      setData(bunpoData);
      setTotal(count || 0);
    } catch (error) {
      console.error('Error fetching bunpo:', error);
      toast.error('Gagal mengambil data Bunpo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  const handleDelete = async (item: Grammar) => {
    if (!window.confirm(`Hapus Pola "${item.pattern}"?`)) return;
    
    try {
      await BunpoService.delete(item.id);
      toast.success('Pola Bunpo berhasil dihapus');
      fetchData();
    } catch (error) {
      toast.error('Gagal menghapus pola bunpo');
    }
  };

  const handleEdit = (item: Grammar) => {
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
    { header: 'Pola', accessorKey: 'pattern', className: 'font-jp text-lg font-bold' },
    { header: 'Arti', accessorKey: 'meaning' },
    { header: 'Tipe', accessorKey: 'bunpo_type',
        cell: (item: Grammar) => (
            <span className={`px-2 py-1 rounded text-xs ${
                item.bunpo_type === 'grammar' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
            }`}>
                {item.bunpo_type === 'grammar' ? 'Grammar' : 'Sentence Pattern'}
            </span>
        )
    },
    { header: 'Level', accessorKey: 'jlpt_level', 
      cell: (item: Grammar) => (
        <Badge level={item.jlpt_level} size="sm" />
      )
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-canvas p-4 rounded-lg border border-border-line shadow-sm">
        <h2 className="text-xl font-bold text-ink">Manajemen Bunpo (Grammar)</h2>
        <button 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={handleCreate}
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pola</span>
        </button>
      </div>

      <div className="flex gap-4 bg-canvas p-4 rounded-lg border border-border-line shadow-sm">
        <input 
          type="text" 
          placeholder="Cari Pola..." 
          className="border border-border-line rounded px-3 py-2 text-sm w-64 bg-surface text-ink placeholder:text-subtle"
          value={filters.pattern}
          onChange={(e) => setFilters(prev => ({ ...prev, pattern: e.target.value }))}
        />
        <select 
          className="border border-border-line rounded px-3 py-2 text-sm w-32 bg-surface text-ink"
          value={filters.jlpt_level}
          onChange={(e) => setFilters(prev => ({ ...prev, jlpt_level: e.target.value }))}
        >
          <option value="">Semua Level</option>
          <option value="N5">N5</option>
          <option value="N4">N4</option>
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
        title={editingItem ? 'Edit Pola Bunpo' : 'Tambah Pola Baru'}
      >
        <BunpoForm
          initialData={editingItem}
          onSuccess={handleSuccess}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};
