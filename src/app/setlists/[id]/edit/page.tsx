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
  CircularProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragHandle as DragHandleIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import { useQuery, useMutation } from '@apollo/client'
import { useParams, useRouter } from 'next/navigation'
import { GET_SETLIST, UPDATE_SETLIST } from '@/lib/graphql/queries'

interface SetlistItem {
  id?: string
  title: string
  note: string
}

interface SetlistFormValues {
  title: string
  bandName: string
  eventName: string
  eventDate: string
  openTime: string
  startTime: string
  theme: string
  items: SetlistItem[]
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
  { value: 'basic', label: 'Basic' },
  { value: 'mqtn', label: 'MQTN' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'mqtn2', label: 'MQTN2' },
]

export default function EditSetlistPage() {
  const params = useParams()
  const router = useRouter()
  const setlistId = params.id as string

  const [expandedOptions, setExpandedOptions] = useState(false)

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
    theme: setlist.theme || 'basic',
    items: setlist.items
      .sort((a: any, b: any) => a.order - b.order)
      .map((item: any) => ({
        id: item.id,
        title: item.title || '',
        note: item.note || '',
      })),
  }

  const handleSubmit = async (values: SetlistFormValues) => {
    try {
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
    } catch (err) {
      console.error('Error updating setlist:', err)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        セットリストを編集
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
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
                {({ push, remove }) => (
                  <>
                    {values.items.map((item, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Paper
                          variant="outlined"
                          sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          <IconButton size="small" disabled>
                            <DragHandleIcon />
                          </IconButton>

                          <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
                            {index + 1}
                          </Typography>

                          <TextField
                            fullWidth
                            name={`items.${index}.title`}
                            label="楽曲名"
                            value={item.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.items?.[index]?.title && Boolean(errors.items?.[index]?.title)
                            }
                            helperText={
                              touched.items?.[index]?.title && errors.items?.[index]?.title
                            }
                            size="small"
                          />

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
                      </Box>
                    ))}

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
                )}
              </FieldArray>
            </Paper>

            {updateError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                セットリストの更新に失敗しました: {updateError.message}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => router.back()}
                disabled={updateLoading}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={updateLoading}
                size="large"
              >
                {updateLoading ? '保存中...' : '変更を保存'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
