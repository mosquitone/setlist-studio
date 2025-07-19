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
import { useI18n } from '@/hooks/useI18n';

interface SetlistFormFieldsProps {
  formik: FormikProps<SetlistFormValues>;
}

export function SetlistFormFields({ formik }: SetlistFormFieldsProps) {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  const { messages } = useI18n();

  const themes = [
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
  ];

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
          label={`${messages.setlistForm.fields.title}（${messages.setlistForm.fields.titlePlaceholder}）`}
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title && Boolean(errors.title)}
          helperText={
            touched.title && errors.title
              ? errors.title
              : messages.setlistForm.fields.titleHelperText
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
              label={messages.setlistForm.fields.bandName}
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
          <InputLabel>{messages.setlistForm.fields.theme}</InputLabel>
          <Select
            name="theme"
            value={values.theme}
            onChange={handleChange}
            label={messages.setlistForm.fields.theme}
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
          label={messages.setlistForm.fields.eventName}
          value={values.eventName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          name="eventDate"
          label={messages.setlistForm.fields.eventDate}
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
          label={messages.setlistForm.fields.openTime}
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
          label={messages.setlistForm.fields.startTime}
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
