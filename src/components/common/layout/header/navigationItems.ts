import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

import { Messages } from '@/lib/i18n/messages';

// 認証が必要なナビゲーション項目を取得する関数
export const getAuthenticatedNavigationItems = (messages: Messages) => {
  return [
    { label: messages.features.songLibrary.title, path: '/songs', icon: LibraryMusicIcon },
    {
      label: messages.features.setlistManagement.title,
      path: '/setlists/new',
      icon: PlaylistPlayIcon,
    },
  ];
};

// 認証不要のナビゲーション項目を取得する関数
export const getPublicNavigationItems = (messages: Messages) => {
  return [
    { label: messages.navigation.home, path: '/', icon: HomeIcon },
    { label: messages.navigation.guide, path: '/guide', icon: HelpIcon },
  ];
};

// 下位互換性のため - 廃止予定
export const authenticatedNavigationItems = [
  { label: 'Songs', path: '/songs', icon: LibraryMusicIcon },
  { label: 'New Setlist', path: '/setlists/new', icon: PlaylistPlayIcon },
];

export const publicNavigationItems = [
  { label: 'Home', path: '/', icon: HomeIcon },
  { label: 'Guide', path: '/guide', icon: HelpIcon },
];

// 全ナビゲーション項目を取得する関数
export const getNavigationItems = (messages: Messages) => {
  const publicItems = getPublicNavigationItems(messages);
  const authenticatedItems = getAuthenticatedNavigationItems(messages);
  return [...publicItems, ...authenticatedItems];
};

// 下位互換性のため - 廃止予定
export const navigationItems = [...publicNavigationItems, ...authenticatedNavigationItems];
