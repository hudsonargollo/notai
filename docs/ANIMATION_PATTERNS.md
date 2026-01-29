# Animation Patterns Guide

This guide documents all animation patterns used in the Native UI system, including when to use them, how to implement them, and best practices.

## Table of Contents

1. [Animation Philosophy](#animation-philosophy)
2. [Spring Physics](#spring-physics)
3. [Animation Variants](#animation-variants)
4. [Common Patterns](#common-patterns)
5. [Performance Considerations](#performance-considerations)
6. [Best Practices](#best-practices)

---

## Animation Philosophy

All animations in the Native UI system follow these principles:

1. **Purpose-Driven**: Every animation serves a purpose (feedback, guidance, or delight)
2. **Consistent Timing**: All transitions complete within 200-300ms
3. **Spring Physics**: Natural motion using spring-based easing
4. **Subtle Sophistication**: Animations are noticeable but not distracting
5. **Performance First**: Animations use GPU-accelerated properties (transform, opacity)

---

## Spring Physics

All animations use consistent spring physics for natural, cohesive motion.

### Spring Configuration

```typescript
import { springTransition } from '@/lib/animations';

// Default spring configuration
const springTransition = {
  type: "spring",
  stiffness: 300,  // Responsive but not jarring
  damping: 30,     // Slight bounce for natural feel
};
```

**Parameters Explained**:
- **Stiffness (300)**: Controls how "tight" the spring is. Higher values = faster, snappier motion
- **Damping (30)**: Controls oscillation. Higher values = less bounce, more controlled
- **Target Duration**: ~200-300ms for most transitions

### When to Use Spring Physics

✅ **Use spring physics for**:
- Interactive elements (buttons, cards)
- Page transitions
- Modal/sheet animations
- Scale transformations
- Position changes

❌ **Don't use spring physics for**:
- Simple fades (use duration-based)
- Very fast micro-interactions (< 100ms)
- Continuous animations (use linear easing)

---

## Animation Variants

The `@/lib/animations` module provides reusable animation variants for common patterns.

### Scale on Hover

**Purpose**: Subtle scale transformation for interactive elements.

**Usage**:
```tsx
import { motion } from 'framer-motion';
import { scaleOnHover } from '@/lib/animations';

<motion.div
  whileHover="hover"
  whileTap="tap"
  variants={scaleOnHover}
>
  <Button>Click me</Button>
</motion.div>
```

**Values**:
- Rest: `scale: 1`
- Hover: `scale: 1.02` (2% larger)
- Tap: `scale: 0.98` (2% smaller)

**When to use**:
- Buttons
- Interactive cards
- Clickable elements
- FAB buttons

**Example with Button**:
```tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { scaleOnHover } from '@/lib/animations';

function InteractiveButton() {
  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      variants={scaleOnHover}
    >
      <Button>Hover me</Button>
    </motion.div>
  );
}
```

---

### Fade In Up

**Purpose**: Content appearing from below with fade effect.

**Usage**:
```tsx
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

<motion.div
  variants={fadeInUp}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {content}
</motion.div>
```

**Values**:
- Initial: `opacity: 0, y: 20`
- Animate: `opacity: 1, y: 0`
- Exit: `opacity: 0, y: -20`

**When to use**:
- List items appearing
- Content sections loading
- Toast notifications
- Success messages

**Example with List**:
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

function AnimatedList({ items }) {
  return (
    <AnimatePresence>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ delay: index * 0.1 }}
        >
          {item.content}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

---

### Slide From Bottom

**Purpose**: Full slide animation for bottom sheets and modals.

**Usage**:
```tsx
import { motion } from 'framer-motion';
import { slideFromBottom } from '@/lib/animations';

<motion.div
  variants={slideFromBottom}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {sheetContent}
</motion.div>
```

**Values**:
- Initial: `y: "100%"` (fully below viewport)
- Animate: `y: 0` (in view)
- Exit: `y: "100%"` (back below viewport)

**When to use**:
- Bottom sheets on mobile
- Slide-up panels
- Mobile action menus
- Drawer components

**Example with Bottom Sheet**:
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { slideFromBottom } from '@/lib/animations';

function BottomSheet({ isOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={slideFromBottom}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-x-0 bottom-0 bg-background rounded-t-xl"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

### Page Transition

**Purpose**: Horizontal slide transitions for page navigation.

**Usage**:
```tsx
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';

// Forward navigation
<motion.div
  variants={pageTransition.forward}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {page}
</motion.div>

// Backward navigation
<motion.div
  variants={pageTransition.backward}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {page}
</motion.div>
```

**Values (Forward)**:
- Initial: `opacity: 0, x: 20`
- Animate: `opacity: 1, x: 0`
- Exit: `opacity: 0, x: -20`

**Values (Backward)**:
- Initial: `opacity: 0, x: -20`
- Animate: `opacity: 1, x: 0`
- Exit: `opacity: 0, x: 20`

**When to use**:
- Page-level navigation
- Multi-step forms
- Wizard flows
- Tab content switching

**Example with Router**:
```tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { useState } from 'react';

function App() {
  const location = useLocation();
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageTransition[direction]}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          {/* Routes */}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
```

---

### Modal Animation

**Purpose**: Scale and fade animation for modals and dialogs.

**Usage**:
```tsx
import { motion } from 'framer-motion';
import { modalAnimation } from '@/lib/animations';

<motion.div
  variants={modalAnimation}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {modalContent}
</motion.div>
```

**Values**:
- Initial: `opacity: 0, scale: 0.95`
- Animate: `opacity: 1, scale: 1`
- Exit: `opacity: 0, scale: 0.95`

**When to use**:
- Centered modals
- Dialog boxes
- Confirmation prompts
- Alert messages

**Example with Dialog**:
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { modalAnimation } from '@/lib/animations';

function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50"
          />
          
          {/* Modal */}
          <motion.div
            variants={modalAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center p-4"
          >
            <div className="bg-background rounded-lg p-6 max-w-md w-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

### Stagger Children

**Purpose**: Staggered animations for lists and groups of elements.

**Usage**:
```tsx
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

<motion.div
  variants={staggerContainer}
  initial="initial"
  animate="animate"
>
  <motion.div variants={staggerItem}>Item 1</motion.div>
  <motion.div variants={staggerItem}>Item 2</motion.div>
  <motion.div variants={staggerItem}>Item 3</motion.div>
</motion.div>
```

**Values**:
- Container: `staggerChildren: 0.1` (100ms delay between children)
- Item Initial: `opacity: 0, y: 20`
- Item Animate: `opacity: 1, y: 0`

**When to use**:
- Lists of items
- Grid layouts
- Navigation menus
- Feature sections

**Example with List**:
```tsx
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

function FeatureList({ features }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {features.map((feature) => (
        <motion.div
          key={feature.id}
          variants={staggerItem}
          className="p-4 bg-card rounded-lg"
        >
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

### Fade

**Purpose**: Simple fade in/out without movement.

**Usage**:
```tsx
import { motion } from 'framer-motion';
import { fade } from '@/lib/animations';

<motion.div
  variants={fade}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {content}
</motion.div>
```

**Values**:
- Initial: `opacity: 0`
- Animate: `opacity: 1`
- Exit: `opacity: 0`
- Duration: 200ms (faster than spring)

**When to use**:
- Backdrop overlays
- Tooltip appearances
- Simple show/hide
- Loading states

**Example with Backdrop**:
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { fade } from '@/lib/animations';

function Backdrop({ isVisible, onClick }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={fade}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClick}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
    </AnimatePresence>
  );
}
```

---

## Common Patterns

### Loading States

**Pattern**: Use skeleton loaders with fade-in when content loads.

```tsx
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { fadeInUp } from '@/lib/animations';

function DataList({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      {data.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
    </motion.div>
  );
}
```

---

### Interactive Cards

**Pattern**: Scale on hover with spring physics.

```tsx
import { motion } from 'framer-motion';
import { scaleOnHover } from '@/lib/animations';
import { Card } from '@/components/ui/card';

function InteractiveCard({ title, description, onClick }) {
  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      variants={scaleOnHover}
      onClick={onClick}
    >
      <Card className="p-6 cursor-pointer">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </Card>
    </motion.div>
  );
}
```

---

### Expandable Sections

**Pattern**: Smooth height animation with content fade.

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { useState } from 'react';

function ExpandableSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {title}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### Toast Notifications

**Pattern**: Slide in from side with fade.

```tsx
import { motion, AnimatePresence } from 'framer-motion';

const toastVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

function Toast({ message, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 bg-card p-4 rounded-lg shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## Performance Considerations

### GPU-Accelerated Properties

✅ **Use these properties** (GPU-accelerated):
- `transform` (translate, scale, rotate)
- `opacity`

❌ **Avoid animating** (CPU-intensive):
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `background-color` (use with caution)

### Layout Animations

For layout changes, use Framer Motion's `layout` prop:

```tsx
<motion.div layout>
  {/* Content that changes size/position */}
</motion.div>
```

### Will-Change Optimization

For complex animations, hint the browser:

```tsx
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ x: 100 }}
>
  {content}
</motion.div>
```

### Reduce Motion

Respect user preferences for reduced motion:

```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ x: shouldReduceMotion ? 0 : 100 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      {content}
    </motion.div>
  );
}
```

---

## Best Practices

### 1. Use AnimatePresence for Exit Animations

```tsx
import { AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  {isVisible && <AnimatedComponent />}
</AnimatePresence>
```

### 2. Prevent Animation Stacking

Use `mode="wait"` to prevent overlapping animations:

```tsx
<AnimatePresence mode="wait" initial={false}>
  <motion.div key={currentPage}>
    {content}
  </motion.div>
</AnimatePresence>
```

### 3. Use Keys for List Animations

Always provide unique keys for animated lists:

```tsx
{items.map(item => (
  <motion.div key={item.id} layout>
    {item.content}
  </motion.div>
))}
```

### 4. Combine Variants for Complex Animations

```tsx
const complexVariants = {
  initial: { opacity: 0, scale: 0.8, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      opacity: { duration: 0.2 },
      scale: { type: 'spring', stiffness: 300, damping: 30 },
      y: { type: 'spring', stiffness: 300, damping: 30 },
    }
  },
};
```

### 5. Test on Lower-End Devices

Always test animations on:
- Mobile devices
- Older computers
- Different browsers
- With reduced motion enabled

### 6. Keep Animations Subtle

- Hover scale: 1.02 (not 1.1)
- Tap scale: 0.98 (not 0.9)
- Slide distance: 20px (not 100px)
- Duration: 200-300ms (not 1000ms)

### 7. Provide Visual Feedback

Every interaction should have immediate feedback:
- Button press: Scale down
- Hover: Scale up slightly
- Loading: Show skeleton or spinner
- Success: Show success state

---

## Animation Checklist

Before shipping animations, verify:

- [ ] Animations complete within 300ms
- [ ] Spring physics used for natural motion
- [ ] GPU-accelerated properties only
- [ ] AnimatePresence used for exit animations
- [ ] Unique keys provided for lists
- [ ] Reduced motion preference respected
- [ ] Tested on mobile devices
- [ ] No layout shifts during animation
- [ ] Animations serve a purpose
- [ ] Performance profiled (60fps target)

---

## Next Steps

- See [Component Usage Guide](./COMPONENT_USAGE_GUIDE.md) for component examples
- See [Responsive Behavior Guide](./RESPONSIVE_BEHAVIOR.md) for responsive patterns
- See [Migration Guide](./MIGRATION_GUIDE.md) for migrating custom components

