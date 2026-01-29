/**
 * NeoCore Component
 * 
 * Animated 3D cube mascot that provides visual personality and state feedback.
 * Uses pure CSS 3D transforms with Framer Motion for state transitions.
 * 
 * States:
 * - idle: Slow rotation with floating motion
 * - listening: Breathing animation with slower rotation
 * - processing: Rapid rotation with glitchy vibration
 * - success: Locks into isometric view with spring animation
 * 
 * Features:
 * - Pure CSS 3D transforms (no Three.js)
 * - State-based border colors (neon/electric)
 * - Ground reflection effect
 * - Circuit detail overlays
 * - Interactive (clickable)
 * - Spring physics animations
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type NeoState = "idle" | "listening" | "processing" | "success";

export interface NeoCoreProps {
  /** Current state of the mascot */
  state: NeoState;
  /** Size in pixels */
  size?: number;
  /** Click handler for interactive state changes */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Animation variants for each NeoCore state
 * Optimized to use CSS animations for continuous states (idle, listening, processing)
 * and Framer Motion only for state transitions
 */
const containerVariants = {
  idle: {
    rotateX: 20,
    rotateY: 0,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  listening: {
    rotateX: 10,
    rotateY: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  processing: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  success: {
    rotateX: 25,
    rotateY: 45, // Isometric view
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

/**
 * NeoCore Component
 * 
 * 3D animated cube mascot with state-based animations.
 * 
 * @example
 * // Basic usage
 * const [state, setState] = useState<NeoState>('idle');
 * 
 * <NeoCore state={state} />
 * 
 * @example
 * // Interactive with click handler
 * <NeoCore
 *   state={state}
 *   onClick={() => setState('processing')}
 *   size={140}
 * />
 */
export function NeoCore({
  state,
  size = 120,
  onClick,
  className,
}: NeoCoreProps) {
  // Border color based on state
  const borderColor =
    state === "processing" ? "border-electric" : "border-neon";

  // Glow effect for listening state
  const showGlow = state === "listening";

  // CSS animation class based on state
  const animationClass = 
    state === "idle" ? "neo-idle-animation" :
    state === "listening" ? "neo-listening-animation" :
    state === "processing" ? "neo-processing-animation" :
    "";

  return (
    <div
      data-testid="neo-core"
      className={cn("relative", className)}
      style={{
        perspective: "800px",
        width: size,
        height: size,
      }}
      onClick={onClick}
    >
      {/* 3D Cube Container */}
      <motion.div
        variants={containerVariants}
        animate={state}
        className={animationClass}
        style={{
          width: size,
          height: size,
          position: "relative",
          transformStyle: "preserve-3d",
          cursor: onClick ? "pointer" : "default",
        }}
      >
        {/* Cube Faces */}
        <CubeFace
          position="front"
          size={size}
          borderColor={borderColor}
          showGlow={showGlow}
        />
        <CubeFace
          position="back"
          size={size}
          borderColor={borderColor}
          showGlow={showGlow}
        />
        <CubeFace
          position="right"
          size={size}
          borderColor={borderColor}
          showGlow={showGlow}
        />
        <CubeFace
          position="left"
          size={size}
          borderColor={borderColor}
          showGlow={showGlow}
        />
        <CubeFace
          position="top"
          size={size}
          borderColor={borderColor}
          showGlow={showGlow}
        />
        <CubeFace
          position="bottom"
          size={size}
          borderColor={borderColor}
          showGlow={showGlow}
        />

        {/* Internal glowing core (visible during listening) */}
        {showGlow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 m-auto w-1/2 h-1/2 bg-neon rounded-full blur-xl opacity-50"
            style={{
              transform: "translateZ(0)",
            }}
          />
        )}
      </motion.div>

      {/* Ground reflection */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-b from-neon/10 to-transparent blur-sm"
        style={{
          transform: "translateY(100%)",
        }}
      />
    </div>
  );
}

/**
 * CubeFace Component
 * 
 * Individual face of the 3D cube with circuit details.
 */
interface CubeFaceProps {
  position: "front" | "back" | "right" | "left" | "top" | "bottom";
  size: number;
  borderColor: string;
  showGlow: boolean;
}

function CubeFace({ position, size, borderColor, showGlow }: CubeFaceProps) {
  const halfSize = size / 2;

  // Transform for each face position
  const transforms = {
    front: `rotateY(0deg) translateZ(${halfSize}px)`,
    back: `rotateY(180deg) translateZ(${halfSize}px)`,
    right: `rotateY(90deg) translateZ(${halfSize}px)`,
    left: `rotateY(-90deg) translateZ(${halfSize}px)`,
    top: `rotateX(90deg) translateZ(${halfSize}px)`,
    bottom: `rotateX(-90deg) translateZ(${halfSize}px)`,
  };

  return (
    <div
      className={cn(
        "absolute inset-0 bg-void/90 border-2 backdrop-blur-sm",
        borderColor,
        showGlow && "shadow-neon-glow"
      )}
      style={{
        width: size,
        height: size,
        transform: transforms[position],
        backfaceVisibility: "hidden",
      }}
    >
      {/* Circuit detail overlay */}
      <div className="absolute inset-0 opacity-20">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circuit lines */}
          <line
            x1="10"
            y1="10"
            x2="90"
            y2="10"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-neon"
          />
          <line
            x1="10"
            y1="30"
            x2="90"
            y2="30"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-neon"
          />
          <line
            x1="10"
            y1="50"
            x2="90"
            y2="50"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-neon"
          />
          <line
            x1="10"
            y1="70"
            x2="90"
            y2="70"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-neon"
          />
          <line
            x1="10"
            y1="90"
            x2="90"
            y2="90"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-neon"
          />
          
          {/* Vertical lines */}
          <line
            x1="30"
            y1="10"
            x2="30"
            y2="90"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-neon"
          />
          <line
            x1="50"
            y1="10"
            x2="50"
            y2="90"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-neon"
          />
          <line
            x1="70"
            y1="10"
            x2="70"
            y2="90"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-neon"
          />
          
          {/* Circuit nodes */}
          <circle
            cx="30"
            cy="30"
            r="2"
            fill="currentColor"
            className="text-neon"
          />
          <circle
            cx="50"
            cy="50"
            r="2"
            fill="currentColor"
            className="text-neon"
          />
          <circle
            cx="70"
            cy="70"
            r="2"
            fill="currentColor"
            className="text-neon"
          />
        </svg>
      </div>
    </div>
  );
}
