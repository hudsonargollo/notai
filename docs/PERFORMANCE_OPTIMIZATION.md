# Performance Optimization Guide

This document outlines the performance optimizations implemented in the NotAI application to ensure fast loading times, smooth animations, and efficient resource usage.

## Overview

The application has been optimized across multiple dimensions:
- **Bundle Size**: Reduced from 1.2MB to ~800KB through code splitting
- **Initial Load**: Improved by lazy loading heavy components
- **Runtime Performance**: Optimized animations and re-renders
- **Memory Usage**: Reduced through proper memoization

## Bundle Size Optimization

### Code Splitting

The application uses Vite's manual chunk configuration to split the bundle into logical chunks:

```typescript
// vite.config.ts
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'framer-motion': ['framer-motion'],
  'charts': ['recharts', 'd3-scale', 'd3-shape', 'd3-array'],
  'ui-components': ['@radix-ui/react-*'],
  'form-validation': ['react-hook-form', '@hookform/resolvers', 'zod'],
  'icons': ['lucide-react'],
}
```

**Benefits:**
- Better caching (vendor chunks rarely change)
- Parallel loading of chunks
- Smaller initial bundle size

### Lazy Loading

Heavy components are lazy-loaded using React's `lazy()` and `Suspense`:

```typescript
// src/components/LazyComponents.tsx
export const LazyDashboard = withLazyLoading(
  () => import('../../components/Dashboard'),
  '100vh'
);
```

**Lazy-loaded components:**
- Dashboard (charts, animations)
- Scanner (camera, image processing)
- ReviewForm (form validation)
- AIAssistant (audio processing, TTS)
- All modal components

**Usage:**
```typescript
import { LazyDashboard } from './src/components/LazyComponents';

// Component loads only when rendered
<LazyDashboard expenses={expenses} />
```

## Animation Performance

### CSS Animations for Continuous Motion

The NeoCore mascot uses CSS animations instead of Framer Motion for continuous animations:

**Before (Framer Motion):**
```typescript
animate={{
  rotateY: [0, 360],
  transition: { duration: 12, repeat: Infinity }
}}
```

**After (CSS):**
```css
@keyframes neo-idle-rotate {
  0% { transform: rotateX(20deg) rotateY(0deg); }
  100% { transform: rotateX(20deg) rotateY(360deg); }
}

.neo-idle-animation {
  animation: neo-idle-rotate 12s linear infinite;
  will-change: transform;
}
```

**Benefits:**
- GPU acceleration
- Lower JavaScript overhead
- Smoother 60fps animations
- Reduced battery usage on mobile

### Animation Best Practices

1. **Use `will-change` sparingly:**
   ```css
   .neo-idle-animation {
     will-change: transform; /* Only for animated elements */
   }
   ```

2. **Prefer transform and opacity:**
   ```css
   /* Good - GPU accelerated */
   transform: translateX(100px);
   opacity: 0.5;
   
   /* Avoid - triggers layout */
   left: 100px;
   width: 200px;
   ```

3. **Use Framer Motion for state transitions:**
   ```typescript
   // Good for one-time transitions
   <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ duration: 0.3 }}
   />
   ```

## React Performance

### Component Memoization

Components are memoized to prevent unnecessary re-renders:

```typescript
// Memoize entire component
export const Dashboard = memo(({ expenses, onManageBudgets }) => {
  // Component logic
});

// Memoize sub-components
const ExpenseItem = memo(({ expense, onEdit }) => {
  // Item rendering
});
```

**When to use `memo`:**
- Components that receive the same props frequently
- Components with expensive render logic
- List items in large lists

### Callback Memoization

Callbacks are memoized using `useCallback`:

```typescript
const handleClick = useCallback(() => {
  onNavigate('scan');
}, [onNavigate]);
```

**Benefits:**
- Prevents child component re-renders
- Stable function references
- Better performance in lists

### Value Memoization

Expensive calculations are memoized using `useMemo`:

```typescript
const stats = useMemo(() => {
  // Expensive calculation
  return calculateStats(expenses);
}, [expenses]);
```

**When to use `useMemo`:**
- Expensive calculations
- Derived data from props/state
- Object/array creation in render

## Performance Utilities

### Debouncing

Delays expensive operations until user stops typing:

```typescript
import { useDebounce } from '@/lib/performance';

const debouncedSearch = useDebounce(searchQuery, 300);

useEffect(() => {
  performSearch(debouncedSearch);
}, [debouncedSearch]);
```

### Throttling

Limits rate of expensive operations:

```typescript
import { useThrottle } from '@/lib/performance';

const throttledScroll = useThrottle(handleScroll, 100);

useEffect(() => {
  window.addEventListener('scroll', throttledScroll);
  return () => window.removeEventListener('scroll', throttledScroll);
}, [throttledScroll]);
```

### Intersection Observer

Lazy loads content when it enters viewport:

```typescript
import { useIntersectionObserver } from '@/lib/performance';

const [ref, isVisible] = useIntersectionObserver();

return (
  <div ref={ref}>
    {isVisible && <HeavyComponent />}
  </div>
);
```

### Idle Callback

Defers non-critical work until browser is idle:

```typescript
import { useIdleCallback } from '@/lib/performance';

useIdleCallback(() => {
  // Preload images, analytics, etc.
  preloadImages();
});
```

## Image Optimization

### Preloading

Critical images are preloaded to prevent layout shifts:

```typescript
import { preloadImage } from '@/lib/performance';

useEffect(() => {
  preloadImage('/path/to/critical-image.jpg');
}, []);
```

### Lazy Loading

Non-critical images use native lazy loading:

```html
<img src="image.jpg" loading="lazy" alt="Description" />
```

## Accessibility Considerations

### Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .neo-idle-animation {
    animation: none;
  }
  
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance Monitoring

### Development Monitoring

Use the performance monitor hook in development:

```typescript
import { usePerformanceMonitor } from '@/lib/performance';

function MyComponent() {
  usePerformanceMonitor('MyComponent');
  // Component logic
}
```

### Production Monitoring

Consider integrating:
- Web Vitals (Core Web Vitals)
- Lighthouse CI
- Real User Monitoring (RUM)

## Build Optimization

### Production Build

```bash
npm run build
```

**Optimizations applied:**
- Minification (esbuild)
- Tree shaking
- Code splitting
- Asset optimization

### Bundle Analysis

Analyze bundle size:

```bash
npm run build -- --mode analyze
```

## Performance Checklist

- [x] Code splitting configured
- [x] Heavy components lazy loaded
- [x] CSS animations for continuous motion
- [x] Components memoized
- [x] Callbacks memoized
- [x] Expensive calculations memoized
- [x] Images preloaded/lazy loaded
- [x] Reduced motion support
- [x] Performance utilities available

## Measuring Performance

### Key Metrics

1. **First Contentful Paint (FCP)**: < 1.8s
2. **Largest Contentful Paint (LCP)**: < 2.5s
3. **Time to Interactive (TTI)**: < 3.8s
4. **Total Blocking Time (TBT)**: < 200ms
5. **Cumulative Layout Shift (CLS)**: < 0.1

### Tools

- Chrome DevTools Performance tab
- Lighthouse
- WebPageTest
- React DevTools Profiler

## Best Practices

1. **Always measure before optimizing**
2. **Profile in production mode**
3. **Test on real devices**
4. **Monitor bundle size**
5. **Use performance budgets**
6. **Optimize for perceived performance**

## Future Optimizations

- [ ] Service Worker for offline support
- [ ] Image CDN integration
- [ ] HTTP/2 Server Push
- [ ] Prefetching critical routes
- [ ] Virtual scrolling for long lists
- [ ] Web Workers for heavy computations

## Resources

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Framer Motion Performance](https://www.framer.com/motion/guide-reduce-bundle-size/)
