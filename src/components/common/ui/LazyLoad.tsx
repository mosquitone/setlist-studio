import { CircularProgress } from '@mui/material';
import { Suspense, ComponentType } from 'react';

interface LazyLoadProps {
  component: ComponentType;
  fallback?: React.ReactNode;
  [key: string]: unknown;
}

/**
 * Wrapper component for lazy-loaded components with loading fallback
 */
export default function LazyLoad({
  component: Component,
  fallback = <CircularProgress size={40} />,
  ...props
}: LazyLoadProps) {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}
