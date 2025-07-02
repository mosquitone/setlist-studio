import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert,
} from '@mui/material';
import { Visibility, Share, Download, QrCode, PersonAdd, Lock, Public } from '@mui/icons-material';

// 静的生成を強制
export const dynamic = 'force-static';

export default function GuidePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Setlist Studio 利用ガイド
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          認証不要でも利用できる機能について
        </Typography>
      </Box>

      {/* パブリックセットリストについて */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Public sx={{ mr: 2, color: 'success.main' }} />
            パブリックセットリストとは
          </Typography>
          <Typography variant="body1" paragraph>
            Setlist Studioでは、セットリストを「パブリック（公開）」として設定することで、
            アカウント登録やログインなしでも誰でも閲覧できるセットリストを作成できます。
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            パブリックセットリストは、共有URLを知っている誰でもアクセス可能です。
          </Alert>
        </CardContent>
      </Card>

      {/* 認証不要で利用できる機能 */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            認証不要で利用できる機能
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Visibility sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">セットリスト閲覧</Typography>
                </Box>
                <Typography variant="body2">
                  パブリックセットリストの詳細情報を閲覧できます。楽曲リスト、バンド名、イベント情報などが確認できます。
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Download sx={{ mr: 2, color: 'success.main' }} />
                  <Typography variant="h6">画像ダウンロード</Typography>
                </Box>
                <Typography variant="body2">
                  セットリストをプロフェッショナルな画像として生成・ダウンロードできます。2つのテーマから選択可能です。
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Share sx={{ mr: 2, color: 'info.main' }} />
                  <Typography variant="h6">共有機能</Typography>
                </Box>
                <Typography variant="body2">
                  セットリストのURLをコピーして他の人と共有できます。SNSでの拡散も簡単です。
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <QrCode sx={{ mr: 2, color: 'secondary.main' }} />
                  <Typography variant="h6">QRコード</Typography>
                </Box>
                <Typography variant="body2">
                  生成された画像には自動的にQRコードが含まれ、モバイルデバイスでの素早いアクセスが可能です。
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 使用方法 */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            パブリックセットリストの使用方法
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  1
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="共有URLにアクセス"
                secondary="パブリックセットリストの共有URLをクリックまたは入力してアクセスします"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  2
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="セットリストを確認"
                secondary="楽曲リスト、バンド情報、イベント詳細などを確認します"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  3
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="テーマを選択"
                secondary="Black（黒）またはWhite（白）テーマから選択できます"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  4
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="画像をダウンロード"
                secondary="「Download」ボタンをクリックして高品質な画像をダウンロードします"
              />
            </ListItem>
          </List>
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
            アカウント作成でさらに便利に
          </Typography>
          <Typography variant="body1" paragraph>
            アカウントを作成すると、以下の追加機能が利用できます：
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Lock sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="プライベートセットリスト"
                secondary="非公開のセットリストを作成・管理できます"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonAdd sx={{ color: 'info.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="セットリスト作成・編集"
                secondary="独自のセットリストを作成し、いつでも編集できます"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Share sx={{ color: 'success.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="複製機能"
                secondary="他のセットリストを複製して、カスタマイズできます"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* フッター */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Setlist Studio - バンド向けセットリスト生成ツール
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          パブリックセットリストは認証不要でご利用いただけます
        </Typography>
      </Box>
    </Container>
  );
}
