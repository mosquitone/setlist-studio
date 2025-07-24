'use client';

import { useMutation, useApolloClient } from '@apollo/client';
import {
  PlaylistPlay as PlaylistPlayIcon,
  Add as AddIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Card,
  Grid,
  Avatar,
  Chip,
  Stack,
  IconButton,
  CardActionArea,
} from '@mui/material';
import Link from 'next/link';
import React, { memo, useCallback, useState } from 'react';

import { SingleDeleteModal } from '@/components/common/SingleDeleteModal';
import { Button } from '@/components/common/ui/Button';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';
import { DELETE_SETLIST, GET_SETLISTS, GET_SETLIST } from '@/lib/server/graphql/apollo-operations';
import { THEMES } from '@/types/common';

import { Setlist } from '../../types/graphql';

interface SetlistCardProps {
  setlist: Setlist;
  messages: Record<string, any>;
  onDeleteClick: (setlist: Setlist, event: React.MouseEvent) => void;
}

const SetlistCard = memo(({ setlist, messages, onDeleteClick }: SetlistCardProps) => {
  const client = useApolloClient();
  const handleDeleteClick = useCallback(
    (event: React.MouseEvent) => {
      onDeleteClick(setlist, event);
    },
    [setlist, onDeleteClick],
  );

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // セットリスト詳細をホバー時にプリフェッチ
  const handleMouseEnter = useCallback(() => {
    client
      .query({
        query: GET_SETLIST,
        variables: { id: setlist.id },
        fetchPolicy: 'cache-only',
      })
      .catch(() => {
        // キャッシュにない場合はバックグラウンドでフェッチ
        client.query({
          query: GET_SETLIST,
          variables: { id: setlist.id },
          fetchPolicy: 'network-only',
        });
      });
  }, [client, setlist.id]);

  return (
    <Card
      onMouseEnter={handleMouseEnter}
      sx={{
        height: 278,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        },
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <CardActionArea
        component={Link}
        href={`/setlists/${setlist.id}`}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${
              setlist.theme === THEMES.WHITE
                ? '#f8fafc 0%, #e2e8f0 100%'
                : '#1e293b 0%, #0f172a 100%'
            })`,
            p: 1.5,
            color: setlist.theme === THEMES.WHITE ? 'text.primary' : 'white',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1.5,
            }}
          >
            <Avatar
              sx={{
                bgcolor: setlist.theme === THEMES.WHITE ? 'primary.main' : 'secondary.main',
                width: 40,
                height: 40,
              }}
            >
              <PlaylistPlayIcon />
            </Avatar>
            <Stack direction="row" spacing={0.5}>
              <Chip
                icon={setlist.isPublic ? <PublicIcon /> : <LockIcon />}
                label={
                  setlist.isPublic
                    ? messages.pages.home.dashboard.public
                    : messages.pages.home.dashboard.private
                }
                size="small"
                sx={{
                  bgcolor: setlist.isPublic ? 'rgba(34, 197, 94, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                  color: setlist.isPublic ? '#16a34a' : '#6b7280',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    fontSize: '0.8rem',
                  },
                }}
              />
              <Chip
                label={
                  setlist.theme === THEMES.WHITE
                    ? messages.pages.home.dashboard.white
                    : messages.pages.home.dashboard.black
                }
                size="small"
                sx={{
                  bgcolor:
                    setlist.theme === THEMES.WHITE
                      ? 'rgba(59, 130, 246, 0.1)'
                      : 'rgba(239, 68, 68, 0.2)',
                  color: setlist.theme === THEMES.WHITE ? 'primary.main' : '#ef4444',
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontSize: '1.1rem',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {setlist.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            {setlist.artistName && (
              <>
                <GroupIcon sx={{ fontSize: 14 }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    opacity: 0.8,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100px',
                  }}
                >
                  {setlist.artistName}
                </Typography>
              </>
            )}
            {setlist.eventName && (
              <>
                <EventIcon sx={{ fontSize: 14, ml: setlist.artistName ? 1 : 0 }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    opacity: 0.8,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100px',
                  }}
                >
                  {setlist.eventName}
                </Typography>
              </>
            )}
          </Box>
          {setlist.eventDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <ScheduleIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {(() => {
                  const date = new Date(setlist.eventDate);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  return `${year}/${month}/${day}`;
                })()}
              </Typography>
            </Box>
          )}
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.8rem',
              opacity: 0.7,
              mt: 'auto',
              mb: 1,
            }}
          >
            {setlist.items.length} {messages.pages.home.dashboard.songsCount}
          </Typography>
        </Box>
      </CardActionArea>
      <Box
        sx={{
          p: 1.5,
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          component={Link}
          href={`/setlists/${setlist.id}/edit`}
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
          sx={{
            borderRadius: 3,
            fontSize: '0.75rem',
            py: 0.75,
            px: 2,
            textTransform: 'none',
            borderColor: 'primary.main',
            color: 'primary.main',
            bgcolor: 'transparent',
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'white',
              borderColor: 'primary.main',
            },
            fontWeight: 600,
            minWidth: 80,
          }}
          onClick={handleEditClick}
        >
          {messages.pages.home.dashboard.edit}
        </Button>
        <IconButton
          onClick={handleDeleteClick}
          sx={{
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.lighter',
              color: 'error.dark',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <DeleteIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Card>
  );
});

SetlistCard.displayName = 'SetlistCard';

interface SetlistDashboardProps {
  setlistsData: { setlists: Setlist[] } | undefined;
  setlistsLoading: boolean;
}

export function SetlistDashboard({ setlistsData, setlistsLoading }: SetlistDashboardProps) {
  const { messages } = useI18n();
  const { showSuccess, showError } = useSnackbar();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setlistToDelete, setSetlistToDelete] = useState<Setlist | null>(null);

  const [deleteSetlist, { loading: deleteLoading }] = useMutation(DELETE_SETLIST, {
    refetchQueries: [{ query: GET_SETLISTS }],
    onCompleted: (data) => {
      setDeleteDialogOpen(false);
      if (data.deleteSetlist.success && data.deleteSetlist.deletedSetlist) {
        showSuccess(
          `「${data.deleteSetlist.deletedSetlist.title}」${messages.notifications.setlistDeleted}`,
        );
      }
      setSetlistToDelete(null);
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const handleDeleteClick = useCallback((setlist: Setlist, event: React.MouseEvent) => {
    event.stopPropagation();
    setSetlistToDelete(setlist);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (setlistToDelete) {
      try {
        await deleteSetlist({ variables: { id: setlistToDelete.id } });
      } catch (error) {
        console.error('Failed to delete setlist:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSetlistToDelete(null);
  };
  if (setlistsLoading) {
    return (
      <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          {messages.pages.home.dashboard.title}
        </Typography>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {messages.pages.home.dashboard.loading}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!setlistsData?.setlists?.length) {
    return (
      <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          {messages.pages.home.dashboard.title}
        </Typography>
        <Card sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
          <PlaylistPlayIcon sx={{ fontSize: 64, color: 'grey.400', mb: 3 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            {messages.pages.home.dashboard.empty.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {messages.pages.home.dashboard.empty.description}
          </Typography>
          <Button
            component={Link}
            href="/setlists/new"
            startIcon={<AddIcon />}
            size="large"
            sx={{ borderRadius: 3 }}
          >
            {messages.pages.home.dashboard.empty.createButton}
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        {messages.pages.home.dashboard.title}
      </Typography>
      <Grid container spacing={2}>
        {setlistsData.setlists.map((setlist: Setlist) => (
          <Grid item xs={12} sm={6} md={4} key={setlist.id}>
            <SetlistCard setlist={setlist} messages={messages} onDeleteClick={handleDeleteClick} />
          </Grid>
        ))}
      </Grid>

      <SingleDeleteModal
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={messages.pages.home.dashboard.delete.title}
        itemName={setlistToDelete?.title || ''}
        itemType={messages.pages.home.dashboard.delete.itemType}
        loading={deleteLoading}
      />
    </Box>
  );
}
