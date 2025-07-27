'use client';

import { useMutation } from '@apollo/client';
import { Container, Typography, TextField, Box, Paper } from '@mui/material';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useMemo, useCallback } from 'react';
import * as Yup from 'yup';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/common/ui/Button';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';
import { Messages } from '@/lib/i18n/messages';
import { CREATE_SONG, GET_SONGS } from '@/lib/server/graphql/apollo-operations';
import { Song } from '@/types/graphql';

interface SongFormValues {
  title: string;
  artist: string;
  key: string;
  tempo: string;
  notes: string;
}

// GraphQL mutation response type
interface CreateSongData {
  createSong: Song;
}

const getValidationSchema = (messages: Messages) =>
  Yup.object({
    title: Yup.string()
      .required(messages.songs.newSong.validation.titleRequired)
      .max(30, messages.songs.newSong.validation.titleMaxLength),
    artist: Yup.string()
      .required(messages.songs.newSong.validation.artistRequired)
      .max(30, messages.songs.newSong.validation.artistMaxLength),
    key: Yup.string(),
    tempo: Yup.number().typeError(messages.songs.newSong.validation.tempoInvalid).nullable(),
    notes: Yup.string().max(20, messages.songs.newSong.validation.notesMaxLength),
  });

const initialValues: SongFormValues = {
  title: '',
  artist: '',
  key: '',
  tempo: '',
  notes: '',
};

export default function NewSongPage() {
  const { messages } = useI18n();
  const router = useRouter();
  const { showError, showSuccess } = useSnackbar();

  // validationSchemaをメモ化
  const validationSchema = useMemo(() => getValidationSchema(messages), [messages]);
  const [createSong, { loading }] = useMutation<CreateSongData>(CREATE_SONG, {
    refetchQueries: [{ query: GET_SONGS }],
    onCompleted: (data: CreateSongData) => {
      if (data.createSong) {
        showSuccess(`「${data.createSong.title}」${messages.notifications.songCreated}`);
        router.push('/songs');
      }
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const handleSubmit = useCallback(
    async (values: SongFormValues) => {
      const tempoVal = values.tempo ? parseInt(values.tempo, 10) : undefined;
      await createSong({
        variables: {
          input: {
            title: values.title,
            artist: values.artist,
            key: values.key || undefined,
            tempo: tempoVal,
            notes: values.notes || undefined,
          },
        },
      });
    },
    [createSong],
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <ProtectedRoute>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          {messages.songs.newSong.title}
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    name="title"
                    label={messages.songs.form.titleLabel}
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                    required
                  />
                  <TextField
                    fullWidth
                    name="artist"
                    label={messages.songs.form.artistLabel}
                    value={values.artist}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.artist && Boolean(errors.artist)}
                    helperText={touched.artist && errors.artist}
                    required
                  />
                  <TextField
                    fullWidth
                    name="key"
                    label={messages.songs.form.keyLabel}
                    value={values.key}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <TextField
                    fullWidth
                    name="tempo"
                    label={messages.songs.form.tempoLabel}
                    type="number"
                    value={values.tempo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.tempo && Boolean(errors.tempo)}
                    helperText={touched.tempo && errors.tempo}
                  />
                  <TextField
                    fullWidth
                    name="notes"
                    label={messages.songs.form.notesLabel}
                    multiline
                    rows={3}
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Box>
              </Paper>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" disabled={loading} onClick={handleCancel}>
                  {messages.common.cancel}
                </Button>
                <Button type="submit" loading={loading}>
                  {messages.songs.newSong.create}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </ProtectedRoute>
  );
}
