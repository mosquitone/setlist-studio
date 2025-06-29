import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { SetlistThemeProps } from './types'

export const MinimalTheme: React.FC<SetlistThemeProps> = ({ data, className }) => {
  const { bandName, eventName, eventDate, openTime, startTime, items, qrCodeURL } = data

  // Dynamic font size based on number of songs - Minimal uses larger fonts
  const getFontSize = (count: number): string => {
    if (count <= 5) return '3.5rem'
    if (count <= 8) return '2.5rem'
    if (count <= 12) return '2rem'
    if (count <= 18) return '1.5rem'
    if (count <= 25) return '1.2rem'
    return '1rem'
  }

  const fontSize = getFontSize(items.length)

  return (
    <Paper
      className={className}
      sx={{
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: 4,
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        position: 'relative',
        border: '2px solid #000000',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'serif',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: `calc(${fontSize} * 1.2)`,
            fontWeight: 'bold',
            color: '#000000',
            mb: 2,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {bandName}
        </Typography>
        {eventName && (
          <Typography
            variant="h4"
            sx={{
              fontSize: `calc(${fontSize} * 0.8)`,
              color: '#000000',
              mb: 1,
              letterSpacing: '0.05em',
            }}
          >
            {eventName}
          </Typography>
        )}
        {eventDate && (
          <Typography
            sx={{
              fontSize: `calc(${fontSize} * 0.6)`,
              color: '#000000',
              mb: 1,
            }}
          >
            {eventDate}
          </Typography>
        )}
        {(openTime || startTime) && (
          <Typography
            sx={{
              fontSize: `calc(${fontSize} * 0.6)`,
              color: '#000000',
            }}
          >
            {openTime && `OPEN: ${openTime}`}
            {openTime && startTime && ' / '}
            {startTime && `START: ${startTime}`}
          </Typography>
        )}
      </Box>

      {/* Songs List */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 3,
              borderBottom: '1px solid #e0e0e0',
              paddingBottom: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: fontSize,
                fontWeight: 'bold',
                color: '#000000',
                minWidth: '60px',
                letterSpacing: '0.05em',
              }}
            >
              {(index + 1).toString().padStart(2, '0')}.
            </Typography>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: fontSize,
                  color: '#000000',
                  fontWeight: 'bold',
                  letterSpacing: '0.02em',
                  lineHeight: 1.3,
                }}
              >
                {item.title.toUpperCase()}
              </Typography>
              {item.note && (
                <Typography
                  sx={{
                    fontSize: `calc(${fontSize} * 0.7)`,
                    color: '#666666',
                    fontStyle: 'italic',
                    mt: 0.5,
                  }}
                >
                  {item.note}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Footer with QR Code */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {qrCodeURL && (
          <Box
            sx={{
              width: 80,
              height: 80,
              border: '2px solid #000000',
              padding: 1,
              backgroundColor: '#ffffff',
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
      </Box>
    </Paper>
  )
}
