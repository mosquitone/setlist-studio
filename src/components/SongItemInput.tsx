'use client'

import React from 'react'
import { Paper, TextField, IconButton, Typography, Autocomplete } from '@mui/material'
import { Delete as DeleteIcon, DragHandle as DragHandleIcon } from '@mui/icons-material'
import { FormikProps } from 'formik'
import { SetlistFormValues, SetlistItem } from './SetlistForm'

interface SongItemInputProps {
  item: SetlistItem
  index: number
  formik: FormikProps<SetlistFormValues>
  onRemove: (index: number) => void
  songs: Array<{ id: string; title: string }>
  enableDragAndDrop: boolean
  isDragDisabled?: boolean
}

export function SongItemInput({
  item,
  index,
  formik,
  onRemove,
  songs,
  enableDragAndDrop,
  isDragDisabled = false,
}: SongItemInputProps) {
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
        onClick={() => onRemove(index)}
        disabled={values.items.length <= 1}
        size="small"
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  )
}
