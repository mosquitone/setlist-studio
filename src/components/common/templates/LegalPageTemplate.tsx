'use client';

import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

interface LegalPageTemplateProps {
  title: string;
  description: string;
  effectiveDate: string;
  children: React.ReactNode;
}

const LegalPageTemplate: React.FC<LegalPageTemplateProps> = ({
  title,
  description,
  effectiveDate,
  children,
}) => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            {description}
          </Typography>

          {children}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 6 }}>
            制定日：{effectiveDate}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LegalPageTemplate;
