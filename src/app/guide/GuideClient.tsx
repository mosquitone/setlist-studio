'use client';

import {
  Visibility,
  Share,
  Download,
  PersonAdd,
  Lock,
  Public,
  Edit,
  LibraryMusic,
  PlaylistAdd,
  Home,
  Close,
  Check,
  AccountCircle,
  Palette,
  FileCopy,
  PersonOff,
  Email,
  VpnKey,
} from '@mui/icons-material';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Link from 'next/link';
import Script from 'next/script';
import React from 'react';

import GoogleColorIcon from '@/components/common/icons/GoogleColorIcon';
import { StepIcon } from '@/components/common/ui/StepIcon';
import { useI18n } from '@/hooks/useI18n';
import { getGuideArticleSchema, getGuideBreadcrumbSchema } from '@/lib/metadata/pageSchemas';

export default function GuideClient() {
  const { messages } = useI18n();
  const guideArticleSchema = getGuideArticleSchema();
  const guideBreadcrumbSchema = getGuideBreadcrumbSchema();

  return (
    <>
      <Script
        id="guide-article-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideArticleSchema) }}
      />
      <Script
        id="guide-breadcrumb-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideBreadcrumbSchema) }}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Typography variant="h3" component="h1">
              {messages.pages.guide.title}
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
            {messages.pages.guide.subtitle}
          </Typography>
        </Box>

        {/* Setlist Studioとは */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Public sx={{ mr: 2, color: 'primary.main' }} />
              {messages.pages.guide.aboutSection.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {messages.pages.guide.aboutSection.description1}
            </Typography>
            <Typography variant="body1" paragraph>
              {messages.pages.guide.aboutSection.description2}
            </Typography>
            <Alert
              severity="info"
              icon="✨"
              sx={{ mt: 2, mb: 2, bgcolor: '#e3f2fd', borderColor: '#2196f3' }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                {messages.pages.guide.aboutSection.description3}
              </Typography>
            </Alert>
            <Alert severity="info" sx={{ mt: 2 }}>
              {messages.pages.guide.aboutSection.alertInfo}
            </Alert>
          </CardContent>
        </Card>

        {/* 機能比較表 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>
              {messages.pages.guide.featureComparison.title}
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>{messages.pages.guide.featureComparison.features}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PersonOff sx={{ mr: 1, color: 'warning.main' }} />
                        <strong>{messages.pages.guide.featureComparison.unregisteredUser}</strong>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AccountCircle sx={{ mr: 1, color: 'primary.main' }} />
                        <strong>{messages.pages.guide.featureComparison.registeredUser}</strong>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {messages.pages.guide.featureComparison.publicSetlistView}
                    </TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{messages.pages.guide.featureComparison.imageDownload}</TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{messages.pages.guide.featureComparison.setlistShare}</TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>
                      {messages.pages.guide.featureComparison.setlistManagement}
                    </TableCell>
                    <TableCell align="center">
                      <Close sx={{ color: 'error.main' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>{messages.pages.guide.featureComparison.songDatabase}</TableCell>
                    <TableCell align="center">
                      <Close sx={{ color: 'error.main' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>
                      {messages.pages.guide.featureComparison.publicitySettings}
                    </TableCell>
                    <TableCell align="center">
                      <Close sx={{ color: 'error.main' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>
                      {messages.pages.guide.featureComparison.duplicateFunction}
                    </TableCell>
                    <TableCell align="center">
                      <Close sx={{ color: 'error.main' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>
                      {messages.pages.guide.featureComparison.personalDashboard}
                    </TableCell>
                    <TableCell align="center">
                      <Close sx={{ color: 'error.main' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>
                      {messages.pages.guide.featureComparison.profileManagement}
                    </TableCell>
                    <TableCell align="center">
                      <Close sx={{ color: 'error.main' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Check sx={{ color: 'success.main' }} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* アカウント作成の利点 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <PersonAdd sx={{ mr: 2, color: 'warning.main' }} />
              {messages.pages.guide.accountBenefits.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {messages.pages.guide.accountBenefits.description}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <PlaylistAdd sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    {messages.pages.guide.accountBenefits.setlistCreation.title}
                  </Typography>
                  <Typography variant="body2">
                    {messages.pages.guide.accountBenefits.setlistCreation.description}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <LibraryMusic sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    {messages.pages.guide.accountBenefits.songManagement.title}
                  </Typography>
                  <Typography variant="body2">
                    {messages.pages.guide.accountBenefits.songManagement.description}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <Lock sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    {messages.pages.guide.accountBenefits.privateFeatures.title}
                  </Typography>
                  <Typography variant="body2">
                    {messages.pages.guide.accountBenefits.privateFeatures.description}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>{messages.pages.guide.accountBenefits.signUpNow}</strong>{' '}
                {messages.pages.guide.accountBenefits.signUpDescription}
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* 認証・パスワード関連 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Lock sx={{ mr: 2, color: 'secondary.main' }} />
              {messages.pages.guide.authentication.title}
            </Typography>

            <Grid container spacing={3}>
              {/* Google認証 */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GoogleColorIcon sx={{ mr: 2, fontSize: 28 }} />
                    <Typography variant="h6">
                      {messages.pages.guide.authentication.googleAuth.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {messages.pages.guide.authentication.googleAuth.description}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {messages.pages.guide.authentication.googleAuth.authSteps}
                      </Typography>
                      <List dense>
                        <ListItem sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <StepIcon step={1} />
                          </ListItemIcon>
                          <ListItemText
                            primary={messages.pages.guide.authentication.googleAuth.step1}
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <StepIcon step={2} />
                          </ListItemIcon>
                          <ListItemText
                            primary={messages.pages.guide.authentication.googleAuth.step2}
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <StepIcon step={3} />
                          </ListItemIcon>
                          <ListItemText
                            primary={messages.pages.guide.authentication.googleAuth.step3}
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <StepIcon step={4} />
                          </ListItemIcon>
                          <ListItemText
                            primary={messages.pages.guide.authentication.googleAuth.step4}
                          />
                        </ListItem>
                      </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {messages.pages.guide.authentication.googleAuth.benefits.title}
                      </Typography>
                      <List dense>
                        <ListItem sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <Check sx={{ color: 'success.main', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              messages.pages.guide.authentication.googleAuth.benefits.benefit1
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <Check sx={{ color: 'success.main', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              messages.pages.guide.authentication.googleAuth.benefits.benefit2
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <Check sx={{ color: 'success.main', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              messages.pages.guide.authentication.googleAuth.benefits.benefit3
                            }
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    {messages.pages.guide.authentication.googleAuth.note}
                  </Alert>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ mr: 2, color: 'info.main' }} />
                    <Typography variant="h6">
                      {messages.pages.guide.authentication.emailVerification.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {messages.pages.guide.authentication.emailVerification.description}
                  </Typography>
                  <List dense>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <StepIcon step={1} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.authentication.emailVerification.step1}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <StepIcon step={2} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.authentication.emailVerification.step2}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <StepIcon step={3} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.authentication.emailVerification.step3}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <StepIcon step={4} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.authentication.emailVerification.step4}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VpnKey sx={{ mr: 2, color: 'warning.main' }} />
                    <Typography variant="h6">
                      {messages.pages.guide.authentication.passwordReset.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {messages.pages.guide.authentication.passwordReset.description}
                  </Typography>
                  <List dense>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <StepIcon step={1} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.authentication.passwordReset.step1}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <StepIcon step={2} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.authentication.passwordReset.step2}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <StepIcon step={3} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.authentication.passwordReset.step3}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <StepIcon step={4} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.authentication.passwordReset.step4}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 使用方法 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Visibility sx={{ mr: 2, color: 'success.main' }} />
              {messages.pages.guide.publicUsage.title}
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {messages.pages.guide.publicUsage.intro}
            </Typography>

            {/* 各ステップの詳細説明 */}
            <Grid container spacing={3}>
              {/* Step 1 */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    {messages.pages.guide.publicUsage.step1.title}
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ fontWeight: 'bold' }}>
                    {messages.pages.guide.publicUsage.step1.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {messages.pages.guide.publicUsage.step1.details}
                  </Typography>
                </Paper>
              </Grid>

              {/* Step 2 */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    {messages.pages.guide.publicUsage.step2.title}
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ fontWeight: 'bold' }}>
                    {messages.pages.guide.publicUsage.step2.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {messages.pages.guide.publicUsage.step2.details}
                  </Typography>
                </Paper>
              </Grid>

              {/* Step 3 */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Download sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="h6" color="primary">
                      {messages.pages.guide.publicUsage.step3.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph sx={{ fontWeight: 'bold' }}>
                    {messages.pages.guide.publicUsage.step3.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {messages.pages.guide.publicUsage.step3.details}
                  </Typography>
                </Paper>
              </Grid>

              {/* Step 4 */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Share sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="h6" color="primary">
                      {messages.pages.guide.publicUsage.step4.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph sx={{ fontWeight: 'bold' }}>
                    {messages.pages.guide.publicUsage.step4.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {messages.pages.guide.publicUsage.step4.details}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* 使用例 */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                {messages.pages.guide.publicUsage.useCases.title}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Alert severity="success" sx={{ height: '100%' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {messages.pages.guide.publicUsage.useCases.case1.title}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {messages.pages.guide.publicUsage.useCases.case1.description}
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Alert severity="info" sx={{ height: '100%' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {messages.pages.guide.publicUsage.useCases.case2.title}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {messages.pages.guide.publicUsage.useCases.case2.description}
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Alert severity="warning" sx={{ height: '100%' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {messages.pages.guide.publicUsage.useCases.case3.title}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {messages.pages.guide.publicUsage.useCases.case3.description}
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* 各ページ機能詳細 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>
              {messages.pages.guide.pageDetails.title}
            </Typography>

            <Grid container spacing={3}>
              {/* ホームページ */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Home sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6">
                      <Link
                        href="/"
                        style={{
                          color: 'inherit',
                          textDecoration: 'none',
                          borderBottom: '1px dashed currentColor',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                      >
                        {messages.pages.guide.pageDetails.homePage.title}
                      </Link>
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    <strong>{messages.pages.guide.featureComparison.unregisteredUser}:</strong>{' '}
                    {messages.pages.guide.pageDetails.homePage.unregisteredDescription}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>{messages.pages.guide.featureComparison.registeredUser}:</strong>{' '}
                    {messages.pages.guide.pageDetails.homePage.registeredDescription}
                  </Typography>
                  <List dense>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.homePage.feature1}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.homePage.feature2}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.homePage.feature3}`}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* セットリスト詳細 */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Visibility sx={{ mr: 2, color: 'success.main' }} />
                    <Typography variant="h6">
                      {messages.pages.guide.pageDetails.setlistDetail.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {messages.pages.guide.pageDetails.setlistDetail.description}
                  </Typography>
                  <List dense>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <Visibility sx={{ fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.pageDetails.setlistDetail.feature1}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <Palette sx={{ fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.pageDetails.setlistDetail.feature2}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <Download sx={{ fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.pageDetails.setlistDetail.feature3}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <Share sx={{ fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.pageDetails.setlistDetail.feature4}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <Edit sx={{ fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.pageDetails.setlistDetail.feature5}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <FileCopy sx={{ fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={messages.pages.guide.pageDetails.setlistDetail.feature6}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* 楽曲管理 */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LibraryMusic sx={{ mr: 2, color: 'info.main' }} />
                    <Typography variant="h6">
                      <Link
                        href="/songs"
                        style={{
                          color: 'inherit',
                          textDecoration: 'none',
                          borderBottom: '1px dashed currentColor',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                      >
                        {messages.pages.guide.pageDetails.songManagement.title}
                      </Link>
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    <strong>{messages.auth.authRequired}:</strong>{' '}
                    {messages.pages.guide.pageDetails.songManagement.description}
                  </Typography>
                  <List dense>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.songManagement.feature1}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.songManagement.feature2}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.songManagement.feature3}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.songManagement.feature4}`}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* セットリスト作成 */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PlaylistAdd sx={{ mr: 2, color: 'warning.main' }} />
                    <Typography variant="h6">
                      <Link
                        href="/setlists/new"
                        style={{
                          color: 'inherit',
                          textDecoration: 'none',
                          borderBottom: '1px dashed currentColor',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                      >
                        {messages.pages.guide.pageDetails.setlistCreation.title}
                      </Link>
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    <strong>{messages.auth.authRequired}:</strong>{' '}
                    {messages.pages.guide.pageDetails.setlistCreation.description}
                  </Typography>
                  <List dense>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.setlistCreation.feature1}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.setlistCreation.feature2}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.setlistCreation.feature3}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.setlistCreation.feature4}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.setlistCreation.feature5}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.setlistCreation.feature6}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.setlistCreation.feature7}`}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* プロフィール */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountCircle sx={{ mr: 2, color: 'secondary.main' }} />
                    <Typography variant="h6">
                      <Link
                        href="/profile"
                        style={{
                          color: 'inherit',
                          textDecoration: 'none',
                          borderBottom: '1px dashed currentColor',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                      >
                        {messages.pages.guide.pageDetails.profile.title}
                      </Link>
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    <strong>{messages.auth.authRequired}:</strong>{' '}
                    {messages.pages.guide.pageDetails.profile.description}
                  </Typography>
                  <List dense>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.profile.feature1}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.profile.feature2}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.profile.feature3}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.profile.feature4}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.profile.feature5}`}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`• ${messages.pages.guide.pageDetails.profile.feature6}`}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
