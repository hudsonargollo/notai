<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NotAI - Native UI Web Application

A high-end web application with native-like behavior, smooth animations, and accessible components. Built with React, TypeScript, Tailwind CSS, and powered by the Native UI design system.

View your app in AI Studio: https://ai.studio/apps/drive/1sKKE8aNS29bUDwnQAUXFlQEArnezzND5

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local` (if available)
   - Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## 🎨 Native UI Design System

This application features a comprehensive Native UI design system that provides:

- **Smooth Animations**: Spring-based physics for natural motion
- **Accessible Components**: WCAG AA compliant UI components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Mode**: Sophisticated dark theme by default
- **Modern Effects**: Glassmorphism, backdrop blur, and subtle animations
- **3D Mascot**: Animated NeoCore cube with state-based feedback

### Design System Features

| Feature | Description |
|---------|-------------|
| **Component Library** | Shadcn/UI components built on Radix UI primitives |
| **Animation System** | Framer Motion with consistent spring physics |
| **Icon Library** | Lucide React for consistent iconography |
| **Responsive Hooks** | Custom hooks for adaptive behavior |
| **Theme System** | CSS variables with OKLCH color space |
| **Typography** | Inter font family with optimized readability |

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

### Core Documentation

- **[Native UI System Overview](./docs/README.md)** - Complete overview of the design system
- **[Component Usage Guide](./docs/COMPONENT_USAGE_GUIDE.md)** - How to use all components
- **[Animation Patterns Guide](./docs/ANIMATION_PATTERNS.md)** - Animation usage and patterns
- **[Responsive Behavior Guide](./docs/RESPONSIVE_BEHAVIOR.md)** - Responsive design patterns
- **[Migration Guide](./docs/MIGRATION_GUIDE.md)** - Migrating existing components

### Customization Documentation

- **[Shadcn/UI Customization](./docs/SHADCN_CUSTOMIZATION.md)** - Customizing UI components
- **[Theme Customization](./docs/THEME_CUSTOMIZATION.md)** - Customizing colors and theme
- **[Animation Configuration](./docs/ANIMATION_PATTERNS.md#spring-physics)** - Configuring animations

### Quick Links

| I want to... | See this guide |
|--------------|----------------|
| Add a button or form | [Component Usage Guide](./docs/COMPONENT_USAGE_GUIDE.md) |
| Create a modal | [Component Usage Guide - BottomSheet](./docs/COMPONENT_USAGE_GUIDE.md#bottomsheet) |
| Add animations | [Animation Patterns Guide](./docs/ANIMATION_PATTERNS.md) |
| Make something responsive | [Responsive Behavior Guide](./docs/RESPONSIVE_BEHAVIOR.md) |
| Customize colors | [Theme Customization](./docs/THEME_CUSTOMIZATION.md) |
| Customize components | [Shadcn/UI Customization](./docs/SHADCN_CUSTOMIZATION.md) |
| Migrate old code | [Migration Guide](./docs/MIGRATION_GUIDE.md) |

---

## 🛠️ Technology Stack

### Core Technologies

- **React 18+** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### UI & Animation

- **Shadcn/UI** - Accessible component library built on Radix UI
- **Framer Motion** - Production-ready animation library
- **Lucide React** - Beautiful, consistent icon library
- **CMDK** - Command menu component

### AI Integration

- **Google Gemini API** - AI-powered features and assistance

---

## 📁 Project Structure

```
notai/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── ...
│   │   ├── layout/          # Layout components
│   │   │   ├── PageTransition.tsx
│   │   │   ├── GlassHeader.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── FloatingActionButton.tsx
│   │   │   └── NeoCore.tsx
│   │   └── [feature components]
│   ├── lib/
│   │   ├── utils.ts         # Utility functions
│   │   └── animations.ts    # Animation variants
│   ├── hooks/
│   │   └── useMediaQuery.ts # Responsive hooks
│   ├── styles/
│   │   └── globals.css      # Global styles & theme
│   └── [other directories]
├── docs/                    # Documentation
│   ├── README.md
│   ├── COMPONENT_USAGE_GUIDE.md
│   ├── ANIMATION_PATTERNS.md
│   ├── RESPONSIVE_BEHAVIOR.md
│   ├── MIGRATION_GUIDE.md
│   ├── SHADCN_CUSTOMIZATION.md
│   └── THEME_CUSTOMIZATION.md
└── [config files]
```

---

## 🎯 Key Features

### Native-Like Experience

- **Smooth Transitions**: Page transitions with spring physics (200-300ms)
- **Interactive Feedback**: Hover and tap animations on all interactive elements
- **Glassmorphism**: Backdrop blur effects on headers and navigation
- **Bottom Sheets**: Mobile-optimized action menus that slide from bottom
- **Command Menu**: Global keyboard shortcuts (CMD+K / CTRL+K)

### Accessibility

- **WCAG AA Compliant**: High contrast ratios and proper color usage
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Reader Support**: Proper ARIA attributes on all components
- **Focus Management**: Automatic focus trapping in modals and sheets
- **Reduced Motion**: Respects user's motion preferences

### Responsive Design

- **Mobile-First**: Designed for mobile, enhanced for desktop
- **Adaptive Components**: Different UI patterns for different screen sizes
- **Touch-Friendly**: Minimum 44x44px touch targets on mobile
- **Gesture Support**: Swipe-to-dismiss on mobile bottom sheets
- **Breakpoint System**: Consistent breakpoints across the application

### Performance

- **GPU-Accelerated Animations**: Only animates transform and opacity
- **Skeleton Loaders**: Prevents layout shifts during loading
- **Code Splitting**: Lazy loading for optimal bundle size
- **Optimized Images**: Responsive images with proper sizing

---

## 🎨 Design System Quick Reference

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
  springTransition,
} from '@/lib/animations';

// Responsive Hooks
import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
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
```

---

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests (if configured)
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Development Guidelines

1. **Use Shadcn/UI components** for consistency
2. **Add animations** to interactive elements
3. **Make components responsive** using provided hooks
4. **Use theme tokens** for colors (no hardcoded colors)
5. **Use Lucide icons** for consistency
6. **Test on mobile devices** before shipping
7. **Ensure accessibility** (keyboard navigation, ARIA attributes)
8. **Keep animations under 300ms** for responsiveness

---

## 🎓 Learning Resources

### Internal Documentation

Start with the [Native UI System Overview](./docs/README.md) for a complete introduction to the design system.

### External Resources

- [Shadcn/UI Documentation](https://ui.shadcn.com) - Component library
- [Framer Motion Documentation](https://www.framer.com/motion) - Animation library
- [Tailwind CSS Documentation](https://tailwindcss.com) - Utility-first CSS
- [Lucide Icons](https://lucide.dev) - Icon library
- [Radix UI Documentation](https://www.radix-ui.com) - Primitive components

---

## 🤝 Contributing

When adding new features or components:

1. Follow existing patterns and conventions
2. Add comprehensive documentation
3. Include usage examples
4. Test on multiple devices and browsers
5. Ensure accessibility compliance
6. Update relevant documentation guides

---

## 📝 License

[Add your license information here]

---

## 🆘 Getting Help

If you need help:

1. Check the [documentation](./docs/README.md)
2. Look at existing component implementations
3. Review the external resources above
4. Ask the team for guidance

---

**Built with ❤️ using the Native UI Design System**
