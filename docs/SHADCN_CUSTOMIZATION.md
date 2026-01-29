# Shadcn/UI Component Customization Guide

This guide explains how to customize Shadcn/UI components in the Native UI system, including styling, variants, and extending functionality.

## Table of Contents

1. [Understanding Shadcn/UI](#understanding-shadcnui)
2. [Component Structure](#component-structure)
3. [Customizing Existing Components](#customizing-existing-components)
4. [Creating Custom Variants](#creating-custom-variants)
5. [Adding New Components](#adding-new-components)
6. [Styling Patterns](#styling-patterns)
7. [Best Practices](#best-practices)

---

## Understanding Shadcn/UI

### What is Shadcn/UI?

Shadcn/UI is **not a traditional component library**. Instead, it's a collection of reusable components that you copy into your project. This means:

- ✅ **Full ownership**: Components live in your codebase
- ✅ **Complete customization**: Modify anything without restrictions
- ✅ **No dependencies**: No package to update or maintain
- ✅ **Type-safe**: Built with TypeScript
- ✅ **Accessible**: Built on Radix UI primitives

### Architecture

```
Shadcn/UI Component
    ↓
Built on Radix UI Primitives (accessibility, behavior)
    ↓
Styled with Tailwind CSS (appearance)
    ↓
Customized with CVA (class-variance-authority) for variants
```

### Key Technologies

- **Radix UI**: Provides accessible, unstyled primitives
- **Tailwind CSS**: Utility-first styling
- **CVA (class-variance-authority)**: Variant management
- **clsx + tailwind-merge**: Class name merging

---

## Component Structure

### Typical Component Anatomy

```typescript
import * as React from "react"
import * as RadixPrimitive from "@radix-ui/react-primitive"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 1. Define variants using CVA
const componentVariants = cva(
  "base-classes-here", // Base classes applied to all variants
  {
    variants: {
      variant: {
        default: "variant-specific-classes",
        secondary: "other-variant-classes",
      },
      size: {
        default: "size-classes",
        sm: "small-size-classes",
        lg: "large-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// 2. Define component props interface
export interface ComponentProps
  extends React.ComponentPropsWithoutRef<typeof RadixPrimitive.Root>,
    VariantProps<typeof componentVariants> {
  // Additional custom props
}

// 3. Create the component
const Component = React.forwardRef<
  React.ElementRef<typeof RadixPrimitive.Root>,
  ComponentProps
>(({ className, variant, size, ...props }, ref) => (
  <RadixPrimitive.Root
    ref={ref}
    className={cn(componentVariants({ variant, size, className }))}
    {...props}
  />
))
Component.displayName = "Component"

export { Component, componentVariants }
```

### Key Parts Explained

1. **CVA Variants**: Define different visual styles
2. **Props Interface**: TypeScript types for props
3. **forwardRef**: Allows ref forwarding for DOM access
4. **cn() utility**: Merges class names intelligently

---

## Customizing Existing Components

### Method 1: Modify the Component File

**When to use**: Permanent changes that affect all instances.

**Example: Customizing Button**

```typescript
// src/components/ui/button.tsx

const buttonVariants = cva(
  // Modify base classes
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Add custom variant
        neon: "bg-neon text-void shadow-neon-glow hover:bg-neon/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        // Add custom size
        xl: "h-12 rounded-lg px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

**Usage**:
```tsx
<Button variant="neon" size="xl">
  Custom Button
</Button>
```

---

### Method 2: Extend with className Prop

**When to use**: One-off customizations or component-specific styles.

**Example: Custom Styled Button**

```tsx
import { Button } from '@/components/ui/button';

function CustomButton() {
  return (
    <Button
      className="bg-gradient-to-r from-neon to-electric text-void font-bold shadow-lg hover:shadow-neon-glow transition-all duration-300"
    >
      Gradient Button
    </Button>
  );
}
```

---

### Method 3: Create a Wrapper Component

**When to use**: Reusable custom variations without modifying the base component.

**Example: Icon Button Wrapper**

```tsx
import { Button, ButtonProps } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends ButtonProps {
  icon: LucideIcon;
  label: string;
  iconPosition?: 'left' | 'right';
}

export function IconButton({
  icon: Icon,
  label,
  iconPosition = 'left',
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button
      className={cn("gap-2", className)}
      aria-label={label}
      {...props}
    >
      {iconPosition === 'left' && <Icon className="h-4 w-4" />}
      {children}
      {iconPosition === 'right' && <Icon className="h-4 w-4" />}
    </Button>
  );
}
```

**Usage**:
```tsx
import { Plus } from 'lucide-react';

<IconButton icon={Plus} label="Add item">
  Add Item
</IconButton>
```

---

## Creating Custom Variants

### Adding a New Variant

**Example: Adding a "gradient" variant to Button**

```typescript
// src/components/ui/button.tsx

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        // ... other variants
        gradient: "bg-gradient-to-r from-neon to-electric text-void shadow-lg hover:shadow-neon-glow",
      },
      size: {
        // ... sizes
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Adding Compound Variants

**Example: Special styling for specific variant + size combinations**

```typescript
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
      },
      size: {
        default: "...",
        sm: "...",
        lg: "...",
      },
    },
    compoundVariants: [
      {
        variant: "destructive",
        size: "lg",
        class: "font-bold uppercase tracking-wide",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

---

## Adding New Components

### Method 1: Using Shadcn CLI

**Recommended for official Shadcn/UI components**

```bash
# Add a single component
npx shadcn-ui@latest add [component-name]

# Examples
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add tooltip

# Add multiple components
npx shadcn-ui@latest add badge tabs tooltip
```

### Method 2: Manual Creation

**For custom components not in Shadcn/UI**

**Example: Creating a Custom Badge Component**

```typescript
// src/components/ui/badge.tsx

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-void hover:bg-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

**Usage**:
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Error</Badge>
```

---

## Styling Patterns

### Pattern 1: Theme Token Usage

**Always use theme tokens instead of hardcoded colors**

```tsx
// ❌ Bad: Hardcoded colors
<Button className="bg-blue-500 text-white">
  Click me
</Button>

// ✅ Good: Theme tokens
<Button className="bg-primary text-primary-foreground">
  Click me
</Button>
```

### Pattern 2: Responsive Styling

**Use Tailwind responsive prefixes**

```tsx
<Button className="text-sm md:text-base lg:text-lg px-4 md:px-6 lg:px-8">
  Responsive Button
</Button>
```

### Pattern 3: Conditional Styling

**Use cn() utility for conditional classes**

```tsx
import { cn } from '@/lib/utils';

function ConditionalButton({ isActive, className, ...props }) {
  return (
    <Button
      className={cn(
        "transition-all",
        isActive && "bg-neon text-void shadow-neon-glow",
        !isActive && "bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
```

### Pattern 4: Animation Integration

**Combine with Framer Motion**

```tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { scaleOnHover } from '@/lib/animations';

function AnimatedButton() {
  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      variants={scaleOnHover}
    >
      <Button>Animated Button</Button>
    </motion.div>
  );
}
```

### Pattern 5: Composition

**Compose components for complex UIs**

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function ProductCard({ product }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{product.name}</CardTitle>
          <Badge variant="success">In Stock</Badge>
        </div>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${product.price}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
```

---

## Best Practices

### 1. Use the cn() Utility

Always use `cn()` for merging class names:

```tsx
import { cn } from '@/lib/utils';

// ✅ Good
<Button className={cn("custom-class", isActive && "active-class")} />

// ❌ Bad
<Button className={`custom-class ${isActive ? 'active-class' : ''}`} />
```

### 2. Maintain Accessibility

When customizing, preserve accessibility features:

```tsx
// ✅ Good: Preserves ARIA attributes
<Button
  className="custom-styles"
  aria-label="Close dialog"
  aria-pressed={isPressed}
>
  Close
</Button>

// ❌ Bad: Removes accessibility
<div className="custom-button" onClick={handleClick}>
  Close
</div>
```

### 3. Use Semantic HTML

Choose the right base element:

```tsx
// ✅ Good: Button for actions
<Button onClick={handleSubmit}>Submit</Button>

// ✅ Good: Link for navigation
<Button asChild>
  <a href="/dashboard">Dashboard</a>
</Button>

// ❌ Bad: Button for navigation
<Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
```

### 4. Keep Variants Focused

Each variant should have a clear purpose:

```tsx
// ✅ Good: Clear, semantic variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="default">Confirm</Button>

// ❌ Bad: Too many similar variants
<Button variant="red">Delete</Button>
<Button variant="danger">Delete</Button>
<Button variant="destructive">Delete</Button>
```

### 5. Document Custom Components

Add JSDoc comments for custom components:

```tsx
/**
 * IconButton - A button with an icon
 * 
 * @param icon - Lucide icon component
 * @param label - Accessibility label
 * @param iconPosition - Position of icon (left or right)
 * 
 * @example
 * <IconButton icon={Plus} label="Add item">
 *   Add Item
 * </IconButton>
 */
export function IconButton({ icon, label, iconPosition, ...props }) {
  // Implementation
}
```

### 6. Test Across Devices

Always test customizations on:
- Mobile devices (< 768px)
- Tablets (768px - 1023px)
- Desktop (≥ 1024px)
- Different browsers
- With keyboard navigation
- With screen readers

### 7. Respect Theme Tokens

Use CSS variables for colors:

```tsx
// ✅ Good: Uses theme tokens
<Button className="bg-primary text-primary-foreground">
  Themed Button
</Button>

// ❌ Bad: Hardcoded colors
<Button className="bg-blue-500 text-white">
  Hardcoded Button
</Button>
```

### 8. Maintain Consistency

Follow existing patterns in the codebase:

```tsx
// ✅ Good: Consistent with existing components
const customVariants = cva(
  "base-classes",
  {
    variants: {
      variant: { /* ... */ },
      size: { /* ... */ },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// ❌ Bad: Different pattern
const customVariants = {
  default: "classes",
  large: "classes",
}
```

---

## Common Customization Examples

### Example 1: Loading Button

```tsx
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export function LoadingButton({
  isLoading,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={isLoading || disabled}
      className={cn(isLoading && "cursor-not-allowed", className)}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
```

### Example 2: Confirmation Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Example 3: Status Badge

```tsx
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Status = 'active' | 'pending' | 'inactive' | 'error';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-green-500 text-white hover:bg-green-600',
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-500 text-void hover:bg-yellow-600',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-500 text-white hover:bg-gray-600',
  },
  error: {
    label: 'Error',
    className: 'bg-red-500 text-white hover:bg-red-600',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
```

---

## Troubleshooting

### Issue: Styles Not Applying

**Problem**: Custom classes are being overridden.

**Solution**: Use `cn()` utility and ensure proper class order:

```tsx
// ✅ Correct order
<Button className={cn(buttonVariants({ variant, size }), className)} />

// ❌ Wrong order
<Button className={cn(className, buttonVariants({ variant, size }))} />
```

### Issue: TypeScript Errors

**Problem**: Type errors when adding custom props.

**Solution**: Extend the proper interface:

```tsx
import { ButtonProps } from '@/components/ui/button';

interface CustomButtonProps extends ButtonProps {
  customProp: string;
}
```

### Issue: Accessibility Warnings

**Problem**: Missing ARIA attributes.

**Solution**: Add proper accessibility attributes:

```tsx
<Button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  aria-disabled={isDisabled}
>
  Close
</Button>
```

---

## Next Steps

- See [Theme Customization](./THEME_CUSTOMIZATION.md) for color and theme customization
- See [Component Usage Guide](./COMPONENT_USAGE_GUIDE.md) for component examples
- See [Animation Patterns Guide](./ANIMATION_PATTERNS.md) for animation integration
- Visit [Shadcn/UI Documentation](https://ui.shadcn.com) for official component docs

---

**Happy customizing! 🎨**
