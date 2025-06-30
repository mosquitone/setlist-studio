'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragHandle as DragHandleIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import { Formik, Form, FieldArray, FormikProps } from 'formik'
import * as Yup from 'yup'
import { useQuery } from '@apollo/client'
import { GET_SONGS } from '@/lib/graphql/queries'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

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

const themes = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
]

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

  const renderSongItem = (
    item: SetlistItem,
    index: number,
    formik: FormikProps<SetlistFormValues>,
    remove: (index: number) => void,
    isDragDisabled = false,
  ) => {
    const { values, errors, touched, handleChange, handleBlur } = formik

    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <IconButton size="small" disabled={isDragDisabled}>
          <DragHandleIcon />
        </IconButton>

        <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
          {index + 1}
        </Typography>

        {enableDragAndDrop ? (
          <Autocomplete
            fullWidth
            options={songs}
            getOptionLabel={option => (typeof option === 'string' ? option : option.title)}
            value={null}
            inputValue={item.title}
            onChange={(event, newValue) => {
              const value = typeof newValue === 'string' ? newValue : newValue?.title || ''
              handleChange({
                target: {
                  name: `items.${index}.title`,
                  value: value,
                },
              })
            }}
            onInputChange={(event, newInputValue) => {
              handleChange({
                target: {
                  name: `items.${index}.title`,
                  value: newInputValue,
                },
              })
            }}
            freeSolo
            renderInput={params => (
              <TextField
                {...params}
                label="楽曲名"
                size="small"
                error={touched.items?.[index]?.title && Boolean(errors.items?.[index]?.title)}
                helperText={touched.items?.[index]?.title && errors.items?.[index]?.title}
              />
            )}
          />
        ) : (
          <TextField
            fullWidth
            name={`items.${index}.title`}
            label="楽曲名"
            value={item.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.items?.[index]?.title && Boolean(errors.items?.[index]?.title)}
            helperText={touched.items?.[index]?.title && errors.items?.[index]?.title}
            size="small"
          />
        )}

        <TextField
          fullWidth
          name={`items.${index}.note`}
          label="メモ"
          value={item.note}
          onChange={handleChange}
          onBlur={handleBlur}
          size="small"
        />

        <IconButton
          color="error"
          onClick={() => remove(index)}
          disabled={values.items.length <= 1}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </Paper>
    )
  }

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
          const { values, errors, touched, handleChange, handleBlur } = formik

          return (
            <Form>
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="title"
                      label="セットリスト名"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.title && Boolean(errors.title)}
                      helperText={touched.title && errors.title}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="bandName"
                      label="バンド名"
                      value={values.bandName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.bandName && Boolean(errors.bandName)}
                      helperText={touched.bandName && errors.bandName}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>テーマ</InputLabel>
                      <Select
                        name="theme"
                        value={values.theme}
                        onChange={handleChange}
                        label="テーマ"
                      >
                        {themes.map(theme => (
                          <MenuItem key={theme.value} value={theme.value}>
                            {theme.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Accordion
                  expanded={expandedOptions}
                  onChange={() => setExpandedOptions(!expandedOptions)}
                  sx={{ mt: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>オプション設定</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="eventName"
                          label="イベント名"
                          value={values.eventName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="eventDate"
                          label="開催日"
                          type="date"
                          value={values.eventDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="openTime"
                          label="開場時間"
                          type="time"
                          value={values.openTime}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="startTime"
                          label="開演時間"
                          type="time"
                          value={values.startTime}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
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
                                            {renderSongItem(item, index, formik, remove)}
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
                              {renderSongItem(item, index, formik, remove, true)}
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
