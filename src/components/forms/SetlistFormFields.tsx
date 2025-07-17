'use client';

import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { FormikProps } from 'formik';
import { SetlistFormValues } from '@/types/components';
import { useQuery } from '@apollo/client';
import { GET_BAND_NAMES } from '@/lib/server/graphql/apollo-operations';

interface SetlistFormFieldsProps {
  formik: FormikProps<SetlistFormValues>;
}

const themes = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
];

export function SetlistFormFields({ formik }: SetlistFormFieldsProps) {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  // バンド名のオートコンプリート用データ取得
  const { data: bandNamesData } = useQuery(GET_BAND_NAMES, {
    errorPolicy: 'ignore', // エラーが発生しても処理を続行
  });

  const bandNames = bandNamesData?.bandNames || [];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="title"
          label="セットリスト名（任意）"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title && Boolean(errors.title)}
          helperText={
            touched.title && errors.title ? errors.title : '空欄の場合は自動でナンバリングされます'
          }
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Autocomplete
          fullWidth
          options={bandNames}
          value={values.bandName}
          inputValue={values.bandName}
          onChange={(_, newValue) => {
            handleChange({
              target: {
                name: 'bandName',
                value: newValue || '',
              },
            });
          }}
          onInputChange={(_, newInputValue) => {
            handleChange({
              target: {
                name: 'bandName',
                value: newInputValue,
              },
            });
          }}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="バンド名"
              error={touched.bandName && Boolean(errors.bandName)}
              helperText={touched.bandName && errors.bandName}
              required
              onBlur={handleBlur}
            />
          )}
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
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '12px',
              },
            }}
          >
            {themes.map((theme) => (
              <MenuItem key={theme.value} value={theme.value}>
                {theme.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

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
  );
}
