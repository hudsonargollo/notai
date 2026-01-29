/**
 * FloatingActionButton (FAB) Component
 * 
 * Prominent circular button for primary actions.
 * Positioned in bottom-right corner with elevation shadow.
 * 
 * Features:
 * - Fixed positioning in bottom-right
 * - Spring hover and tap animations
 * - Expandable to show secondary actions
 * - Elevation shadow for depth
 * - Accessible with proper ARIA labels
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { scaleOnHover, springTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";

export interface FABAction {
  /** Icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Action label for accessibility */
  label: string;
  /** Click handler */
  onClick: () => void;
}

export interface FloatingActionButtonProps {
  /** Primary icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Click handler for primary action */
  onClick?: () => void;
  /** Accessibility label */
  label: string;
  /** Optional secondary actions */
  secondaryActions?: FABAction[];
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: "default" | "lg";
}

/**
 * FloatingActionButton Component
 * 
 * A floating action button with optional expandable secondary actions.
 * 
 * @example
 * // Simple FAB
 * <FloatingActionButton
 *   icon={Plus}
 *   label="Add new item"
 *   onClick={() => console.log('Add clicked')}
 * />
 * 
 * @example
 * // FAB with secondary actions
 * <FloatingActionButton
 *   icon={Plus}
 *   label="Add"
 *   secondaryActions={[
 *     {
 *       icon: Camera,
 *       label: "Scan receipt",
 *       onClick: () => console.log('Scan'),
 *     },
 *     {
 *       icon: FileText,
 *       label: "Manual entry",
 *       onClick: () => console.log('Manual'),
 *     },
 *   ]}
 * />
 */
export function FloatingActionButton({
  icon: Icon,
  onClick,
  label,
  secondaryActions,
  className,
  size = "default",
}: FloatingActionButtonProps) {
  const [expanded, setExpanded] = useState(false);

  const handlePrimaryClick = () => {
    if (secondaryActions && secondaryActions.length > 0) {
      setExpanded(!expanded);
    } else if (onClick) {
      onClick();
    }
  };

  const sizeClasses = {
    default: "h-14 w-14",
    lg: "h-16 w-16",
  };

  const iconSizeClasses = {
    default: "h-6 w-6",
    lg: "h-7 w-7",
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Secondary actions */}
      <AnimatePresence>
        {expanded && secondaryActions && secondaryActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={springTransition}
            className="absolute bottom-20 right-0 flex flex-col gap-3"
          >
            {secondaryActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{
                  ...springTransition,
                  delay: index * 0.05,
                }}
                whileHover="hover"
                whileTap="tap"
                variants={scaleOnHover}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => {
                    action.onClick();
                    setExpanded(false);
                  }}
                  aria-label={action.label}
                  className="h-12 w-12 rounded-full shadow-lg"
                >
                  <action.icon className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary FAB */}
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={scaleOnHover}
      >
        <Button
          size="icon"
          onClick={handlePrimaryClick}
          aria-label={label}
          aria-expanded={expanded}
          className={cn(
            sizeClasses[size],
            "rounded-full shadow-lg",
            expanded && "rotate-45 transition-transform duration-200"
          )}
        >
          <Icon className={iconSizeClasses[size]} />
        </Button>
      </motion.div>

      {/* Backdrop when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
            className="fixed inset-0 -z-10"
            style={{ backgroundColor: "transparent" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * FABGroup Component
 * 
 * Container for multiple FABs when you need more than one primary action.
 * Stacks FABs vertically with proper spacing.
 * 
 * @example
 * <FABGroup>
 *   <FloatingActionButton icon={Plus} label="Add" onClick={handleAdd} />
 *   <FloatingActionButton icon={Filter} label="Filter" onClick={handleFilter} />
 * </FABGroup>
 */
export function FABGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("fixed bottom-6 right-6 z-50 flex flex-col gap-3", className)}>
      {children}
    </div>
  );
}
