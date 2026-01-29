/**
 * BottomSheet Component
 * 
 * Responsive modal component that adapts to screen size:
 * - Mobile (< 768px): Bottom sheet that slides up from bottom
 * - Desktop (>= 768px): Standard centered dialog
 * 
 * Features:
 * - Automatic responsive behavior
 * - Swipe-to-dismiss on mobile
 * - Visual handle indicator for mobile
 * - Spring physics animations
 * - Proper focus management
 */

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/useMediaQuery";

export interface BottomSheetProps {
  /** Whether the sheet/dialog is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Sheet/dialog content */
  children: React.ReactNode;
  /** Optional title */
  title?: string;
  /** Optional description */
  description?: string;
  /** Additional CSS classes for content */
  className?: string;
}

/**
 * BottomSheet Component
 * 
 * Responsive modal that uses Sheet on mobile and Dialog on desktop.
 * Automatically adapts based on viewport width.
 * 
 * @example
 * // Basic usage
 * const [open, setOpen] = useState(false);
 * 
 * <BottomSheet
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Action Menu"
 * >
 *   <div className="space-y-4">
 *     <Button onClick={() => console.log('Action 1')}>Action 1</Button>
 *     <Button onClick={() => console.log('Action 2')}>Action 2</Button>
 *   </div>
 * </BottomSheet>
 * 
 * @example
 * // With description
 * <BottomSheet
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Confirm Action"
 *   description="Are you sure you want to proceed?"
 * >
 *   <div className="flex gap-2">
 *     <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
 *     <Button onClick={handleConfirm}>Confirm</Button>
 *   </div>
 * </BottomSheet>
 */
export function BottomSheet({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
}: BottomSheetProps) {
  const isMobile = useIsMobile();

  // Mobile: Use Sheet (bottom sheet)
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={className}
          style={{
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
          }}
        >
          {/* Visual handle indicator */}
          <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mb-4" />
          
          {(title || description) && (
            <SheetHeader>
              {title && <SheetTitle>{title}</SheetTitle>}
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>
          )}
          
          <div className="mt-4">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use Dialog (centered modal)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * BottomSheetTrigger Component
 * 
 * Helper component to trigger the BottomSheet.
 * Wraps children with click handler to open the sheet.
 * 
 * @example
 * const [open, setOpen] = useState(false);
 * 
 * <BottomSheetTrigger onClick={() => setOpen(true)}>
 *   <Button>Open Menu</Button>
 * </BottomSheetTrigger>
 * 
 * <BottomSheet open={open} onOpenChange={setOpen}>
 *   {content}
 * </BottomSheet>
 */
export function BottomSheetTrigger({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div onClick={onClick} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
