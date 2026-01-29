/**
 * PageTransition Component
 * 
 * Wrapper component for page-level transitions using Framer Motion.
 * Provides smooth slide animations when navigating between views.
 * 
 * Features:
 * - Forward/backward navigation direction support
 * - Spring physics for natural motion
 * - Completes within 300ms for responsiveness
 * - Prevents animation stacking with AnimatePresence
 */

import { motion, AnimatePresence } from "framer-motion";
import { springTransition } from "@/lib/animations";

export interface PageTransitionProps {
  /** Content to animate */
  children: React.ReactNode;
  /** Navigation direction - affects slide direction */
  direction?: "forward" | "backward";
  /** Unique key for AnimatePresence (e.g., route path) */
  pageKey?: string;
}

/**
 * PageTransition Component
 * 
 * Wraps page content with slide transition animations.
 * Use with React Router or similar routing solution.
 * 
 * @example
 * // Basic usage
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 * 
 * @example
 * // With direction control
 * <PageTransition direction="backward">
 *   <YourPageContent />
 * </PageTransition>
 * 
 * @example
 * // With React Router
 * const location = useLocation();
 * <AnimatePresence mode="wait" initial={false}>
 *   <PageTransition key={location.pathname}>
 *     <Routes location={location}>
 *       <Route path="/" element={<Home />} />
 *     </Routes>
 *   </PageTransition>
 * </AnimatePresence>
 */
export function PageTransition({
  children,
  direction = "forward",
  pageKey,
}: PageTransitionProps) {
  // Define animation variants based on direction
  const variants = {
    initial: {
      opacity: 0,
      x: direction === "forward" ? 20 : -20,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: direction === "forward" ? -20 : 20,
    },
  };

  return (
    <motion.div
      key={pageKey}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={springTransition}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * PageTransitionWrapper Component
 * 
 * Higher-level wrapper that includes AnimatePresence.
 * Use this when you want a complete solution without managing AnimatePresence yourself.
 * 
 * @example
 * const location = useLocation();
 * <PageTransitionWrapper pageKey={location.pathname}>
 *   <YourPageContent />
 * </PageTransitionWrapper>
 */
export function PageTransitionWrapper({
  children,
  direction = "forward",
  pageKey,
}: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={pageKey} direction={direction}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}
