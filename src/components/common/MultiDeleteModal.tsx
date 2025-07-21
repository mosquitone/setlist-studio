'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Button } from '@/components/common/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import { Song } from '@/types/graphql';

interface MultiDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedSongs: Song[];
  loading?: boolean;
}

export function MultiDeleteModal({
  open,
  onClose,
  onConfirm,
  selectedSongs,
  loading = false,
}: MultiDeleteModalProps) {
  const { messages, lang } = useI18n();

  const songCount = selectedSongs.length;
  const songCountText = lang === 'ja' ? `${songCount}曲` : `${songCount} songs`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      keepMounted={false}
    >
      <DialogTitle>{messages.common.deleteSong}</DialogTitle>
      <DialogContent>
        <Box>
          <Typography sx={{ mb: 2 }}>
            {songCountText}
            {messages.common.deleteConfirmation}
          </Typography>

          {/* 楽曲リスト表示 */}
          <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
            <List dense>
              {selectedSongs.map((song) => (
                <ListItem key={song.id} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={song.title}
                    secondary={song.artist}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      color: 'text.secondary',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {messages.confirmations.deleteSong}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} variant="text">
          {messages.common.cancel}
        </Button>
        <Button onClick={onConfirm} variant="danger" disabled={loading} loading={loading}>
          {messages.common.delete}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
