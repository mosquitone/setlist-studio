'use client';

import React from 'react';
import { 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  Autocomplete, 
  Box,
  Stack,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { Delete as DeleteIcon, DragHandle as DragHandleIcon } from '@mui/icons-material';
import { FormikProps } from 'formik';
import { SetlistFormValues, SetlistFormItem } from '@/types/components';

// 後方互換性のため型エイリアス
type SetlistItem = SetlistFormItem;

interface SongItemInputProps {
  item: SetlistItem;
  index: number;
  formik: FormikProps<SetlistFormValues>;
  onRemove: (index: number) => void;
  songs: Array<{ id: string; title: string }>;
  enableDragAndDrop: boolean;
  isDragDisabled?: boolean;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
}

export function SongItemInput({
  item,
  index,
  formik,
  onRemove,
  songs,
  enableDragAndDrop,
  isDragDisabled = false,
  onMoveUp,
  onMoveDown,
}: SongItemInputProps) {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp' && event.ctrlKey && onMoveUp) {
      event.preventDefault();
      onMoveUp(index);
    } else if (event.key === 'ArrowDown' && event.ctrlKey && onMoveDown) {
      event.preventDefault();
      onMoveDown(index);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: isMobile ? 1.5 : 2,
      }}
    >
      {isMobile ? (
        // モバイル版: より使いやすいレイアウト
        <Stack spacing={2}>
          {/* ヘッダー行 */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                size="small"
                disabled={isDragDisabled}
                aria-label={`楽曲 ${index + 1} をドラッグして移動`}
                onKeyDown={handleKeyDown}
                tabIndex={0}
              >
                <DragHandleIcon />
              </IconButton>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                楽曲 {index + 1}
              </Typography>
            </Stack>
            <IconButton
              color="error"
              onClick={() => onRemove(index)}
              disabled={values.items.length <= 1}
              size="small"
              aria-label={`楽曲 ${index + 1} を削除`}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>

          {/* 楽曲名フィールド */}
          {enableDragAndDrop ? (
            <Autocomplete
              fullWidth
              options={songs}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
              value={null}
              inputValue={item.title}
              onChange={(event, newValue) => {
                const value = typeof newValue === 'string' ? newValue : newValue?.title || '';
                handleChange({
                  target: {
                    name: `items.${index}.title`,
                    value: value,
                  },
                });
              }}
              onInputChange={(event, newInputValue) => {
                handleChange({
                  target: {
                    name: `items.${index}.title`,
                    value: newInputValue,
                  },
                });
              }}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="楽曲名"
                  size="small"
                  error={
                    touched.items?.[index]?.title &&
                    Boolean(
                      errors.items?.[index] &&
                        typeof errors.items[index] === 'object' &&
                        'title' in errors.items[index],
                    )
                  }
                  helperText={
                    touched.items?.[index]?.title &&
                    errors.items?.[index] &&
                    typeof errors.items[index] === 'object' &&
                    'title' in errors.items[index]
                      ? String(errors.items[index].title)
                      : ''
                  }
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
              error={
                touched.items?.[index]?.title &&
                Boolean(
                  errors.items?.[index] &&
                    typeof errors.items[index] === 'object' &&
                    'title' in errors.items[index],
                )
              }
              helperText={
                touched.items?.[index]?.title &&
                errors.items?.[index] &&
                typeof errors.items[index] === 'object' &&
                'title' in errors.items[index]
                  ? String(errors.items[index].title)
                  : ''
              }
              size="small"
            />
          )}

          {/* メモフィールド */}
          <TextField
            fullWidth
            name={`items.${index}.note`}
            label="メモ（任意）"
            value={item.note}
            onChange={handleChange}
            onBlur={handleBlur}
            size="small"
            multiline
            rows={2}
          />
        </Stack>
      ) : (
        // デスクトップ版: 従来のレイアウト
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={2}
        >
          {/* ヘッダー部分（ドラッグハンドル + 番号 + 削除ボタン） */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: '120px' }}>
            <IconButton
              size="small"
              disabled={isDragDisabled}
              aria-label={`楽曲 ${index + 1} をドラッグして移動。Ctrl+矢印キーでキーボード操作可能`}
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              <DragHandleIcon />
            </IconButton>

            <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
              {index + 1}
            </Typography>

            <IconButton
              color="error"
              onClick={() => onRemove(index)}
              disabled={values.items.length <= 1}
              size="small"
              aria-label={`楽曲 ${index + 1} を削除`}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>

          {/* フィールド部分 */}
          <Stack direction="row" spacing={2} sx={{ flex: 1, width: '100%' }}>
            {/* 楽曲名フィールド */}
            <Box sx={{ flex: 2 }}>
              {enableDragAndDrop ? (
                <Autocomplete
                  fullWidth
                  options={songs}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
                  value={null}
                  inputValue={item.title}
                  onChange={(event, newValue) => {
                    const value = typeof newValue === 'string' ? newValue : newValue?.title || '';
                    handleChange({
                      target: {
                        name: `items.${index}.title`,
                        value: value,
                      },
                    });
                  }}
                  onInputChange={(event, newInputValue) => {
                    handleChange({
                      target: {
                        name: `items.${index}.title`,
                        value: newInputValue,
                      },
                    });
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="楽曲名"
                      size="small"
                      error={
                        touched.items?.[index]?.title &&
                        Boolean(
                          errors.items?.[index] &&
                            typeof errors.items[index] === 'object' &&
                            'title' in errors.items[index],
                        )
                      }
                      helperText={
                        touched.items?.[index]?.title &&
                        errors.items?.[index] &&
                        typeof errors.items[index] === 'object' &&
                        'title' in errors.items[index]
                          ? String(errors.items[index].title)
                          : ''
                      }
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
                  error={
                    touched.items?.[index]?.title &&
                    Boolean(
                      errors.items?.[index] &&
                        typeof errors.items[index] === 'object' &&
                        'title' in errors.items[index],
                    )
                  }
                  helperText={
                    touched.items?.[index]?.title &&
                    errors.items?.[index] &&
                    typeof errors.items[index] === 'object' &&
                    'title' in errors.items[index]
                      ? String(errors.items[index].title)
                      : ''
                  }
                  size="small"
                />
              )}
            </Box>

            {/* メモフィールド */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                name={`items.${index}.note`}
                label="メモ"
                value={item.note}
                onChange={handleChange}
                onBlur={handleBlur}
                size="small"
              />
            </Box>
          </Stack>
        </Stack>
      )}
    </Paper>
  );
}
