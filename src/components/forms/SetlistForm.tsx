'use client';

import React, { useState, useMemo } from 'react';
import { Box, Container, Typography, Paper, Alert } from '@mui/material';
import { Button } from '@/components/common/ui/Button';
import { Add as AddIcon } from '@mui/icons-material';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@apollo/client';
import { GET_SONGS } from '@/lib/server/graphql/apollo-operations';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { SetlistFormFields } from './SetlistFormFields';
import { SongItemInput } from './SongItemInput';
import { validateAndSanitizeInput } from '@/lib/security/security-utils';

import { SetlistFormValues } from '@/types/components';

interface SetlistFormProps {
  title: string;
  initialValues: SetlistFormValues;
  onSubmit: (values: SetlistFormValues) => Promise<void>;
  loading: boolean;
  error?: Error | null;
  submitButtonText: string;
  loadingButtonText: string;
  enableDragAndDrop?: boolean;
}

/**
 * セットリスト作成・編集フォームコンポーネント
 * ドラッグ&ドロップ対応、バリデーション機能付き
 *
 * @param title - フォームのタイトル
 * @param initialValues - フォームの初期値
 * @param onSubmit - フォーム送信時のハンドラー関数
 * @param loading - 送信中のローディング状態
 * @param error - エラーオブジェクト
 * @param submitButtonText - 送信ボタンのテキスト
 * @param loadingButtonText - ローディング中のボタンテキスト
 * @param enableDragAndDrop - ドラッグ&ドロップ機能の有効/無効
 */

const validationSchema = Yup.object({
  title: Yup.string()
    .required('セットリスト名は必須です')
    .max(100, 'セットリスト名は100文字以下にしてください')
    .test('sanitize', 'セットリスト名に無効な文字が含まれています', function (value) {
      if (!value) return true;
      try {
        validateAndSanitizeInput(value, 100);
        return true;
      } catch {
        return false;
      }
    }),
  bandName: Yup.string()
    .required('バンド名は必須です')
    .max(100, 'バンド名は100文字以下にしてください')
    .test('sanitize', 'バンド名に無効な文字が含まれています', function (value) {
      if (!value) return true;
      try {
        validateAndSanitizeInput(value, 100);
        return true;
      } catch {
        return false;
      }
    }),
  eventName: Yup.string()
    .max(200, 'イベント名は200文字以下にしてください')
    .test('sanitize', 'イベント名に無効な文字が含まれています', function (value) {
      if (!value) return true;
      try {
        validateAndSanitizeInput(value, 200);
        return true;
      } catch {
        return false;
      }
    }),
  eventDate: Yup.string(),
  openTime: Yup.string(),
  startTime: Yup.string(),
  theme: Yup.string().required('テーマは必須です'),
  items: Yup.array()
    .of(
      Yup.object({
        title: Yup.string()
          .required('楽曲名は必須です')
          .max(200, '楽曲名は200文字以下にしてください')
          .test('sanitize', '楽曲名に無効な文字が含まれています', function (value) {
            if (!value) return true;
            try {
              validateAndSanitizeInput(value, 200);
              return true;
            } catch {
              return false;
            }
          }),
        note: Yup.string()
          .max(500, 'ノートは500文字以下にしてください')
          .test('sanitize', 'ノートに無効な文字が含まれています', function (value) {
            if (!value) return true;
            try {
              validateAndSanitizeInput(value, 500);
              return true;
            } catch {
              return false;
            }
          }),
      }),
    )
    .min(1, '少なくとも1曲は必要です')
    .max(20, '楽曲は20曲以下にしてください'),
});

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
  const [expandedOptions, setExpandedOptions] = useState(false);
  const { data: songsData } = useQuery(GET_SONGS);
  const songs = useMemo(() => songsData?.songs || [], [songsData]);

  return (
    <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}
      >
        {title}
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(formik) => {
          const { values } = formik;

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
                <Alert severity="info" sx={{ mb: 2 }}>
                  楽曲の追加は最大20曲までです。
                </Alert>

                <FieldArray name="items">
                  {({ push, remove, move }) => {
                    const handleDragEnd = (result: DropResult) => {
                      if (!result.destination) return;

                      const sourceIndex = result.source.index;
                      const destinationIndex = result.destination.index;

                      move(sourceIndex, destinationIndex);
                    };

                    return (
                      <>
                        {enableDragAndDrop ? (
                          <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="setlist-items">
                              {(provided) => (
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
                          disabled={values.items.length >= 20}
                        >
                          {values.items.length >= 20 ? '楽曲は20曲まで' : '楽曲を追加'}
                        </Button>
                      </>
                    );
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
                <Button type="submit" disabled={loading} size="large">
                  {loading ? loadingButtonText : submitButtonText}
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
}
