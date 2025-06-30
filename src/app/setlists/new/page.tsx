'use client'

import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_SETLIST, GET_SETLIST } from '@/lib/graphql/apollo-operations'
import { useRouter, useSearchParams } from 'next/navigation'
import SetlistForm, { SetlistFormValues } from '@/components/forms/SetlistForm'

export default function NewSetlistPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const duplicateId = searchParams.get('duplicate')
  const [initialValues, setInitialValues] = useState<SetlistFormValues>({
    title: '',
    bandName: '',
    eventName: '',
    eventDate: '',
    openTime: '',
    startTime: '',
    theme: 'black',
    items: [{ title: '', note: '' }],
  })

  const [createSetlist, { loading, error }] = useMutation(CREATE_SETLIST)

  const { data: duplicateData, loading: duplicateLoading } = useQuery(GET_SETLIST, {
    variables: { id: duplicateId },
    skip: !duplicateId,
  })

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

  useEffect(() => {
    if (duplicateData?.setlist) {
      const setlist = duplicateData.setlist
      setInitialValues({
        title: `${setlist.title} (コピー)`,
        bandName: setlist.bandName,
        eventName: setlist.eventName || '',
        eventDate: setlist.eventDate || '',
        openTime: setlist.openTime || '',
        startTime: setlist.startTime || '',
        theme: setlist.theme,
        items:
          setlist.items.length > 0
            ? [...setlist.items]
                .sort((a: any, b: any) => a.order - b.order)
                .map((item: any) => ({
                  title: item.title,
                  note: item.note || '',
                }))
            : [{ title: '', note: '' }],
      })
    }
  }, [duplicateData])

  const createError = error ? new Error(`セットリストの作成に失敗しました: ${error.message}`) : null
  const isLoading = loading || duplicateLoading

  return (
    <SetlistForm
      title={duplicateId ? 'セットリストを複製' : '新しいセットリストを作成'}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      loading={isLoading}
      error={createError}
      submitButtonText="セットリストを作成"
      loadingButtonText="作成中..."
      enableDragAndDrop={true}
    />
  )
}
