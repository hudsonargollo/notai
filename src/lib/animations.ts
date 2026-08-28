/**
 * Animation Configuration
 * 
 * Reusable animation variants and spring physics constants for Framer Motion.
 * All animations use consistent spring physics for natural, cohesive motion.
 */

import { Transition, Variants } from "framer-motion";

/**
 * Spring Physics Constants
 * 
 * These values create responsive animations with a slight bounce for natural feel.
 * - Stiffness: 300 (responsive but not jarring)
 * - Damping: 30 (slight bounce for natural feel)
 * - Target duration: 200-300ms for all transitions
 */
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

/**
 * Scale on Hover Animation
 * 
 * Subtle scale transformation for interactive elements.
 * Use with motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}
 * 
 * @example
 * <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
 *   <Button>Click me</Button>
 * </motion.div>
 */
export const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: springTransition },
  tap: { scale: 0.98, transition: springTransition },
} satisfies Variants;

/**
 * Fade In Up Animation
 * 
 * Common pattern for content appearing from below with fade.
 * Use with AnimatePresence for enter/exit animations.
 * 
 * @example
 * <motion.div
 *   variants={fadeInUp}
 *   initial="initial"
 *   animate="animate"
 *   exit="exit"
 * >
 *   {content}
 * </motion.div>
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: springTransition,
  },
} satisfies Variants;

/**
 * Slide From Bottom Animation
 * 
 * Full slide animation for bottom sheets and modals.
 * Slides in from 100% below viewport.
 * 
 * @example
 * <motion.div
 *   variants={slideFromBottom}
 *   initial="initial"
 *   animate="animate"
 *   exit="exit"
 * >
 *   {sheetContent}
 * </motion.div>
 */
export const slideFromBottom = {
  initial: { y: "100%" },
  animate: {
    y: 0,
    transition: springTransition,
  },
  exit: {
    y: "100%",
    transition: springTransition,
  },
} satisfies Variants;

/**
 * Page Transition Variants
 * 
 * Horizontal slide transitions for page navigation.
 * Supports forward and backward directions.
 * 
 * @example
 * // Forward navigation
 * <motion.div
 *   variants={pageTransition.forward}
 *   initial="initial"
 *   animate="animate"
 *   exit="exit"
 * >
 *   {page}
 * </motion.div>
 */
export const pageTransition = {
  forward: {
    initial: { opacity: 0, x: 20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: springTransition,
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: springTransition,
    },
  },
  backward: {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: springTransition,
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: springTransition,
    },
  },
};

/**
 * Modal/Dialog Animation
 * 
 * Scale and fade animation for modals and dialogs.
 * Creates a subtle zoom effect.
 * 
 * @example
 * <motion.div
 *   variants={modalAnimation}
 *   initial="initial"
 *   animate="animate"
 *   exit="exit"
 * >
 *   {modalContent}
 * </motion.div>
 */
export const modalAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: springTransition,
  },
} satisfies Variants;

/**
 * Stagger Children Animation
 * 
 * Configuration for staggering child animations.
 * Use with motion.div variants={staggerContainer}
 * 
 * @example
 * <motion.div variants={staggerContainer} initial="initial" animate="animate">
 *   <motion.div variants={staggerItem}>Item 1</motion.div>
 *   <motion.div variants={staggerItem}>Item 2</motion.div>
 *   <motion.div variants={staggerItem}>Item 3</motion.div>
 * </motion.div>
 */
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
} satisfies Variants;

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
} satisfies Variants;

/**
 * Fade Animation
 * 
 * Simple fade in/out without movement.
 * 
 * @example
 * <motion.div
 *   variants={fade}
 *   initial="initial"
 *   animate="animate"
 *   exit="exit"
 * >
 *   {content}
 * </motion.div>
 */
export const fade = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
} satisfies Variants;
