/**
 * PageTransition Demo Component
 * 
 * A simple, self-contained demo to visually verify the PageTransition component.
 * This can be imported and rendered in the app to test the transitions.
 */

import React, { useState } from "react";
import { PageTransition } from "../PageTransition";
import { AnimatePresence } from "framer-motion";

/**
 * Simple demo showing forward/backward transitions
 */
export function PageTransitionDemo() {
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const goNext = () => {
    setDirection("forward");
    setPage((prev) => prev + 1);
  };

  const goPrev = () => {
    setDirection("backward");
    setPage((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          PageTransition Component Demo
        </h1>

        <div className="mb-8 flex gap-4 justify-center">
          <button
            onClick={goPrev}
            disabled={page === 1}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={goNext}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Next →
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <PageTransition pageKey={page.toString()} direction={direction}>
            <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">
                  {page}
                </div>
                <h2 className="text-2xl font-semibold mb-4">
                  Page {page}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {direction === "forward"
                    ? "Sliding in from the right →"
                    : "Sliding in from the left ←"}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted p-4 rounded">
                    <div className="font-semibold mb-1">Direction</div>
                    <div className="text-muted-foreground capitalize">
                      {direction}
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded">
                    <div className="font-semibold mb-1">Animation</div>
                    <div className="text-muted-foreground">
                      Spring Physics
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded">
                    <div className="font-semibold mb-1">Duration</div>
                    <div className="text-muted-foreground">
                      ~200-300ms
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded">
                    <div className="font-semibold mb-1">Stacking</div>
                    <div className="text-muted-foreground">
                      Prevented
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PageTransition>
        </AnimatePresence>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">How it works:</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Click "Next" to see forward transition (slides from right)</li>
            <li>• Click "Previous" to see backward transition (slides from left)</li>
            <li>• Animations use spring physics for natural motion</li>
            <li>• AnimatePresence prevents animation stacking</li>
            <li>• Transitions complete within 300ms</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PageTransitionDemo;
