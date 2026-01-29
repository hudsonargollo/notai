/**
 * AIAssistant Component Examples
 * 
 * Demonstrates the migrated AIAssistant component with:
 * - Responsive behavior (BottomSheet on mobile, Dialog-like on desktop)
 * - Lucide icons
 * - Skeleton-based typing indicators
 * - Spring animations
 * - Shadcn UI components
 */

import React, { useState } from 'react';
import { AIAssistant } from '../AIAssistant';
import { Language } from '../../types';

/**
 * Basic AIAssistant Example
 * 
 * Shows the default AIAssistant with all features enabled.
 */
export function BasicAIAssistantExample() {
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Basic AI Assistant</h2>
          <p className="text-slate-400 mb-6">
            Click the Neo pill at the bottom to open the AI assistant.
            Try sending messages, using voice input, and toggling sound.
          </p>
        </div>

        <AIAssistant
          onClose={() => console.log('Close requested')}
          currentLang="en"
          onShowPaywall={() => setShowPaywall(true)}
          onNavigate={(target) => console.log('Navigate to:', target)}
        />

        {showPaywall && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-900 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Upgrade Required</h3>
              <p className="text-slate-400 mb-4">You've reached your free AI interaction limit.</p>
              <button
                onClick={() => setShowPaywall(false)}
                className="px-4 py-2 bg-energy-500 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Portuguese Language Example
 * 
 * Shows the AIAssistant with Portuguese language.
 */
export function PortugueseAIAssistantExample() {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">AI Assistant (Portuguese)</h2>
          <p className="text-slate-400 mb-6">
            Assistente de IA em português. Clique no Neo para começar.
          </p>
        </div>

        <AIAssistant
          onClose={() => console.log('Close requested')}
          currentLang="pt"
          onShowPaywall={() => console.log('Show paywall')}
        />
      </div>
    </div>
  );
}

/**
 * Mobile Preview Example
 * 
 * Shows how the AIAssistant looks on mobile devices.
 * Uses a mobile viewport simulation.
 */
export function MobileAIAssistantExample() {
  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-sm mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Mobile View</h2>
          <p className="text-slate-400 text-sm mb-4">
            On mobile devices (< 768px), the assistant uses a bottom sheet layout.
          </p>
        </div>

        <div className="border-4 border-slate-800 rounded-[2.5rem] p-4 bg-slate-950 h-[667px] overflow-hidden">
          <AIAssistant
            onClose={() => console.log('Close requested')}
            currentLang="en"
            onShowPaywall={() => console.log('Show paywall')}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Desktop Preview Example
 * 
 * Shows how the AIAssistant looks on desktop devices.
 */
export function DesktopAIAssistantExample() {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Desktop View</h2>
          <p className="text-slate-400 mb-6">
            On desktop devices (>= 768px), the assistant uses a dialog-like centered layout.
          </p>
        </div>

        <div className="border border-slate-800 rounded-xl p-8 bg-slate-900/50 min-h-[600px]">
          <AIAssistant
            onClose={() => console.log('Close requested')}
            currentLang="en"
            onShowPaywall={() => console.log('Show paywall')}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive States Example
 * 
 * Demonstrates different states of the AI assistant.
 */
export function InteractiveStatesExample() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Interactive States</h2>
          <p className="text-slate-400 mb-6">
            Control the AI assistant's language and sound settings.
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setCurrentLang('en')}
              className={`px-4 py-2 rounded-lg ${
                currentLang === 'en'
                  ? 'bg-energy-500 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setCurrentLang('pt')}
              className={`px-4 py-2 rounded-lg ${
                currentLang === 'pt'
                  ? 'bg-energy-500 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Português
            </button>
          </div>
        </div>

        <AIAssistant
          onClose={() => console.log('Close requested')}
          currentLang={currentLang}
          onShowPaywall={() => console.log('Show paywall')}
        />
      </div>
    </div>
  );
}

/**
 * Feature Showcase Example
 * 
 * Highlights all the new features in the migrated component.
 */
export function FeatureShowcaseExample() {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Feature Showcase</h2>
          <div className="space-y-4 text-slate-300">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">✨ Responsive Design</h3>
              <p className="text-sm">
                Automatically adapts between mobile (bottom sheet) and desktop (dialog) layouts
                based on viewport width.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">🎨 Lucide Icons</h3>
              <p className="text-sm">
                All icons replaced with Lucide React icons for consistency and better performance.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">💬 Skeleton Typing Indicators</h3>
              <p className="text-sm">
                Uses Skeleton components for loading states, showing animated thought waves
                while processing.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">🌊 Spring Animations</h3>
              <p className="text-sm">
                All message appearances use spring physics for natural, fluid motion.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">🎯 Shadcn UI Components</h3>
              <p className="text-sm">
                Built with accessible Shadcn UI primitives (Button, Input, Dialog, Sheet).
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">🎤 Voice Input</h3>
              <p className="text-sm">
                Supports voice input with visual feedback and speech recognition.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">🔊 Text-to-Speech</h3>
              <p className="text-sm">
                Neural TTS with audio generation indicators and sound toggle.
              </p>
            </div>
          </div>
        </div>

        <AIAssistant
          onClose={() => console.log('Close requested')}
          currentLang="en"
          onShowPaywall={() => console.log('Show paywall')}
        />
      </div>
    </div>
  );
}

/**
 * All Examples Component
 * 
 * Renders all examples in a single view for easy testing.
 */
export function AllAIAssistantExamples() {
  const [activeExample, setActiveExample] = useState<string>('basic');

  const examples = {
    basic: <BasicAIAssistantExample />,
    portuguese: <PortugueseAIAssistantExample />,
    mobile: <MobileAIAssistantExample />,
    desktop: <DesktopAIAssistantExample />,
    interactive: <InteractiveStatesExample />,
    showcase: <FeatureShowcaseExample />,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-white mb-4">AIAssistant Examples</h1>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(examples).map((key) => (
              <button
                key={key}
                onClick={() => setActiveExample(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === key
                    ? 'bg-energy-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>{examples[activeExample as keyof typeof examples]}</div>
    </div>
  );
}

export default AllAIAssistantExamples;
