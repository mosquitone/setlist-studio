import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType;
}

interface MobileNavigationProps {
  items: NavigationItem[];
  isLoading: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
}

export function MobileNavigation({
  items,
  isLoading,
  mobileOpen,
  onToggle,
}: MobileNavigationProps) {
  const { isLoggedIn, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      router.push('/login');
    }
  };

  const drawer = (
    <Box onClick={onToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Setlist Studio
      </Typography>
      <Divider />
      {isLoading ? (
        <List>
          {[1, 2].map((i) => (
            <ListItem key={i} disablePadding>
              <Skeleton
                variant="rounded"
                width="100%"
                height={48}
                sx={{
                  mx: 2,
                  my: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <List>
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  selected={pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <IconComponent />
                  </Box>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
      {!isLoading && items.length > 0 && <Divider />}
      {isLoggedIn && user && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {user.username || user.email}
          </Typography>
        </Box>
      )}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleAuthClick}
          disabled={isLoading}
          sx={{
            borderRadius: 10,
            py: 1.5,
            textTransform: 'none',
          }}
        >
          {isLoading ? '読込中…' : isLoggedIn ? 'ログアウト' : 'ログイン'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onToggle}
        sx={{ mr: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
