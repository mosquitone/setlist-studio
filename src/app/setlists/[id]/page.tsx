'use client';

import React, { useState } from 'react';
import {
  Container,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'next/navigation';
import { GET_SETLIST, TOGGLE_SETLIST_VISIBILITY } from '@/lib/server/graphql/apollo-operations';
import { SetlistData } from '@/components/setlist-themes/types';
import { ImageGenerator } from '@/components/setlist/ImageGenerator';
import { SetlistActions } from '@/components/setlist/SetlistActions';
import { SetlistPreview } from '@/components/setlist/SetlistPreview';
import { useSetlistActions } from '@/hooks/useSetlistActions';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useAuth } from '@/components/providers/AuthProvider';
import { SetlistProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SetlistDetailPage() {
  const params = useParams();
  const setlistId = params.id as string;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'black' | 'white' | null>(null);
  const [themeInitialized, setThemeInitialized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  const { data, loading, error } = useQuery(GET_SETLIST, {
    variables: { id: setlistId },
    skip: !setlistId,
  });

  const [toggleVisibility] = useMutation(TOGGLE_SETLIST_VISIBILITY);

  const { handleEdit, handleDelete, handleShare, handleDuplicate, deleteLoading } =
    useSetlistActions({ setlistId, setlist: data?.setlist });

  const isOwner = React.useMemo(() => {
    return isLoggedIn && user && data?.setlist && data.setlist.userId === user.id;
  }, [isLoggedIn, user, data?.setlist]);

  const handleToggleVisibility = async () => {
    try {
      await toggleVisibility({ variables: { id: setlistId } });
      // Force page reload to refresh data with correct authentication context
      window.location.reload();
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  const {
    isGeneratingPreview,
    previewImage,
    showDebug,
    handleDownloadReady,
    handlePreviewReady,
    handlePreviewGenerationStart,
    handleDownload: onDownload,
    handleDebugToggle,
  } = useImageGeneration({
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  // Initialize selectedTheme with the saved theme from database (only once)
  React.useEffect(() => {
    if (data?.setlist && !themeInitialized) {
      if (
        data.setlist.theme &&
        (data.setlist.theme === 'black' || data.setlist.theme === 'white')
      ) {
        setSelectedTheme(data.setlist.theme);
      } else {
        // Fallback to black if no theme is saved
        setSelectedTheme('black');
      }
      setThemeInitialized(true);
    }
  }, [data?.setlist, themeInitialized]);

  // setlistDataを安全に作成
  const setlistData: SetlistData | null = data?.setlist
    ? {
        id: data.setlist.id,
        title: data.setlist.title,
        bandName: data.setlist.bandName,
        eventName: data.setlist.eventName,
        eventDate: data.setlist.eventDate,
        openTime: data.setlist.openTime,
        startTime: data.setlist.startTime,
        theme: data.setlist.theme,
        items: [...data.setlist.items].sort((a, b) => a.order - b.order),
      }
    : null;

  const handleThemeChange = (theme: 'black' | 'white') => {
    setSelectedTheme(theme);
  };

  return (
    <SetlistProtectedRoute
      setlistData={data?.setlist}
      isLoading={loading || authLoading}
      error={error}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* データがない場合はSetlistProtectedRouteがハンドリング */}
        {!setlistData ? null /* テーマ初期化中の場合はローディングを表示 */ : selectedTheme ===
          null ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Success Banner */}
            {showSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Setlist Generated !
              </Alert>
            )}

            <SetlistActions
              onEdit={handleEdit}
              onDownload={onDownload}
              onShare={handleShare}
              onDuplicate={handleDuplicate}
              selectedTheme={selectedTheme}
              onThemeChange={handleThemeChange}
              showDebugToggle={isDev}
              showDebug={showDebug}
              onDebugToggle={handleDebugToggle}
              isPublic={data?.setlist?.isPublic}
              onToggleVisibility={handleToggleVisibility}
              isOwner={isOwner}
            />

            {setlistData && (
              <>
                <SetlistPreview
                  data={{ ...setlistData, theme: selectedTheme }}
                  selectedTheme={selectedTheme}
                  showDebug={showDebug}
                  isGeneratingPreview={isGeneratingPreview}
                  previewImage={previewImage}
                  qrCodeURL={`${typeof window !== 'undefined' ? window.location.origin : ''}/setlists/${setlistId}`}
                />

                <Box sx={{ display: 'none' }}>
                  <ImageGenerator
                    data={{ ...setlistData, theme: selectedTheme }}
                    selectedTheme={selectedTheme}
                    onDownloadReady={handleDownloadReady}
                    onPreviewReady={handlePreviewReady}
                    onPreviewGenerationStart={handlePreviewGenerationStart}
                  />
                </Box>
              </>
            )}

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
              <DialogTitle>セットリストを削除</DialogTitle>
              <DialogContent>
                <Typography>
                  「{data?.setlist?.title}」を削除してもよろしいですか？ この操作は取り消せません。
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
                <Button onClick={handleDelete} color="error" disabled={deleteLoading}>
                  {deleteLoading ? '削除中...' : '削除'}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Container>
    </SetlistProtectedRoute>
  );
}
