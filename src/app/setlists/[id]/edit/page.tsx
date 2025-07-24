'use client';

import { useQuery, useMutation } from '@apollo/client';
import { Container, Alert, CircularProgress, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SetlistForm from '@/components/forms/SetlistForm';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';
import {
  GET_SETLIST,
  UPDATE_SETLIST,
  GET_SONGS,
  GET_SETLISTS,
} from '@/lib/server/graphql/apollo-operations';
import { formatDateForInput } from '@/lib/shared/dateUtils';
import { generateNewSongNotification } from '@/lib/shared/notificationHelpers';
import { THEMES } from '@/types/common';
import { SetlistFormValues } from '@/types/components';
import { UpdateSetlistData } from '@/types/graphql';

export default function EditSetlistPage() {
  const params = useParams();
  const router = useRouter();
  const { showError, showSuccess } = useSnackbar();
  const { messages } = useI18n();
  const setlistId = params.id as string;

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_SETLIST, {
    variables: { id: setlistId },
    skip: !setlistId,
  });

  const [updateSetlist, { loading: updateLoading }] = useMutation<UpdateSetlistData>(
    UPDATE_SETLIST,
    {
      refetchQueries: [{ query: GET_SONGS }, { query: GET_SETLISTS }],
      awaitRefetchQueries: false,
      onCompleted: (data: UpdateSetlistData) => {
        showSuccess('セットリストが更新されました');

        // 新規楽曲が登録された場合の通知
        if (data.updateSetlist.newSongs.count > 0) {
          const notificationMessage = generateNewSongNotification(
            data.updateSetlist.newSongs,
            messages,
          );
          showSuccess(notificationMessage);
        }

        // 即座に遷移
        router.push(`/setlists/${setlistId}`);
      },
      onError: (error) => {
        showError(error.message);
      },
    },
  );

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
    theme: setlist.theme || THEMES.BLACK,
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
