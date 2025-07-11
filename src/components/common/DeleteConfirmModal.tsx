'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import { Button } from '@/components/common/Button';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  itemType?: string;
  description?: string;
  loading?: boolean;
}

export function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  itemName,
  description,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      keepMounted={false}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box>
          <Typography>「{itemName}」を削除しますか？</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {description || 'この操作は取り消せません。'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} variant="text">
          キャンセル
        </Button>
        <Button onClick={onConfirm} variant="danger" disabled={loading} loading={loading}>
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
}
