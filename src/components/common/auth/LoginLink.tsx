import { Button } from '@/components/common/ui/Button';
import { Login as LoginIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/hooks/useI18n';
import NextLink from 'next/link';
import { Messages } from '@/lib/i18n/messages';

export type AuthLinkVariant = 'header' | 'mobile' | 'home' | 'primary';
export type AuthLinkType = 'login' | 'register';

interface AuthLinkProps {
  variant: AuthLinkVariant;
  type: AuthLinkType;
}

const getTypeConfig = (messages: Messages) => ({
  login: {
    href: '/login',
    icon: LoginIcon,
    text: messages.auth.login,
    colors: {
      primary: '#3b82f6',
      hover: '#2563eb',
      light: 'rgba(59, 130, 246, 0.04)',
      shadow: 'rgba(59, 130, 246, 0.3)',
      hoverShadow: 'rgba(59, 130, 246, 0.4)',
    },
  },
  register: {
    href: '/register',
    icon: PersonAddIcon,
    text: messages.auth.register,
    colors: {
      primary: '#059669',
      hover: '#047857',
      light: 'rgba(5, 150, 105, 0.04)',
      shadow: 'rgba(5, 150, 105, 0.3)',
      hoverShadow: 'rgba(5, 150, 105, 0.4)',
    },
  },
});

type ColorConfig = {
  primary: string;
  hover: string;
  light: string;
  shadow: string;
  hoverShadow: string;
};

const variantConfig = {
  header: {
    variant: 'outlined' as const,
    size: 'medium' as const,
    showIcon: true,
    sx: {
      borderColor: 'white',
      color: 'white',
      minWidth: 140,
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.9)',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
      },
    },
  },
  mobile: {
    variant: 'outlined' as const,
    size: 'medium' as const,
    showIcon: true,
    sx: (colors: ColorConfig) => ({
      borderColor: colors.primary,
      color: colors.primary,
      width: '100%',
      '&:hover': {
        backgroundColor: colors.light,
        borderColor: colors.hover,
      },
    }),
  },
  home: {
    variant: 'contained' as const,
    size: 'large' as const,
    showIcon: true,
    sx: (colors: ColorConfig) => ({
      minWidth: { xs: 140, sm: 220 },
      width: { xs: 'auto', sm: 'auto' },
      maxWidth: { xs: 180, sm: 'none' },
      fontSize: { xs: '0.875rem', sm: '1rem' },
      padding: { xs: '10px 16px', sm: '12px 24px' },
      backgroundColor: colors.primary,
      fontWeight: 600,
      boxShadow: `0 2px 8px ${colors.shadow}`,
      '&:hover': {
        backgroundColor: colors.hover,
        boxShadow: `0 8px 20px ${colors.hoverShadow}`,
      },
    }),
  },
  primary: {
    variant: 'contained' as const,
    size: 'large' as const,
    showIcon: true,
    sx: (colors: ColorConfig) => ({
      minWidth: { xs: 130, sm: 180 },
      fontSize: { xs: '0.875rem', sm: '1rem' },
      fontWeight: 600,
      borderRadius: '25px',
      px: { xs: 2.5, sm: 3 },
      py: { xs: 1.2, sm: 1.5 },
      backgroundColor: colors.primary,
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.hover} 100%)`,
      boxShadow: `0 4px 15px ${colors.shadow}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'scale(1)',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: `0 8px 25px ${colors.hoverShadow}`,
        background: `linear-gradient(135deg, ${colors.hover} 0%, ${colors.primary} 100%)`,
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    }),
  },
};

export function AuthLink({ variant, type }: AuthLinkProps) {
  const { isLoading } = useAuth();
  const { messages } = useI18n();
  const typeConf = getTypeConfig(messages)[type];
  const variantConf = variantConfig[variant];
  const IconComponent = typeConf.icon;

  const sx =
    typeof variantConf.sx === 'function' ? variantConf.sx(typeConf.colors) : variantConf.sx;

  return (
    <Button
      variant={variantConf.variant}
      size={variantConf.size}
      component={NextLink}
      href={typeConf.href}
      startIcon={variantConf.showIcon ? <IconComponent /> : undefined}
      disabled={isLoading}
      authButton
      sx={sx}
    >
      {isLoading ? messages.common.loading : typeConf.text}
    </Button>
  );
}

// 後方互換性のため
export function LoginLink({ variant }: { variant: AuthLinkVariant }) {
  return <AuthLink variant={variant} type="login" />;
}
