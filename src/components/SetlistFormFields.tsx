'use client'

import React from 'react'
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { FormikProps } from 'formik'
import { SetlistFormValues } from './SetlistForm'

interface SetlistFormFieldsProps {
  formik: FormikProps<SetlistFormValues>
  expandedOptions: boolean
  onToggleOptions: () => void
}

const themes = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
]

export function SetlistFormFields({
  formik,
  expandedOptions,
  onToggleOptions,
}: SetlistFormFieldsProps) {
  const { values, errors, touched, handleChange, handleBlur } = formik

  return (
    <>
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
            <Select name="theme" value={values.theme} onChange={handleChange} label="テーマ">
              {themes.map(theme => (
                <MenuItem key={theme.value} value={theme.value}>
                  {theme.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Accordion expanded={expandedOptions} onChange={onToggleOptions} sx={{ mt: 2 }}>
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
    </>
  )
}
