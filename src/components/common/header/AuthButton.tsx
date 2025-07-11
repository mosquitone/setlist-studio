import Button from '@mui/material/Button';
import { useAuth } from '@/components/providers/AuthProvider';

interface AuthButtonProps {
  onClick: () => void;
}

export function AuthButton({ onClick }: AuthButtonProps) {
  const { isLoading } = useAuth();

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={isLoading}
      sx={{
        borderRadius: 10,
        px: 4,
        py: 1.5,
        borderColor: 'white',
        color: 'white',
        fontSize: '16px',
        fontWeight: 500,
        textTransform: 'none',
        border: '2px solid white',
        ml: 1,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: 'none',
        },
        '&:disabled': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
          color: 'rgba(255, 255, 255, 0.5)',
        },
      }}
    >
      {isLoading ? '読込中…' : 'ログイン'}
    </Button>
  );
}
