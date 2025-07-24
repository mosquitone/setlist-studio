'use client';

import { useQuery } from '@apollo/client';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { FormikProps, FastField, FieldProps } from 'formik';
import React, { memo } from 'react';

import { useI18n } from '@/hooks/useI18n';
import { GET_ARTIST_NAMES } from '@/lib/server/graphql/apollo-operations';
import { SetlistFormValues } from '@/types/components';

interface SetlistFormFieldsProps {
  formik: FormikProps<SetlistFormValues>;
}

export const SetlistFormFields = memo(function SetlistFormFields({
  formik,
}: SetlistFormFieldsProps) {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;
  const { messages, lang } = useI18n();

  // dayjsロケール設定
  React.useEffect(() => {
    dayjs.locale(lang);
  }, [lang]);

  const themes = [
    { value: 'black', label: messages.common.basicBlack },
    { value: 'white', label: messages.common.basicWhite },
  ];

  // アーティスト名のオートコンプリート用データ取得（楽曲のアーティスト名から）
  const { data: artistNamesData } = useQuery(GET_ARTIST_NAMES, {
    errorPolicy: 'ignore', // エラーが発生しても処理を続行
    fetchPolicy: 'cache-first',
  });

  const artistNames = artistNamesData?.artistNames || [];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FastField name="title">
          {({ field, meta }: FieldProps) => (
            <TextField
              fullWidth
              {...field}
              label={`${messages.setlistForm.fields.title}（${messages.setlistForm.fields.titlePlaceholder}）`}
              error={meta.touched && Boolean(meta.error)}
              helperText={
                meta.touched && meta.error
                  ? meta.error
                  : messages.setlistForm.fields.titleHelperText
              }
            />
          )}
        </FastField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Autocomplete
          fullWidth
          options={artistNames}
          value={values.artistName}
          inputValue={values.artistName}
          onChange={(_, newValue) => {
            handleChange({
              target: {
                name: 'artistName',
                value: newValue || '',
              },
            });
          }}
          onInputChange={(_, newInputValue) => {
            handleChange({
              target: {
                name: 'artistName',
                value: newInputValue,
              },
            });
          }}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label={messages.setlistForm.fields.artistName}
              error={touched.artistName && Boolean(errors.artistName)}
              helperText={
                touched.artistName && errors.artistName
                  ? errors.artistName
                  : messages.setlistForm.fields.artistNameHelperText
              }
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
        <FastField name="eventName">
          {({ field }: FieldProps) => (
            <TextField fullWidth {...field} label={messages.setlistForm.fields.eventName} />
          )}
        </FastField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <DatePicker
          label={messages.setlistForm.fields.eventDate}
          value={values.eventDate ? dayjs(values.eventDate) : null}
          onChange={(newValue: Dayjs | null) => {
            setFieldValue('eventDate', newValue ? newValue.format('YYYY-MM-DD') : '');
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: touched.eventDate && Boolean(errors.eventDate),
              helperText: touched.eventDate && errors.eventDate,
              onBlur: handleBlur,
              name: 'eventDate',
              id: 'eventDate',
              InputProps: {
                sx: {
                  borderRadius: '12px',
                  width: '100%',
                },
              },
            },
            field: {
              onBlur: () => handleBlur({ target: { name: 'eventDate' } }),
            },
          }}
          format={lang === 'ja' ? 'YYYY年MM月DD日' : 'MM/DD/YYYY'}
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
});

SetlistFormFields.displayName = 'SetlistFormFields';
