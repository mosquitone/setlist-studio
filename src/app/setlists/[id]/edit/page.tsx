'use client';

import { useQuery, useMutation } from '@apollo/client';
import { Container, Alert, CircularProgress, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SetlistForm from '@/components/forms/SetlistForm';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { GET_SETLIST, UPDATE_SETLIST } from '@/lib/server/graphql/apollo-operations';
import { formatDateForInput } from '@/lib/shared/dateUtils';
import { SetlistFormValues } from '@/types/components';

export default function EditSetlistPage() {
  const params = useParams();
  const router = useRouter();
  const { showError, showSuccess } = useSnackbar();
  const setlistId = params.id as string;

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_SETLIST, {
    variables: { id: setlistId },
    skip: !setlistId,
  });

  const [updateSetlist, { loading: updateLoading }] = useMutation(UPDATE_SETLIST, {
    onCompleted: () => {
      showSuccess('セットリストが更新されました');
      router.push(`/setlists/${setlistId}`);
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  if (queryLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>セットリストを読み込み中...</Typography>
      </Container>
    );
  }

  if (queryError || !data?.setlist) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">セットリストが見つかりません。</Alert>
      </Container>
    );
  }

  const setlist = data.setlist;

  const initialValues: SetlistFormValues = {
    title: setlist.title || '',
    artistName: setlist.artistName || '',
    eventName: setlist.eventName || '',
    eventDate: formatDateForInput(setlist.eventDate),
    openTime: setlist.openTime || '',
    startTime: setlist.startTime || '',
    theme: setlist.theme || 'black',
    items: [...setlist.items]
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        id: item.id,
        title: item.title || '',
        note: item.note || '',
      })),
  };

  const handleSubmit = async (values: SetlistFormValues) => {
    await updateSetlist({
      variables: {
        id: setlistId,
        input: {
          title: values.title,
          artistName: values.artistName,
          eventName: values.eventName || undefined,
          eventDate: values.eventDate || undefined,
          openTime: values.openTime || undefined,
          startTime: values.startTime || undefined,
          theme: values.theme,
          items: values.items.map((item, index) => ({
            title: item.title,
            note: item.note || undefined,
            order: index,
          })),
        },
      },
    });
  };

  return (
    <ProtectedRoute>
      <SetlistForm
        title="セットリストを編集"
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={updateLoading}
        submitButtonText="変更を保存"
        enableDragAndDrop={true}
      />
    </ProtectedRoute>
  );
}
