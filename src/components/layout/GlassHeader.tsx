/**
 * GlassHeader Component
 * 
 * Header component with glassmorphism effects (backdrop blur).
 * Provides a modern, premium look for navigation headers.
 * 
 * Features:
 * - Backdrop blur for glassmorphism effect
 * - Sticky positioning option
 * - High contrast text for readability
 * - Optional action buttons
 * - Proper z-index layering
 */

import { cn } from "@/lib/utils";

export interface GlassHeaderProps {
  /** Header title text */
  title: string;
  /** Optional action buttons or elements */
  actions?: React.ReactNode;
  /** Whether header should stick to top on scroll */
  sticky?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Optional subtitle or description */
  subtitle?: string;
}

/**
 * GlassHeader Component
 * 
 * A header with glassmorphism effects for modern, premium UI.
 * 
 * @example
 * // Basic usage
 * <GlassHeader title="Dashboard" />
 * 
 * @example
 * // With actions
 * <GlassHeader
 *   title="Settings"
 *   actions={
 *     <Button variant="ghost" size="icon">
 *       <Settings className="h-5 w-5" />
 *     </Button>
 *   }
 * />
 * 
 * @example
 * // Non-sticky header
 * <GlassHeader title="Profile" sticky={false} />
 * 
 * @example
 * // With subtitle
 * <GlassHeader
 *   title="Dashboard"
 *   subtitle="Welcome back!"
 * />
 */
export function GlassHeader({
  title,
  actions,
  sticky = true,
  className,
  subtitle,
}: GlassHeaderProps) {
  return (
    <header
      className={cn(
        // Glassmorphism effects
        "backdrop-blur-md bg-background/80",
        // Border with subtle contrast
        "border-b border-border/50",
        // Sticky positioning
        sticky && "sticky top-0 z-50",
        // Smooth transition for scroll effects
        "transition-all duration-200",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Title section */}
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Actions section */}
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      </div>
    </header>
  );
}

/**
 * GlassHeaderCompact Component
 * 
 * Compact version of GlassHeader with reduced height.
 * Useful for mobile or space-constrained layouts.
 * 
 * @example
 * <GlassHeaderCompact title="Settings" />
 */
export function GlassHeaderCompact({
  title,
  actions,
  sticky = true,
  className,
}: Omit<GlassHeaderProps, "subtitle">) {
  return (
    <header
      className={cn(
        "backdrop-blur-md bg-background/80",
        "border-b border-border/50",
        sticky && "sticky top-0 z-50",
        "transition-all duration-200",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      </div>
    </header>
  );
}
