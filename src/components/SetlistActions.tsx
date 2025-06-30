'use client'

import React from 'react'
import { Box, Button, FormControl, Select, MenuItem } from '@mui/material'
import {
  Edit as EditIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  ContentCopy as DuplicateIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'

interface SetlistActionsProps {
  onEdit: () => void
  onDownload: () => void
  onShare: () => void
  onDuplicate: () => void
  selectedTheme: 'black' | 'white'
  onThemeChange: (theme: 'black' | 'white') => void
  showDebugToggle?: boolean
  showDebug?: boolean
  onDebugToggle?: () => void
}

export function SetlistActions({
  onEdit,
  onDownload,
  onShare,
  onDuplicate,
  selectedTheme,
  onThemeChange,
  showDebugToggle = false,
  showDebug = false,
  onDebugToggle,
}: SetlistActionsProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>
          Edit
        </Button>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={onDownload}>
          Download
        </Button>
        <Button variant="outlined" startIcon={<ShareIcon />} onClick={onShare}>
          Share
        </Button>
        <Button variant="outlined" startIcon={<DuplicateIcon />} onClick={onDuplicate}>
          Duplicate
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {showDebugToggle && onDebugToggle && (
          <Button
            variant={showDebug ? 'contained' : 'outlined'}
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

        <FormControl size="small">
          <Select
            value={selectedTheme}
            onChange={e => onThemeChange(e.target.value as 'black' | 'white')}
            displayEmpty
            IconComponent={ExpandMoreIcon}
            sx={{ minWidth: 140 }}
            renderValue={value => {
              if (value === 'black') return 'Theme: black'
              if (value === 'white') return 'Theme: white'
              return 'Theme: black'
            }}
          >
            <MenuItem value="black">black</MenuItem>
            <MenuItem value="white">white</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}
