/**
 * NeoCore Component Examples
 * 
 * Demonstrates various usage patterns for the NeoCore animated mascot component.
 * This file serves as both documentation and a visual test.
 */

import React, { useState, useEffect } from "react";
import { NeoCore, NeoState } from "../NeoCore";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * Example 1: Basic NeoCore States
 * 
 * Shows all four states of the NeoCore mascot.
 */
export function BasicNeoCoreStatesExample() {
  const states: NeoState[] = ["idle", "listening", "processing", "success"];
  
  return (
    <div className="border rounded-lg bg-void p-8">
      <h2 className="text-xl font-semibold mb-6 text-white">Basic NeoCore States</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {states.map((state) => (
          <div key={state} className="flex flex-col items-center gap-4">
            <NeoCore state={state} size={100} />
            <p className="text-sm text-neon font-mono capitalize">{state}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 2: Interactive NeoCore
 * 
 * Click the mascot to cycle through states.
 */
export function InteractiveNeoCoreExample() {
  const states: NeoState[] = ["idle", "listening", "processing", "success"];
  const [currentStateIndex, setCurrentStateIndex] = useState(0);

  const handleClick = () => {
    setCurrentStateIndex((prev) => (prev + 1) % states.length);
  };

  return (
    <div className="border rounded-lg bg-void p-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Interactive NeoCore</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Click the mascot to cycle through states
      </p>
      
      <div className="flex flex-col items-center gap-4">
        <NeoCore 
          state={states[currentStateIndex]} 
          size={140}
          onClick={handleClick}
        />
        <p className="text-lg text-neon font-mono capitalize">
          {states[currentStateIndex]}
        </p>
      </div>
    </div>
  );
}

/**
 * Example 3: Size Variants
 * 
 * Shows different sizes of the NeoCore mascot.
 */
export function NeoCoreeSizeVariantsExample() {
  const sizes = [60, 100, 140, 200];
  
  return (
    <div className="border rounded-lg bg-void p-8">
      <h2 className="text-xl font-semibold mb-6 text-white">Size Variants</h2>
      <div className="flex items-end justify-around gap-4 flex-wrap">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col items-center gap-4">
            <NeoCore state="idle" size={size} />
            <p className="text-sm text-neon font-mono">{size}px</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 4: Automated State Cycle
 * 
 * Automatically cycles through states to demonstrate animations.
 */
export function AutomatedStateCycleExample() {
  const states: NeoState[] = ["idle", "listening", "processing", "success"];
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentStateIndex((prev) => (prev + 1) % states.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, states.length]);

  return (
    <div className="border rounded-lg bg-void p-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Automated State Cycle</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Automatically cycles through states every 3 seconds
      </p>
      
      <div className="flex flex-col items-center gap-6">
        <NeoCore state={states[currentStateIndex]} size={140} />
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg text-neon font-mono capitalize">
            {states[currentStateIndex]}
          </p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className="text-neon border-neon hover:bg-neon/10"
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 5: NeoCore with Speech Bubble
 * 
 * Shows the mascot with a speech bubble (typical dashboard usage).
 */
export function NeoCoreWithSpeechBubbleExample() {
  const [state, setState] = useState<NeoState>("idle");
  const [message, setMessage] = useState("Ready to assist!");

  const stateMessages: Record<NeoState, string> = {
    idle: "Ready to assist!",
    listening: "I'm listening...",
    processing: "Processing your request...",
    success: "Done! What's next?",
  };

  const handleStateChange = (newState: NeoState) => {
    setState(newState);
    setMessage(stateMessages[newState]);
  };

  return (
    <div className="border rounded-lg bg-void p-8">
      <h2 className="text-xl font-semibold mb-6 text-white">NeoCore with Speech Bubble</h2>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <NeoCore state={state} size={140} />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={message}
            className="mt-6 px-4 py-2 bg-neutral-900 border border-neutral-800 
                       rounded-full text-xs font-mono text-neutral-400"
          >
            "{message}"
          </motion.div>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStateChange("idle")}
            className="text-neon border-neon hover:bg-neon/10"
          >
            Idle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStateChange("listening")}
            className="text-neon border-neon hover:bg-neon/10"
          >
            Listening
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStateChange("processing")}
            className="text-electric border-electric hover:bg-electric/10"
          >
            Processing
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStateChange("success")}
            className="text-neon border-neon hover:bg-neon/10"
          >
            Success
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 6: Multiple NeoCores
 * 
 * Shows multiple mascots in different states simultaneously.
 */
export function MultipleNeoCoresExample() {
  return (
    <div className="border rounded-lg bg-void p-8">
      <h2 className="text-xl font-semibold mb-6 text-white">Multiple NeoCores</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Multiple mascots can coexist with different states
      </p>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col items-center gap-2">
          <NeoCore state="idle" size={100} />
          <p className="text-sm text-neon font-mono">Agent 1: Idle</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <NeoCore state="listening" size={100} />
          <p className="text-sm text-neon font-mono">Agent 2: Listening</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <NeoCore state="processing" size={100} />
          <p className="text-sm text-electric font-mono">Agent 3: Processing</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <NeoCore state="success" size={100} />
          <p className="text-sm text-neon font-mono">Agent 4: Success</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 7: Simulated Workflow
 * 
 * Simulates a typical workflow with state transitions.
 */
export function SimulatedWorkflowExample() {
  const [state, setState] = useState<NeoState>("idle");
  const [isRunning, setIsRunning] = useState(false);

  const runWorkflow = async () => {
    setIsRunning(true);
    
    // Idle
    setState("idle");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Listening
    setState("listening");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Processing
    setState("processing");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // Success
    setState("success");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Back to idle
    setState("idle");
    setIsRunning(false);
  };

  return (
    <div className="border rounded-lg bg-void p-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Simulated Workflow</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Watch the mascot go through a typical workflow
      </p>
      
      <div className="flex flex-col items-center gap-6">
        <NeoCore state={state} size={140} />
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg text-neon font-mono capitalize">{state}</p>
          
          <Button
            onClick={runWorkflow}
            disabled={isRunning}
            className="bg-neon text-void hover:bg-neon/90"
          >
            {isRunning ? "Running..." : "Start Workflow"}
          </Button>
        </div>

        <div className="w-full max-w-md p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
          <h3 className="text-sm font-semibold mb-2 text-white">Workflow Steps:</h3>
          <ol className="text-xs text-neutral-400 space-y-1 list-decimal list-inside">
            <li>Idle (1.5s) - Ready state</li>
            <li>Listening (2s) - Receiving input</li>
            <li>Processing (3s) - Analyzing data</li>
            <li>Success (2s) - Task complete</li>
            <li>Back to Idle</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 8: Dashboard Integration Preview
 * 
 * Shows how NeoCore would appear in a dashboard context.
 */
export function DashboardIntegrationExample() {
  const [state, setState] = useState<NeoState>("idle");

  return (
    <div className="border rounded-lg bg-void p-8 min-h-[500px]">
      <h2 className="text-xl font-semibold mb-6 text-white">Dashboard Integration</h2>
      
      <div className="flex flex-col items-center justify-center h-full gap-8">
        {/* Hero Section with NeoCore */}
        <div className="flex flex-col items-center gap-4">
          <NeoCore 
            state={state} 
            size={160}
            onClick={() => {
              const states: NeoState[] = ["idle", "listening", "processing", "success"];
              const currentIndex = states.indexOf(state);
              setState(states[(currentIndex + 1) % states.length]);
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-3 bg-neutral-900 border border-neutral-800 
                       rounded-full text-sm font-mono text-neutral-400"
          >
            "Safe to spend. Don't ruin it."
          </motion.div>
        </div>

        {/* Mock Dashboard Cards */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
            <p className="text-xs text-neutral-500 mb-1">Balance</p>
            <p className="text-xl font-bold text-neon">$1,234</p>
          </div>
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
            <p className="text-xs text-neutral-500 mb-1">Spent</p>
            <p className="text-xl font-bold text-electric">$567</p>
          </div>
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
            <p className="text-xs text-neutral-500 mb-1">Saved</p>
            <p className="text-xl font-bold text-neon">$890</p>
          </div>
        </div>

        <p className="text-xs text-neutral-500 text-center">
          Click the mascot to change states
        </p>
      </div>
    </div>
  );
}

/**
 * All Examples Component
 * 
 * Renders all examples in a grid layout.
 */
export function AllNeoCoreExamples() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">NeoCore Component Examples</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <BasicNeoCoreStatesExample />
        <InteractiveNeoCoreExample />
        <NeoCoreeSizeVariantsExample />
        <AutomatedStateCycleExample />
        <NeoCoreWithSpeechBubbleExample />
        <MultipleNeoCoresExample />
        <SimulatedWorkflowExample />
        <DashboardIntegrationExample />
      </div>

      <div className="mt-8 p-6 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">Component Features</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2 text-sm">Visual Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Pure CSS 3D transforms (no Three.js)</li>
              <li>6-faced cube with circuit details</li>
              <li>State-based border colors (neon/electric)</li>
              <li>Internal glowing core (listening state)</li>
              <li>Ground reflection effect</li>
              <li>800px perspective for 3D depth</li>
              <li>Backdrop blur on cube faces</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm">Animation Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Idle: Slow rotation + floating motion</li>
              <li>Listening: Breathing animation + glow</li>
              <li>Processing: Rapid rotation + vibration</li>
              <li>Success: Locks to isometric view</li>
              <li>Spring physics for all transitions</li>
              <li>Smooth state transitions</li>
              <li>Interactive (clickable)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 p-6 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">Usage Guidelines</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Use as a hero element on the dashboard</li>
          <li>Pair with speech bubbles for personality</li>
          <li>Update state based on app activity (idle, listening, processing, success)</li>
          <li>Default size (120px) works well for most contexts</li>
          <li>Use larger sizes (140-160px) for hero sections</li>
          <li>Make interactive with onClick for engagement</li>
          <li>Ensure sufficient contrast on dark backgrounds</li>
          <li>Test animations on lower-end devices</li>
        </ul>
      </div>

      <div className="mt-4 p-6 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">State Meanings</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-neon mb-1">Idle</p>
            <p className="text-muted-foreground">
              Default state. Mascot is ready and waiting for user interaction.
              Slow, calming animations.
            </p>
          </div>
          <div>
            <p className="font-semibold text-neon mb-1">Listening</p>
            <p className="text-muted-foreground">
              Actively receiving input. Shows glowing core and breathing animation
              to indicate attention.
            </p>
          </div>
          <div>
            <p className="font-semibold text-electric mb-1">Processing</p>
            <p className="text-muted-foreground">
              Working on a task. Rapid rotation and vibration with electric purple
              border to show activity.
            </p>
          </div>
          <div>
            <p className="font-semibold text-neon mb-1">Success</p>
            <p className="text-muted-foreground">
              Task completed successfully. Locks into isometric view with spring
              animation for satisfaction.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-6 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">Technical Details</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">3D Implementation:</span> Uses CSS
            transform-style: preserve-3d with individual face transforms. No WebGL
            or heavy 3D libraries required.
          </p>
          <p>
            <span className="font-semibold">Animation Library:</span> Framer Motion
            handles all state transitions and physics-based animations.
          </p>
          <p>
            <span className="font-semibold">Performance:</span> Lightweight and
            performant. Uses CSS transforms which are GPU-accelerated.
          </p>
          <p>
            <span className="font-semibold">Customization:</span> Fully customizable
            via props (state, size, onClick, className).
          </p>
        </div>
      </div>
    </div>
  );
}

export default AllNeoCoreExamples;
