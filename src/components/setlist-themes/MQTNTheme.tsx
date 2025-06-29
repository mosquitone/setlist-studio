import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { SetlistThemeProps } from './types';

export const MQTNTheme: React.FC<SetlistThemeProps> = ({ data, className }) => {
  const { bandName, eventName, eventDate, openTime, startTime, items, qrCodeURL } = data;
  
  // Dynamic font size based on number of songs
  const getFontSize = (count: number): string => {
    if (count <= 8) return '2em';
    if (count <= 15) return '1.5em';
    if (count <= 25) return '1.2em';
    if (count <= 30) return '1em';
    return '0.75em';
  };

  const fontSize = getFontSize(items.length);

  return (
    <Paper
      className={className}
      sx={{
        backgroundColor: '#1b1c1d',
        color: 'rgba(255,255,255,.9)',
        padding: 3,
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        minHeight: '600px',
        backgroundImage: 'url(/soft-wallpaper.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(27, 28, 29, 0.8)',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header with Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: fontSize,
                fontWeight: 'bold',
                color: 'rgba(255,255,255,.9)',
                mb: 1,
              }}
            >
              {bandName}
            </Typography>
            {eventName && (
              <Typography
                variant="h6"
                sx={{
                  fontSize: `calc(${fontSize} * 0.7)`,
                  color: 'rgba(255,255,255,.7)',
                }}
              >
                {eventName}
              </Typography>
            )}
            {eventDate && (
              <Typography
                sx={{
                  fontSize: `calc(${fontSize} * 0.6)`,
                  color: 'rgba(255,255,255,.6)',
                }}
              >
                {eventDate}
              </Typography>
            )}
            {(openTime || startTime) && (
              <Typography
                sx={{
                  fontSize: `calc(${fontSize} * 0.6)`,
                  color: 'rgba(255,255,255,.6)',
                }}
              >
                {openTime && `開場: ${openTime}`}
                {openTime && startTime && ' / '}
                {startTime && `開演: ${startTime}`}
              </Typography>
            )}
          </Box>

          {/* Logo */}
          <Box sx={{ width: 80, height: 80 }}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </Box>
        </Box>

        {/* QR Code */}
        {qrCodeURL && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 60,
              height: 60,
              zIndex: 2,
            }}
          >
            <img
              src={qrCodeURL}
              alt="QR Code"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: 'white',
                padding: '4px',
                borderRadius: '4px',
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
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: 1,
                borderRadius: 1,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography
                sx={{
                  fontSize: fontSize,
                  fontWeight: 'bold',
                  color: 'rgba(255,255,255,.9)',
                  minWidth: '40px',
                }}
              >
                {index + 1}.
              </Typography>
              <Typography
                sx={{
                  fontSize: fontSize,
                  color: 'rgba(255,255,255,.9)',
                  flex: 1,
                }}
              >
                {item.title}
              </Typography>
              {item.note && (
                <Typography
                  sx={{
                    fontSize: `calc(${fontSize} * 0.8)`,
                    color: 'rgba(255,255,255,.6)',
                    fontStyle: 'italic',
                  }}
                >
                  ({item.note})
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};