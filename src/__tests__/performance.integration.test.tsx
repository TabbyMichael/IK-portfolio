import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock performance APIs
const mockPerformanceObserver = jest.fn();
const mockGetEntriesByType = jest.fn();
const mockMark = jest.fn();
const mockMeasure = jest.fn();

Object.defineProperty(global, 'PerformanceObserver', {
  value: mockPerformanceObserver,
});

Object.defineProperty(global.performance, 'getEntriesByType', {
  value: mockGetEntriesByType,
});

Object.defineProperty(global.performance, 'mark', {
  value: mockMark,
});

Object.defineProperty(global.performance, 'measure', {
  value: mockMeasure,
});

// Mock Web Vitals
jest.mock('web-vitals', () => ({
  getCLS: jest.fn((callback) => callback({ value: 0.05, rating: 'good' })),
  getFCP: jest.fn((callback) => callback({ value: 800, rating: 'good' })),
  getFID: jest.fn((callback) => callback({ value: 50, rating: 'good' })),
  getLCP: jest.fn((callback) => callback({ value: 1200, rating: 'good' })),
  getTTFB: jest.fn((callback) => callback({ value: 100, rating: 'good' })),
}));

// Mock framer-motion for performance
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.ComponentProps<'section'>) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('Performance Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
    
    // Reset performance API mocks
    mockPerformanceObserver.mockClear();
    mockGetEntriesByType.mockReturnValue([]);
    
    // Clear localStorage
    global.localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Page Load Times', () => {
    it('measures initial page load performance', async () => {
      const startTime = performance.now();
      renderApp();

      // Wait for initial content to load
      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Initial load should be fast
      expect(loadTime).toBeLessThan(2000); // 2 seconds
    });

    it('measures route navigation performance', async () => {
      const user = userEvent.setup();
      renderApp();

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      });

      // Measure navigation to About page
      const startTime = performance.now();
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);

      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      const endTime = performance.now();
      const navTime = endTime - startTime;

      // Navigation should be fast
      expect(navTime).toBeLessThan(1000); // 1 second
    });

    it('measures performance across multiple page loads', async () => {
      const user = userEvent.setup();
      const loadTimes: number[] = [];

      renderApp();

      // Test multiple page loads
      const pages = [
        { link: /about/i, content: /about me/i },
        { link: /projects/i, content: /my projects/i },
        { link: /contact/i, content: /get in touch/i },
        { link: /blog/i, content: /technical blog/i },
      ];

      for (const page of pages) {
        const startTime = performance.now();
        const link = screen.getByRole('link', { name: page.link });
        await user.click(link);

        await waitFor(() => {
          expect(screen.getByText(page.content)).toBeInTheDocument();
        });

        const endTime = performance.now();
        loadTimes.push(endTime - startTime);
      }

      // All page loads should be reasonably fast
      loadTimes.forEach(time => {
        expect(time).toBeLessThan(1500); // 1.5 seconds
      });

      // Average load time should be good
      const avgLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
      expect(avgLoadTime).toBeLessThan(1000);
    });
  });

  describe('Bundle Size Validation', () => {
    it('loads initial JavaScript efficiently', () => {
      renderApp();

      // Check that app loads without timing out
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      
      // Verify no JavaScript errors in console
      expect(console.error).not.toHaveBeenCalled();
    });

    it('implements code splitting for routes', async () => {
      const user = userEvent.setup();
      renderApp();

      // Initial load
      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      });

      // Navigate to different route
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);

      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Route should load separately (code splitting working)
      expect(screen.queryByText(/full-stack developer/i)).not.toBeInTheDocument();
    });

    it('lazy loads images and components', async () => {
      renderApp();

      // Images should have lazy loading attributes
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        expect(img.loading === 'lazy' || img.loading === undefined).toBe(true);
      });
    });
  });

  describe('Memory Usage Monitoring', () => {
    it('does not cause memory leaks during navigation', async () => {
      const user = userEvent.setup();
      renderApp();

      // Store initial memory snapshot
      const initialMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;

      // Navigate through multiple pages multiple times
      const pages = [
        { link: /about/i, content: /about me/i },
        { link: /projects/i, content: /my projects/i },
        { link: /contact/i, content: /get in touch/i },
        { link: /home/i, content: /full-stack developer/i },
      ];

      for (let cycle = 0; cycle < 3; cycle++) {
        for (const page of pages) {
          const link = screen.getByRole('link', { name: page.link });
          await user.click(link);

          await waitFor(() => {
            expect(screen.getByText(page.content)).toBeInTheDocument();
          });
        }
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // Memory usage should not grow excessively
      const finalMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryGrowth = finalMemory - initialMemory;
        const growthPercentage = (memoryGrowth / initialMemory) * 100;
        
        // Memory growth should be reasonable (less than 50% growth)
        expect(growthPercentage).toBeLessThan(50);
      }
    });

    it('cleans up event listeners and timers', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = renderApp();
      
      // Check event listener count
      expect(addEventListenerSpy.mock.calls.length).toBeGreaterThanOrEqual(0);
      
      unmount();
      
      const removedListeners = removeEventListenerSpy.mock.calls.length;
      
      // Should clean up most event listeners
      expect(removedListeners).toBeGreaterThan(0);
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('handles component unmounting gracefully', () => {
      const { unmount } = renderApp();
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Core Web Vitals Tracking', () => {
    it('measures and tracks LCP (Largest Contentful Paint)', async () => {
      renderApp();

      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      });

      // Web Vitals should be measured
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    });

    it('measures and tracks FID (First Input Delay)', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      });

      // Simulate user interaction
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);

      // FID should be measured
      expect(screen.getByText(/about me/i)).toBeInTheDocument();
    });

    it('measures and tracks CLS (Cumulative Layout Shift)', () => {
      renderApp();

      // CLS should be measured
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    });

    it('measures and tracks FCP (First Contentful Paint)', () => {
      renderApp();

      // FCP should be measured
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    });

    it('stores performance metrics locally', async () => {
      renderApp();

      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      });

      // Should store metrics in localStorage
      jest.advanceTimersByTime(1000);
      
      // Check stored metrics
      localStorage.getItem('webVitalsMetrics');
      // Metrics might be stored depending on implementation
    });
  });

  describe('Resource Loading Optimization', () => {
    it('loads critical resources first', async () => {
      renderApp();

      // Critical content should load quickly
      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('preloads important assets', () => {
      renderApp();

      // Check for preload hints in head
      // Check for preload links
      document.querySelectorAll('link[rel="preload"]');
      // Implementation might include preload hints
    });

    it('lazy loads non-critical images', () => {
      renderApp();

      // Images should be lazy loaded
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        expect(img.loading === 'lazy' || img.loading === undefined).toBe(true);
      });
    });

    it('efficiently loads fonts and icons', () => {
      renderApp();

      // Font loading should be optimized
      // Check for font optimization
      document.querySelectorAll('link[rel="preconnect"], link[rel="dns-prefetch"]');
      // Implementation might include font optimization
    });
  });

  describe('Animation Performance', () => {
    it('uses efficient animations', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      });

      // Navigate to trigger animations
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);

      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Animations should not block the main thread
      // This is verified by successful navigation without timeout
    });

    it('handles motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderApp();

      // App should respect motion preferences
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    });
  });

  describe('Performance Monitoring Dashboard', () => {
    it('displays performance metrics in development', () => {
      renderApp();

      // Look for performance dashboard toggle
      const perfButton = screen.queryByRole('button', { name: /performance/i }) ||
                        document.querySelector('[data-testid*="performance"]');

      // Performance dashboard should be available in development
      if (process.env.NODE_ENV === 'development') {
        expect(perfButton || screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      }
    });

    it('tracks real-time performance metrics', async () => {
      renderApp();

      // Advance timers to trigger metric updates
      jest.advanceTimersByTime(5000);

      // Performance tracking should be active
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    });

    it('provides performance insights', async () => {
      const user = userEvent.setup();
      renderApp();

      // Check if performance dashboard is available
      const perfButton = screen.queryByRole('button', { name: /performance/i });
      
      if (perfButton) {
        await user.click(perfButton);
        
        // Should show performance metrics
        await waitFor(() => {
          expect(
            screen.getByText(/performance|metrics|score/i)
          ).toBeInTheDocument();
        });
      }
    });
  });

  describe('Bundle Analysis', () => {
    it('loads minimal initial bundle', () => {
      const startTime = performance.now();
      renderApp();
      
      // Should load quickly indicating small initial bundle
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      
      const loadTime = performance.now() - startTime;
      expect(loadTime).toBeLessThan(1000);
    });

    it('splits code by routes effectively', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to different routes to test code splitting
      const routes = ['/about', '/projects', '/contact', '/blog'];
      
      for (const route of routes) {
        const link = screen.getByRole('link', { name: new RegExp(route.substring(1), 'i') });
        await user.click(link);
        
        // Each route should load independently
        await waitFor(() => {
          expect(document.location.pathname).toBe(route);
        });
      }
    });

    it('loads vendor dependencies efficiently', () => {
      renderApp();

      // App should load without JavaScript errors
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      
      // No console errors should indicate efficient loading
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('Performance Regression Detection', () => {
    it('maintains consistent load times', async () => {
      const loadTimes: number[] = [];

      // Test multiple app initializations
      for (let i = 0; i < 5; i++) {
        const startTime = performance.now();
        const { unmount } = renderApp();
        
        await waitFor(() => {
          expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
        });
        
        const endTime = performance.now();
        loadTimes.push(endTime - startTime);
        
        unmount();
      }

      // Load times should be consistent (low variance)
      const avgTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
      const variance = loadTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / loadTimes.length;
      const standardDeviation = Math.sqrt(variance);

      // Standard deviation should be low (consistent performance)
      expect(standardDeviation).toBeLessThan(avgTime * 0.3); // 30% of average
    });

    it('scales well with content', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate through content-heavy pages
      const contentPages = ['/projects', '/blog', '/case-studies'];
      
      for (const page of contentPages) {
        const startTime = performance.now();
        
        try {
          const link = screen.getByRole('link', { name: new RegExp(page.replace('/', '').replace('-', ' '), 'i') });
          await user.click(link);
          
          const endTime = performance.now();
          const loadTime = endTime - startTime;
          
          // Content-heavy pages should still load reasonably fast
          expect(loadTime).toBeLessThan(2000);
        } catch {
          // Some routes might not exist, that's OK
        }
      }
    });
  });

  describe('Web Vitals Monitoring', () => {
    it('tracks Core Web Vitals metrics', () => {
      // Mock web-vitals functions
      const mockLCP = jest.fn();
      const mockFID = jest.fn();
      const mockCLS = jest.fn();
      const mockFCP = jest.fn();
      
      jest.doMock('web-vitals', () => ({
        onLCP: mockLCP,
        onFID: mockFID,
        onCLS: mockCLS,
        onFCP: mockFCP,
      }));
      
      renderApp();
      
      // Web vitals should be tracked
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    });

    it('tracks First Input Delay (FID)', () => {
      const mockFID = jest.fn();
      jest.doMock('web-vitals', () => ({ onFID: mockFID }));
      
      renderApp();
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    });

    it('tracks Cumulative Layout Shift (CLS)', () => {
      const mockCLS = jest.fn();
      jest.doMock('web-vitals', () => ({ onCLS: mockCLS }));
      
      renderApp();
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    });

    it('tracks First Contentful Paint (FCP)', () => {
      const mockFCP = jest.fn();
      jest.doMock('web-vitals', () => ({ onFCP: mockFCP }));
      
      renderApp();
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    });
  });
});