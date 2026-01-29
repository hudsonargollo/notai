import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from '../SplashScreen';
import { Button } from '@/components/ui/button';

/**
 * SplashScreen Example
 * 
 * Demonstrates the SplashScreen component with Framer Motion animations.
 * The splash screen automatically fades out after 2 seconds.
 */
export function SplashScreenExample() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Auto-hide splash screen after 2.7 seconds (2s display + 0.7s fade out)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full">
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      {/* Main App Content (shown after splash) */}
      {!showSplash && (
        <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to notAÍ</h1>
          <p className="text-slate-400 mb-8">Your finances are synced and ready!</p>
          <Button onClick={() => setShowSplash(true)}>
            Show Splash Again
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Manual Control Example
 * 
 * Demonstrates manual control of the splash screen visibility.
 */
export function SplashScreenManualExample() {
  const [showSplash, setShowSplash] = useState(false);

  return (
    <div className="relative h-screen w-full bg-slate-900">
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          SplashScreen Manual Control
        </h2>
        
        <div className="space-x-4">
          <Button 
            onClick={() => setShowSplash(true)}
            variant="default"
          >
            Show Splash Screen
          </Button>
          
          <Button 
            onClick={() => setShowSplash(false)}
            variant="outline"
          >
            Hide Splash Screen
          </Button>
        </div>

        <div className="mt-8 p-4 bg-slate-800 rounded-lg max-w-md">
          <h3 className="text-lg font-semibold text-white mb-2">Features:</h3>
          <ul className="text-slate-300 space-y-1 text-sm">
            <li>✓ Framer Motion animations with spring physics</li>
            <li>✓ Breathing glow effect on icon background</li>
            <li>✓ Floating animation on icon container</li>
            <li>✓ Bouncing dot in brand name</li>
            <li>✓ Shimmer effect on loading bar</li>
            <li>✓ Staggered text animations</li>
            <li>✓ Smooth fade-out transition</li>
            <li>✓ Lucide React icon (Receipt)</li>
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>
    </div>
  );
}

/**
 * Integration Example
 * 
 * Shows how to integrate the splash screen in an app with routing.
 */
export function SplashScreenIntegrationExample() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate app initialization
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 700); // Wait for fade out
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashScreen key="splash" />
        ) : (
          <div 
            key="app"
            className="flex flex-col items-center justify-center h-full bg-slate-900 text-white"
          >
            <h1 className="text-4xl font-bold mb-4">App Loaded!</h1>
            <p className="text-slate-400 mb-8">
              Initialization complete ({progress}%)
            </p>
            <Button onClick={() => {
              setIsLoading(true);
              setProgress(0);
            }}>
              Restart
            </Button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SplashScreenExample;
