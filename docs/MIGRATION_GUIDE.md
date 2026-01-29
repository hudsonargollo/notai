# Migration Guide

This guide helps you migrate existing custom components to use the Native UI system with Shadcn/UI components, Framer Motion animations, and responsive patterns.

## Table of Contents

1. [Migration Overview](#migration-overview)
2. [Component Migration Patterns](#component-migration-patterns)
3. [Animation Migration](#animation-migration)
4. [Styling Migration](#styling-migration)
5. [Icon Migration](#icon-migration)
6. [Form Migration](#form-migration)
7. [Modal Migration](#modal-migration)
8. [Common Pitfalls](#common-pitfalls)
9. [Migration Checklist](#migration-checklist)

---

## Migration Overview

### Why Migrate?

**Benefits of Native UI System**:
- ✅ Accessible by default (WCAG AA compliant)
- ✅ Consistent design language
- ✅ Smooth animations with spring physics
- ✅ Responsive behavior built-in
- ✅ Better performance
- ✅ Easier maintenance
- ✅ Professional, native-like feel

### Migration Strategy

1. **Incremental Migration**: Migrate one component at a time
2. **Test Thoroughly**: Ensure functionality is preserved
3. **Maintain Compatibility**: Keep old components until migration is complete
4. **Update Gradually**: No need to migrate everything at once

---

## Component Migration Patterns

### Button Migration

**Before** (Custom Button):
```tsx
// Old custom button
<button
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  onClick={handleClick}
>
  Click me
</button>
```

**After** (Shadcn Button with Animation):
```tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { scaleOnHover } from '@/lib/animations';

<motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
  <Button onClick={handleClick}>
    Click me
  </Button>
</motion.div>
```

**With Icon**:
```tsx
import { Plus } from 'lucide-react';

<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

---

### Card Migration

**Before** (Custom Card):
```tsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h3 className="text-lg font-semibold mb-2">{title}</h3>
  <p className="text-gray-600">{description}</p>
</div>
```

**After** (Shadcn Card with Animation):
```tsx
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { scaleOnHover } from '@/lib/animations';

<motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Additional content */}
    </CardContent>
  </Card>
</motion.div>
```

---

### Input Migration

**Before** (Custom Input):
```tsx
<div>
  <label htmlFor="email" className="block text-sm font-medium mb-1">
    Email
  </label>
  <input
    id="email"
    type="email"
    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
    placeholder="Enter email"
  />
</div>
```

**After** (Shadcn Input with Label):
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter email"
  />
</div>
```

---

### Loading State Migration

**Before** (Spinner):
```tsx
{isLoading ? (
  <div className="flex justify-center">
    <div className="spinner" />
  </div>
) : (
  <div>{content}</div>
)}
```

**After** (Skeleton Loader):
```tsx
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

{isLoading ? (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
) : (
  <motion.div variants={fadeInUp} initial="initial" animate="animate">
    {content}
  </motion.div>
)}
```

---

## Animation Migration

### CSS Transitions to Framer Motion

**Before** (CSS Transition):
```tsx
<div
  className="transition-all duration-300 hover:scale-105"
  onClick={handleClick}
>
  {content}
</div>
```

**After** (Framer Motion):
```tsx
import { motion } from 'framer-motion';
import { scaleOnHover } from '@/lib/animations';

<motion.div
  whileHover="hover"
  whileTap="tap"
  variants={scaleOnHover}
  onClick={handleClick}
>
  {content}
</motion.div>
```

---

### Page Transitions

**Before** (No Transition):
```tsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
```

**After** (With PageTransition):
```tsx
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}
```

---

### List Animations

**Before** (No Animation):
```tsx
{items.map(item => (
  <div key={item.id}>{item.content}</div>
))}
```

**After** (Staggered Animation):
```tsx
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

<motion.div
  variants={staggerContainer}
  initial="initial"
  animate="animate"
>
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Styling Migration

### Tailwind Class Migration

**Before** (Custom Classes):
```tsx
<div className="bg-white text-black border-gray-300">
  {content}
</div>
```

**After** (Theme Tokens):
```tsx
<div className="bg-background text-foreground border-border">
  {content}
</div>
```

### Common Token Mappings

| Old Class | New Token | Description |
|-----------|-----------|-------------|
| `bg-white` | `bg-background` | Background color |
| `text-black` | `text-foreground` | Text color |
| `bg-gray-100` | `bg-card` | Card background |
| `text-gray-600` | `text-muted-foreground` | Muted text |
| `border-gray-300` | `border-border` | Border color |
| `bg-blue-500` | `bg-primary` | Primary color |
| `text-blue-500` | `text-primary` | Primary text |
| `bg-red-500` | `bg-destructive` | Destructive color |

---

### Dark Mode Support

**Before** (Manual Dark Mode):
```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  {content}
</div>
```

**After** (Automatic with Tokens):
```tsx
<div className="bg-background text-foreground">
  {content}
</div>
```

---

## Icon Migration

### Custom SVG to Lucide Icons

**Before** (Custom SVG):
```tsx
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" />
</svg>
```

**After** (Lucide Icon):
```tsx
import { Plus } from 'lucide-react';

<Plus className="h-6 w-6" />
```

---

### Icon Library Migration

**Common Icon Mappings**:

| Purpose | Lucide Icon | Import |
|---------|-------------|--------|
| Add/Create | `Plus` | `import { Plus } from 'lucide-react'` |
| Delete | `Trash2` | `import { Trash2 } from 'lucide-react'` |
| Edit | `Pencil` | `import { Pencil } from 'lucide-react'` |
| Settings | `Settings` | `import { Settings } from 'lucide-react'` |
| Search | `Search` | `import { Search } from 'lucide-react'` |
| Menu | `Menu` | `import { Menu } from 'lucide-react'` |
| Close | `X` | `import { X } from 'lucide-react'` |
| Check | `Check` | `import { Check } from 'lucide-react'` |
| Arrow Right | `ArrowRight` | `import { ArrowRight } from 'lucide-react'` |
| Home | `Home` | `import { Home } from 'lucide-react'` |
| User | `User` | `import { User } from 'lucide-react'` |
| Camera | `Camera` | `import { Camera } from 'lucide-react'` |

**Icon Sizing**:
```tsx
// Small (inline with text)
<Plus className="h-4 w-4" />

// Medium (standalone)
<Plus className="h-5 w-5" />

// Large (prominent)
<Plus className="h-6 w-6" />
```

---

## Form Migration

### Basic Form Migration

**Before** (Custom Form):
```tsx
<form onSubmit={handleSubmit}>
  <div>
    <label>Name</label>
    <input type="text" name="name" />
  </div>
  <div>
    <label>Email</label>
    <input type="email" name="email" />
  </div>
  <button type="submit">Submit</button>
</form>
```

**After** (Shadcn Form):
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

<form onSubmit={handleSubmit} className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input id="name" type="text" name="name" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" name="email" />
  </div>
  <Button type="submit">Submit</Button>
</form>
```

---

### Form with Validation

**After** (With React Hook Form):
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

---

## Modal Migration

### Simple Modal Migration

**Before** (Custom Modal):
```tsx
{isOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 max-w-md">
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
)}
```

**After** (Shadcn Dialog):
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </DialogContent>
</Dialog>
```

---

### Responsive Modal Migration

**Before** (Same modal on all devices):
```tsx
{isOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6">
      {content}
    </div>
  </div>
)}
```

**After** (Responsive with BottomSheet):
```tsx
import { BottomSheet } from '@/components/layout/BottomSheet';

<BottomSheet
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Modal Title"
  description="Modal description"
>
  {content}
</BottomSheet>
```

This automatically uses:
- Bottom sheet on mobile (< 768px)
- Centered dialog on desktop (≥ 768px)

---

## Common Pitfalls

### 1. Forgetting AnimatePresence

❌ **Wrong**:
```tsx
{isVisible && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {content}
  </motion.div>
)}
```

✅ **Correct**:
```tsx
import { AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

---

### 2. Not Using Theme Tokens

❌ **Wrong**:
```tsx
<div className="bg-white text-black border-gray-300">
```

✅ **Correct**:
```tsx
<div className="bg-background text-foreground border-border">
```

---

### 3. Inconsistent Icon Sizes

❌ **Wrong**:
```tsx
<Plus className="w-5 h-6" />  // Different width and height
```

✅ **Correct**:
```tsx
<Plus className="h-5 w-5" />  // Same width and height
```

---

### 4. Missing Keys in Lists

❌ **Wrong**:
```tsx
{items.map(item => (
  <motion.div>{item.content}</motion.div>
))}
```

✅ **Correct**:
```tsx
{items.map(item => (
  <motion.div key={item.id}>{item.content}</motion.div>
))}
```

---

### 5. Animating Non-GPU Properties

❌ **Wrong** (CPU-intensive):
```tsx
<motion.div animate={{ width: 200, height: 200 }}>
```

✅ **Correct** (GPU-accelerated):
```tsx
<motion.div animate={{ scale: 1.5, opacity: 1 }}>
```

---

### 6. Not Handling Mobile Touch Targets

❌ **Wrong**:
```tsx
<Button className="h-6 w-6">  // Too small for touch
```

✅ **Correct**:
```tsx
<Button className="min-h-[44px] min-w-[44px] md:min-h-[32px] md:min-w-[32px]">
```

---

### 7. Hardcoding Breakpoints

❌ **Wrong**:
```tsx
const isMobile = window.innerWidth < 768;  // Doesn't update on resize
```

✅ **Correct**:
```tsx
import { useIsMobile } from '@/hooks/useMediaQuery';

const isMobile = useIsMobile();  // Updates on resize
```

---

## Migration Checklist

Use this checklist when migrating a component:

### Component Structure
- [ ] Replaced custom components with Shadcn/UI equivalents
- [ ] Added proper TypeScript types
- [ ] Used semantic HTML elements
- [ ] Added proper ARIA attributes

### Styling
- [ ] Replaced hardcoded colors with theme tokens
- [ ] Used Tailwind utility classes
- [ ] Ensured dark mode compatibility
- [ ] Applied consistent spacing

### Icons
- [ ] Replaced custom SVGs with Lucide icons
- [ ] Used consistent icon sizes (h-4 w-4, h-5 w-5, h-6 w-6)
- [ ] Applied proper spacing around icons

### Animations
- [ ] Added Framer Motion animations where appropriate
- [ ] Used spring physics for natural motion
- [ ] Added AnimatePresence for exit animations
- [ ] Used GPU-accelerated properties only

### Responsive Behavior
- [ ] Tested on mobile (< 768px)
- [ ] Tested on tablet (768px - 1023px)
- [ ] Tested on desktop (≥ 1024px)
- [ ] Used responsive hooks (useIsMobile, etc.)
- [ ] Ensured touch targets are ≥ 44px on mobile

### Accessibility
- [ ] Added proper labels to form inputs
- [ ] Ensured keyboard navigation works
- [ ] Added focus indicators
- [ ] Tested with screen reader
- [ ] Verified color contrast ratios

### Performance
- [ ] Used Skeleton loaders for loading states
- [ ] Prevented layout shifts
- [ ] Optimized animations (< 300ms)
- [ ] Tested on lower-end devices

### Testing
- [ ] Functionality preserved
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Visual appearance matches design
- [ ] Animations feel smooth

---

## Migration Examples

### Complete Component Migration

**Before** (Custom Component):
```tsx
// OldModal.tsx
import { useState } from 'react';

interface OldModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function OldModal({ isOpen, onClose, title, children }: OldModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
```

**After** (Native UI Component):
```tsx
// NewModal.tsx
import { BottomSheet } from '@/components/layout/BottomSheet';

interface NewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function NewModal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: NewModalProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      {children}
    </BottomSheet>
  );
}
```

**Usage Update**:
```tsx
// Before
<OldModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
  {content}
</OldModal>

// After
<NewModal open={isOpen} onOpenChange={setIsOpen} title="My Modal">
  {content}
</NewModal>
```

---

## Next Steps

- See [Component Usage Guide](./COMPONENT_USAGE_GUIDE.md) for detailed component examples
- See [Animation Patterns Guide](./ANIMATION_PATTERNS.md) for animation usage
- See [Responsive Behavior Guide](./RESPONSIVE_BEHAVIOR.md) for responsive patterns

---

## Getting Help

If you encounter issues during migration:

1. Check the [Component Usage Guide](./COMPONENT_USAGE_GUIDE.md) for examples
2. Review the [Shadcn/UI documentation](https://ui.shadcn.com)
3. Check the [Framer Motion documentation](https://www.framer.com/motion)
4. Look at existing migrated components for reference
5. Ask the team for help

