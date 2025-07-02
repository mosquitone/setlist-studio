'use client';

import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Song } from '../../types/graphql';

interface SongTableProps {
  songs: Song[];
  loading: boolean;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
}

export function SongTable({ songs, loading, onEdit, onDelete }: SongTableProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!songs.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          楽曲がありません
        </Typography>
        <Typography variant="body2" color="text.secondary">
          新しい楽曲を追加してください
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>タイトル</TableCell>
            <TableCell>アーティスト</TableCell>
            <TableCell>キー</TableCell>
            <TableCell>テンポ</TableCell>
            <TableCell>ノート</TableCell>
            <TableCell align="right">アクション</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {songs.map(song => (
            <TableRow
              key={song.id}
              hover
              tabIndex={0}
              sx={{
                '&:focus': {
                  backgroundColor: 'action.focus',
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '-2px',
                },
              }}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onEdit(song);
                } else if (event.key === 'Delete') {
                  event.preventDefault();
                  onDelete(song.id);
                }
              }}
              aria-label={`楽曲: ${song.title}。Enterで編集、Deleteで削除`}
            >
              <TableCell>{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.key || '-'}</TableCell>
              <TableCell>{song.tempo || '-'}</TableCell>
              <TableCell>{song.notes || '-'}</TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => onEdit(song)}
                  color="primary"
                  size="small"
                  aria-label={`${song.title}を編集`}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(song.id)}
                  color="error"
                  size="small"
                  aria-label={`${song.title}を削除`}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
