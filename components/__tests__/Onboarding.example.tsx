/**
 * Onboarding Component Example
 * 
 * This file demonstrates the usage of the migrated Onboarding component
 * with Shadcn/UI components, PageTransition wrapper, and enhanced animations.
 */

import React, { useState } from 'react';
import { Onboarding } from '../Onboarding';
import { Language, UserProfile } from '../../types';

/**
 * Basic Onboarding Example
 * 
 * Shows the standard onboarding flow with all 4 steps:
 * 1. Name input
 * 2. Monthly budget input
 * 3. Category management
 * 4. Completion screen
 */
export function BasicOnboardingExample() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile> | null>(null);

  const handleComplete = (profileData: Partial<UserProfile>, showOffer?: boolean) => {
    console.log('Onboarding completed:', profileData);
    console.log('Show special offer:', showOffer);
    setUserProfile(profileData);
    setShowOnboarding(false);
  };

  if (!showOnboarding) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, {userProfile?.name}!</h2>
        <p className="text-muted-foreground mb-4">
          Monthly Budget: R$ {userProfile?.monthlyBudget}
        </p>
        <button
          onClick={() => setShowOnboarding(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Restart Onboarding
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      <Onboarding
        onComplete={handleComplete}
        currentLang="en"
      />
    </div>
  );
}

/**
 * Onboarding with Portuguese Language
 * 
 * Demonstrates the onboarding flow in Portuguese (pt-BR)
 */
export function PortugueseOnboardingExample() {
  const handleComplete = (profileData: Partial<UserProfile>, showOffer?: boolean) => {
    console.log('Onboarding concluído:', profileData);
    alert(`Bem-vindo, ${profileData.name}! Orçamento: R$ ${profileData.monthlyBudget}`);
  };

  return (
    <div className="h-screen w-screen">
      <Onboarding
        onComplete={handleComplete}
        currentLang="pt"
      />
    </div>
  );
}

/**
 * Onboarding with Custom Completion Handler
 * 
 * Shows how to handle the completion event with custom logic,
 * such as saving to a backend or showing a special offer modal
 */
export function OnboardingWithCustomHandlerExample() {
  const [loading, setLoading] = useState(false);

  const handleComplete = async (profileData: Partial<UserProfile>, showOffer?: boolean) => {
    setLoading(true);
    
    try {
      // Simulate API call to save user profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Profile saved:', profileData);
      
      if (showOffer) {
        console.log('Showing special offer modal...');
        // Show PaywallModal or special offer
      }
      
      // Navigate to dashboard
      console.log('Navigating to dashboard...');
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen relative">
      <Onboarding
        onComplete={handleComplete}
        currentLang="en"
      />
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-xl">Saving your profile...</div>
        </div>
      )}
    </div>
  );
}

/**
 * Onboarding Feature Highlights
 * 
 * Key features of the migrated Onboarding component:
 * 
 * 1. **PageTransition Wrapper**: Smooth slide transitions between steps
 * 2. **Shadcn/UI Card**: Each step is wrapped in a Card component for consistency
 * 3. **Shadcn/UI Button**: All buttons use the Button component with hover animations
 * 4. **Shadcn/UI Input**: Form inputs use the Input component for accessibility
 * 5. **Progress Indicators**: Animated progress dots show current step
 * 6. **Slide Transitions**: Steps transition with fadeInUp animation
 * 7. **Lucide Icons**: All icons are from the Lucide library
 * 8. **Spring Physics**: All animations use consistent spring physics
 * 9. **Responsive Design**: Works on mobile and desktop
 * 10. **Accessibility**: Proper ARIA attributes and keyboard navigation
 * 
 * Migration Changes:
 * - Replaced custom input elements with Shadcn/UI Input
 * - Replaced custom button with Shadcn/UI Button
 * - Wrapped each step content in Shadcn/UI Card
 * - Added PageTransition wrapper for page-level transitions
 * - Enhanced progress indicators with spring physics
 * - Added scaleOnHover animation to buttons
 * - Used fadeInUp animation for step transitions
 * - Added staggerContainer/staggerItem for category list
 */

/**
 * Step-by-Step Flow
 * 
 * Step 0: Name Input
 * - User enters their name
 * - Next button is disabled until name is entered
 * - Neo dialogue updates to greet the user
 * 
 * Step 1: Budget Input
 * - User enters monthly budget
 * - Next button is disabled until budget is entered
 * - Neo dialogue personalizes with user's name
 * 
 * Step 2: Category Management
 * - User can add new categories
 * - User can remove existing categories
 * - Categories are saved to local storage
 * - Neo dialogue encourages customization
 * 
 * Step 3: Completion
 * - Success animation with Sparkles icon
 * - Final button text changes to "Bora Começar!"
 * - Calls onComplete with user profile data
 * - Passes showOffer=true to trigger special offer modal
 */

export default {
  BasicOnboardingExample,
  PortugueseOnboardingExample,
  OnboardingWithCustomHandlerExample,
};
