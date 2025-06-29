import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { SetlistThemeProps } from './types'

export const MQTN2Theme: React.FC<SetlistThemeProps> = ({ data, className }) => {
  const { bandName, eventName, eventDate, openTime, startTime, items, qrCodeURL } = data

  // Dynamic font size based on number of songs - MQTN2 uses more complex scaling
  const getFontSize = (count: number): string => {
    if (count <= 3) return '3.5rem'
    if (count <= 5) return '2.8rem'
    if (count <= 8) return '2.2rem'
    if (count <= 12) return '1.8rem'
    if (count <= 18) return '1.4rem'
    if (count <= 25) return '1.2rem'
    if (count <= 35) return '1rem'
    return '0.9rem'
  }

  const fontSize = getFontSize(items.length)

  return (
    <Paper
      className={className}
      sx={{
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        position: 'relative',
        padding: 0,
        background: `
          radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, #f093fb 0%, transparent 50%),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `,
        overflow: 'hidden',
      }}
    >
      {/* Main Content Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '297mm',
          padding: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 2,
          boxShadow: `
            0 8px 32px 0 rgba(31, 38, 135, 0.37),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
        }}
      >
        {/* Header with Large MQTN Logo */}
        <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
          <Box sx={{ mb: 3 }}>
            <img
              src="/MQTN_LOGO_white_ver_nonback.png"
              alt="MQTN Logo"
              style={{
                width: '120px',
                height: 'auto',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            />
          </Box>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: `calc(${fontSize} * 1.3)`,
              fontWeight: 'bold',
              color: '#ffffff',
              mb: 2,
              letterSpacing: '0.05em',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {bandName}
          </Typography>

          {eventName && (
            <Typography
              variant="h4"
              sx={{
                fontSize: `calc(${fontSize} * 0.9)`,
                color: 'rgba(255,255,255,0.9)',
                mb: 2,
                letterSpacing: '0.03em',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {eventName}
            </Typography>
          )}

          {eventDate && (
            <Typography
              sx={{
                fontSize: `calc(${fontSize} * 0.7)`,
                color: 'rgba(255,255,255,0.8)',
                mb: 1,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {eventDate}
            </Typography>
          )}

          {(openTime || startTime) && (
            <Typography
              sx={{
                fontSize: `calc(${fontSize} * 0.7)`,
                color: 'rgba(255,255,255,0.8)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {openTime && `OPEN: ${openTime}`}
              {openTime && startTime && ' / '}
              {startTime && `START: ${startTime}`}
            </Typography>
          )}
        </Box>

        {/* QR Code */}
        {qrCodeURL && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 70,
              height: 70,
              backgroundColor: 'rgba(255,255,255,0.9)',
              padding: 1,
              borderRadius: 1,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
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

        {/* Songs List */}
        <Box sx={{ mt: 4 }}>
          {items.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1.5,
                gap: 2,
                backgroundColor:
                  index % 2 === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
                padding: 2,
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: fontSize,
                  fontWeight: 'bold',
                  color: '#ffffff',
                  minWidth: '50px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {index + 1}
              </Typography>

              <Typography
                sx={{
                  fontSize: fontSize,
                  color: '#ffffff',
                  flex: 1,
                  fontWeight: '500',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {item.title}
              </Typography>

              {item.note && (
                <Typography
                  sx={{
                    fontSize: `calc(${fontSize} * 0.8)`,
                    color: 'rgba(255,255,255,0.7)',
                    fontStyle: 'italic',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    padding: '4px 8px',
                    borderRadius: 1,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {item.note}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  )
}
