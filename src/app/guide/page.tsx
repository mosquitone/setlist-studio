import React from 'react';
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
} from '@mui/icons-material';

// 静的生成を強制
export const dynamic = 'force-static';

// メタデータ追加
export const metadata = {
  title: '利用ガイド - 機能一覧と使い方',
  description:
    'Setlist Studioの全機能と使い方を詳しく説明します。未登録ユーザーと登録ユーザーの機能比較、セットリスト作成方法、楽曲管理など完全ガイド。',
  keywords: ['セットリスト', '使い方', '機能', 'ガイド', 'バンド', '楽曲管理', 'mosquitone'],
  openGraph: {
    title: '利用ガイド - Setlist Studio',
    description:
      'Setlist Studioの全機能と使い方を詳しく説明します。未登録ユーザーと登録ユーザーの機能比較、セットリスト作成方法、楽曲管理など完全ガイド。',
    type: 'article',
  },
};

export default function GuidePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" component="h1">
            利用ガイド
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          機能一覧と利用方法の完全ガイド
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
            Setlist Studio とは
          </Typography>
          <Typography variant="body1" paragraph>
            Setlist Studioは、バンドや音楽グループのためのセットリスト生成・管理ツールです。
            楽曲情報を管理し、高品質なセットリスト画像を簡単に作成できます。
          </Typography>
          <Typography variant="body1" paragraph>
            セットリストは「パブリック（公開）」と「プライベート（非公開）」で管理でき、
            パブリックセットリストはアカウント登録なしでも閲覧・ダウンロードが可能です。
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            パブリックセットリストは、共有URLを知っている誰でもアクセス可能です。
            プライベートセットリストは所有者のみが閲覧できます。
          </Alert>
        </CardContent>
      </Card>

      {/* 機能比較表 */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            利用可能機能一覧
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>機能</strong>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PersonOff sx={{ mr: 1, color: 'warning.main' }} />
                      <strong>未登録ユーザー</strong>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AccountCircle sx={{ mr: 1, color: 'primary.main' }} />
                      <strong>登録ユーザー</strong>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>パブリックセットリスト閲覧</TableCell>
                  <TableCell align="center">
                    <Check sx={{ color: 'success.main' }} />
                  </TableCell>
                  <TableCell align="center">
                    <Check sx={{ color: 'success.main' }} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>画像ダウンロード（Black/White テーマ）</TableCell>
                  <TableCell align="center">
                    <Check sx={{ color: 'success.main' }} />
                  </TableCell>
                  <TableCell align="center">
                    <Check sx={{ color: 'success.main' }} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>セットリスト共有（URL コピー）</TableCell>
                  <TableCell align="center">
                    <Check sx={{ color: 'success.main' }} />
                  </TableCell>
                  <TableCell align="center">
                    <Check sx={{ color: 'success.main' }} />
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>セットリスト作成・編集・削除</TableCell>
                  <TableCell align="center">
                    <Close sx={{ color: 'error.main' }} />
                  </TableCell>
                  <TableCell align="center">
                    <Check sx={{ color: 'success.main' }} />
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>楽曲データベース管理</TableCell>
                  <TableCell align="center">
                    <Close sx={{ color: 'error.main' }} />
                  </TableCell>
                  <TableCell align="center">
                    <Check sx={{ color: 'success.main' }} />
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>セットリストの公開設定変更</TableCell>
                  <TableCell align="center">
                    <Close sx={{ color: 'error.main' }} />
                  </TableCell>
                  <TableCell align="center">
                    <Check sx={{ color: 'success.main' }} />
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>自分のセットリスト複製機能</TableCell>
                  <TableCell align="center">
                    <Close sx={{ color: 'error.main' }} />
                  </TableCell>
                  <TableCell align="center">
                    <Check sx={{ color: 'success.main' }} />
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>個人ダッシュボード</TableCell>
                  <TableCell align="center">
                    <Close sx={{ color: 'error.main' }} />
                  </TableCell>
                  <TableCell align="center">
                    <Check sx={{ color: 'success.main' }} />
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>プロフィール管理</TableCell>
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
            アカウント作成でさらに便利に
          </Typography>
          <Typography variant="body1" paragraph>
            無料のアカウントを作成すると、パブリック機能に加えて以下の機能が利用できます：
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <PlaylistAdd sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  セットリスト作成
                </Typography>
                <Typography variant="body2">
                  独自のセットリストを無制限に作成・編集できます
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <LibraryMusic sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  楽曲管理
                </Typography>
                <Typography variant="body2">
                  個人の楽曲データベースで曲情報を効率的に管理
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Lock sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  プライベート機能
                </Typography>
                <Typography variant="body2">非公開セットリストや個人設定などの管理機能</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>今すぐ始める:</strong> 右上の「登録」ボタンからアカウントを作成できます。
              メールアドレスとパスワードのみで、すぐに全機能をご利用いただけます。
            </Typography>
          </Alert>
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

      {/* 各ページ機能詳細 */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            各ページの機能詳細
          </Typography>

          <Grid container spacing={3}>
            {/* ホームページ */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Home sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">ホームページ</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  <strong>未登録ユーザー:</strong> アプリケーションの紹介とアカウント作成への案内
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>登録ユーザー:</strong>{' '}
                  個人ダッシュボードで自分のセットリスト一覧を表示。各セットリストはカード形式で表示され、直接表示・編集が可能。
                </Typography>
                <List dense>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• セットリスト作成へのクイックアクセス" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• レスポンシブなグリッドレイアウト" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• テーマ別カードデザイン" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* セットリスト詳細 */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Visibility sx={{ mr: 2, color: 'success.main' }} />
                  <Typography variant="h6">セットリスト詳細ページ</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  セットリストの詳細表示と各種操作が可能です。
                </Typography>
                <List dense>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <Visibility sx={{ fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="楽曲リスト・イベント情報表示" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <Palette sx={{ fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="テーマ変更（Black/White）" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <Download sx={{ fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="高品質画像ダウンロード" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <Share sx={{ fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="URL共有機能" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <Edit sx={{ fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="編集機能（所有者のみ）" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <FileCopy sx={{ fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary="複製機能（ログインユーザー）" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* 楽曲管理 */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LibraryMusic sx={{ mr: 2, color: 'info.main' }} />
                  <Typography variant="h6">楽曲管理ページ</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  <strong>要認証:</strong> 個人の楽曲データベースを管理できます。
                </Typography>
                <List dense>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• 楽曲の追加・編集・削除" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• タイトル・アーティスト・キー・テンポ管理" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• 演奏時間とメモ機能" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• 検索・フィルタリング機能" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• セットリスト作成時の楽曲選択" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* セットリスト作成 */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PlaylistAdd sx={{ mr: 2, color: 'warning.main' }} />
                  <Typography variant="h6">セットリスト作成ページ</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  <strong>要認証:</strong> 新しいセットリストを作成できます。
                </Typography>
                <List dense>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• 基本情報設定（タイトル・バンド名）" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• イベント情報（会場・日時・開演時間）" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• 楽曲追加とドラッグ&ドロップ並び替え" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• テーマ選択（Black/White）" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• プライベート／パブリック設定" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• 複製元がある場合の自動入力" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* プロフィール */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountCircle sx={{ mr: 2, color: 'secondary.main' }} />
                  <Typography variant="h6">プロフィールページ</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  <strong>要認証:</strong> アカウント情報の確認と管理ができます。
                </Typography>
                <List dense>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• ユーザー名・メールアドレス表示" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• アカウント作成日時" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• 統計情報（作成セットリスト数など）" />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemText primary="• アカウント設定" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
