'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Container, Typography, TextField, Box, Paper, Alert } from '@mui/material';
import { Button } from '@/components/common/ui/Button';
import { useMutation } from '@apollo/client';
import { CREATE_SONG } from '@/lib/server/graphql/apollo-operations';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface SongFormValues {
  title: string;
  artist: string;
  key: string;
  tempo: string;
  notes: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required('楽曲名は必須です'),
  artist: Yup.string().required('アーティスト名は必須です'),
  key: Yup.string(),
  tempo: Yup.number().typeError('数値を入力してください').nullable(),
  notes: Yup.string(),
});

const initialValues: SongFormValues = {
  title: '',
  artist: '',
  key: '',
  tempo: '',
  notes: '',
};

export default function NewSongPage() {
  const router = useRouter();
  const [createSong, { loading, error }] = useMutation(CREATE_SONG);

  const handleSubmit = async (values: SongFormValues) => {
    const tempoVal = values.tempo ? parseInt(values.tempo, 10) : undefined;
    const { data } = await createSong({
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
    if (data?.createSong?.id) {
      router.push('/songs');
    }
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          新しい楽曲を追加
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    name="title"
                    label="楽曲名"
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
                    label="アーティスト"
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
                    label="キー"
                    value={values.key}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <TextField
                    fullWidth
                    name="tempo"
                    label="テンポ (BPM)"
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
                    label="メモ"
                    multiline
                    rows={3}
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Box>
              </Paper>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  楽曲の作成に失敗しました: {error.message}
                </Alert>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" disabled={loading} onClick={() => router.back()}>
                  キャンセル
                </Button>
                <Button type="submit" loading={loading}>
                  作成
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </ProtectedRoute>
  );
}
