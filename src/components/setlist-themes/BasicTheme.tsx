import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { SetlistThemeProps } from './types';

export const BasicTheme: React.FC<SetlistThemeProps> = ({ data, className }) => {
  const { bandName, eventName, items, qrCodeURL } = data;
  
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
        backgroundColor: '#fefefe',
        border: '1px solid #ccc',
        padding: 3,
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        minHeight: '600px',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: fontSize,
            fontWeight: 'bold',
            color: '#333',
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
              color: '#666',
            }}
          >
            {eventName}
          </Typography>
        )}
      </Box>

      {/* QR Code */}
      {qrCodeURL && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 50,
            height: 50,
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
              mb: 1,
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: fontSize,
                fontWeight: 'bold',
                color: '#333',
                minWidth: '40px',
              }}
            >
              {index + 1}.
            </Typography>
            <Typography
              sx={{
                fontSize: fontSize,
                color: '#333',
                flex: 1,
              }}
            >
              {item.title}
            </Typography>
            {item.note && (
              <Typography
                sx={{
                  fontSize: `calc(${fontSize} * 0.8)`,
                  color: '#666',
                  fontStyle: 'italic',
                }}
              >
                ({item.note})
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};