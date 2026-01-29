# Component Usage Guide

This guide provides comprehensive examples and best practices for using the Native UI components in the NotAI application.

## Table of Contents

1. [Layout Components](#layout-components)
   - [PageTransition](#pagetransition)
   - [GlassHeader](#glassheader)
   - [BottomSheet](#bottomsheet)
   - [FloatingActionButton](#floatingactionbutton)
   - [NeoCore](#neocore)
2. [UI Components (Shadcn/UI)](#ui-components)
3. [Animation Patterns](#animation-patterns)
4. [Responsive Behavior](#responsive-behavior)
5. [Best Practices](#best-practices)

---

## Layout Components

### PageTransition

**Purpose**: Provides smooth slide animations when navigating between views.

**When to use**:
- Wrapping page-level content in a routed application
- Creating smooth transitions between different views
- Providing visual feedback during navigation

**Basic Usage**:

```tsx
import { PageTransition } from '@/components/layout/PageTransition';

function MyPage() {
  return (
    <PageTransition>
      <div>
        <h1>My Page Content</h1>
        {/* Your page content */}
      </div>
    </PageTransition>
  );
}
```

**With React Router**:

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
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}
```

**With Direction Control**:

```tsx
import { useState } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';

function NavigationExample() {
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const handleNext = () => {
    setDirection('forward');
    // Navigate to next page
  };

  const handleBack = () => {
    setDirection('backward');
    // Navigate to previous page
  };

  return (
    <PageTransition direction={direction}>
      {/* Page content */}
    </PageTransition>
  );
}
```

**Using PageTransitionWrapper** (includes AnimatePresence):

```tsx
import { PageTransitionWrapper } from '@/components/layout/PageTransition';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  return (
    <PageTransitionWrapper pageKey={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
      </Routes>
    </PageTransitionWrapper>
  );
}
```

**Props**:
- `children`: React.ReactNode - Content to animate
- `direction`: 'forward' | 'backward' - Navigation direction (default: 'forward')
- `pageKey`: string - Unique key for AnimatePresence (optional)

**Animation Details**:
- Duration: ~300ms with spring physics
- Forward: Slides in from right (x: 20), exits to left (x: -20)
- Backward: Slides in from left (x: -20), exits to right (x: 20)
- Includes fade effect (opacity: 0 to 1)

---

### GlassHeader

**Purpose**: Header component with glassmorphism effects (backdrop blur) for modern, premium UI.

**When to use**:
- Page headers with navigation
- Sticky headers that overlay content
- Headers that need to maintain readability over dynamic backgrounds

**Basic Usage**:

```tsx
import { GlassHeader } from '@/components/layout/GlassHeader';

function MyPage() {
  return (
    <>
      <GlassHeader title="Dashboard" />
      <main>{/* Page content */}</main>
    </>
  );
}
```

**With Actions**:

```tsx
import { GlassHeader } from '@/components/layout/GlassHeader';
import { Button } from '@/components/ui/button';
import { Settings, Bell } from 'lucide-react';

function MyPage() {
  return (
    <GlassHeader
      title="Dashboard"
      actions={
        <>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </>
      }
    />
  );
}
```

**With Subtitle**:

```tsx
<GlassHeader
  title="Dashboard"
  subtitle="Welcome back, John!"
/>
```

**Non-Sticky Header**:

```tsx
<GlassHeader
  title="Profile"
  sticky={false}
/>
```

**Compact Version** (for mobile or space-constrained layouts):

```tsx
import { GlassHeaderCompact } from '@/components/layout/GlassHeader';

function MobileView() {
  return (
    <GlassHeaderCompact
      title="Settings"
      actions={<Button size="icon" variant="ghost">×</Button>}
    />
  );
}
```

**Props**:
- `title`: string - Header title (required)
- `subtitle`: string - Optional subtitle text
- `actions`: React.ReactNode - Optional action buttons or elements
- `sticky`: boolean - Whether header sticks to top on scroll (default: true)
- `className`: string - Additional CSS classes

**Styling Details**:
- Backdrop blur: `backdrop-blur-md`
- Background: `bg-background/80` (80% opacity)
- Border: `border-b border-border/50` (subtle bottom border)
- Height: 64px (h-16) for standard, 48px (h-12) for compact
- Z-index: 50 when sticky

---

### BottomSheet

**Purpose**: Responsive modal that adapts to screen size - bottom sheet on mobile, centered dialog on desktop.

**When to use**:
- Action menus that need to work on both mobile and desktop
- Forms that should be accessible on all devices
- Confirmation dialogs with responsive behavior
- Any modal content that needs mobile-first design

**Basic Usage**:

```tsx
import { useState } from 'react';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { Button } from '@/components/ui/button';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Menu</Button>
      
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Action Menu"
      >
        <div className="space-y-4">
          <Button className="w-full">Action 1</Button>
          <Button className="w-full">Action 2</Button>
          <Button className="w-full">Action 3</Button>
        </div>
      </BottomSheet>
    </>
  );
}
```

**With Description**:

```tsx
<BottomSheet
  open={open}
  onOpenChange={setOpen}
  title="Confirm Delete"
  description="Are you sure you want to delete this item? This action cannot be undone."
>
  <div className="flex gap-2 mt-4">
    <Button variant="outline" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  </div>
</BottomSheet>
```

**Form Example**:

```tsx
import { BottomSheet } from '@/components/layout/BottomSheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function AddItemForm() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setOpen(false);
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={setOpen}
      title="Add New Item"
      description="Fill in the details below"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter name" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" placeholder="Enter description" />
        </div>
        <Button type="submit" className="w-full">
          Add Item
        </Button>
      </form>
    </BottomSheet>
  );
}
```

**With BottomSheetTrigger**:

```tsx
import { BottomSheet, BottomSheetTrigger } from '@/components/layout/BottomSheet';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <BottomSheetTrigger onClick={() => setOpen(true)}>
        <Button>Open Menu</Button>
      </BottomSheetTrigger>
      
      <BottomSheet open={open} onOpenChange={setOpen}>
        {/* Content */}
      </BottomSheet>
    </>
  );
}
```

**Props**:
- `open`: boolean - Whether the sheet/dialog is open (required)
- `onOpenChange`: (open: boolean) => void - Callback when open state changes (required)
- `children`: React.ReactNode - Sheet/dialog content (required)
- `title`: string - Optional title
- `description`: string - Optional description
- `className`: string - Additional CSS classes for content

**Responsive Behavior**:
- **Mobile (< 768px)**: Uses Sheet component, slides up from bottom
- **Desktop (>= 768px)**: Uses Dialog component, centered modal
- **Mobile features**: Visual handle indicator, swipe-to-dismiss gesture
- **Desktop features**: Standard modal with backdrop click to close

---

### FloatingActionButton

**Purpose**: Prominent circular button for primary actions, positioned in bottom-right corner.

**When to use**:
- Primary actions that should always be accessible
- Quick access to common tasks (e.g., "Add", "Create", "Scan")
- Actions that need to be visible while scrolling
- Multiple related actions (expandable FAB)

**Simple FAB**:

```tsx
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { Plus } from 'lucide-react';

function MyPage() {
  const handleAdd = () => {
    console.log('Add clicked');
  };

  return (
    <>
      {/* Page content */}
      <FloatingActionButton
        icon={Plus}
        label="Add new item"
        onClick={handleAdd}
      />
    </>
  );
}
```

**Expandable FAB with Secondary Actions**:

```tsx
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { Plus, Camera, FileText, Upload } from 'lucide-react';

function MyPage() {
  return (
    <FloatingActionButton
      icon={Plus}
      label="Add"
      secondaryActions={[
        {
          icon: Camera,
          label: "Scan receipt",
          onClick: () => console.log('Scan'),
        },
        {
          icon: FileText,
          label: "Manual entry",
          onClick: () => console.log('Manual'),
        },
        {
          icon: Upload,
          label: "Upload file",
          onClick: () => console.log('Upload'),
        },
      ]}
    />
  );
}
```

**Large FAB**:

```tsx
<FloatingActionButton
  icon={Plus}
  label="Add"
  onClick={handleAdd}
  size="lg"
/>
```

**Custom Position**:

```tsx
<FloatingActionButton
  icon={Plus}
  label="Add"
  onClick={handleAdd}
  className="bottom-20 right-4"
/>
```

**Multiple FABs with FABGroup**:

```tsx
import { FABGroup, FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { Plus, Filter, Search } from 'lucide-react';

function MyPage() {
  return (
    <FABGroup>
      <FloatingActionButton
        icon={Plus}
        label="Add"
        onClick={handleAdd}
      />
      <FloatingActionButton
        icon={Filter}
        label="Filter"
        onClick={handleFilter}
      />
      <FloatingActionButton
        icon={Search}
        label="Search"
        onClick={handleSearch}
      />
    </FABGroup>
  );
}
```

**Props**:
- `icon`: React.ComponentType - Icon component (required)
- `label`: string - Accessibility label (required)
- `onClick`: () => void - Click handler (optional if secondaryActions provided)
- `secondaryActions`: FABAction[] - Optional secondary actions
- `size`: 'default' | 'lg' - Size variant (default: 'default')
- `className`: string - Additional CSS classes

**FABAction Interface**:
```typescript
interface FABAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}
```

**Animation Details**:
- Hover: Scale 1.02 with spring physics
- Tap: Scale 0.98 with spring physics
- Expand: Secondary actions fade in with stagger (50ms delay between each)
- Primary icon rotates 45° when expanded

---

### NeoCore

**Purpose**: Animated 3D cube mascot that provides visual personality and state feedback.

**When to use**:
- Dashboard hero element
- Loading/processing indicators with personality
- Interactive mascot for user engagement
- Visual feedback for system states

**Basic Usage**:

```tsx
import { useState } from 'react';
import { NeoCore, NeoState } from '@/components/layout/NeoCore';

function Dashboard() {
  const [state, setState] = useState<NeoState>('idle');

  return (
    <div className="flex flex-col items-center pt-12">
      <NeoCore state={state} />
    </div>
  );
}
```

**Interactive with Click Handler**:

```tsx
import { NeoCore, NeoState } from '@/components/layout/NeoCore';

function Dashboard() {
  const [state, setState] = useState<NeoState>('idle');

  const handleClick = () => {
    setState('processing');
    // Simulate processing
    setTimeout(() => setState('success'), 2000);
    setTimeout(() => setState('idle'), 3000);
  };

  return (
    <NeoCore
      state={state}
      onClick={handleClick}
      size={140}
    />
  );
}
```

**With Speech Bubble**:

```tsx
import { motion } from 'framer-motion';
import { NeoCore, NeoState } from '@/components/layout/NeoCore';

function Dashboard() {
  const [state, setState] = useState<NeoState>('idle');

  const messages = {
    idle: "Ready when you are.",
    listening: "I'm listening...",
    processing: "Processing your request...",
    success: "All done!",
  };

  return (
    <div className="flex flex-col items-center">
      <NeoCore state={state} size={140} />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 px-4 py-2 bg-neutral-900 border border-neutral-800 
                   rounded-full text-xs font-mono text-neutral-400"
      >
        {messages[state]}
      </motion.div>
    </div>
  );
}
```

**State Management Example**:

```tsx
import { useEffect, useState } from 'react';
import { NeoCore, NeoState } from '@/components/layout/NeoCore';

function Dashboard() {
  const [state, setState] = useState<NeoState>('idle');
  const [isLoading, setIsLoading] = useState(false);

  // Update NeoCore state based on app state
  useEffect(() => {
    if (isLoading) {
      setState('processing');
    } else {
      setState('idle');
    }
  }, [isLoading]);

  const handleAction = async () => {
    setIsLoading(true);
    setState('listening');
    
    try {
      await performAction();
      setState('success');
      setTimeout(() => setState('idle'), 2000);
    } catch (error) {
      setState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NeoCore state={state} onClick={handleAction} />
    </div>
  );
}
```

**Props**:
- `state`: NeoState - Current state ('idle' | 'listening' | 'processing' | 'success') (required)
- `size`: number - Size in pixels (default: 120)
- `onClick`: () => void - Click handler for interactive state changes (optional)
- `className`: string - Additional CSS classes

**State Behaviors**:

| State | Animation | Border Color | Description |
|-------|-----------|--------------|-------------|
| `idle` | Slow rotation (12s), floating motion (4s) | Neon lime | Default resting state |
| `listening` | Slower rotation (20s), breathing scale (1.6s) | Neon lime | Waiting for input |
| `processing` | Rapid rotation (1-1.5s), glitchy vibration | Electric purple | Processing data |
| `success` | Locks to isometric view (25°, 45°), spring animation | Neon lime | Operation complete |

**Visual Features**:
- 3D cube with 6 faces using CSS transforms
- Circuit detail overlays on each face
- Internal glowing core (visible during listening state)
- Ground reflection effect
- Perspective: 800px for 3D depth
- Pure CSS 3D (no Three.js required)

---

## UI Components

The application uses Shadcn/UI components built on Radix UI primitives. These components are accessible by default and follow consistent styling patterns.

### Available Components

- **Button**: `@/components/ui/button`
- **Card**: `@/components/ui/card`
- **Command**: `@/components/ui/command`
- **Dialog**: `@/components/ui/dialog`
- **Form**: `@/components/ui/form`
- **Input**: `@/components/ui/input`
- **Label**: `@/components/ui/label`
- **Select**: `@/components/ui/select`
- **Sheet**: `@/components/ui/sheet`
- **Skeleton**: `@/components/ui/skeleton`

### Button Examples

```tsx
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Plus className="h-4 w-4" /></Button>

// With icon
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

### Dialog Examples

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function MyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            Dialog description text
          </DialogDescription>
        </DialogHeader>
        <div>{/* Dialog content */}</div>
      </DialogContent>
    </Dialog>
  );
}
```

### Skeleton Examples

```tsx
import { Skeleton } from '@/components/ui/skeleton';

// Single skeleton
<Skeleton className="h-12 w-full" />

// Multiple skeletons for list
<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-full" />
</div>

// Card skeleton
<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
</div>
```

For complete documentation on Shadcn/UI components, see the [Animation Patterns Guide](./ANIMATION_PATTERNS.md).

---

## Next Steps

- See [Animation Patterns Guide](./ANIMATION_PATTERNS.md) for detailed animation usage
- See [Responsive Behavior Guide](./RESPONSIVE_BEHAVIOR.md) for responsive patterns
- See [Migration Guide](./MIGRATION_GUIDE.md) for migrating custom components

