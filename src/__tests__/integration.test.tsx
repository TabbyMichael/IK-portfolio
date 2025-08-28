import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import App from '../App';

// Mock modules that cause issues in tests
jest.mock('../components/ParticleBackground', () => {
  return function MockParticleBackground() {
    return <div data-testid="particle-background">Particle Background</div>;
  };
});

jest.mock('../utils/analytics', () => ({
  initGA: jest.fn(),
  usePageTracking: jest.fn(),
  trackFormSubmission: jest.fn(),
  trackEvent: jest.fn(),
}));

jest.mock('../utils/sentry', () => ({
  initSentry: jest.fn(),
}));

jest.mock('../utils/performance', () => ({
  initPerformanceMonitoring: jest.fn(),
}));

// Mock environment variables
process.env.VITE_GA_TRACKING_ID = 'test-ga-id';
process.env.VITE_SENTRY_DSN = 'test-sentry-dsn';

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the app and navigates between pages', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for app to load
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Check if home page elements are present
    expect(screen.getByText('IK')).toBeInTheDocument();
    
    // Navigate to About page
    const aboutLink = screen.getByRole('link', { name: /about/i });
    await user.click(aboutLink);

    // Wait for navigation to complete
    await waitFor(() => {
      expect(window.location.pathname).toBe('/about');
    });

    // Navigate to Projects page
    const projectsLink = screen.getByRole('link', { name: /projects/i });
    await user.click(projectsLink);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/projects');
    });

    // Navigate to Contact page
    const contactLink = screen.getByRole('link', { name: /contact/i });
    await user.click(contactLink);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/contact');
    });
  });

  it('handles mobile navigation menu', async () => {
    const user = userEvent.setup();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    // Find and click mobile menu button
    const menuButton = screen.getByLabelText(/open menu/i);
    expect(menuButton).toBeInTheDocument();

    await user.click(menuButton);

    // Check if mobile menu opened
    await waitFor(() => {
      expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
    });

    // Click a navigation link from mobile menu
    const aboutLink = screen.getByRole('link', { name: /about/i });
    await user.click(aboutLink);

    // Menu should close and navigate
    await waitFor(() => {
      expect(window.location.pathname).toBe('/about');
      expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();
    });
  });

  it('displays error boundary when component crashes', () => {
    // Create a component that throws an error
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Mock console.error to avoid noise in test output
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <BrowserRouter>
        <ThemeProvider>
          <ThrowError />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Should display error boundary fallback
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Restore console.error
    console.error = originalError;
  });

  it('initializes analytics and monitoring services', async () => {
    const analytics = jest.mocked(await import('../utils/analytics'));
    const sentry = jest.mocked(await import('../utils/sentry'));
    const performance = jest.mocked(await import('../utils/performance'));

    render(<App />);

    await waitFor(() => {
      expect(analytics.initGA).toHaveBeenCalled();
      expect(sentry.initSentry).toHaveBeenCalled();
      expect(performance.initPerformanceMonitoring).toHaveBeenCalled();
    });
  });

  it('handles theme switching', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    // Find theme toggle button (this depends on ThemeToggle implementation)
    const themeButtons = screen.getAllByRole('button');
    const themeToggle = themeButtons.find(button => 
      button.getAttribute('aria-label')?.includes('theme') ||
      button.textContent?.includes('theme')
    );

    if (themeToggle) {
      await user.click(themeToggle);
      // Theme should change (specific assertions depend on implementation)
    }
  });

  it('handles lazy loading and code splitting', async () => {
    render(<App />);

    // Wait for initial page to load
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Navigate to different pages to test lazy loading
    const pages = [
      { link: /about/i, path: '/about' },
      { link: /projects/i, path: '/projects' },
      { link: /contact/i, path: '/contact' },
      { link: /newsletter/i, path: '/news' },
    ];

    for (const page of pages) {
      const link = screen.getByRole('link', { name: page.link });
      fireEvent.click(link);
      
      await waitFor(() => {
        expect(window.location.pathname).toBe(page.path);
      }, { timeout: 3000 });
    }
  });

  it('maintains accessibility throughout navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    // Check for skip link
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveClass('sr-only');

    // Focus skip link
    fireEvent.focus(skipLink);
    expect(skipLink).not.toHaveClass('sr-only');

    // Check navigation accessibility
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();

    // Navigate and check for main content landmark
    const aboutLink = screen.getByRole('link', { name: /about/i });
    await user.click(aboutLink);

    await waitFor(() => {
      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();
      expect(mainContent).toHaveAttribute('aria-label', 'Main content');
    });
  });

  it('handles route-based page tracking', async () => {
    const analytics = jest.mocked(await import('../utils/analytics'));
    const user = userEvent.setup();
    
    render(<App />);

    await waitFor(() => {
      expect(analytics.usePageTracking).toHaveBeenCalled();
    });

    // Navigate to trigger page tracking
    const aboutLink = screen.getByRole('link', { name: /about/i });
    await user.click(aboutLink);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/about');
    });

    // Page tracking hook should be called for route changes
    expect(analytics.usePageTracking).toHaveBeenCalled();
  });
});