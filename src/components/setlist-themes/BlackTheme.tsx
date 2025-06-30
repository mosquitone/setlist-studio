import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { SetlistThemeProps } from './types'

export const BlackTheme: React.FC<SetlistThemeProps> = ({ data, className }) => {
  const { bandName, eventName, eventDate, openTime, startTime, items, qrCodeURL } = data

  // A4 dimensions: 210mm x 297mm (roughly 794px x 1123px at 96 DPI)
  const A4_WIDTH = 794
  const A4_HEIGHT = 1123

  // Dynamic font size based on number of songs for A4 compatibility
  const getFontSize = (count: number): string => {
    if (count <= 8) return '24px'
    if (count <= 15) return '20px'
    if (count <= 25) return '18px'
    if (count <= 30) return '16px'
    return '14px'
  }

  const fontSize = getFontSize(items.length)

  return (
    <Paper
      className={className}
      sx={{
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '40px',
        width: `${A4_WIDTH}px`,
        height: `${A4_HEIGHT}px`,
        margin: '0 auto',
        position: 'relative',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
        borderRadius: 0,
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#ffffff',
            mb: 2,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          {bandName}
        </Typography>

        {eventName && (
          <Typography
            variant="h2"
            sx={{
              fontSize: '20px',
              color: '#cccccc',
              mb: 1,
              fontWeight: 400,
            }}
          >
            {eventName}
          </Typography>
        )}

        {/* Event Details */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
          {eventDate && (
            <Typography sx={{ fontSize: '14px', color: '#999999' }}>{eventDate}</Typography>
          )}
          {openTime && (
            <Typography sx={{ fontSize: '14px', color: '#999999' }}>Open: {openTime}</Typography>
          )}
          {startTime && (
            <Typography sx={{ fontSize: '14px', color: '#999999' }}>Start: {startTime}</Typography>
          )}
        </Box>
      </Box>

      {/* QR Code */}
      {qrCodeURL && (
        <Box
          sx={{
            position: 'absolute',
            top: 30,
            right: 30,
            width: 80,
            height: 80,
            backgroundColor: '#ffffff',
            padding: '8px',
            borderRadius: '4px',
          }}
        >
          <img
            src={qrCodeURL}
            alt="QR Code"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      )}

      {/* Setlist Title */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#ffffff',
            textAlign: 'center',
            borderBottom: '2px solid #333333',
            paddingBottom: '8px',
            marginBottom: '20px',
          }}
        >
          SETLIST
        </Typography>
      </Box>

      {/* Songs List */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              padding: '8px 0',
              borderBottom: '1px solid #1a1a1a',
            }}
          >
            <Typography
              sx={{
                fontSize: fontSize,
                fontWeight: 600,
                color: '#ffffff',
                minWidth: '40px',
                textAlign: 'right',
                marginRight: '20px',
              }}
            >
              {(index + 1).toString().padStart(2, '0')}
            </Typography>
            <Typography
              sx={{
                fontSize: fontSize,
                color: '#ffffff',
                flex: 1,
                fontWeight: 400,
              }}
            >
              {item.title}
            </Typography>
            {item.note && (
              <Typography
                sx={{
                  fontSize: `${parseInt(fontSize) - 2}px`,
                  color: '#999999',
                  fontStyle: 'italic',
                  marginLeft: '10px',
                }}
              >
                {item.note}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 'auto', pt: 2, textAlign: 'center', borderTop: '1px solid #333333' }}>
        <Typography sx={{ fontSize: '12px', color: '#666666' }}>
          Generated by Setlist Generator
        </Typography>
      </Box>
    </Paper>
  )
}
