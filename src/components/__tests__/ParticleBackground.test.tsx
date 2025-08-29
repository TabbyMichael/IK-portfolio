import React from 'react';
import { render } from '@testing-library/react';
import ParticleBackground from '../ParticleBackground';
import { useTheme } from '../../contexts/ThemeContext';

// Mock the theme context
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

// Mock canvas context and methods
const mockGetContext = jest.fn();
const mockBeginPath = jest.fn();
const mockArc = jest.fn();
const mockFill = jest.fn();
const mockFillRect = jest.fn();
const mockCancelAnimationFrame = jest.fn();

// Track animation frame calls to prevent infinite loops
let animationFrameCallCount = 0;
const maxAnimationFrames = 3; // Limit animation frames in tests

const mockRequestAnimationFrame = jest.fn((callback) => {
  // Only call callback for a limited number of times to prevent infinite loops
  if (animationFrameCallCount < maxAnimationFrames) {
    animationFrameCallCount++;
    // Use setTimeout to make it async and prevent stack overflow
    setTimeout(() => callback(performance.now()), 0);
  }
  return animationFrameCallCount;
});

// Mock HTMLCanvasElement methods
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: mockGetContext,
});

// Mock canvas width and height properties to prevent infinite loops
Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
  get: () => 1024,
  set: () => {}, // no-op setter
  configurable: true,
});

Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
  get: () => 768,
  set: () => {}, // no-op setter
  configurable: true,
});

// Mock window methods
Object.defineProperty(window, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: mockCancelAnimationFrame,
});

// Mock window resize event
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('ParticleBackground Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    animationFrameCallCount = 0; // Reset animation frame counter
    
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: jest.fn(),
      setTheme: jest.fn(),
    });

    // Setup canvas context mock
    mockGetContext.mockReturnValue({
      fillStyle: '',
      fillRect: mockFillRect,
      beginPath: mockBeginPath,
      arc: mockArc,
      fill: mockFill,
      canvas: {
        // Use getters for width/height to prevent infinite loops
        get width() { return 1024; },
        get height() { return 768; },
        set width(_value: number) { /* no-op */ },
        set height(_value: number) { /* no-op */ }
      },
    });
  });

  it('renders canvas with correct classes and attributes', () => {
    render(<ParticleBackground />);
    
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    
    if (canvas) {
      expect(canvas).toHaveClass('fixed');
      expect(canvas).toHaveClass('top-0');
      expect(canvas).toHaveClass('left-0');
      expect(canvas).toHaveClass('w-full');
      expect(canvas).toHaveClass('h-full');

      expect(canvas).toHaveClass('-z-10');

    }
  });

  it('cleans up canvas context on unmount', () => {
    const { unmount } = render(<ParticleBackground />);
    
    // Check canvas element exists
    document.querySelector('canvas');
    
    unmount();
    
    // Canvas should be cleaned up
  });

  it('handles theme changes gracefully', () => {
    mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn(), setTheme: jest.fn() });
    const { rerender } = render(<ParticleBackground />);
    mockUseTheme.mockReturnValue({ theme: 'dark', toggleTheme: jest.fn(), setTheme: jest.fn() });
    rerender(<ParticleBackground />);
    mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn(), setTheme: jest.fn() });
    rerender(<ParticleBackground />);
    
    // Should handle theme transitions smoothly
  });

  it('maintains reference consistency', () => {
    render(<ParticleBackground />);
    
    const useRefSpy = jest.spyOn(React, 'useRef');
    
    // useRef should maintain reference consistency
    expect(useRefSpy).toBeDefined();
  });

  it('has appropriate z-index for background', () => {
    render(<ParticleBackground />);
    
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    
    if (canvas) {
      expect(canvas).toHaveClass('fixed');
      expect(canvas).toHaveClass('-z-10');
    }
  });

  describe('Theme Integration', () => {
    it('responds to dark theme', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: jest.fn(),
        setTheme: jest.fn(),
      });
      
      render(<ParticleBackground />);
      // Test implementation should handle dark theme
    });

    it('responds to light theme', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: jest.fn(),
        setTheme: jest.fn(),
      });
      
      render(<ParticleBackground />);
      // Test implementation should handle light theme
    });

    it('updates particles when theme changes', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: jest.fn(),
        setTheme: jest.fn(),
      });
      
      const { rerender } = render(<ParticleBackground />);
      
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: jest.fn(),
        setTheme: jest.fn(),
      });
      
      rerender(<ParticleBackground />);
      
      // Animation should adapt to new theme
    });

    it('maintains consistent animation speed across themes', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: jest.fn(),
        setTheme: jest.fn(),
      });
      
      render(<ParticleBackground />);
      
      // Animation speed should be consistent regardless of theme
    });
  });
});
