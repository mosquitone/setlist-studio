import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType;
}

interface DesktopNavigationProps {
  items: NavigationItem[];
}

export function DesktopNavigation({ items }: DesktopNavigationProps) {
  const pathname = usePathname();

  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, ml: 4 }}>
      {items.map(item => {
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
