import { Suspense, ComponentType } from 'react';

import LoadingSpinner from './LoadingSpinner';

interface LazyLoadProps {
  component: ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

/**
 * Wrapper component for lazy-loaded components with loading fallback
 */
export default function LazyLoad({ 
  component: Component, 
  fallback = <LoadingSpinner />,
  ...props 
}: LazyLoadProps) {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}