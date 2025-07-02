import HomeIcon from '@mui/icons-material/Home'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'

export const navigationItems = [
  { label: 'ホーム', path: '/', icon: HomeIcon },
  { label: '楽曲管理', path: '/songs', icon: LibraryMusicIcon },
  { label: 'セットリスト作成', path: '/setlists/new', icon: PlaylistAddIcon },
]
