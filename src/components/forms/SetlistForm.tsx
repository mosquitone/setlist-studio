'use client';

import { useQuery } from '@apollo/client';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Add as AddIcon } from '@mui/icons-material';
import { Box, Container, Typography, Paper, Alert } from '@mui/material';
import { Formik, Form, FieldArray } from 'formik';
import React, { useMemo, memo } from 'react';
import * as Yup from 'yup';

import { Button } from '@/components/common/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import { Messages } from '@/lib/i18n/messages';
import { validateAndSanitizeInput } from '@/lib/security/security-utils';
import { GET_SONGS } from '@/lib/server/graphql/apollo-operations';
import { SetlistFormValues } from '@/types/components';

import { SetlistFormFields } from './SetlistFormFields';
import { SongItemInput } from './SongItemInput';

interface SetlistFormProps {
  title: string;
  initialValues: SetlistFormValues;
  onSubmit: (values: SetlistFormValues) => Promise<void>;
  loading: boolean;
  submitButtonText: string;
  enableDragAndDrop?: boolean;
  enableReinitialize?: boolean;
}

/**
 * セットリスト作成・編集フォームコンポーネント
 * ドラッグ&ドロップ対応、バリデーション機能付き
 *
 * @param title - フォームのタイトル
 * @param initialValues - フォームの初期値
 * @param onSubmit - フォーム送信時のハンドラー関数
 * @param loading - 送信中のローディング状態
 * @param submitButtonText - 送信ボタンのテキスト
 * @param enableDragAndDrop - ドラッグ&ドロップ機能の有効/無効
 * @param enableReinitialize - 初期値の動的更新を許可するか（デフォルト: false）
 */

// バリデーションスキーマを関数として定義し、i18nメッセージを動的に取得
const createValidationSchema = (messages: Messages) =>
  Yup.object({
    title: Yup.string()
      .max(100, messages.setlistForm.validation.titleMaxLength)
      .test('sanitize', messages.setlistForm.validation.titleInvalidChars, function (value) {
        if (!value) return true;
        try {
          validateAndSanitizeInput(value, 100);
          return true;
        } catch {
          return false;
        }
      }),
    artistName: Yup.string()
      .required(messages.setlistForm.validation.artistNameRequired)
      .max(100, messages.setlistForm.validation.artistNameMaxLength)
      .test('sanitize', messages.setlistForm.validation.artistNameInvalidChars, function (value) {
        if (!value) return true;
        try {
          validateAndSanitizeInput(value, 100);
          return true;
        } catch {
          return false;
        }
      }),
    eventName: Yup.string()
      .max(200, messages.setlistForm.validation.eventNameMaxLength)
      .test('sanitize', messages.setlistForm.validation.eventNameInvalidChars, function (value) {
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
    theme: Yup.string().required(messages.validation.required),
    items: Yup.array()
      .of(
        Yup.object({
          title: Yup.string()
            .required(
              messages.setlistForm.validation.songTitleRequired || messages.validation.required,
            )
            .max(200, messages.setlistForm.validation.songTitleMaxLength)
            .test(
              'sanitize',
              messages.setlistForm.validation.songTitleInvalidChars,
              function (value) {
                if (!value) return true;
                try {
                  validateAndSanitizeInput(value, 200);
                  return true;
                } catch {
                  return false;
                }
              },
            ),
          note: Yup.string()
            .max(20, messages.setlistForm.validation.songNoteMaxLength)
            .test(
              'sanitize',
              messages.setlistForm.validation.songNoteInvalidChars,
              function (value) {
                if (!value) return true;
                try {
                  validateAndSanitizeInput(value, 20);
                  return true;
                } catch {
                  return false;
                }
              },
            ),
        }),
      )
      .min(1, messages.setlistForm.validation.minSongsRequired)
      .max(20, messages.setlistForm.validation.maxSongsExceeded),
  });

const SetlistForm = memo(function SetlistForm({
  title,
  initialValues,
  onSubmit,
  loading,
  submitButtonText,
  enableDragAndDrop = true,
  enableReinitialize = false,
}: SetlistFormProps) {
  const { data: songsData } = useQuery(GET_SONGS, {
    fetchPolicy: 'cache-first',
  });
  const { messages } = useI18n();
  const songs = useMemo(() => songsData?.songs || [], [songsData]);

  // validationSchemaをメモ化
  const validationSchema = useMemo(() => createValidationSchema(messages), [messages]);

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
        enableReinitialize={enableReinitialize}
        validateOnChange={false}
        validateOnBlur={true}
      >
        {(formik) => {
          const { values } = formik;

          return (
            <Form>
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <SetlistFormFields formik={formik} />
              </Paper>

              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {messages.setlistForm.songsList.title}
                </Typography>
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 2,
                    '& .MuiAlert-icon': {
                      alignItems: 'center',
                    },
                  }}
                >
                  {messages.setlistForm.songsList.maxSongsWarning}
                  <br />
                  {messages.setlistForm.songsList.autoAddInfo}
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
                          {values.items.length >= 20
                            ? messages.setlistForm.songsList.maxSongsWarning
                            : messages.setlistForm.songsList.addSong}
                        </Button>
                      </>
                    );
                  }}
                </FieldArray>
              </Paper>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  type="button"
                  disabled={loading}
                  onClick={() => window.history.back()}
                >
                  {messages.common.cancel}
                </Button>
                <Button type="submit" loading={loading} size="large">
                  {submitButtonText}
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
});

SetlistForm.displayName = 'SetlistForm';

export default SetlistForm;
