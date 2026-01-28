import React, { useState } from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import type { Grammar } from '../../../lib/supabase';
import { BunpoService } from '../../../lib/services/bunpoService';
import { toast } from 'sonner';

interface BunpoFormProps {
  initialData?: Grammar;
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

const TYPE_OPTIONS = [
  { value: 'grammar', label: 'Grammar' },
  { value: 'sentence_pattern', label: 'Sentence Pattern' },
];

export const BunpoForm: React.FC<BunpoFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Grammar>>({
    pattern: '',
    meaning: '',
    bunpo_type: 'grammar',
    jlpt_level: 'N5',
    ...initialData
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?.id) {
        await BunpoService.update(initialData.id, formData);
        toast.success('Bunpo berhasil diperbarui');
      } else {
        await BunpoService.create(formData as any);
        toast.success('Bunpo berhasil ditambahkan');
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan Bunpo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Pola (Pattern)"
        value={formData.pattern || ''}
        onChange={e => setFormData({ ...formData, pattern: e.target.value })}
        required
        placeholder="～てください"
      />
      
      <Input
        label="Arti"
        value={formData.meaning || ''}
        onChange={e => setFormData({ ...formData, meaning: e.target.value })}
        required
        placeholder="Tolong lakukan..."
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Tipe"
          options={TYPE_OPTIONS}
          value={formData.bunpo_type || 'grammar'}
          onChange={e => setFormData({ ...formData, bunpo_type: e.target.value as any })}
        />
        <Select
          label="Level JLPT"
          options={LEVEL_OPTIONS}
          value={formData.jlpt_level || 'N5'}
          onChange={e => setFormData({ ...formData, jlpt_level: e.target.value as any })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" isLoading={loading}>
          {initialData ? 'Simpan Perubahan' : 'Tambah Bunpo'}
        </Button>
      </div>
    </form>
  );
};
