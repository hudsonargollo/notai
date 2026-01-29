# Theme Customization Guide

This guide explains how to customize the theme in the Native UI system, including colors, typography, spacing, and other design tokens.

## Table of Contents

1. [Theme System Overview](#theme-system-overview)
2. [Color Customization](#color-customization)
3. [Typography Customization](#typography-customization)
4. [Spacing and Sizing](#spacing-and-sizing)
5. [Border Radius](#border-radius)
6. [Shadows and Effects](#shadows-and-effects)
7. [Animation Configuration](#animation-configuration)
8. [Creating Custom Themes](#creating-custom-themes)
9. [Best Practices](#best-practices)

---

## Theme System Overview

### Architecture

The Native UI theme system uses a three-layer approach:

```
CSS Variables (globals.css)
    ↓
Tailwind Theme Extension (tailwind.config.js)
    ↓
Component Usage (className props)
```

### Key Files

- **`src/styles/globals.css`** - CSS variables and global styles
- **`tailwind.config.js`** - Tailwind theme configuration
- **`src/lib/animations.ts`** - Animation configuration

### Color Space

The theme uses **OKLCH color space** for better perceptual uniformity and wider gamut support:

```css
/* OKLCH format: oklch(lightness chroma hue) */
--color-primary: oklch(0.98 0.01 260);
```

**Benefits of OKLCH**:
- More perceptually uniform than HSL
- Wider color gamut
- Better for programmatic color manipulation
- Future-proof for wide-gamut displays

---

## Color Customization

### Understanding the Color System

The theme defines semantic color tokens that adapt to context:

```css
/* Base colors */
--color-background: oklch(0.15 0.02 260);  /* Dark background */
--color-foreground: oklch(0.98 0.01 260);  /* Light text */

/* Component colors */
--color-card: oklch(0.15 0.02 260);
--color-card-foreground: oklch(0.98 0.01 260);

/* Interactive colors */
--color-primary: oklch(0.98 0.01 260);
--color-primary-foreground: oklch(0.20 0.02 260);

/* State colors */
--color-destructive: oklch(0.45 0.15 25);  /* Red for errors */
--color-muted: oklch(0.25 0.02 260);       /* Subdued elements */
```

### Customizing Colors

#### Method 1: Modify CSS Variables

**Location**: `src/styles/globals.css`

```css
@theme {
  /* Customize existing colors */
  --color-primary: oklch(0.85 0.15 160);  /* Change primary to green */
  --color-accent: oklch(0.75 0.18 100);   /* Change accent to yellow */
  
  /* Add custom colors */
  --color-brand: oklch(0.60 0.20 280);    /* Custom brand color */
  --color-brand-foreground: oklch(0.98 0.01 280);
}
```

#### Method 2: Extend Tailwind Config

**Location**: `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add custom color with shades
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
        // Add single custom color
        'custom-purple': '#7928CA',
      },
    },
  },
}
```

**Usage**:
```tsx
<div className="bg-brand-500 text-brand-50">
  Custom brand color
</div>
```

### Color Token Reference

| Token | Purpose | Example Usage |
|-------|---------|---------------|
| `background` | Page background | `bg-background` |
| `foreground` | Primary text | `text-foreground` |
| `card` | Card backgrounds | `bg-card` |
| `card-foreground` | Card text | `text-card-foreground` |
| `popover` | Popover backgrounds | `bg-popover` |
| `popover-foreground` | Popover text | `text-popover-foreground` |
| `primary` | Primary actions | `bg-primary` |
| `primary-foreground` | Primary action text | `text-primary-foreground` |
| `secondary` | Secondary actions | `bg-secondary` |
| `secondary-foreground` | Secondary action text | `text-secondary-foreground` |
| `muted` | Muted elements | `bg-muted` |
| `muted-foreground` | Muted text | `text-muted-foreground` |
| `accent` | Accent elements | `bg-accent` |
| `accent-foreground` | Accent text | `text-accent-foreground` |
| `destructive` | Destructive actions | `bg-destructive` |
| `destructive-foreground` | Destructive action text | `text-destructive-foreground` |
| `border` | Borders | `border-border` |
| `input` | Input backgrounds | `bg-input` |
| `ring` | Focus rings | `ring-ring` |

### Custom Color Examples

#### Example 1: Brand Colors

```css
/* src/styles/globals.css */
@theme {
  /* Add brand colors */
  --color-brand-primary: oklch(0.55 0.22 260);
  --color-brand-secondary: oklch(0.65 0.18 160);
  --color-brand-accent: oklch(0.75 0.20 100);
}
```

```tsx
// Usage in components
<Button className="bg-[var(--color-brand-primary)] text-white">
  Brand Button
</Button>
```

#### Example 2: Status Colors

```css
/* src/styles/globals.css */
@theme {
  /* Status colors */
  --color-success: oklch(0.60 0.15 160);
  --color-warning: oklch(0.75 0.18 100);
  --color-error: oklch(0.45 0.15 25);
  --color-info: oklch(0.60 0.15 240);
}
```

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
    },
  },
}
```

```tsx
// Usage
<Badge className="bg-success text-white">Success</Badge>
<Badge className="bg-warning text-void">Warning</Badge>
<Badge className="bg-error text-white">Error</Badge>
```

### NeoCore Custom Colors

The NeoCore mascot uses special custom colors:

```css
/* src/styles/globals.css */
@theme {
  --color-void: #050505;      /* Deepest black */
  --color-neon: #CCFF00;      /* Cyber lime */
  --color-electric: #7928CA;  /* Electric purple */
}
```

**Usage**:
```tsx
<div className="bg-void text-neon border-2 border-neon">
  NeoCore themed element
</div>
```

---

## Typography Customization

### Font Family

The theme uses Inter as the primary font with a system font fallback:

```css
/* src/styles/globals.css */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}
```

### Changing the Font

#### Method 1: Replace Inter

```css
/* src/styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

#### Method 2: Add Secondary Font

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
}
```

**Usage**:
```tsx
<h1 className="font-display">Display Heading</h1>
<code className="font-mono">Code snippet</code>
```

### Font Sizes

Customize font sizes in Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'xs': '0.75rem',     // 12px
        'sm': '0.875rem',    // 14px
        'base': '1rem',      // 16px
        'lg': '1.125rem',    // 18px
        'xl': '1.25rem',     // 20px
        '2xl': '1.5rem',     // 24px
        '3xl': '1.875rem',   // 30px
        '4xl': '2.25rem',    // 36px
        '5xl': '3rem',       // 48px
        // Add custom sizes
        'huge': '4rem',      // 64px
      },
    },
  },
}
```

### Font Weights

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
}
```

### Line Heights and Letter Spacing

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      lineHeight: {
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },
  },
}
```

---

## Spacing and Sizing

### Spacing Scale

Customize the spacing scale:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
        // Add custom spacing
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
}
```

### Container Sizes

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
  },
}
```

---

## Border Radius

### Radius Tokens

The theme defines radius tokens for consistent rounded corners:

```css
/* src/styles/globals.css */
@theme {
  --radius-lg: 0.5rem;      /* 8px */
  --radius-md: calc(0.5rem - 2px);  /* 6px */
  --radius-sm: calc(0.5rem - 4px);  /* 4px */
  --radius-4xl: 1.5rem;     /* 24px */
  --radius-5xl: 2.5rem;     /* 40px */
}
```

### Customizing Radius

```css
/* src/styles/globals.css */
@theme {
  /* Make everything more rounded */
  --radius-lg: 1rem;        /* 16px */
  --radius-md: 0.75rem;     /* 12px */
  --radius-sm: 0.5rem;      /* 8px */
  
  /* Or make everything sharper */
  --radius-lg: 0.25rem;     /* 4px */
  --radius-md: 0.125rem;    /* 2px */
  --radius-sm: 0;           /* 0px */
}
```

### Tailwind Radius Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        'none': '0',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': 'var(--radius-4xl)',
        '5xl': 'var(--radius-5xl)',
        'full': '9999px',
      },
    },
  },
}
```

---

## Shadows and Effects

### Box Shadows

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        // Custom shadows
        'neon-glow': '0 0 20px rgba(204, 255, 0, 0.3)',
        'electric-glow': '0 0 20px rgba(121, 40, 202, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
}
```

**Usage**:
```tsx
<div className="shadow-neon-glow bg-neon">
  Glowing element
</div>
```

### Backdrop Blur

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },
}
```

**Usage**:
```tsx
<div className="backdrop-blur-md bg-background/80">
  Glass effect
</div>
```

---

## Animation Configuration

### Spring Physics

Customize animation spring physics:

```typescript
// src/lib/animations.ts

export const springTransition = {
  type: "spring",
  stiffness: 300,  // Increase for snappier animations
  damping: 30,     // Increase for less bounce
};

// Custom spring configurations
export const snappySpring = {
  type: "spring",
  stiffness: 400,
  damping: 40,
};

export const bouncySpring = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

export const gentleSpring = {
  type: "spring",
  stiffness: 150,
  damping: 25,
};
```

### Animation Durations

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
    },
  },
}
```

### Animation Timing Functions

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionTimingFunction: {
        'ease-in-out-cubic': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-back': 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
        'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
}
```

---

## Creating Custom Themes

### Light Mode Theme

Create a light mode variant:

```css
/* src/styles/globals.css */

/* Add light mode variables */
@theme {
  /* Dark mode (default) */
  --color-background: oklch(0.15 0.02 260);
  --color-foreground: oklch(0.98 0.01 260);
  
  /* Light mode */
  --color-background-light: oklch(0.98 0.01 260);
  --color-foreground-light: oklch(0.15 0.02 260);
}

/* Light mode class */
.light {
  --color-background: var(--color-background-light);
  --color-foreground: var(--color-foreground-light);
  /* ... other light mode colors */
}
```

**Usage**:
```tsx
<div className="light">
  {/* Light mode content */}
</div>
```

### Theme Switcher

```tsx
import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}
```

### Multiple Color Schemes

```css
/* src/styles/globals.css */

/* Default theme */
@theme {
  --color-primary: oklch(0.98 0.01 260);
}

/* Blue theme */
.theme-blue {
  --color-primary: oklch(0.60 0.15 240);
  --color-accent: oklch(0.70 0.12 220);
}

/* Green theme */
.theme-green {
  --color-primary: oklch(0.60 0.15 160);
  --color-accent: oklch(0.70 0.12 140);
}

/* Purple theme */
.theme-purple {
  --color-primary: oklch(0.60 0.15 280);
  --color-accent: oklch(0.70 0.12 300);
}
```

---

## Best Practices

### 1. Use Semantic Tokens

Always use semantic color tokens instead of specific colors:

```tsx
// ✅ Good: Semantic tokens
<Button className="bg-primary text-primary-foreground">
  Primary Action
</Button>

// ❌ Bad: Specific colors
<Button className="bg-blue-500 text-white">
  Primary Action
</Button>
```

### 2. Maintain Contrast Ratios

Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text):

```css
/* ✅ Good: High contrast */
--color-background: oklch(0.15 0.02 260);  /* Dark */
--color-foreground: oklch(0.98 0.01 260);  /* Light */

/* ❌ Bad: Low contrast */
--color-background: oklch(0.40 0.02 260);  /* Medium */
--color-foreground: oklch(0.60 0.01 260);  /* Medium */
```

### 3. Test Across Devices

Test theme changes on:
- Different screen sizes
- Different browsers
- Different color gamuts
- With color blindness simulators

### 4. Document Custom Tokens

Add comments for custom tokens:

```css
@theme {
  /* Brand Colors */
  --color-brand-primary: oklch(0.55 0.22 260);  /* Main brand color */
  --color-brand-secondary: oklch(0.65 0.18 160);  /* Secondary brand color */
  
  /* Status Colors */
  --color-success: oklch(0.60 0.15 160);  /* Success state */
  --color-warning: oklch(0.75 0.18 100);  /* Warning state */
}
```

### 5. Use CSS Variables for Dynamic Values

```tsx
// ✅ Good: CSS variable for dynamic color
<div style={{ '--custom-color': userColor } as React.CSSProperties}>
  <div className="bg-[var(--custom-color)]">
    Dynamic color
  </div>
</div>

// ❌ Bad: Inline style
<div style={{ backgroundColor: userColor }}>
  Dynamic color
</div>
```

### 6. Maintain Consistency

Keep spacing, sizing, and other tokens consistent:

```javascript
// ✅ Good: Consistent scale
spacing: {
  '1': '0.25rem',  // 4px
  '2': '0.5rem',   // 8px
  '3': '0.75rem',  // 12px
  '4': '1rem',     // 16px
  '5': '1.25rem',  // 20px
}

// ❌ Bad: Inconsistent scale
spacing: {
  '1': '0.25rem',  // 4px
  '2': '0.6rem',   // 9.6px (odd value)
  '3': '0.9rem',   // 14.4px (odd value)
}
```

### 7. Optimize for Performance

Minimize CSS variable usage in animations:

```tsx
// ✅ Good: Animate transform and opacity
<motion.div
  animate={{ x: 100, opacity: 1 }}
>
  Content
</motion.div>

// ❌ Bad: Animate CSS variables
<motion.div
  animate={{ '--custom-x': 100 }}
>
  Content
</motion.div>
```

---

## Theme Customization Checklist

Before deploying theme changes:

- [ ] All colors use semantic tokens
- [ ] Contrast ratios meet WCAG AA standards
- [ ] Theme works on mobile and desktop
- [ ] Theme works in different browsers
- [ ] Custom colors are documented
- [ ] Typography is readable at all sizes
- [ ] Spacing is consistent
- [ ] Border radius is consistent
- [ ] Shadows are subtle and purposeful
- [ ] Animations use appropriate timing
- [ ] Theme changes are tested with real content
- [ ] Accessibility is maintained

---

## Next Steps

- See [Shadcn/UI Customization](./SHADCN_CUSTOMIZATION.md) for component customization
- See [Component Usage Guide](./COMPONENT_USAGE_GUIDE.md) for component examples
- See [Animation Patterns Guide](./ANIMATION_PATTERNS.md) for animation configuration
- Visit [OKLCH Color Picker](https://oklch.com) for color selection

---

**Happy theming! 🎨**
