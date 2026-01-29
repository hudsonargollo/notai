# Native UI System Documentation

Welcome to the Native UI System documentation. This system transforms NotAI into a high-end web application with native-like behavior, smooth animations, and accessible components.

## 📚 Documentation Overview

This documentation is organized into six main guides:

### 1. [Component Usage Guide](./COMPONENT_USAGE_GUIDE.md)
Comprehensive examples and best practices for using all Native UI components.

**Topics Covered**:
- Layout Components (PageTransition, GlassHeader, BottomSheet, FAB, NeoCore)
- UI Components (Shadcn/UI library)
- Component props and usage examples
- Real-world implementation patterns

**Start here if**: You want to learn how to use the components in your application.

---

### 2. [Animation Patterns Guide](./ANIMATION_PATTERNS.md)
Complete guide to animation patterns, spring physics, and motion design.

**Topics Covered**:
- Animation philosophy and principles
- Spring physics configuration
- Reusable animation variants
- Common animation patterns
- Performance considerations
- Best practices

**Start here if**: You want to add animations to your components or understand how animations work.

---

### 3. [Responsive Behavior Guide](./RESPONSIVE_BEHAVIOR.md)
Patterns and best practices for building adaptive interfaces across all device sizes.

**Topics Covered**:
- Breakpoint system
- Responsive hooks (useMediaQuery, useIsMobile, etc.)
- Responsive patterns (adaptive modals, navigation, grids)
- Mobile-first components
- Touch interactions
- Best practices

**Start here if**: You want to make your components responsive or understand mobile-first design.

---

### 4. [Migration Guide](./MIGRATION_GUIDE.md)
Step-by-step guide for migrating existing custom components to the Native UI system.

**Topics Covered**:
- Component migration patterns
- Animation migration
- Styling migration (theme tokens)
- Icon migration (Lucide)
- Form migration
- Modal migration
- Common pitfalls
- Migration checklist

**Start here if**: You're migrating existing components to use the new system.

---

### 5. [Shadcn/UI Customization Guide](./SHADCN_CUSTOMIZATION.md)
Complete guide to customizing Shadcn/UI components, including styling, variants, and extending functionality.

**Topics Covered**:
- Understanding Shadcn/UI architecture
- Component structure and anatomy
- Customizing existing components
- Creating custom variants
- Adding new components
- Styling patterns
- Best practices

**Start here if**: You want to customize UI components or create new variants.

---

### 6. [Theme Customization Guide](./THEME_CUSTOMIZATION.md)
Comprehensive guide to customizing the theme, including colors, typography, spacing, and design tokens.

**Topics Covered**:
- Theme system overview
- Color customization (OKLCH color space)
- Typography customization
- Spacing and sizing
- Border radius and shadows
- Animation configuration
- Creating custom themes
- Best practices

**Start here if**: You want to customize colors, fonts, or other theme aspects.

---

## 🚀 Quick Start

### Installation

The Native UI system is already set up in this project. All dependencies are installed and configured.

### Basic Usage

```tsx
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/layout/PageTransition';
import { useIsMobile } from '@/hooks/useMediaQuery';

function MyPage() {
  const isMobile = useIsMobile();

  return (
    <PageTransition>
      <div className="p-4">
        <h1 className="text-2xl font-bold">My Page</h1>
        <Button>Click me</Button>
        {isMobile && <p>Mobile view</p>}
      </div>
    </PageTransition>
  );
}
```

---

## 🎨 Design System

### Core Principles

1. **Subtle Sophistication**: Refined without being ostentatious
2. **Performance First**: Animations complete within 300ms
3. **Platform Awareness**: Adapts to mobile, tablet, and desktop
4. **Accessibility**: WCAG AA compliant by default
5. **Consistency**: Unified design language across all components

### Technology Stack

- **React 18+**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Shadcn/UI**: Accessible component primitives
- **Lucide React**: Consistent iconography

---

## 📦 Available Components

### Layout Components

| Component | Purpose | Documentation |
|-----------|---------|---------------|
| **PageTransition** | Page-level slide transitions | [Guide](./COMPONENT_USAGE_GUIDE.md#pagetransition) |
| **GlassHeader** | Header with glassmorphism effects | [Guide](./COMPONENT_USAGE_GUIDE.md#glassheader) |
| **BottomSheet** | Responsive modal (sheet on mobile, dialog on desktop) | [Guide](./COMPONENT_USAGE_GUIDE.md#bottomsheet) |
| **FloatingActionButton** | Prominent circular button for primary actions | [Guide](./COMPONENT_USAGE_GUIDE.md#floatingactionbutton) |
| **NeoCore** | Animated 3D cube mascot | [Guide](./COMPONENT_USAGE_GUIDE.md#neocore) |

### UI Components (Shadcn/UI)

| Component | Purpose |
|-----------|---------|
| **Button** | Interactive buttons with variants |
| **Card** | Content containers |
| **Command** | Command menu (CMD+K) |
| **Dialog** | Modal dialogs |
| **Form** | Form components with validation |
| **Input** | Text inputs |
| **Label** | Form labels |
| **Select** | Dropdown selects |
| **Sheet** | Side drawers and bottom sheets |
| **Skeleton** | Loading placeholders |

---

## 🎭 Animation System

### Spring Physics

All animations use consistent spring physics:
- **Stiffness**: 300 (responsive but not jarring)
- **Damping**: 30 (slight bounce for natural feel)
- **Duration**: 200-300ms target

### Animation Variants

```typescript
import {
  scaleOnHover,      // Hover/tap scale animation
  fadeInUp,          // Fade in from below
  slideFromBottom,   // Full slide from bottom
  pageTransition,    // Page navigation slides
  modalAnimation,    // Modal scale and fade
  staggerContainer,  // Stagger children
  fade,              // Simple fade
} from '@/lib/animations';
```

See [Animation Patterns Guide](./ANIMATION_PATTERNS.md) for detailed usage.

---

## 📱 Responsive System

### Breakpoints

| Name | Size | Devices |
|------|------|---------|
| Mobile | < 768px | Phones |
| Tablet | 768px - 1023px | Tablets |
| Desktop | ≥ 1024px | Laptops, desktops |

### Responsive Hooks

```typescript
import {
  useMediaQuery,        // Custom media queries
  useIsMobile,          // Mobile detection
  useIsTablet,          // Tablet detection
  useIsDesktop,         // Desktop detection
  useResponsiveConfig,  // Full responsive config
  useBreakpointValue,   // Breakpoint-based values
} from '@/hooks/useMediaQuery';
```

See [Responsive Behavior Guide](./RESPONSIVE_BEHAVIOR.md) for detailed usage.

---

## 🎯 Common Use Cases

### Adding a New Page

```tsx
import { PageTransition } from '@/components/layout/PageTransition';
import { GlassHeader } from '@/components/layout/GlassHeader';
import { Button } from '@/components/ui/button';

function NewPage() {
  return (
    <PageTransition>
      <GlassHeader title="New Page" />
      <main className="container mx-auto p-4">
        <h1>Content</h1>
        <Button>Action</Button>
      </main>
    </PageTransition>
  );
}
```

### Creating a Responsive Modal

```tsx
import { useState } from 'react';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { Button } from '@/components/ui/button';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <BottomSheet open={open} onOpenChange={setOpen} title="Actions">
        <div className="space-y-4">
          <Button className="w-full">Action 1</Button>
          <Button className="w-full">Action 2</Button>
        </div>
      </BottomSheet>
    </>
  );
}
```

### Adding Animations

```tsx
import { motion } from 'framer-motion';
import { scaleOnHover, fadeInUp } from '@/lib/animations';
import { Card } from '@/components/ui/card';

function AnimatedCard() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={scaleOnHover}
      >
        <Card>Content</Card>
      </motion.div>
    </motion.div>
  );
}
```

### Responsive Behavior

```tsx
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';

function ResponsiveComponent() {
  const isMobile = useIsMobile();

  return isMobile ? (
    <Sheet>
      <SheetContent>Mobile view</SheetContent>
    </Sheet>
  ) : (
    <Dialog>
      <DialogContent>Desktop view</DialogContent>
    </Dialog>
  );
}
```

---

## 🔍 Finding What You Need

### I want to...

**...add a button**
→ See [Component Usage Guide - Button](./COMPONENT_USAGE_GUIDE.md#ui-components)

**...create a modal**
→ See [Component Usage Guide - BottomSheet](./COMPONENT_USAGE_GUIDE.md#bottomsheet)

**...add page transitions**
→ See [Component Usage Guide - PageTransition](./COMPONENT_USAGE_GUIDE.md#pagetransition)

**...animate a component**
→ See [Animation Patterns Guide](./ANIMATION_PATTERNS.md)

**...make something responsive**
→ See [Responsive Behavior Guide](./RESPONSIVE_BEHAVIOR.md)

**...migrate an old component**
→ See [Migration Guide](./MIGRATION_GUIDE.md)

**...add the mascot**
→ See [Component Usage Guide - NeoCore](./COMPONENT_USAGE_GUIDE.md#neocore)

**...add a floating action button**
→ See [Component Usage Guide - FAB](./COMPONENT_USAGE_GUIDE.md#floatingactionbutton)

**...create a form**
→ See [Migration Guide - Form Migration](./MIGRATION_GUIDE.md#form-migration)

**...use icons**
→ See [Migration Guide - Icon Migration](./MIGRATION_GUIDE.md#icon-migration)

**...customize component styles**
→ See [Shadcn/UI Customization Guide](./SHADCN_CUSTOMIZATION.md)

**...change colors or theme**
→ See [Theme Customization Guide](./THEME_CUSTOMIZATION.md)

**...configure animations**
→ See [Animation Patterns Guide - Spring Physics](./ANIMATION_PATTERNS.md#spring-physics)

---

## 🎓 Learning Path

### For New Developers

1. Read this README for overview
2. Review [Component Usage Guide](./COMPONENT_USAGE_GUIDE.md) for available components
3. Try the [Quick Start](#quick-start) example
4. Explore [Animation Patterns Guide](./ANIMATION_PATTERNS.md) for motion design
5. Learn [Responsive Behavior Guide](./RESPONSIVE_BEHAVIOR.md) for adaptive design

### For Migrating Existing Code

1. Read [Migration Guide](./MIGRATION_GUIDE.md) overview
2. Follow component-specific migration patterns
3. Use the [Migration Checklist](./MIGRATION_GUIDE.md#migration-checklist)
4. Reference other guides as needed

### For Advanced Usage

1. Study [Animation Patterns Guide](./ANIMATION_PATTERNS.md) for complex animations
2. Review [Responsive Behavior Guide](./RESPONSIVE_BEHAVIOR.md) for advanced patterns
3. Explore source code in `src/components/layout/` and `src/lib/`
4. Experiment with custom variants and configurations

---

## 📋 Best Practices

### Component Usage

✅ **Do**:
- Use Shadcn/UI components for consistency
- Add animations to interactive elements
- Make components responsive
- Use theme tokens for colors
- Use Lucide icons for consistency

❌ **Don't**:
- Create custom components when Shadcn/UI has an equivalent
- Use hardcoded colors instead of theme tokens
- Mix icon libraries
- Animate non-GPU properties
- Ignore mobile users

### Animation

✅ **Do**:
- Use spring physics for natural motion
- Keep animations under 300ms
- Use AnimatePresence for exit animations
- Animate transform and opacity only
- Respect reduced motion preferences

❌ **Don't**:
- Make animations too slow (> 500ms)
- Animate width, height, or position
- Stack animations
- Use animations without purpose
- Make animations too dramatic

### Responsive Design

✅ **Do**:
- Design mobile-first
- Use responsive hooks
- Test on real devices
- Ensure touch targets ≥ 44px on mobile
- Use appropriate input types

❌ **Don't**:
- Hardcode breakpoints
- Ignore tablet sizes
- Use desktop-only patterns on mobile
- Make touch targets too small
- Forget to test on mobile

---

## 🛠️ Development Tools

### VS Code Extensions (Recommended)

- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **ES7+ React/Redux/React-Native snippets**: React snippets
- **TypeScript**: Built-in TypeScript support

### Browser DevTools

- **React Developer Tools**: Inspect React components
- **Responsive Design Mode**: Test different screen sizes
- **Performance Monitor**: Profile animations

### Testing

- **Mobile Testing**: Use real devices or browser DevTools
- **Accessibility Testing**: Use axe DevTools or Lighthouse
- **Performance Testing**: Use Chrome DevTools Performance tab

---

## 📚 External Resources

### Official Documentation

- [Shadcn/UI](https://ui.shadcn.com) - Component library
- [Framer Motion](https://www.framer.com/motion) - Animation library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Lucide Icons](https://lucide.dev) - Icon library
- [Radix UI](https://www.radix-ui.com) - Primitive components

### Learning Resources

- [Framer Motion Tutorial](https://www.framer.com/motion/introduction/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

---

## 🤝 Contributing

When adding new components or patterns:

1. Follow existing patterns and conventions
2. Add comprehensive documentation
3. Include usage examples
4. Test on multiple devices
5. Ensure accessibility
6. Update relevant guides

---

## 📞 Getting Help

If you need help:

1. Check the relevant guide in this documentation
2. Look at existing component implementations
3. Review the external resources
4. Ask the team for guidance

---

## 📝 Documentation Index

- **[Component Usage Guide](./COMPONENT_USAGE_GUIDE.md)** - How to use components
- **[Animation Patterns Guide](./ANIMATION_PATTERNS.md)** - Animation usage and patterns
- **[Responsive Behavior Guide](./RESPONSIVE_BEHAVIOR.md)** - Responsive design patterns
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Migrating existing components
- **[Shadcn/UI Customization Guide](./SHADCN_CUSTOMIZATION.md)** - Customizing UI components
- **[Theme Customization Guide](./THEME_CUSTOMIZATION.md)** - Customizing colors and theme

---

## 🎉 Quick Reference

### Import Paths

```typescript
// Layout Components
import { PageTransition } from '@/components/layout/PageTransition';
import { GlassHeader } from '@/components/layout/GlassHeader';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { NeoCore } from '@/components/layout/NeoCore';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

// Animations
import {
  scaleOnHover,
  fadeInUp,
  slideFromBottom,
  pageTransition,
  modalAnimation,
  springTransition,
} from '@/lib/animations';

// Responsive Hooks
import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useResponsiveConfig,
  useBreakpointValue,
} from '@/hooks/useMediaQuery';

// Icons
import { Plus, Settings, Menu, X } from 'lucide-react';
```

### Common Patterns

```typescript
// Animated button
<motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
  <Button>Click me</Button>
</motion.div>

// Responsive modal
<BottomSheet open={open} onOpenChange={setOpen} title="Title">
  {content}
</BottomSheet>

// Page with transition
<PageTransition>
  <GlassHeader title="Page" />
  <main>{content}</main>
</PageTransition>

// Loading state
{isLoading ? (
  <Skeleton className="h-12 w-full" />
) : (
  <motion.div variants={fadeInUp} initial="initial" animate="animate">
    {content}
  </motion.div>
)}

// Responsive behavior
const isMobile = useIsMobile();
return isMobile ? <MobileView /> : <DesktopView />;
```

---

**Happy coding! 🚀**

