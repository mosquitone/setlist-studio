'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Home as HomeIcon } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SONGS, DELETE_SONG, UPDATE_SONG } from '@/lib/graphql/queries';
import { useRouter } from 'next/navigation';

interface Song {
  id: string;
  title: string;
  artist: string;
  key?: string | null;
  tempo?: number | null;
  notes?: string | null;
}

export default function SongsPage() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_SONGS, { fetchPolicy: 'network-only' });
  const [rows, setRows] = useState<Song[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<Song | null>(null);
  const [formValues, setFormValues] = useState<Omit<Song, 'id'>>({
    title: '',
    artist: '',
    key: '',
    tempo: null,
    notes: ''
  });

  const [updateSong] = useMutation(UPDATE_SONG, {
    refetchQueries: [{ query: GET_SONGS }]
  });
  const [deleteSong] = useMutation(DELETE_SONG, {
    refetchQueries: [{ query: GET_SONGS }]
  });

  useEffect(() => {
    if (data?.songs) {
      setRows(data.songs);
    }
  }, [data]);

  const handleRowClick = (song: Song) => {
    setSelected(song);
    setFormValues({
      title: song.title ?? '',
      artist: song.artist ?? '',
      key: song.key ?? '',
      tempo: song.tempo ?? null,
      notes: song.notes ?? ''
    });
    setOpenEdit(true);
  };

  const handleFieldChange = (field: keyof Omit<Song, 'id'>, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]:
        field === 'tempo'
          ? value === ''
            ? null
            : Number(value)
          : value
    }));
  };

  const handleSave = async () => {
    if (!selected) return;
    try {
      await updateSong({
        variables: {
          id: selected.id,
          input: {
            title: formValues.title || '',
            artist: formValues.artist || '',
            key: formValues.key || null,
            tempo: formValues.tempo,
            notes: formValues.notes || null
          }
        }
      });
      setRows(prev =>
        prev.map(r =>
          r.id === selected.id ? { ...r, ...formValues } as Song : r
        )
      );
      setOpenEdit(false);
      setSelected(null);
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSong({ variables: { id } });
      setRows(prev => prev.filter(r => r.id !== id));
      if (selected?.id === id) {
        setOpenEdit(false);
        setSelected(null);
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">エラーが発生しました: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="span">
          楽曲管理
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => router.push('/')}
          sx={{ mr: 2 }}
        >
          ホームに戻る
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/songs/new')}
        >
          新しい楽曲を追加
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>楽曲名</TableCell>
              <TableCell>アーティスト</TableCell>
              <TableCell>キー</TableCell>
              <TableCell>テンポ</TableCell>
              <TableCell>メモ</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow
                key={row.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => handleRowClick(row)}
              >
                <TableCell>{row.title ?? ''}</TableCell>
                <TableCell>{row.artist ?? ''}</TableCell>
                <TableCell>{row.key ?? ''}</TableCell>
                <TableCell>{row.tempo != null ? row.tempo : ''}</TableCell>
                <TableCell>{row.notes ?? ''}</TableCell>
                <TableCell align="right" onClick={e => e.stopPropagation()}>
                  <IconButton color="error" onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>楽曲を編集</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="楽曲名"
              value={formValues.title}
              onChange={e => handleFieldChange('title', e.target.value)}
              fullWidth
            />
            <TextField
              label="アーティスト"
              value={formValues.artist}
              onChange={e => handleFieldChange('artist', e.target.value)}
              fullWidth
            />
            <TextField
              label="キー"
              value={formValues.key}
              onChange={e => handleFieldChange('key', e.target.value)}
              fullWidth
            />
            <TextField
              label="テンポ"
              type="number"
              value={formValues.tempo ?? ''}
              onChange={e => handleFieldChange('tempo', e.target.value)}
              fullWidth
            />
            <TextField
              label="メモ"
              value={formValues.notes}
              onChange={e => handleFieldChange('notes', e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleSave} startIcon={<EditIcon />}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
