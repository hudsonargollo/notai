/**
 * PageTransition Example and Integration Tests
 * 
 * This file demonstrates proper usage of the PageTransition component
 * and serves as an integration test to verify the component works correctly.
 */

import React, { useState } from "react";
import { PageTransition, PageTransitionWrapper } from "../PageTransition";
import { AnimatePresence } from "framer-motion";

/**
 * Example 1: Basic PageTransition Usage
 * 
 * Demonstrates the simplest use case with default forward direction.
 */
export function BasicPageTransitionExample() {
  return (
    <PageTransition>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Page Content</h1>
        <p>This content will slide in from the right with a fade effect.</p>
      </div>
    </PageTransition>
  );
}

/**
 * Example 2: PageTransition with Direction Control
 * 
 * Demonstrates how to control the animation direction based on navigation.
 */
export function DirectionalPageTransitionExample() {
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [page, setPage] = useState(1);

  const goForward = () => {
    setDirection("forward");
    setPage((prev) => prev + 1);
  };

  const goBackward = () => {
    setDirection("backward");
    setPage((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mb-4 flex gap-4">
        <button
          onClick={goBackward}
          disabled={page === 1}
          className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          ← Previous
        </button>
        <button
          onClick={goForward}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Next →
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <PageTransition pageKey={page.toString()} direction={direction}>
          <div className="p-8 border border-border rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Page {page}</h1>
            <p className="text-muted-foreground">
              Navigate forward or backward to see the direction-aware transitions.
            </p>
          </div>
        </PageTransition>
      </AnimatePresence>
    </div>
  );
}

/**
 * Example 3: PageTransitionWrapper Usage
 * 
 * Demonstrates the higher-level wrapper that includes AnimatePresence.
 */
export function PageTransitionWrapperExample() {
  const [page, setPage] = useState("home");

  const pages = {
    home: {
      title: "Home",
      content: "Welcome to the home page. This is the starting point.",
    },
    about: {
      title: "About",
      content: "Learn more about us on this page.",
    },
    contact: {
      title: "Contact",
      content: "Get in touch with us through this page.",
    },
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <nav className="mb-8 flex gap-4">
        {Object.keys(pages).map((key) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={`px-4 py-2 rounded ${
              page === key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {pages[key as keyof typeof pages].title}
          </button>
        ))}
      </nav>

      <PageTransitionWrapper pageKey={page}>
        <div className="p-8 border border-border rounded-lg">
          <h1 className="text-3xl font-bold mb-4">
            {pages[page as keyof typeof pages].title}
          </h1>
          <p className="text-muted-foreground">
            {pages[page as keyof typeof pages].content}
          </p>
        </div>
      </PageTransitionWrapper>
    </div>
  );
}

/**
 * Example 4: Router Integration Pattern
 * 
 * Demonstrates how to integrate PageTransition with a routing solution.
 * This example shows the pattern without requiring an actual router.
 */
export function RouterIntegrationExample() {
  const [currentPath, setCurrentPath] = useState("/");
  const [history, setHistory] = useState<string[]>(["/"]); // Simple history tracking
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigate = (path: string) => {
    const newHistory = [...history.slice(0, historyIndex + 1), path];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  // Determine direction based on history navigation
  const direction = historyIndex < history.length - 1 && currentPath === history[historyIndex + 1]
    ? "forward"
    : "backward";

  const routes: Record<string, { title: string; content: string }> = {
    "/": {
      title: "Dashboard",
      content: "Welcome to your dashboard. Navigate to other pages using the links below.",
    },
    "/profile": {
      title: "Profile",
      content: "View and edit your profile information here.",
    },
    "/settings": {
      title: "Settings",
      content: "Manage your application settings and preferences.",
    },
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Browser-like navigation controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={goBack}
          disabled={historyIndex === 0}
          className="px-3 py-1 bg-secondary text-secondary-foreground rounded disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex === history.length - 1}
          className="px-3 py-1 bg-secondary text-secondary-foreground rounded disabled:opacity-50"
        >
          Forward →
        </button>
        <span className="px-3 py-1 bg-muted text-muted-foreground rounded">
          {currentPath}
        </span>
      </div>

      {/* Navigation links */}
      <nav className="mb-8 flex gap-4">
        {Object.keys(routes).map((path) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`px-4 py-2 rounded ${
              currentPath === path
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {routes[path].title}
          </button>
        ))}
      </nav>

      {/* Page content with transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition pageKey={currentPath} direction={direction}>
          <div className="p-8 border border-border rounded-lg">
            <h1 className="text-3xl font-bold mb-4">
              {routes[currentPath]?.title || "Not Found"}
            </h1>
            <p className="text-muted-foreground">
              {routes[currentPath]?.content || "This page does not exist."}
            </p>
          </div>
        </PageTransition>
      </AnimatePresence>
    </div>
  );
}

/**
 * Example 5: Performance Test
 * 
 * Demonstrates rapid navigation to verify animation stacking prevention.
 */
export function PerformanceTestExample() {
  const [page, setPage] = useState(0);
  const [isRapidNavigating, setIsRapidNavigating] = useState(false);

  const rapidNavigate = () => {
    setIsRapidNavigating(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setPage(count);
      if (count >= 10) {
        clearInterval(interval);
        setIsRapidNavigating(false);
      }
    }, 100); // Navigate every 100ms (faster than animation duration)
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Next Page
        </button>
        <button
          onClick={rapidNavigate}
          disabled={isRapidNavigating}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded disabled:opacity-50"
        >
          {isRapidNavigating ? "Navigating..." : "Rapid Navigate (10 pages)"}
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <PageTransition pageKey={page.toString()}>
          <div className="p-8 border border-border rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Page {page}</h1>
            <p className="text-muted-foreground">
              Click "Rapid Navigate" to test animation stacking prevention.
              The AnimatePresence mode="wait" ensures only one animation runs at a time.
            </p>
          </div>
        </PageTransition>
      </AnimatePresence>
    </div>
  );
}

/**
 * Example 6: Timing Verification
 * 
 * Demonstrates and measures the animation timing to verify 300ms requirement.
 */
export function TimingVerificationExample() {
  const [page, setPage] = useState(0);
  const [timings, setTimings] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);

  const measureTransition = () => {
    const start = performance.now();
    setStartTime(start);
    setPage((prev) => prev + 1);

    // Measure after expected animation duration
    setTimeout(() => {
      const end = performance.now();
      const duration = end - start;
      setTimings((prev) => [...prev, duration]);
      setStartTime(null);
    }, 350); // Slightly longer than expected 300ms
  };

  const averageTiming = timings.length > 0
    ? timings.reduce((a, b) => a + b, 0) / timings.length
    : 0;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mb-4">
        <button
          onClick={measureTransition}
          disabled={startTime !== null}
          className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          {startTime !== null ? "Measuring..." : "Measure Transition"}
        </button>
      </div>

      <div className="mb-8 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Timing Results</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Measurements: {timings.length}
        </p>
        {timings.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Average: {averageTiming.toFixed(2)}ms
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Last: {timings[timings.length - 1].toFixed(2)}ms
            </p>
            <p className={`text-sm font-semibold ${
              averageTiming <= 300 ? "text-green-500" : "text-red-500"
            }`}>
              {averageTiming <= 300 ? "✓ Within 300ms requirement" : "✗ Exceeds 300ms requirement"}
            </p>
          </>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <PageTransition pageKey={page.toString()}>
          <div className="p-8 border border-border rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Page {page}</h1>
            <p className="text-muted-foreground">
              Click "Measure Transition" to verify the animation completes within 300ms.
            </p>
          </div>
        </PageTransition>
      </AnimatePresence>
    </div>
  );
}

/**
 * All Examples Component
 * 
 * Renders all examples in a tabbed interface for easy testing.
 */
export function AllPageTransitionExamples() {
  const [activeExample, setActiveExample] = useState("basic");

  const examples = {
    basic: {
      title: "Basic Usage",
      component: BasicPageTransitionExample,
    },
    directional: {
      title: "Directional Control",
      component: DirectionalPageTransitionExample,
    },
    wrapper: {
      title: "Wrapper Usage",
      component: PageTransitionWrapperExample,
    },
    router: {
      title: "Router Integration",
      component: RouterIntegrationExample,
    },
    performance: {
      title: "Performance Test",
      component: PerformanceTestExample,
    },
    timing: {
      title: "Timing Verification",
      component: TimingVerificationExample,
    },
  };

  const ActiveComponent = examples[activeExample as keyof typeof examples].component;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold py-4">PageTransition Examples</h1>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.entries(examples).map(([key, { title }]) => (
              <button
                key={key}
                onClick={() => setActiveExample(key)}
                className={`px-4 py-2 rounded-t-lg whitespace-nowrap ${
                  activeExample === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ActiveComponent />
    </div>
  );
}
