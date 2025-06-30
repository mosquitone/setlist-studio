'use client'

import React, { useState } from 'react'
import { Box, Container, Typography, Button, Paper, Alert } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import { useQuery } from '@apollo/client'
import { GET_SONGS } from '@/lib/graphql/apollo-operations'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { SetlistFormFields } from './SetlistFormFields'
import { SongItemInput } from './SongItemInput'

export interface SetlistItem {
  id?: string
  title: string
  note: string
}

export interface SetlistFormValues {
  title: string
  bandName: string
  eventName: string
  eventDate: string
  openTime: string
  startTime: string
  theme: string
  items: SetlistItem[]
}

interface SetlistFormProps {
  title: string
  initialValues: SetlistFormValues
  onSubmit: (values: SetlistFormValues) => Promise<void>
  loading: boolean
  error?: Error | null
  submitButtonText: string
  loadingButtonText: string
  enableDragAndDrop?: boolean
}

const validationSchema = Yup.object({
  title: Yup.string().required('セットリスト名は必須です'),
  bandName: Yup.string().required('バンド名は必須です'),
  eventName: Yup.string(),
  eventDate: Yup.string(),
  openTime: Yup.string(),
  startTime: Yup.string(),
  theme: Yup.string().required('テーマは必須です'),
  items: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().required('楽曲名は必須です'),
        note: Yup.string(),
      }),
    )
    .min(1, '少なくとも1曲は必要です'),
})

export default function SetlistForm({
  title,
  initialValues,
  onSubmit,
  loading,
  error,
  submitButtonText,
  loadingButtonText,
  enableDragAndDrop = true,
}: SetlistFormProps) {
  const [expandedOptions, setExpandedOptions] = useState(false)
  const { data: songsData } = useQuery(GET_SONGS)
  const songs = songsData?.songs || []

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {formik => {
          const { values } = formik

          return (
            <Form>
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <SetlistFormFields
                  formik={formik}
                  expandedOptions={expandedOptions}
                  onToggleOptions={() => setExpandedOptions(!expandedOptions)}
                />
              </Paper>

              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  楽曲リスト
                </Typography>

                <FieldArray name="items">
                  {({ push, remove, move }) => {
                    const handleDragEnd = (result: DropResult) => {
                      if (!result.destination) return

                      const sourceIndex = result.source.index
                      const destinationIndex = result.destination.index

                      move(sourceIndex, destinationIndex)
                    }

                    return (
                      <>
                        {enableDragAndDrop ? (
                          <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="setlist-items">
                              {provided => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                  {values.items.map((item, index) => (
                                    <Draggable
                                      key={`item-${index}`}
                                      draggableId={`item-${index}`}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <Box
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          sx={{ mb: 2 }}
                                        >
                                          <Box
                                            sx={{
                                              backgroundColor: snapshot.isDragging
                                                ? 'action.hover'
                                                : 'background.paper',
                                              opacity: snapshot.isDragging ? 0.8 : 1,
                                            }}
                                            {...provided.dragHandleProps}
                                          >
                                            <SongItemInput
                                              item={item}
                                              index={index}
                                              formik={formik}
                                              onRemove={remove}
                                              songs={songs}
                                              enableDragAndDrop={enableDragAndDrop}
                                            />
                                          </Box>
                                        </Box>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                        ) : (
                          values.items.map((item, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                              <SongItemInput
                                item={item}
                                index={index}
                                formik={formik}
                                onRemove={remove}
                                songs={songs}
                                enableDragAndDrop={enableDragAndDrop}
                                isDragDisabled={true}
                              />
                            </Box>
                          ))
                        )}

                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => push({ title: '', note: '' })}
                          fullWidth
                          sx={{ mt: 2 }}
                        >
                          楽曲を追加
                        </Button>
                      </>
                    )
                  }}
                </FieldArray>
              </Paper>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error.message}
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  type="button"
                  disabled={loading}
                  onClick={() => window.history.back()}
                >
                  キャンセル
                </Button>
                <Button type="submit" variant="contained" disabled={loading} size="large">
                  {loading ? loadingButtonText : submitButtonText}
                </Button>
              </Box>
            </Form>
          )
        }}
      </Formik>
    </Container>
  )
}
