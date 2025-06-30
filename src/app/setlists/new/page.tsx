'use client'

import React from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_SETLIST } from '@/lib/graphql/queries'
import { useRouter } from 'next/navigation'
import SetlistForm, { SetlistFormValues } from '@/components/SetlistForm'

const initialValues: SetlistFormValues = {
  title: '',
  bandName: '',
  eventName: '',
  eventDate: '',
  openTime: '',
  startTime: '',
  theme: 'basic',
  items: [{ title: '', note: '' }],
}

export default function NewSetlistPage() {
  const router = useRouter()
  const [createSetlist, { loading, error }] = useMutation(CREATE_SETLIST)

  const handleSubmit = async (values: SetlistFormValues) => {
    try {
      const { data } = await createSetlist({
        variables: {
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

      if (data?.createSetlist) {
        router.push(`/setlists/${data.createSetlist.id}`)
      }
    } catch (err) {
      console.error('Error creating setlist:', err)
    }
  }

  const createError = error ? new Error(`セットリストの作成に失敗しました: ${error.message}`) : null

  return (
    <SetlistForm
      title="新しいセットリストを作成"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      loading={loading}
      error={createError}
      submitButtonText="セットリストを作成"
      loadingButtonText="作成中..."
      enableDragAndDrop={true}
    />
  )
}
