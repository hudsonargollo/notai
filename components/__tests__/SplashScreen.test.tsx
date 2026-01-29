import React from 'react';
import { render, screen } from '@testing-library/react';
import { SplashScreen } from '../SplashScreen';

describe('SplashScreen', () => {
  it('renders the splash screen with all elements', () => {
    render(<SplashScreen />);
    
    // Check for brand text
    expect(screen.getByText(/not/i)).toBeInTheDocument();
    expect(screen.getByText(/AÍ/i)).toBeInTheDocument();
    
    // Check for loading message
    expect(screen.getByText(/Syncing Finances\.\.\./i)).toBeInTheDocument();
    
    // Check for footer branding
    expect(screen.getByText(/Powered by Neo/i)).toBeInTheDocument();
  });

  it('renders the Receipt icon', () => {
    const { container } = render(<SplashScreen />);
    
    // Check for Lucide Receipt icon (it renders as an SVG)
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-20', 'w-20', 'text-white');
  });

  it('applies correct styling classes', () => {
    const { container } = render(<SplashScreen />);
    
    // Check main container has correct classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('fixed', 'inset-0', 'bg-slate-950', 'z-50');
  });

  it('renders with proper structure', () => {
    const { container } = render(<SplashScreen />);
    
    // Check for icon container
    const iconContainer = container.querySelector('.bg-gradient-to-tr.from-emerald-600');
    expect(iconContainer).toBeInTheDocument();
    
    // Check for loading bar
    const loadingBar = container.querySelector('.bg-slate-900\\/50.rounded-full');
    expect(loadingBar).toBeInTheDocument();
  });

  it('renders the animated dot in the brand name', () => {
    const { container } = render(<SplashScreen />);
    
    // Check for the animated dot (emerald circle)
    const dot = container.querySelector('.bg-emerald-400.rounded-full');
    expect(dot).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<SplashScreen />);
    
    // Check for heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
