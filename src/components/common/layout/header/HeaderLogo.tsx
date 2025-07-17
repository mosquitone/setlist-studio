import Link from 'next/link';
import { BrandText } from '@/components/common/ui/BrandText';

export function HeaderLogo() {
  return (
    <Link href="/" passHref style={{ textDecoration: 'none' }}>
      <BrandText
        sx={{
          cursor: 'pointer',
          '&:hover': {
            color: 'primary.dark',
            transform: 'scale(1.02)',
          },
        }}
      >
        Setlist Studio
      </BrandText>
    </Link>
  );
}
