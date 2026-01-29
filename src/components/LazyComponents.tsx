/**
 * Lazy Loading Components
 * 
 * This file provides lazy-loaded versions of heavy components to improve
 * initial bundle size and loading performance. Components are loaded on-demand
 * when they are actually needed.
 * 
 * Benefits:
 * - Reduced initial bundle size
 * - Faster initial page load
 * - Better code splitting
 * - Improved performance on slower connections
 */

import { lazy, Suspense, ComponentType } from 'react';
import { Skeleton } from './ui/skeleton';

/**
 * Loading fallback component
 * Shows a skeleton loader while the component is being loaded
 */
const ComponentLoader = ({ height = '400px' }: { height?: string }) => (
  <div className="w-full flex items-center justify-center" style={{ height }}>
    <div className="w-full max-w-lg space-y-4 p-6">
      <Skeleton className="h-12 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-2xl" />
    </div>
  </div>
);

/**
 * Higher-order component for lazy loading with suspense
 */
function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallbackHeight?: string
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: P) => (
    <Suspense fallback={<ComponentLoader height={fallbackHeight} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Lazy-loaded Dashboard component
 * Heavy due to charts and animations
 */
export const LazyDashboard = withLazyLoading(
  () => import('../../components/Dashboard'),
  '100vh'
);

/**
 * Lazy-loaded Scanner component
 * Heavy due to camera/image processing
 */
export const LazyScanner = withLazyLoading(
  () => import('../../components/Scanner'),
  '100vh'
);

/**
 * Lazy-loaded ReviewForm component
 * Heavy due to form validation and image handling
 */
export const LazyReviewForm = withLazyLoading(
  () => import('../../components/ReviewForm'),
  '100vh'
);

/**
 * Lazy-loaded AIAssistant component
 * Heavy due to audio processing and TTS
 */
export const LazyAIAssistant = withLazyLoading(
  () => import('../../components/AIAssistant'),
  '200px'
);

/**
 * Lazy-loaded BudgetModal component
 */
export const LazyBudgetModal = withLazyLoading(
  () => import('../../components/BudgetModal'),
  '400px'
);

/**
 * Lazy-loaded SettingsModal component
 */
export const LazySettingsModal = withLazyLoading(
  () => import('../../components/SettingsModal'),
  '500px'
);

/**
 * Lazy-loaded PaywallModal component
 */
export const LazyPaywallModal = withLazyLoading(
  () => import('../../components/PaywallModal'),
  '400px'
);

/**
 * Lazy-loaded Onboarding component
 */
export const LazyOnboarding = withLazyLoading(
  () => import('../../components/Onboarding'),
  '100vh'
);

/**
 * Lazy-loaded LoginScreen component
 */
export const LazyLoginScreen = withLazyLoading(
  () => import('../../components/LoginScreen'),
  '100vh'
);

/**
 * Lazy-loaded SplashScreen component
 * Note: This might not need lazy loading as it's the first screen
 * but included for consistency
 */
export const LazySplashScreen = withLazyLoading(
  () => import('../../components/SplashScreen'),
  '100vh'
);
