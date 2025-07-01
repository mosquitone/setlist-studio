'use client'

import React from 'react'
import { Container, Alert, CircularProgress, Typography } from '@mui/material'
import { useQuery, useMutation } from '@apollo/client'
import { useParams, useRouter } from 'next/navigation'
import { GET_SETLIST, UPDATE_SETLIST } from '@/lib/server/graphql/apollo-operations'
import SetlistForm, { SetlistFormValues } from '@/components/forms/SetlistForm'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function EditSetlistPage() {
  const params = useParams()
  const router = useRouter()
  const setlistId = params.id as string

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_SETLIST, {
    variables: { id: setlistId },
    skip: !setlistId,
  })

  const [updateSetlist, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_SETLIST)

  if (queryLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>セットリストを読み込み中...</Typography>
      </Container>
    )
  }

  if (queryError || !data?.setlist) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">セットリストが見つかりません。</Alert>
      </Container>
    )
  }

  const setlist = data.setlist

  const initialValues: SetlistFormValues = {
    title: setlist.title || '',
    bandName: setlist.bandName || '',
    eventName: setlist.eventName || '',
    eventDate: setlist.eventDate || '',
    openTime: setlist.openTime || '',
    startTime: setlist.startTime || '',
    theme: setlist.theme || 'black',
    items: [...setlist.items]
      .sort((a: any, b: any) => a.order - b.order)
      .map((item: any) => ({
        id: item.id,
        title: item.title || '',
        note: item.note || '',
      })),
  }

  const handleSubmit = async (values: SetlistFormValues) => {
    const { data } = await updateSetlist({
      variables: {
        id: setlistId,
        input: {
          title: values.title,
          bandName: values.bandName,
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
    })

    if (data?.updateSetlist) {
      router.push(`/setlists/${setlistId}`)
    }
  }

  const updateErrorMessage = updateError
    ? new Error(`セットリストの更新に失敗しました: ${updateError.message}`)
    : null

  return (
    <ProtectedRoute>
      <SetlistForm
        title="セットリストを編集"
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={updateLoading}
        error={updateErrorMessage}
        submitButtonText="変更を保存"
        loadingButtonText="保存中..."
        enableDragAndDrop={true}
      />
    </ProtectedRoute>
  )
}
