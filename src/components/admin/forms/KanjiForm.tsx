import React, { useState, useEffect } from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import type { Kanji } from '../../../lib/supabase';
import { KanjiService } from '../../../lib/services/kanjiService';
import { toast } from 'sonner';

interface KanjiFormProps {
  initialData?: Kanji;
  onSuccess: () => void;
  onCancel: () => void;
}

const LEVEL_OPTIONS = [
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
  { value: 'N3', label: 'N3' },
  { value: 'N2', label: 'N2' },
  { value: 'N1', label: 'N1' },
];

export const KanjiForm: React.FC<KanjiFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Kanji>>({
    character: '',
    meaning: '',
    onyomi: '',
    kunyomi: '',
    jlpt_level: 'N5',
    ...initialData
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?.id) {
        await KanjiService.update(initialData.id, formData);
        toast.success('Kanji berhasil diperbarui');
      } else {
        await KanjiService.create(formData as any);
        toast.success('Kanji berhasil ditambahkan');
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan Kanji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Kanji"
        value={formData.character || ''}
        onChange={e => setFormData({ ...formData, character: e.target.value })}
        required
        placeholder="Contoh: 日"
      />
      
      <Input
        label="Arti"
        value={formData.meaning || ''}
        onChange={e => setFormData({ ...formData, meaning: e.target.value })}
        required
        placeholder="Matahari, Hari"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Onyomi"
          value={formData.onyomi || ''}
          onChange={e => setFormData({ ...formData, onyomi: e.target.value })}
          placeholder="NICHI, JITSU"
        />
        <Input
          label="Kunyomi"
          value={formData.kunyomi || ''}
          onChange={e => setFormData({ ...formData, kunyomi: e.target.value })}
          placeholder="hi, bi"
        />
      </div>

      <Select
        label="Level JLPT"
        options={LEVEL_OPTIONS}
        value={formData.jlpt_level || 'N5'}
        onChange={e => setFormData({ ...formData, jlpt_level: e.target.value as any })}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" isLoading={loading}>
          {initialData ? 'Simpan Perubahan' : 'Tambah Kanji'}
        </Button>
      </div>
    </form>
  );
};
