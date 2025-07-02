import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import HelpIcon from '@mui/icons-material/Help';

export const navigationItems = [
  { label: 'ホーム', path: '/', icon: HomeIcon },
  { label: '楽曲管理', path: '/songs', icon: LibraryMusicIcon },
  { label: 'セットリスト作成', path: '/setlists/new', icon: PlaylistAddIcon },
  { label: '利用ガイド', path: '/guide', icon: HelpIcon },
];
