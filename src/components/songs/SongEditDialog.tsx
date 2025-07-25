'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import { useEffect, useRef, memo, useCallback } from 'react';
import * as Yup from 'yup';

import { Button } from '@/components/common/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import { Messages } from '@/lib/i18n/messages';

import { Song } from '../../types/graphql';

interface SongEditDialogProps {
  open: boolean;
  song: Song | null;
  onClose: () => void;
  onSave: (songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  loading?: boolean;
}

// バリデーションスキーマを生成する関数
const getValidationSchema = (messages: Messages) =>
  Yup.object({
    title: Yup.string()
      .required(messages.songs.newSong.validation.titleRequired)
      .max(30, messages.songs.newSong.validation.titleMaxLength),
    artist: Yup.string()
      .required(messages.songs.newSong.validation.artistRequired)
      .max(30, messages.songs.newSong.validation.artistMaxLength),
    key: Yup.string(),
    tempo: Yup.number().nullable().typeError(messages.songs.newSong.validation.tempoInvalid),
    notes: Yup.string().max(20, messages.songs.newSong.validation.notesMaxLength),
  });

export const SongEditDialog = memo(function SongEditDialog({
  open,
  song,
  onClose,
  onSave,
  loading = false,
}: SongEditDialogProps) {
  const { messages } = useI18n();
  const titleRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    title: song?.title ?? '',
    artist: song?.artist ?? '',
    key: song?.key ?? '',
    tempo: song?.tempo ?? null,
    duration: song?.duration ?? null,
    notes: song?.notes ?? '',
  };

  useEffect(() => {
    if (open && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = useCallback(
    async (values: typeof initialValues) => {
      await onSave(values);
      onClose();
    },
    [onSave, onClose],
  );

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{messages.songs.form.editTitle}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema(messages)}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={true}
        enableReinitialize={true}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField
                  ref={titleRef}
                  name="title"
                  label={messages.songs.form.titleLabel}
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                  fullWidth
                  required
                />
                <TextField
                  name="artist"
                  label={messages.songs.form.artistLabel}
                  value={values.artist}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.artist && Boolean(errors.artist)}
                  helperText={touched.artist && errors.artist}
                  fullWidth
                  required
                />
                <TextField
                  name="key"
                  label={messages.songs.form.keyLabel}
                  value={values.key || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                />
                <TextField
                  name="tempo"
                  label={messages.songs.form.tempoLabel}
                  type="number"
                  value={values.tempo || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.tempo && Boolean(errors.tempo)}
                  helperText={touched.tempo && errors.tempo}
                  fullWidth
                />
                <TextField
                  name="notes"
                  label={messages.songs.form.notesLabel}
                  value={values.notes || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.notes && Boolean(errors.notes)}
                  helperText={touched.notes && errors.notes}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={onClose} disabled={loading}>
                {messages.common.cancel}
              </Button>
              <Button type="submit" loading={loading}>
                {messages.common.save}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
});

SongEditDialog.displayName = 'SongEditDialog';
