'use client';

import {
  Edit as EditIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  ContentCopy as DuplicateIcon,
  ExpandMore as ExpandMoreIcon,
  Public as PublicIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React from 'react';

import { Button } from '@/components/common/ui/Button';
import { useI18n } from '@/components/providers/I18nProvider';
import { Theme } from '@/types/common';

interface SetlistActionsProps {
  onEdit: () => void;
  onDownload: () => void;
  onShare: () => void;
  onDuplicate: () => void;
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  showDebugToggle?: boolean;
  showDebug?: boolean;
  onDebugToggle?: () => void;
  isPublic?: boolean;
  onToggleVisibility?: () => void;
  isOwner?: boolean;
}

export const SetlistActions = React.memo(function SetlistActions({
  onEdit,
  onDownload,
  onShare,
  onDuplicate,
  selectedTheme,
  onThemeChange,
  showDebugToggle = false,
  showDebug = false,
  onDebugToggle,
  isPublic = false,
  onToggleVisibility,
  isOwner = true,
}: SetlistActionsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { messages } = useI18n();

  if (isMobile) {
    // モバイル版: 縦積み表示
    return (
      <Stack spacing={2} sx={{ mb: 3 }}>
        {/* アクションボタン群 */}
        <Stack spacing={1}>
          {/* 編集系ボタン（オーナーのみ） */}
          {isOwner && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={onEdit}
                size="small"
                sx={{
                  flex: 1,
                  fontSize: '0.75rem',
                  px: 1,
                }}
              >
                {messages.common.edit}
              </Button>
              <Button
                variant="outlined"
                startIcon={<DuplicateIcon />}
                onClick={onDuplicate}
                size="small"
                sx={{
                  flex: 1,
                  fontSize: '0.75rem',
                  px: 1,
                }}
              >
                {messages.setlistDetail.actions.duplicate}
              </Button>
            </Stack>
          )}

          {/* 共有系ボタン（全ユーザー） */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={onDownload}
              size="small"
              sx={{
                flex: 1,
                fontSize: '0.75rem',
                px: 1,
              }}
            >
              {messages.setlistDetail.actions.download}
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={onShare}
              size="small"
              sx={{
                flex: 1,
                fontSize: '0.75rem',
                px: 1,
              }}
            >
              {messages.setlistDetail.actions.share}
            </Button>
          </Stack>
        </Stack>

        {/* 設定・ツール群 */}
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
          {/* 公開/非公開ボタン（オーナー）または状態表示（非オーナー） */}
          {isOwner && onToggleVisibility ? (
            <Button
              variant={isPublic ? 'contained' : 'outlined'}
              startIcon={isPublic ? <PublicIcon /> : <LockIcon />}
              onClick={onToggleVisibility}
              size="small"
              sx={{
                fontSize: '0.75rem',
                px: 1,
                minWidth: 120,
                whiteSpace: 'nowrap',
                color: isPublic ? 'white' : '#374151',
                backgroundColor: isPublic ? '#10b981' : 'transparent',
                borderColor: isPublic ? '#10b981' : '#d1d5db',
                '&:hover': {
                  backgroundColor: isPublic ? '#059669' : 'rgba(17, 24, 39, 0.05)',
                  borderColor: isPublic ? '#059669' : '#9ca3af',
                },
              }}
            >
              {isPublic
                ? messages.setlistDetail.actions.makePrivate
                : messages.setlistDetail.actions.makePublic}
            </Button>
          ) : (
            !isOwner && (
              <Tooltip
                title={
                  isPublic
                    ? `${messages.common.public}${messages.common.setlist}`
                    : `${messages.common.private}${messages.common.setlist}`
                }
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: isPublic ? '#10b981' : '#6b7280',
                    backgroundColor: isPublic
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(156, 163, 175, 0.1)',
                    borderRadius: 1,
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.75rem',
                  }}
                >
                  {isPublic ? <PublicIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                  {isPublic ? messages.common.public : messages.common.private}
                </Box>
              </Tooltip>
            )
          )}

          {showDebugToggle && onDebugToggle && (
            <Button
              variant={showDebug ? undefined : 'outlined'}
              onClick={onDebugToggle}
              size="small"
              sx={{
                minWidth: '60px',
                fontSize: '0.75rem',
                color: showDebug ? 'white' : 'text.secondary',
                borderColor: showDebug ? 'primary.main' : 'grey.400',
                backgroundColor: showDebug ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: showDebug ? 'primary.dark' : 'grey.50',
                },
              }}
            >
              {showDebug ? 'DOM' : 'IMG'}
            </Button>
          )}

          {isOwner && (
            <FormControl size="small">
              <Select
                value={selectedTheme}
                onChange={(e) => onThemeChange(e.target.value as Theme)}
                displayEmpty
                IconComponent={ExpandMoreIcon}
                sx={{ minWidth: 120 }}
                inputProps={{
                  'aria-label': messages.common.theme,
                }}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  slotProps: {
                    paper: {
                      sx: {
                        mt: 1,
                      },
                    },
                  },
                }}
                renderValue={(value) => {
                  if (value === 'black')
                    return `${messages.common.theme}: ${messages.common.basicBlack}`;
                  if (value === 'white')
                    return `${messages.common.theme}: ${messages.common.basicWhite}`;
                  return `${messages.common.theme}: ${messages.common.basicBlack}`;
                }}
              >
                <MenuItem value="black" role="option">
                  {messages.common.basicBlack}
                </MenuItem>
                <MenuItem value="white" role="option">
                  {messages.common.basicWhite}
                </MenuItem>
              </Select>
            </FormControl>
          )}
        </Stack>
      </Stack>
    );
  }

  // デスクトップ版: 横並び表示
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {isOwner && (
          <Button variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>
            {messages.common.edit}
          </Button>
        )}
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={onDownload}>
          {messages.setlistDetail.actions.download}
        </Button>
        <Button variant="outlined" startIcon={<ShareIcon />} onClick={onShare}>
          {messages.setlistDetail.actions.share}
        </Button>
        {isOwner && (
          <Button variant="outlined" startIcon={<DuplicateIcon />} onClick={onDuplicate}>
            {messages.setlistDetail.actions.duplicate}
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {isOwner && onToggleVisibility && (
          <Button
            variant={isPublic ? 'contained' : 'outlined'}
            startIcon={isPublic ? <PublicIcon /> : <LockIcon />}
            onClick={onToggleVisibility}
            sx={{
              minWidth: 140,
              whiteSpace: 'nowrap',
              color: isPublic ? 'white' : '#374151',
              backgroundColor: isPublic ? '#10b981' : 'transparent',
              borderColor: isPublic ? '#10b981' : '#d1d5db',
              '&:hover': {
                backgroundColor: isPublic ? '#059669' : 'rgba(17, 24, 39, 0.05)',
                borderColor: isPublic ? '#059669' : '#9ca3af',
              },
            }}
          >
            {isPublic
              ? messages.setlistDetail.actions.makePrivate
              : messages.setlistDetail.actions.makePublic}
          </Button>
        )}
        {!isOwner && (
          <Tooltip
            title={
              isPublic
                ? `${messages.common.public}${messages.common.setlist}`
                : `${messages.common.private}${messages.common.setlist}`
            }
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: isPublic ? '#10b981' : '#6b7280',
                backgroundColor: isPublic ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                borderRadius: 1,
                px: 2,
                py: 1,
                fontSize: '0.875rem',
              }}
            >
              {isPublic ? <PublicIcon fontSize="small" /> : <LockIcon fontSize="small" />}
              {isPublic ? messages.common.public : messages.common.private}
            </Box>
          </Tooltip>
        )}
        {showDebugToggle && onDebugToggle && (
          <Button
            variant={showDebug ? undefined : 'outlined'}
            onClick={onDebugToggle}
            size="small"
            sx={{
              minWidth: '60px',
              fontSize: '0.75rem',
              color: showDebug ? 'white' : 'text.secondary',
              borderColor: showDebug ? 'primary.main' : 'grey.400',
              backgroundColor: showDebug ? 'primary.main' : 'transparent',
              '&:hover': {
                backgroundColor: showDebug ? 'primary.dark' : 'grey.50',
              },
            }}
          >
            {showDebug ? 'DOM' : 'IMG'}
          </Button>
        )}

        {isOwner && (
          <FormControl size="small">
            <Select
              value={selectedTheme}
              onChange={(e) => onThemeChange(e.target.value as Theme)}
              displayEmpty
              IconComponent={ExpandMoreIcon}
              sx={{ minWidth: 140 }}
              inputProps={{
                'aria-label': messages.common.theme,
              }}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                slotProps: {
                  paper: {
                    sx: {
                      mt: 1,
                    },
                  },
                },
              }}
              renderValue={(value) => {
                if (value === 'black')
                  return `${messages.common.theme}: ${messages.common.basicBlack}`;
                if (value === 'white')
                  return `${messages.common.theme}: ${messages.common.basicWhite}`;
                return `${messages.common.theme}: ${messages.common.basicBlack}`;
              }}
            >
              <MenuItem value="black" role="option">
                {messages.common.basicBlack}
              </MenuItem>
              <MenuItem value="white" role="option">
                {messages.common.basicWhite}
              </MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>
    </Box>
  );
});
