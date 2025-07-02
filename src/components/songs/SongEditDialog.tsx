'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { Song } from '../../types/graphql';

interface SongEditDialogProps {
  open: boolean;
  song: Song | null;
  onClose: () => void;
  onSave: (songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function SongEditDialog({ open, song, onClose, onSave }: SongEditDialogProps) {
  const [formValues, setFormValues] = useState<Omit<Song, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    artist: '',
    key: '',
    tempo: null,
    duration: null,
    notes: '',
  });
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (song) {
      setFormValues({
        title: song.title ?? '',
        artist: song.artist ?? '',
        key: song.key ?? '',
        tempo: song.tempo ?? null,
        duration: song.duration ?? null,
        notes: song.notes ?? '',
      });
    }
  }, [song]);

  useEffect(() => {
    if (open && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open]);

  const handleFieldChange = (field: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: field === 'tempo' ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const handleSave = async () => {
    await onSave(formValues);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>楽曲を編集</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            ref={titleRef}
            label="タイトル"
            value={formValues.title}
            onChange={e => handleFieldChange('title', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="アーティスト"
            value={formValues.artist}
            onChange={e => handleFieldChange('artist', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="キー"
            value={formValues.key || ''}
            onChange={e => handleFieldChange('key', e.target.value)}
            fullWidth
          />
          <TextField
            label="テンポ"
            type="number"
            value={formValues.tempo || ''}
            onChange={e => handleFieldChange('tempo', e.target.value)}
            fullWidth
          />
          <TextField
            label="ノート"
            value={formValues.notes || ''}
            onChange={e => handleFieldChange('notes', e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleSave} variant="contained">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}
