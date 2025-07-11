import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import HelpIcon from '@mui/icons-material/Help';

// 認証が必要なナビゲーション項目
export const authenticatedNavigationItems = [
  { label: '楽曲管理', path: '/songs', icon: LibraryMusicIcon },
  { label: 'セットリスト作成', path: '/setlists/new', icon: PlaylistAddIcon },
];

// 認証不要のナビゲーション項目
export const publicNavigationItems = [
  { label: 'ホーム', path: '/', icon: HomeIcon },
  { label: '利用ガイド', path: '/guide', icon: HelpIcon },
];

// 全ナビゲーション項目（下位互換性のため）
export const navigationItems = [...publicNavigationItems, ...authenticatedNavigationItems];
