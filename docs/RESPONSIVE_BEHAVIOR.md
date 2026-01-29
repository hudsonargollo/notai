# Responsive Behavior Guide

This guide documents responsive patterns and best practices for building adaptive interfaces that work seamlessly across all device sizes.

## Table of Contents

1. [Responsive Philosophy](#responsive-philosophy)
2. [Breakpoint System](#breakpoint-system)
3. [Responsive Hooks](#responsive-hooks)
4. [Responsive Patterns](#responsive-patterns)
5. [Mobile-First Components](#mobile-first-components)
6. [Touch Interactions](#touch-interactions)
7. [Best Practices](#best-practices)

---

## Responsive Philosophy

The Native UI system follows these responsive principles:

1. **Mobile-First**: Design for mobile, enhance for desktop
2. **Adaptive Components**: Components change behavior based on screen size
3. **Touch-Friendly**: Minimum 44x44px touch targets on mobile
4. **Context-Aware**: Different UI patterns for different contexts (bottom sheets vs modals)
5. **Performance**: Efficient media query handling with React hooks

---

## Breakpoint System

### Standard Breakpoints

The system uses Tailwind CSS breakpoints for consistency:

```typescript
export const BREAKPOINTS = {
  sm: 640,   // Mobile landscape
  md: 768,   // Tablet
  lg: 1024,  // Desktop
  xl: 1280,  // Large desktop
  "2xl": 1536, // Extra large desktop
};
```

### Breakpoint Ranges

| Name | Range | Typical Devices |
|------|-------|-----------------|
| Mobile | < 768px | Phones (portrait & landscape) |
| Tablet | 768px - 1023px | Tablets, small laptops |
| Desktop | ≥ 1024px | Laptops, desktops |
| Large Desktop | ≥ 1280px | Large monitors |
| XL Desktop | ≥ 1536px | Ultra-wide monitors |

### Media Query Strings

Pre-defined media queries for common use cases:

```typescript
export const MEDIA_QUERIES = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};
```

---

## Responsive Hooks

### useMediaQuery

**Purpose**: React hook for responsive behavior based on media queries.

**Usage**:
```typescript
import { useMediaQuery, MEDIA_QUERIES } from '@/hooks/useMediaQuery';

function MyComponent() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

**Custom Media Query**:
```typescript
const isLargeScreen = useMediaQuery("(min-width: 1200px)");
const isPortrait = useMediaQuery("(orientation: portrait)");
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
```

**Parameters**:
- `query`: string - CSS media query string

**Returns**:
- `boolean` - true if media query matches, false otherwise

---

### useIsMobile

**Purpose**: Convenience hook for mobile detection.

**Usage**:
```typescript
import { useIsMobile } from '@/hooks/useMediaQuery';

function MyComponent() {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "p-4" : "p-8"}>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </div>
  );
}
```

**Returns**:
- `boolean` - true if viewport is < 768px

---

### useIsTablet

**Purpose**: Convenience hook for tablet detection.

**Usage**:
```typescript
import { useIsTablet } from '@/hooks/useMediaQuery';

function MyComponent() {
  const isTablet = useIsTablet();

  if (isTablet) {
    return <TabletOptimizedView />;
  }

  return <DefaultView />;
}
```

**Returns**:
- `boolean` - true if viewport is 768px - 1023px

---

### useIsDesktop

**Purpose**: Convenience hook for desktop detection.

**Usage**:
```typescript
import { useIsDesktop } from '@/hooks/useMediaQuery';

function MyComponent() {
  const isDesktop = useIsDesktop();

  return (
    <>
      {isDesktop && <Sidebar />}
      <MainContent />
    </>
  );
}
```

**Returns**:
- `boolean` - true if viewport is ≥ 1024px

---

### useResponsiveConfig

**Purpose**: Get comprehensive responsive configuration.

**Usage**:
```typescript
import { useResponsiveConfig } from '@/hooks/useMediaQuery';

function MyComponent() {
  const config = useResponsiveConfig();

  return (
    <div>
      <p>Breakpoint: {config.breakpoint}px</p>
      <p>Mobile Layout: {config.useMobileLayout ? 'Yes' : 'No'}</p>
      <p>Touch Target Size: {config.touchTargetSize}px</p>
      <p>Gestures Enabled: {config.enableGestures ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

**Returns**:
```typescript
interface ResponsiveConfig {
  breakpoint: number;        // Current viewport width
  useMobileLayout: boolean;  // Whether to use mobile patterns
  useBottomSheet: boolean;   // Whether to use bottom sheet vs modal
  touchTargetSize: number;   // Minimum touch target size (44 on mobile, 32 on desktop)
  enableGestures: boolean;   // Whether to enable gesture interactions
}
```

---

### useBreakpointValue

**Purpose**: Get different values based on current breakpoint.

**Usage**:
```typescript
import { useBreakpointValue } from '@/hooks/useMediaQuery';

function MyComponent() {
  const columns = useBreakpointValue({
    default: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  });

  const padding = useBreakpointValue({
    default: '1rem',
    md: '2rem',
    lg: '3rem',
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        padding,
      }}
    >
      {/* Grid items */}
    </div>
  );
}
```

**Parameters**:
```typescript
{
  default: T;  // Required: fallback value
  sm?: T;      // Optional: value for ≥ 640px
  md?: T;      // Optional: value for ≥ 768px
  lg?: T;      // Optional: value for ≥ 1024px
  xl?: T;      // Optional: value for ≥ 1280px
  "2xl"?: T;   // Optional: value for ≥ 1536px
}
```

**Returns**:
- `T` - Value for current breakpoint

---

## Responsive Patterns

### Adaptive Modal/Sheet

**Pattern**: Use bottom sheet on mobile, modal on desktop.

```typescript
import { BottomSheet } from '@/components/layout/BottomSheet';

function MyComponent() {
  const [open, setOpen] = useState(false);

  // BottomSheet automatically adapts:
  // - Mobile: Sheet from bottom
  // - Desktop: Centered modal
  return (
    <BottomSheet
      open={open}
      onOpenChange={setOpen}
      title="Actions"
    >
      {/* Content */}
    </BottomSheet>
  );
}
```

**Manual Implementation**:
```typescript
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';

function AdaptiveModal({ open, onOpenChange, children }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom">
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

---

### Responsive Navigation

**Pattern**: Different navigation patterns for different screen sizes.

```typescript
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

function Navigation() {
  const isMobile = useIsMobile();

  const navItems = (
    <nav className="flex flex-col md:flex-row gap-4">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          {navItems}
        </SheetContent>
      </Sheet>
    );
  }

  return navItems;
}
```

---

### Responsive Grid

**Pattern**: Different column counts based on screen size.

```typescript
import { useBreakpointValue } from '@/hooks/useMediaQuery';

function ResponsiveGrid({ items }) {
  const columns = useBreakpointValue({
    default: 1,
    sm: 2,
    md: 3,
    lg: 4,
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem',
      }}
    >
      {items.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
    </div>
  );
}
```

**With Tailwind CSS**:
```tsx
function ResponsiveGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
    </div>
  );
}
```

---

### Responsive Sidebar

**Pattern**: Sidebar on desktop, drawer on mobile.

```typescript
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useState } from 'react';

function Layout({ children }) {
  const isDesktop = useIsDesktop();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarContent = (
    <aside className="w-64 p-4">
      {/* Sidebar content */}
    </aside>
  );

  if (isDesktop) {
    return (
      <div className="flex">
        {sidebarContent}
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left">
          {sidebarContent}
        </SheetContent>
      </Sheet>
      <main>{children}</main>
    </>
  );
}
```

---

### Responsive Typography

**Pattern**: Different font sizes based on screen size.

```typescript
import { useBreakpointValue } from '@/hooks/useMediaQuery';

function ResponsiveHeading({ children }) {
  const fontSize = useBreakpointValue({
    default: '1.5rem',
    md: '2rem',
    lg: '2.5rem',
  });

  return (
    <h1 style={{ fontSize }}>
      {children}
    </h1>
  );
}
```

**With Tailwind CSS**:
```tsx
function ResponsiveHeading({ children }) {
  return (
    <h1 className="text-2xl md:text-3xl lg:text-4xl">
      {children}
    </h1>
  );
}
```

---

### Responsive Spacing

**Pattern**: Different padding/margin based on screen size.

```tsx
function ResponsiveContainer({ children }) {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      {children}
    </div>
  );
}
```

---

### Conditional Rendering

**Pattern**: Show/hide elements based on screen size.

```typescript
import { useIsMobile, useIsDesktop } from '@/hooks/useMediaQuery';

function ResponsiveFeatures() {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  return (
    <>
      {isMobile && <MobileOnlyFeature />}
      {isDesktop && <DesktopOnlyFeature />}
      <AlwaysVisibleFeature />
    </>
  );
}
```

**With Tailwind CSS**:
```tsx
function ResponsiveFeatures() {
  return (
    <>
      <div className="block md:hidden">
        <MobileOnlyFeature />
      </div>
      <div className="hidden md:block">
        <DesktopOnlyFeature />
      </div>
      <AlwaysVisibleFeature />
    </>
  );
}
```

---

## Mobile-First Components

### Touch-Friendly Buttons

**Pattern**: Larger touch targets on mobile.

```typescript
import { useResponsiveConfig } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';

function TouchFriendlyButton({ children, ...props }) {
  const config = useResponsiveConfig();

  return (
    <Button
      {...props}
      style={{
        minHeight: config.touchTargetSize,
        minWidth: config.touchTargetSize,
      }}
    >
      {children}
    </Button>
  );
}
```

**With Tailwind CSS**:
```tsx
function TouchFriendlyButton({ children, ...props }) {
  return (
    <Button
      {...props}
      className="min-h-[44px] min-w-[44px] md:min-h-[32px] md:min-w-[32px]"
    >
      {children}
    </Button>
  );
}
```

---

### Swipeable Components

**Pattern**: Enable swipe gestures on mobile.

```typescript
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useMediaQuery';

function SwipeableCard({ onSwipeLeft, onSwipeRight, children }) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.x > 100) {
          onSwipeRight?.();
        } else if (offset.x < -100) {
          onSwipeLeft?.();
        }
      }}
    >
      {children}
    </motion.div>
  );
}
```

---

### Mobile-Optimized Forms

**Pattern**: Larger inputs and better spacing on mobile.

```tsx
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ResponsiveForm() {
  const isMobile = useIsMobile();

  return (
    <form className={isMobile ? "space-y-6" : "space-y-4"}>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          className={isMobile ? "h-12 text-base" : "h-10"}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          className={isMobile ? "h-12 text-base" : "h-10"}
        />
      </div>
    </form>
  );
}
```

---

## Touch Interactions

### Touch Target Sizes

**Minimum Sizes**:
- Mobile: 44x44px (iOS guideline)
- Desktop: 32x32px (standard)

**Implementation**:
```tsx
import { useResponsiveConfig } from '@/hooks/useMediaQuery';

function TouchTarget({ children, onClick }) {
  const config = useResponsiveConfig();

  return (
    <button
      onClick={onClick}
      style={{
        minHeight: config.touchTargetSize,
        minWidth: config.touchTargetSize,
      }}
    >
      {children}
    </button>
  );
}
```

---

### Gesture Support

**Pattern**: Enable gestures on mobile only.

```typescript
import { motion } from 'framer-motion';
import { useResponsiveConfig } from '@/hooks/useMediaQuery';

function GestureCard({ onDismiss, children }) {
  const config = useResponsiveConfig();

  if (!config.enableGestures) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.y > 100 || velocity.y > 500) {
          onDismiss?.();
        }
      }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Best Practices

### 1. Mobile-First Approach

Start with mobile design, then enhance for larger screens:

```tsx
// ✅ Good: Mobile-first
<div className="p-4 md:p-6 lg:p-8">

// ❌ Bad: Desktop-first
<div className="p-8 md:p-6 sm:p-4">
```

---

### 2. Use Semantic Breakpoints

Use breakpoints based on content, not devices:

```tsx
// ✅ Good: Content-based
const showSidebar = useMediaQuery("(min-width: 1024px)");

// ❌ Bad: Device-based
const isIPhone = useMediaQuery("(max-width: 375px)");
```

---

### 3. Test on Real Devices

Always test responsive behavior on:
- Real mobile devices (not just browser DevTools)
- Different screen sizes
- Portrait and landscape orientations
- Touch interactions

---

### 4. Avoid Layout Shifts

Ensure consistent layout across breakpoints:

```tsx
// ✅ Good: Consistent height
<div className="h-16 md:h-20">

// ❌ Bad: Unpredictable height
<div className="h-auto">
```

---

### 5. Optimize Touch Targets

Ensure all interactive elements meet minimum sizes:

```tsx
// ✅ Good: Touch-friendly
<Button className="min-h-[44px] min-w-[44px]">

// ❌ Bad: Too small
<Button className="h-6 w-6">
```

---

### 6. Use Appropriate Input Types

Use correct input types for mobile keyboards:

```tsx
// ✅ Good: Optimized keyboard
<Input type="email" />
<Input type="tel" />
<Input type="number" />

// ❌ Bad: Generic keyboard
<Input type="text" />
```

---

### 7. Consider Thumb Zones

Place important actions in easy-to-reach areas on mobile:

```tsx
// ✅ Good: Bottom-right (thumb zone)
<FloatingActionButton icon={Plus} label="Add" />

// ❌ Bad: Top-left (hard to reach)
<Button className="fixed top-4 left-4">Add</Button>
```

---

### 8. Provide Visual Feedback

Ensure touch interactions have immediate feedback:

```tsx
import { motion } from 'framer-motion';
import { scaleOnHover } from '@/lib/animations';

<motion.button
  whileTap="tap"
  variants={scaleOnHover}
>
  Tap me
</motion.button>
```

---

## Responsive Checklist

Before shipping responsive features, verify:

- [ ] Tested on mobile devices (< 768px)
- [ ] Tested on tablets (768px - 1023px)
- [ ] Tested on desktop (≥ 1024px)
- [ ] Touch targets ≥ 44x44px on mobile
- [ ] Touch targets ≥ 32x32px on desktop
- [ ] No horizontal scrolling on mobile
- [ ] Text is readable without zooming
- [ ] Forms use appropriate input types
- [ ] Navigation works on all screen sizes
- [ ] Images are responsive
- [ ] No layout shifts between breakpoints
- [ ] Gestures work on mobile
- [ ] Tested in portrait and landscape
- [ ] Performance is acceptable on mobile

---

## Next Steps

- See [Component Usage Guide](./COMPONENT_USAGE_GUIDE.md) for component examples
- See [Animation Patterns Guide](./ANIMATION_PATTERNS.md) for animation usage
- See [Migration Guide](./MIGRATION_GUIDE.md) for migrating custom components

