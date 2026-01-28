import React, { useState } from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import type { Kosakata } from '../../../lib/supabase';
import { KosakataService } from '../../../lib/services/kosakataService';
import { toast } from 'sonner';

interface KosakataFormProps {
  initialData?: Kosakata;
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

export const KosakataForm: React.FC<KosakataFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Kosakata>>({
    kanji: '',
    hiragana: '',
    romaji: '',
    meaning: '',
    jlpt_level: 'N5',
    ...initialData
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?.id) {
        await KosakataService.update(initialData.id, formData);
        toast.success('Kosakata berhasil diperbarui');
      } else {
        await KosakataService.create(formData as any);
        toast.success('Kosakata berhasil ditambahkan');
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan Kosakata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Kanji"
          value={formData.kanji || ''}
          onChange={e => setFormData({ ...formData, kanji: e.target.value })}
          required
          placeholder="日本語"
        />
        <Input
          label="Hiragana"
          value={formData.hiragana || ''}
          onChange={e => setFormData({ ...formData, hiragana: e.target.value })}
          required
          placeholder="にほんご"
        />
      </div>

      <Input
        label="Romaji"
        value={formData.romaji || ''}
        onChange={e => setFormData({ ...formData, romaji: e.target.value })}
        placeholder="nihongo"
      />
      
      <Input
        label="Arti"
        value={formData.meaning || ''}
        onChange={e => setFormData({ ...formData, meaning: e.target.value })}
        required
        placeholder="Bahasa Jepang"
      />

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
          {initialData ? 'Simpan Perubahan' : 'Tambah Kosakata'}
        </Button>
      </div>
    </form>
  );
};
