import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import HelpIcon from '@mui/icons-material/Help';
import { Messages } from '@/lib/i18n/messages';

// 認証が必要なナビゲーション項目を取得する関数
export const getAuthenticatedNavigationItems = (t: Messages) => {
  return [
    { label: t.ui.songs, path: '/songs', icon: LibraryMusicIcon },
    { label: t.ui.newSetlist, path: '/setlists/new', icon: PlaylistAddIcon },
  ];
};

// 認証不要のナビゲーション項目を取得する関数
export const getPublicNavigationItems = (t: Messages) => {
  return [
    { label: t.ui.home, path: '/', icon: HomeIcon },
    { label: t.ui.guide, path: '/guide', icon: HelpIcon },
  ];
};

// 下位互換性のため - 廃止予定
export const authenticatedNavigationItems = [
  { label: 'Songs', path: '/songs', icon: LibraryMusicIcon },
  { label: 'New Setlist', path: '/setlists/new', icon: PlaylistAddIcon },
];

export const publicNavigationItems = [
  { label: 'Home', path: '/', icon: HomeIcon },
  { label: 'Guide', path: '/guide', icon: HelpIcon },
];

// 全ナビゲーション項目を取得する関数
export const getNavigationItems = (t: Messages) => {
  const publicItems = getPublicNavigationItems(t);
  const authenticatedItems = getAuthenticatedNavigationItems(t);
  return [...publicItems, ...authenticatedItems];
};

// 下位互換性のため - 廃止予定
export const navigationItems = [...publicNavigationItems, ...authenticatedNavigationItems];
