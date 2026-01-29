/**
 * GlassHeader Component Examples
 * 
 * Demonstrates various usage patterns for the GlassHeader component.
 * These examples can be used for visual testing and documentation.
 */

import React from 'react';
import { GlassHeader, GlassHeaderCompact } from '../GlassHeader';
import { Button } from '@/components/ui/button';
import { Settings, Bell, Search, Menu, User, Plus } from 'lucide-react';

/**
 * Example 1: Basic Header
 * Simplest usage with just a title
 */
export function BasicHeaderExample() {
  return (
    <div className="min-h-screen bg-background">
      <GlassHeader title="Dashboard" />
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">
          Basic header with just a title. Scroll to see the glassmorphism effect.
        </p>
        <div className="h-[200vh] mt-8">
          <p>Scroll down to see the sticky header in action...</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 2: Header with Subtitle
 * Shows how to add contextual information below the title
 */
export function HeaderWithSubtitleExample() {
  return (
    <div className="min-h-screen bg-background">
      <GlassHeader
        title="Dashboard"
        subtitle="Welcome back, John!"
      />
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">
          Header with a subtitle for additional context.
        </p>
      </div>
    </div>
  );
}

/**
 * Example 3: Header with Single Action
 * Common pattern for settings or profile buttons
 */
export function HeaderWithSingleActionExample() {
  return (
    <div className="min-h-screen bg-background">
      <GlassHeader
        title="Settings"
        actions={
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        }
      />
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">
          Header with a single action button (Settings icon).
        </p>
      </div>
    </div>
  );
}

/**
 * Example 4: Header with Multiple Actions
 * Shows how to add multiple action buttons
 */
export function HeaderWithMultipleActionsExample() {
  return (
    <div className="min-h-screen bg-background">
      <GlassHeader
        title="Notifications"
        actions={
          <>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </>
        }
      />
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">
          Header with multiple action buttons (Search, Bell, Settings).
        </p>
      </div>
    </div>
  );
}

/**
 * Example 5: Header with Primary Action Button
 * Shows how to add a prominent call-to-action
 */
export function HeaderWithPrimaryActionExample() {
  return (
    <div className="min-h-screen bg-background">
      <GlassHeader
        title="Projects"
        actions={
          <>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </>
        }
      />
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">
          Header with a primary action button for creating new items.
        </p>
      </div>
    </div>
  );
}

/**
 * Example 6: Non-Sticky Header
 * Header that scrolls with the page content
 */
export function NonStickyHeaderExample() {
  return (
    <div className="min-h-screen bg-background">
      <GlassHeader
        title="About"
        sticky={false}
      />
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">
          Non-sticky header that scrolls with the page.
        </p>
        <div className="h-[200vh] mt-8">
          <p>Scroll down - the header will scroll away...</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 7: Compact Header
 * Space-efficient variant for mobile or dense layouts
 */
export function CompactHeaderExample() {
  return (
    <div className="min-h-screen bg-background">
      <GlassHeaderCompact
        title="Mobile View"
        actions={
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        }
      />
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">
          Compact header variant with reduced height (48px vs 64px).
        </p>
      </div>
    </div>
  );
}

/**
 * Example 8: Header with Custom Styling
 * Shows how to extend the component with custom classes
 */
export function CustomStyledHeaderExample() {
  return (
    <div className="min-h-screen bg-background">
      <GlassHeader
        title="Custom Styled"
        className="border-b-2 border-primary/20"
        actions={
          <Button variant="outline" size="sm">
            Custom Action
          </Button>
        }
      />
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">
          Header with custom styling applied via className prop.
        </p>
      </div>
    </div>
  );
}

/**
 * Example 9: Dashboard Header Pattern
 * Complete example showing typical dashboard usage
 */
export function DashboardHeaderExample() {
  return (
    <div className="min-h-screen bg-background">
      <GlassHeader
        title="Dashboard"
        subtitle="Overview of your activity"
        actions={
          <>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </>
        }
      />
      <div className="container mx-auto p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Card 1</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Content behind the glass header
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Card 2</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Scroll to see the glassmorphism effect
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Card 3</h3>
            <p className="text-sm text-muted-foreground mt-2">
              The header blurs content behind it
            </p>
          </div>
        </div>
        <div className="h-[150vh] mt-8">
          <p className="text-muted-foreground">
            Scroll down to see the glassmorphism effect as content passes behind the header...
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 10: Mobile-Optimized Header
 * Shows responsive behavior with mobile-friendly actions
 */
export function MobileOptimizedHeaderExample() {
  return (
    <div className="min-h-screen bg-background">
      <GlassHeaderCompact
        title="Mobile App"
        actions={
          <>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </>
        }
      />
      <div className="container mx-auto p-4">
        <p className="text-sm text-muted-foreground">
          Compact header optimized for mobile devices with icon-only actions.
        </p>
      </div>
    </div>
  );
}

/**
 * All Examples Component
 * Renders all examples in a single view for comprehensive testing
 */
export function AllGlassHeaderExamples() {
  return (
    <div className="space-y-16 pb-16">
      <section>
        <h2 className="text-2xl font-bold mb-4 px-8 pt-8">1. Basic Header</h2>
        <BasicHeaderExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 px-8">2. Header with Subtitle</h2>
        <HeaderWithSubtitleExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 px-8">3. Header with Single Action</h2>
        <HeaderWithSingleActionExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 px-8">4. Header with Multiple Actions</h2>
        <HeaderWithMultipleActionsExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 px-8">5. Header with Primary Action</h2>
        <HeaderWithPrimaryActionExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 px-8">6. Non-Sticky Header</h2>
        <NonStickyHeaderExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 px-8">7. Compact Header</h2>
        <CompactHeaderExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 px-8">8. Custom Styled Header</h2>
        <CustomStyledHeaderExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 px-8">9. Dashboard Header Pattern</h2>
        <DashboardHeaderExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 px-8">10. Mobile-Optimized Header</h2>
        <MobileOptimizedHeaderExample />
      </section>
    </div>
  );
}
