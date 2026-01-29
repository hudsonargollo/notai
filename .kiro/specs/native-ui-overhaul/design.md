# Design Document: Native UI Overhaul

## Overview

This design transforms NotAI from a standard web application into a high-end, native-feeling experience through strategic use of modern web technologies. The transformation focuses on three pillars: **motion design** (Framer Motion for fluid transitions), **accessible components** (Shadcn/UI for professional, WCAG-compliant interfaces), and **visual refinement** (Lucide icons, glassmorphism, and sophisticated dark theming).

The design maintains the existing React + TypeScript architecture while introducing a cohesive design system that eliminates generic aesthetics. All changes are additive and non-breaking, allowing for incremental migration of existing components.

### Design Philosophy

**Subtle Sophistication**: The interface should feel expensive and refined without being ostentatious. Every animation serves a purpose (providing feedback or guiding attention), every component is accessible by default, and every visual detail contributes to a cohesive whole.

**Performance First**: Native apps feel fast because they prioritize perceived performance. This design uses skeleton loaders to prevent layout shifts, spring physics for natural motion, and optimized animations that complete within 300ms.

**Platform Awareness**: The interface adapts to its context - bottom sheets on mobile, modals on desktop, keyboard shortcuts for power users, and touch-friendly targets for mobile users.

## Architecture

### Technology Stack

**Core Framework**:
- React 18+ (existing)
- TypeScript (existing)
- Tailwind CSS (existing)

**New Dependencies**:
- `@radix-ui/react-*` (via Shadcn/UI) - Accessible component primitives
- `framer-motion` - Animation and gesture library
- `lucide-react` - Icon library
- `cmdk` - Command menu component
- `clsx` + `tailwind-merge` - Utility for conditional class merging

**Custom Theme Colors** (for NeoCore mascot):
- `void`: #050505 (Deepest Black)
- `neon`: #CCFF00 (Cyber Lime)
- `electric`: #7928CA (Secondary Logic Color)

**Design System Structure**:
```
src/
├── components/
│   ├── ui/              # Shadcn/UI components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx
│   │   ├── command.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   ├── layout/          # Layout wrappers
│   │   ├── PageTransition.tsx
│   │   ├── GlassHeader.tsx
│   │   ├── BottomSheet.tsx
│   │   └── NeoCore.tsx  # 3D animated mascot
│   └── [existing components]
├── lib/
│   ├── utils.ts         # cn() utility for class merging
│   └── animations.ts    # Reusable animation variants
├── styles/
│   └── globals.css      # Tailwind + custom CSS variables
└── hooks/
    └── useMediaQuery.ts # Responsive behavior hook
```

### Animation System

**Framer Motion Integration**:

All page-level transitions use `AnimatePresence` with layout animations:

```typescript
// PageTransition.tsx wrapper
<AnimatePresence mode="wait" initial={false}>
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

**Spring Physics Configuration**:
- **Stiffness**: 300 (responsive but not jarring)
- **Damping**: 30 (slight bounce for natural feel)
- **Duration**: Target 200-300ms for all transitions

**Reusable Animation Variants** (lib/animations.ts):

```typescript
export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const slideFromBottom = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" }
};
```

### Responsive Strategy

**Breakpoint System** (Tailwind defaults):
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

**Mobile-First Patterns**:
- Bottom sheets for actions below 768px
- Standard modals above 768px
- Touch targets minimum 44x44px
- Swipe gestures for dismissal on mobile

**useMediaQuery Hook**:
```typescript
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}
```

## Components and Interfaces

### Core UI Components (Shadcn/UI)

All Shadcn/UI components follow a consistent pattern:
1. Built on Radix UI primitives for accessibility
2. Styled with Tailwind utility classes
3. Customizable via `className` prop
4. Type-safe with TypeScript

**Button Component**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

// Usage with Framer Motion
<motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
  <Button variant="default" size="lg">
    <LucideIcon className="mr-2 h-4 w-4" />
    Action
  </Button>
</motion.div>
```

**Dialog/Modal Component**:
```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

// Automatically handles focus trapping, ESC key, backdrop click
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

**Sheet Component** (for mobile bottom sheets):
```typescript
interface SheetProps {
  side?: "top" | "right" | "bottom" | "left";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mobile-first usage
const isMobile = useMediaQuery("(max-width: 768px)");

{isMobile ? (
  <Sheet side="bottom" open={isOpen} onOpenChange={setIsOpen}>
    <SheetContent>
      {/* Mobile content */}
    </SheetContent>
  </Sheet>
) : (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    {/* Desktop content */}
  </Dialog>
)}
```

**Command Menu Component**:
```typescript
interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Global keyboard shortcut (CMD+K / CTRL+K)
<Command>
  <CommandInput placeholder="Search commands..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Navigation">
      <CommandItem onSelect={() => navigate('/dashboard')}>
        <Home className="mr-2 h-4 w-4" />
        Dashboard
      </CommandItem>
      {/* More items */}
    </CommandGroup>
  </CommandList>
</Command>
```

**Skeleton Loader Component**:
```typescript
interface SkeletonProps {
  className?: string;
}

// Prevents layout shift during loading
<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-full" />
</div>
```

### Layout Components

**PageTransition Wrapper**:
```typescript
interface PageTransitionProps {
  children: React.ReactNode;
  direction?: "forward" | "backward";
}

export function PageTransition({ children, direction = "forward" }: PageTransitionProps) {
  const variants = {
    initial: { opacity: 0, x: direction === "forward" ? 20 : -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === "forward" ? -20 : 20 }
  };
  
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={springTransition}
    >
      {children}
    </motion.div>
  );
}
```

**GlassHeader Component**:
```typescript
interface GlassHeaderProps {
  title: string;
  actions?: React.ReactNode;
  sticky?: boolean;
}

export function GlassHeader({ title, actions, sticky = true }: GlassHeaderProps) {
  return (
    <header className={cn(
      "backdrop-blur-md bg-background/80 border-b border-border/50",
      sticky && "sticky top-0 z-50"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {actions}
      </div>
    </header>
  );
}
```

**BottomSheet Component** (mobile-optimized):
```typescript
interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  snapPoints?: number[];
}

export function BottomSheet({ open, onOpenChange, children, snapPoints }: BottomSheetProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Sheet side="bottom" open={open} onOpenChange={onOpenChange}>
      <SheetContent className="rounded-t-xl">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mb-4" />
        {children}
      </SheetContent>
    </Sheet>
  );
}
```

**FloatingActionButton Component**:
```typescript
interface FABProps {
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  label: string;
  secondaryActions?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
  }>;
}

export function FloatingActionButton({ icon: Icon, onClick, label, secondaryActions }: FABProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {expanded && secondaryActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {secondaryActions.map((action, i) => (
              <Button
                key={i}
                size="icon"
                variant="secondary"
                onClick={action.onClick}
                className="shadow-lg"
              >
                <action.icon className="h-4 w-4" />
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={secondaryActions ? () => setExpanded(!expanded) : onClick}
        >
          <Icon className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
```

### Component Migration Strategy

**Existing Components to Migrate**:
1. **BudgetModal** → Use Dialog/BottomSheet with Form components
2. **PaywallModal** → Use Dialog with Card and Button components
3. **SettingsModal** → Use Sheet (side drawer) with Form components
4. **LoginScreen** → Use Card with Input and Button components
5. **Dashboard** → Wrap with PageTransition, use Skeleton for loading states, add NeoCore mascot
6. **Scanner** → Add FAB for quick actions, use BottomSheet for results
7. **ReviewForm** → Use Form components with validation
8. **Onboarding** → Use Card with progress indicators and Button components

**Migration Pattern**:
```typescript
// Before: Custom modal
<div className="modal">
  <div className="modal-content">
    <button onClick={onClose}>×</button>
    {children}
  </div>
</div>

// After: Shadcn Dialog with responsive behavior
const isMobile = useMediaQuery("(max-width: 768px)");

{isMobile ? (
  <Sheet side="bottom" open={open} onOpenChange={onOpenChange}>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>
      {children}
    </SheetContent>
  </Sheet>
) : (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
)}
```

### NeoCore Mascot Component

**NeoCore Component Interface**:
```typescript
export type NeoState = 'idle' | 'listening' | 'processing' | 'success';

interface NeoCoreProps {
  state: NeoState;
  size?: number; // Size in pixels, default 120
}

export const NeoCore: React.FC<NeoCoreProps> = ({ state, size = 120 }) => {
  // Pure CSS 3D cube with Framer Motion animations
  // No Three.js or heavy 3D libraries required
};
```

**Animation Variants by State**:

```typescript
const containerVariants = {
  idle: {
    rotateX: [20, 10, 20],
    rotateY: [0, 360],
    y: [0, -10, 0],
    scale: 1,
    transition: {
      rotateY: { duration: 12, repeat: Infinity, ease: "linear" },
      rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  },
  listening: {
    rotateX: 10,
    rotateY: [0, 360],
    scale: 1.15,
    transition: {
      rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
      scale: { duration: 0.8, yoyo: Infinity, ease: "easeInOut" } // Breathing
    }
  },
  processing: {
    rotateX: [0, 360],
    rotateY: [0, -360],
    scale: [0.9, 1.1, 0.9],
    transition: {
      rotateX: { duration: 1, repeat: Infinity, ease: "linear" },
      rotateY: { duration: 1.5, repeat: Infinity, ease: "linear" },
      scale: { duration: 0.2, repeat: Infinity } // Glitchy vibration
    }
  },
  success: {
    rotateX: 25,
    rotateY: 45, // Locks into isometric view
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
};
```

**Visual Design**:
- 3D cube constructed with 6 faces using CSS transforms
- Border color changes based on state (neon lime for idle/listening, electric purple for processing)
- Inner "circuit" details on each face for depth
- Internal glowing core visible during listening state
- Ground reflection with blur for visual anchoring
- Perspective: 800px for 3D depth
- Uses `transformStyle: 'preserve-3d'` for proper 3D rendering

**Integration Pattern**:
```typescript
// Dashboard.tsx integration
import { NeoCore, NeoState } from './components/layout/NeoCore';
import { useState } from 'react';

const [neoState, setNeoState] = useState<NeoState>('idle');

return (
  <div className="h-full flex flex-col items-center pt-12 relative bg-void text-white">
    {/* Mascot Layer */}
    <div className="flex flex-col items-center justify-center mb-8 z-10"
         onClick={() => setNeoState('processing')}>
      <NeoCore state={neoState} size={140} />
      
      {/* Speech Bubble */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 px-4 py-2 bg-neutral-900 border border-neutral-800 
                   rounded-full text-xs font-mono text-neutral-400"
      >
        "Safe to spend. Don't ruin it."
      </motion.div>
    </div>
    
    {/* Rest of dashboard */}
  </div>
);
```

## Data Models

### Theme Configuration

```typescript
interface ThemeConfig {
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  radius: number;
  fontFamily: string;
}

// CSS Variables (globals.css)
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --border: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
  --radius: 0.5rem;
  
  /* NeoCore custom colors */
  --void: #050505;
  --neon: #CCFF00;
  --electric: #7928CA;
}
```

**Tailwind Theme Extension** (for NeoCore):
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        void: '#050505',
        neon: '#CCFF00',
        electric: '#7928CA',
      },
      boxShadow: {
        'neon-glow': '0 0 20px rgba(204, 255, 0, 0.3)',
      }
    }
  }
}
```

### Animation Configuration

```typescript
interface AnimationConfig {
  transition: {
    type: "spring" | "tween";
    stiffness?: number;
    damping?: number;
    duration?: number;
  };
  variants: {
    [key: string]: {
      initial: Record<string, any>;
      animate: Record<string, any>;
      exit?: Record<string, any>;
    };
  };
}

const defaultAnimationConfig: AnimationConfig = {
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 30
  },
  variants: {
    page: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    },
    modal: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 }
    },
    sheet: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" }
    }
  }
};
```

### Command Menu Data Model

```typescript
interface Command {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  action: () => void;
  group: string;
  shortcut?: string[];
}

interface CommandGroup {
  heading: string;
  commands: Command[];
}

// Example command registry
const commandRegistry: CommandGroup[] = [
  {
    heading: "Navigation",
    commands: [
      {
        id: "nav-dashboard",
        label: "Go to Dashboard",
        icon: Home,
        keywords: ["home", "dashboard", "main"],
        action: () => navigate("/dashboard"),
        group: "navigation",
        shortcut: ["g", "d"]
      },
      {
        id: "nav-scanner",
        label: "Open Scanner",
        icon: Camera,
        keywords: ["scan", "camera", "receipt"],
        action: () => navigate("/scanner"),
        group: "navigation",
        shortcut: ["g", "s"]
      }
    ]
  },
  {
    heading: "Actions",
    commands: [
      {
        id: "action-new-expense",
        label: "Add New Expense",
        icon: Plus,
        keywords: ["add", "new", "create", "expense"],
        action: () => openExpenseModal(),
        group: "actions",
        shortcut: ["n", "e"]
      }
    ]
  }
];
```

### Responsive Behavior Model

```typescript
interface ResponsiveConfig {
  breakpoint: number;
  useMobileLayout: boolean;
  useBottomSheet: boolean;
  touchTargetSize: number;
  enableGestures: boolean;
}

function getResponsiveConfig(width: number): ResponsiveConfig {
  if (width < 768) {
    return {
      breakpoint: width,
      useMobileLayout: true,
      useBottomSheet: true,
      touchTargetSize: 44,
      enableGestures: true
    };
  }
  
  return {
    breakpoint: width,
    useMobileLayout: false,
    useBottomSheet: false,
    touchTargetSize: 32,
    enableGestures: false
  };
}
```

