import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType;
}

interface DesktopNavigationProps {
  items: NavigationItem[];
  isLoading: boolean;
}

export function DesktopNavigation({ items, isLoading }: DesktopNavigationProps) {
  const pathname = usePathname();

  if (isLoading) {
    return (
      <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, ml: 4 }}>
        {[1, 2].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            width={120}
            height={36}
            sx={{
              mx: 1,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, ml: 4 }}>
      {items.map((item) => {
        const IconComponent = item.icon;
        return (
          <Button
            key={item.path}
            component={Link}
            href={item.path}
            startIcon={<IconComponent />}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: pathname === item.path ? 700 : 500,
              mx: 1,
              borderBottom: pathname === item.path ? '2px solid white' : 'none',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );
}
