# Implementation Tasks

## Phase 1: Setup and Infrastructure

- [ ] 1.1 Initialize Shadcn/UI in the repository
  - Run `npx shadcn-ui@latest init` to set up the component library
  - Configure Tailwind CSS integration
  - Set up the `components/ui` directory structure
  - Configure the `cn()` utility function in `lib/utils.ts`

- [ ] 1.2 Install required dependencies
  - Install `framer-motion` for animations
  - Install `lucide-react` for icons
  - Install `clsx` and `tailwind-merge` for utility class merging
  - Install `cmdk` for command menu functionality
  - Update `package.json` with all new dependencies

- [ ] 1.3 Configure theme and design tokens
  - Set up CSS variables in `globals.css` for dark mode theme
  - Configure Tailwind theme with custom colors and spacing
  - Set up font family (Inter or system UI stack)
  - Configure border radius and ring width tokens

- [ ] 1.4 Create animation configuration
  - Create `lib/animations.ts` with reusable animation variants
  - Define spring physics constants (stiffness: 300, damping: 30)
  - Export common animation patterns (fadeInUp, slideFromBottom, scaleOnHover)

- [ ] 1.5 Create responsive utilities
  - Implement `useMediaQuery` hook in `hooks/useMediaQuery.ts`
  - Set up breakpoint constants
  - Create responsive behavior helper functions

## Phase 2: Core UI Components

- [ ] 2.1 Install base Shadcn/UI components
  - Add Button component via `npx shadcn-ui@latest add button`
  - Add Dialog component via `npx shadcn-ui@latest add dialog`
  - Add Sheet component via `npx shadcn-ui@latest add sheet`
  - Add Input component via `npx shadcn-ui@latest add input`
  - Add Form components via `npx shadcn-ui@latest add form`
  - Add Skeleton component via `npx shadcn-ui@latest add skeleton`
  - Add Command component via `npx shadcn-ui@latest add command`
  - Add Card component via `npx shadcn-ui@latest add card`

- [ ] 2.2 Create PageTransition wrapper component
  - Implement `components/layout/PageTransition.tsx`
  - Use Framer Motion's `AnimatePresence` for transitions
  - Support forward/backward navigation directions
  - Apply spring physics to transitions
  - Ensure transitions complete within 300ms

- [ ] 2.3 Create GlassHeader component
  - Implement `components/layout/GlassHeader.tsx`
  - Apply backdrop-blur effects for glassmorphism
  - Make header sticky with proper z-index
  - Ensure text contrast and readability
  - Support optional action buttons

- [ ] 2.4 Create BottomSheet component
  - Implement `components/layout/BottomSheet.tsx`
  - Use Sheet component on mobile (< 768px)
  - Use Dialog component on desktop (>= 768px)
  - Add swipe-to-dismiss gesture on mobile
  - Include visual handle indicator for mobile

- [ ] 2.5 Create FloatingActionButton component
  - Implement `components/layout/FloatingActionButton.tsx`
  - Position in bottom-right corner with proper spacing
  - Apply elevation shadow and hover animations
  - Support expanding to show secondary actions
  - Use spring physics for all animations

- [ ] 2.6 Implement Global Command Menu
  - Create `components/CommandMenu.tsx`
  - Set up keyboard shortcut listener (CMD+K / CTRL+K)
  - Create command registry with navigation and action commands
  - Implement fuzzy search functionality
  - Add keyboard navigation support
  - Style with Shadcn/UI Command component

## Phase 3: Component Migration

- [ ] 3.1 Migrate BudgetModal component
  - Replace custom modal with Dialog/BottomSheet
  - Use responsive behavior (Sheet on mobile, Dialog on desktop)
  - Migrate form inputs to Shadcn/UI Input components
  - Add Framer Motion animations
  - Replace custom icons with Lucide icons
  - Ensure accessibility with proper ARIA attributes

- [ ] 3.2 Migrate PaywallModal component
  - Replace custom modal with Dialog component
  - Use Shadcn/UI Card for content layout
  - Migrate buttons to Shadcn/UI Button components
  - Add scale animations on hover/tap
  - Replace custom icons with Lucide icons

- [ ] 3.3 Migrate SettingsModal component
  - Replace modal with Sheet component (side drawer)
  - Migrate form inputs to Shadcn/UI Form components
  - Add form validation
  - Replace custom icons with Lucide icons
  - Add spring animations for drawer open/close

- [ ] 3.4 Migrate LoginScreen component
  - Wrap with PageTransition component
  - Use Shadcn/UI Card for login form container
  - Migrate inputs to Shadcn/UI Input components
  - Migrate buttons to Shadcn/UI Button components
  - Add form validation with error states
  - Replace custom icons with Lucide icons

- [ ] 3.5 Migrate Dashboard component
  - Wrap with PageTransition component
  - Add GlassHeader for navigation
  - Implement Skeleton loaders for loading states
  - Replace custom icons with Lucide icons
  - Add spring animations to interactive cards
  - Ensure no layout shifts during data loading

- [ ] 3.6 Migrate Scanner component
  - Wrap with PageTransition component
  - Add FloatingActionButton for quick actions
  - Use BottomSheet for scan results on mobile
  - Replace custom icons with Lucide icons
  - Add loading states with Skeleton components

- [ ] 3.7 Migrate ReviewForm component
  - Use Shadcn/UI Form components with validation
  - Migrate all inputs to Shadcn/UI Input components
  - Migrate buttons to Shadcn/UI Button components
  - Add inline validation feedback
  - Replace custom icons with Lucide icons

- [ ] 3.8 Migrate Onboarding component
  - Wrap with PageTransition component
  - Use Shadcn/UI Card for onboarding steps
  - Add progress indicators
  - Migrate buttons to Shadcn/UI Button components
  - Add slide transitions between steps
  - Replace custom icons with Lucide icons

- [ ] 3.9 Migrate AIAssistant component
  - Use BottomSheet for mobile presentation
  - Use Dialog for desktop presentation
  - Replace custom icons with Lucide icons
  - Add typing indicators with Skeleton components
  - Add spring animations for message appearance

- [ ] 3.10 Migrate SplashScreen component
  - Add fade-in animation with Framer Motion
  - Use spring physics for logo animation
  - Ensure smooth transition to main app
  - Replace custom icons with Lucide icons

## Phase 4: Visual Polish and Refinement

- [ ] 4.1 Apply consistent iconography
  - Audit all components for icon usage
  - Replace all custom SVGs with Lucide icons
  - Ensure consistent stroke weight (default: 2)
  - Ensure consistent sizing (default: h-4 w-4 for inline, h-6 w-6 for standalone)
  - Apply uniform spacing and alignment

- [ ] 4.2 Add hover and active state animations
  - Apply scaleOnHover variant to all buttons
  - Apply scaleOnHover variant to all interactive cards
  - Use spring physics (stiffness: 300, damping: 30)
  - Ensure animations are subtle (scale: 1.02 on hover, 0.98 on tap)
  - Test performance across all components

- [ ] 4.3 Implement loading state patterns
  - Replace all spinner loaders with Skeleton components
  - Ensure Skeleton dimensions match expected content
  - Prevent layout shifts during content loading
  - Add staggered animations for multiple Skeleton elements

- [ ] 4.4 Apply glassmorphism effects
  - Add backdrop-blur to all headers
  - Add backdrop-blur to navigation bars
  - Ensure sufficient text contrast on blurred backgrounds
  - Test scrolling performance with backdrop-blur
  - Apply subtle transparency (bg-background/80)

- [ ] 4.5 Refine typography system
  - Apply Inter or system UI font stack globally
  - Ensure high contrast ratios for all text (WCAG AA minimum)
  - Apply consistent font weights from design system
  - Set optimal line heights and letter spacing
  - Test readability across all components

- [ ] 4.6 Refine dark mode theme
  - Ensure all components use theme tokens
  - Apply soft borders with subtle contrast
  - Use 0.5px ring width for focus indicators
  - Ensure high contrast for text on dark backgrounds
  - Test color consistency across all components

## Phase 5: Testing and Optimization

- [ ] 5.1 Test responsive behavior
  - Test all components at mobile breakpoint (< 768px)
  - Test all components at tablet breakpoint (768px - 1024px)
  - Test all components at desktop breakpoint (>= 1024px)
  - Verify bottom sheets appear on mobile
  - Verify modals appear on desktop
  - Test touch target sizes on mobile (minimum 44x44px)

- [ ] 5.2 Test keyboard navigation
  - Test tab order across all components
  - Test focus indicators visibility
  - Test CMD+K / CTRL+K command menu shortcut
  - Test ESC key for closing modals and sheets
  - Test arrow key navigation in command menu
  - Ensure all interactive elements are keyboard accessible

- [ ] 5.3 Test animations and performance
  - Verify all transitions complete within 300ms
  - Test animation performance on lower-end devices
  - Ensure no animation stacking on rapid interactions
  - Test backdrop-blur performance during scrolling
  - Profile frame rates during complex animations

- [ ] 5.4 Test accessibility
  - Run automated accessibility tests (axe-core or similar)
  - Verify ARIA attributes on all Shadcn/UI components
  - Test with screen reader (VoiceOver or NVDA)
  - Verify color contrast ratios (WCAG AA minimum)
  - Test keyboard-only navigation
  - Verify focus management in modals and sheets

- [ ] 5.5 Test loading states and error handling
  - Verify Skeleton loaders prevent layout shifts
  - Test error states in forms
  - Test loading states in all data-fetching components
  - Verify graceful degradation when animations are disabled
  - Test offline behavior

- [ ] 5.6 Cross-browser testing
  - Test in Chrome/Edge (Chromium)
  - Test in Firefox
  - Test in Safari (WebKit)
  - Test on iOS Safari
  - Test on Android Chrome
  - Verify backdrop-blur support and fallbacks

## Phase 6: Documentation and Cleanup

- [ ] 6.1 Document component usage
  - Create usage examples for all new layout components
  - Document animation patterns and when to use them
  - Document responsive behavior patterns
  - Create migration guide for remaining custom components

- [ ] 6.2 Clean up unused code
  - Remove old custom modal implementations
  - Remove unused CSS files
  - Remove custom icon SVGs replaced by Lucide
  - Remove unused dependencies

- [ ] 6.3 Update project documentation
  - Update README with new design system information
  - Document Shadcn/UI component customization
  - Document animation configuration
  - Document theme customization

- [ ] 6.4 Performance optimization
  - Optimize bundle size (code splitting if needed)
  - Lazy load heavy components
  - Optimize animation performance
  - Review and optimize re-renders
