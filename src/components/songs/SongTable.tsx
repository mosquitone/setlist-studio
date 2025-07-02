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
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Chip,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  // モバイル版: カード表示
  if (isMobile) {
    return (
      <Stack spacing={2}>
        {songs.map((song) => (
          <Card 
            key={song.id}
            sx={{ 
              '&:hover': { backgroundColor: 'action.hover' },
              cursor: 'pointer',
            }}
            onClick={() => onEdit(song)}
          >
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" component="h3" noWrap>
                      {song.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {song.artist}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(song);
                      }}
                      color="primary"
                      size="small"
                      aria-label={`${song.title}を編集`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(song.id);
                      }}
                      color="error"
                      size="small"
                      aria-label={`${song.title}を削除`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
                
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {song.key && (
                    <Chip 
                      label={`キー: ${song.key}`} 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                  {song.tempo && (
                    <Chip 
                      label={`テンポ: ${song.tempo}`} 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                </Stack>
                
                {song.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {song.notes}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  // デスクトップ版: テーブル表示
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
          {songs.map((song) => (
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
              onKeyDown={(event) => {
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
