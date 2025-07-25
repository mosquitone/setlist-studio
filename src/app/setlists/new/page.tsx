'use client';

import { useMutation, useQuery } from '@apollo/client';
import { Box, CircularProgress, Container } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SetlistForm from '@/components/forms/SetlistForm';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';
import {
  CREATE_SETLIST,
  GET_SETLIST,
  GET_SETLISTS,
  GET_SONGS,
} from '@/lib/server/graphql/apollo-operations';
import { generateNewSongNotification } from '@/lib/shared/notificationHelpers';
import { THEMES } from '@/types/common';
import { SetlistFormValues } from '@/types/components';
import { GetSetlistResponse, SetlistItem, CreateSetlistData } from '@/types/graphql';

export default function NewSetlistPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get('duplicate');
  const selectedSongsParam = searchParams.get('selectedSongs');
  const songsParam = searchParams.get('songs'); // Base64エンコードされた楽曲データ
  const { messages } = useI18n();
  const { showError, showSuccess } = useSnackbar();
  const [initialValues, setInitialValues] = useState<SetlistFormValues>({
    title: '',
    artistName: '',
    eventName: '',
    eventDate: '',
    openTime: '',
    startTime: '',
    theme: THEMES.BLACK,
    items: [{ title: '', note: '' }],
  });

  const [createSetlist, { loading }] = useMutation<CreateSetlistData>(CREATE_SETLIST, {
    refetchQueries: [{ query: GET_SETLISTS }, { query: GET_SONGS }],
    awaitRefetchQueries: false,
    onCompleted: (data: CreateSetlistData) => {
      showSuccess(messages.setlistForm.buttons.createSuccess || 'セットリストが作成されました');

      // 新規楽曲が登録された場合の通知
      if (data.createSetlist.newSongs.count > 0) {
        const notificationMessage = generateNewSongNotification(
          data.createSetlist.newSongs,
          messages,
        );
        showSuccess(notificationMessage);
      }

      // 即座に遷移
      router.push(`/setlists/${data.createSetlist.setlist.id}`);
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const { data: duplicateData, loading: duplicateLoading } = useQuery<GetSetlistResponse>(
    GET_SETLIST,
    {
      variables: { id: duplicateId },
      skip: !duplicateId,
    },
  );

  const handleSubmit = async (values: SetlistFormValues) => {
    await createSetlist({
      variables: {
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

  useEffect(() => {
    if (duplicateData?.setlist) {
      const setlist = duplicateData.setlist;
      setInitialValues({
        title: `${setlist.title} (${messages.setlistForm.copy})`,
        artistName: setlist.artistName || '',
        eventName: setlist.eventName || '',
        eventDate: setlist.eventDate || '',
        openTime: setlist.openTime || '',
        startTime: setlist.startTime || '',
        theme: setlist.theme || THEMES.WHITE,
        items:
          setlist.items.length > 0
            ? [...setlist.items]
                .sort((a: SetlistItem, b: SetlistItem) => a.order - b.order)
                .map((item: SetlistItem) => ({
                  title: item.title,
                  note: item.note || '',
                }))
            : [{ title: '', note: '' }],
      });
    } else if (songsParam) {
      // Base64エンコードされた楽曲データをデコード
      try {
        const decodedString = decodeURIComponent(atob(songsParam));
        const selectedSongs: unknown = JSON.parse(decodedString);
        if (Array.isArray(selectedSongs) && selectedSongs.length > 0) {
          setInitialValues((prev) => ({
            ...prev,
            items: selectedSongs.slice(0, 20), // 20曲制限
          }));
        }
      } catch (error: unknown) {
        console.error('Failed to decode selected songs:', error);
      }
    } else if (selectedSongsParam) {
      // 後方互換性のため、古い形式もサポート
      try {
        const selectedSongs: unknown = JSON.parse(selectedSongsParam);
        if (Array.isArray(selectedSongs) && selectedSongs.length > 0) {
          setInitialValues((prev) => ({
            ...prev,
            items: selectedSongs.slice(0, 20), // 20曲制限
          }));
        }
      } catch (error: unknown) {
        console.error('Failed to parse selected songs:', error);
      }
    }
  }, [duplicateData, songsParam, selectedSongsParam, messages.setlistForm.copy]);

  // 複製モードの場合、データが読み込まれるまで待つ
  const isReady = !duplicateId || (duplicateId && !duplicateLoading);

  return (
    <ProtectedRoute>
      {isReady ? (
        <SetlistForm
          title={
            duplicateId
              ? messages.setlistForm.titles.duplicate
              : songsParam || selectedSongsParam
                ? messages.setlistForm.titles.fromSongs
                : messages.setlistForm.titles.create
          }
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={loading}
          submitButtonText={messages.setlistForm.buttons.create}
          enableDragAndDrop={true}
        />
      ) : (
        <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      )}
    </ProtectedRoute>
  );
}
