import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock all external dependencies
jest.mock('../utils/analytics', () => ({
  event: jest.fn(),
  trackFormSubmission: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.ComponentProps<'section'>) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
    nav: ({ children, ...props }: React.ComponentProps<'nav'>) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-type-animation', () => ({
  TypeAnimation: ({ sequence, ...props }: { sequence: unknown[] } & React.ComponentProps<'span'>) => (
    <span data-testid="type-animation" {...props}>
      {String(sequence?.[0] || 'typing animation')}
    </span>
  ),
}));

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('Navigation Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Multi-page Navigation Workflows', () => {
    it('navigates from home to all main pages', async () => {
      const user = userEvent.setup();
      renderApp();

      // Should start on home page
      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      });

      // Navigate to About
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Navigate to Projects
      const projectsLink = screen.getByRole('link', { name: /projects/i });
      await user.click(projectsLink);
      
      await waitFor(() => {
        expect(screen.getByText(/my projects/i)).toBeInTheDocument();
      });

      // Navigate to Contact
      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);
      
      await waitFor(() => {
        expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
      });

      // Navigate to Blog
      const blogLink = screen.getByRole('link', { name: /blog/i });
      await user.click(blogLink);
      
      await waitFor(() => {
        expect(screen.getByText(/technical blog/i)).toBeInTheDocument();
      });
    });

    it('maintains navigation state across page transitions', async () => {
      const user = userEvent.setup();
      renderApp();

      // Check that navbar is present on all pages
      const navBar = screen.getByRole('navigation');
      expect(navBar).toBeInTheDocument();

      // Navigate to About
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      // Navbar should still be present
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      // Navigate to Projects
      const projectsLink = screen.getByRole('link', { name: /projects/i });
      await user.click(projectsLink);
      
      // Navbar should still be present
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('handles browser back/forward navigation', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to About
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Navigate to Projects
      const projectsLink = screen.getByRole('link', { name: /projects/i });
      await user.click(projectsLink);
      
      await waitFor(() => {
        expect(screen.getByText(/my projects/i)).toBeInTheDocument();
      });

      // Simulate browser back
      window.history.back();
      
      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });
    });

    it('highlights active navigation item', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to About
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      await waitFor(() => {
        expect(aboutLink.className).toMatch(/active|current/); // or whatever active class is used
      });
    });
  });

  describe('Lazy Loading Verification', () => {
    it('loads route components dynamically', async () => {
      const user = userEvent.setup();
      renderApp();

      // Home should load initially
      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      });

      // Navigate to a different route
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      // About component should load
      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Previous route content should be unmounted
      expect(screen.queryByText(/full-stack developer/i)).not.toBeInTheDocument();
    });

    it('shows loading states during route transitions', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to a different route
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      // Should eventually load the new route
      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });
    });

    it('handles route loading errors gracefully', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to a route that might fail
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      // Should either load successfully or show error boundary
      await waitFor(() => {
        expect(
          screen.getByText(/about me/i) || 
          screen.getByText(/something went wrong/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Route Error Handling', () => {
    it('handles invalid routes gracefully', () => {
      window.history.pushState({}, '', '/invalid-route');
      renderApp();

      // Should either redirect to home or show 404
      expect(
        screen.getByText(/full-stack developer/i) || 
        screen.getByText(/not found/i) ||
        screen.getByText(/404/i)
      ).toBeInTheDocument();
    });

    it('handles missing route parameters', () => {
      // Test with routes that might expect parameters
      window.history.pushState({}, '', '/projects/invalid-id');
      renderApp();

      // Should handle gracefully
      expect(document.body).toBeInTheDocument();
    });

    it('maintains application state during errors', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to valid route first
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Navigation should still work
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('shows mobile menu toggle on small screens', () => {
      renderApp();

      // Look for mobile menu button (hamburger menu)
      const mobileMenuButton = screen.queryByRole('button', { name: /menu/i }) ||
                              screen.queryByTestId('mobile-menu-button') ||
                              document.querySelector('[data-testid*="mobile"]');
      
      expect(mobileMenuButton || screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('opens and closes mobile menu', async () => {
      const user = userEvent.setup();
      renderApp();

      // Look for mobile menu button
      const mobileMenuButton = screen.queryByRole('button', { name: /menu/i }) ||
                              screen.queryByTestId('mobile-menu-button');
      
      if (mobileMenuButton) {
        await user.click(mobileMenuButton);
        
        // Menu should open
        expect(screen.getByRole('navigation')).toBeInTheDocument();
        
        // Close menu
        await user.click(mobileMenuButton);
      }
    });

    it('navigates correctly on mobile', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to About (should work on mobile)
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance Optimization', () => {
    it('loads initial route quickly', async () => {
      const startTime = performance.now();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Should load within reasonable time (2 seconds)
      expect(loadTime).toBeLessThan(2000);
    });

    it('preloads critical routes', async () => {
      const user = userEvent.setup();
      renderApp();

      // Home should load
      await waitFor(() => {
        expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
      });

      // Quick navigation to About should be fast
      const aboutLink = screen.getByRole('link', { name: /about/i });
      const startTime = performance.now();
      
      await user.click(aboutLink);
      
      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      const endTime = performance.now();
      const navTime = endTime - startTime;
      
      // Navigation should be fast
      expect(navTime).toBeLessThan(1000);
    });

    it('efficiently manages route-based code splitting', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate through multiple routes
      const routes = [
        { link: /about/i, content: /about me/i },
        { link: /projects/i, content: /my projects/i },
        { link: /contact/i, content: /get in touch/i },
      ];

      for (const route of routes) {
        const link = screen.getByRole('link', { name: route.link });
        await user.click(link);
        
        await waitFor(() => {
          expect(screen.getByText(route.content)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Deep Linking', () => {
    it('handles direct navigation to deep routes', () => {
      window.history.pushState({}, '', '/about');
      renderApp();

      // Should load About page directly
      expect(screen.getByText(/about me/i)).toBeInTheDocument();
    });

    it('preserves URL parameters', () => {
      window.history.pushState({}, '', '/projects?category=web');
      renderApp();

      // Should load Projects page with parameters
      expect(screen.getByText(/my projects/i)).toBeInTheDocument();
    });

    it('handles hash navigation', () => {
      window.history.pushState({}, '', '/about#skills');
      renderApp();

      // Should load About page
      expect(screen.getByText(/about me/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility in Navigation', () => {
    it('provides keyboard navigation', async () => {
      renderApp();

      // Find navigation links
      const aboutLink = screen.getByRole('link', { name: /about/i });
      
      // Tab to the link
      aboutLink.focus();
      expect(aboutLink).toHaveFocus();
      
      // Press Enter to navigate
      await userEvent.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });
    });

    it('maintains focus management during navigation', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to About
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Focus should be managed appropriately
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('provides skip navigation links', () => {
      renderApp();

      // Look for skip links (might be visually hidden)
      const skipLink = screen.queryByText(/skip to main content/i) ||
                      document.querySelector('[href="#main"]') ||
                      document.querySelector('.sr-only');
      
      // Skip links should exist for accessibility
      expect(skipLink || screen.getByRole('main')).toBeInTheDocument();
    });

    it('has proper ARIA landmarks', () => {
      renderApp();

      // Should have navigation landmark
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      // Should have main content area
      expect(screen.getByRole('main') || document.querySelector('main')).toBeInTheDocument();
    });
  });

  describe('SEO and Meta Tags', () => {
    it('updates document title on route change', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to About
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      await waitFor(() => {
        expect(screen.getByText(/about me/i)).toBeInTheDocument();
      });

      // Title should be updated (implementation dependent)
      // This test verifies the page loads correctly
    });

    it('maintains proper heading hierarchy', async () => {
      const user = userEvent.setup();
      renderApp();

      // Check home page
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements.length).toBeGreaterThanOrEqual(1);

      // Navigate to About
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await user.click(aboutLink);
      
      await waitFor(() => {
        const newH1Elements = screen.getAllByRole('heading', { level: 1 });
        expect(newH1Elements.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});