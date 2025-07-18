'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import { Button } from '@/components/common/ui/Button';
import { useI18n } from '@/hooks/useI18n';

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
  const { t } = useI18n();
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
          <Typography>
            「{itemName}」{t.common.deleteConfirmation}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {description || t.common.deleteWarning}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} variant="text">
          {t.common.cancel}
        </Button>
        <Button onClick={onConfirm} variant="danger" disabled={loading} loading={loading}>
          {t.common.delete}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
