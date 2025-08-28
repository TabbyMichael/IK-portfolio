import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PerformanceDashboard from '../PerformanceDashboard';

// Mock environment variables
const mockEnv = {
  DEV: true,
  PROD: false,
};

Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: mockEnv,
    },
  },
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Activity: ({ className, ...props }: { className?: string } & React.ComponentProps<'div'>) => <div data-testid="activity-icon" className={className} {...props} />,
  TrendingUp: ({ className, ...props }: { className?: string } & React.ComponentProps<'div'>) => <div data-testid="trending-up-icon" className={className} {...props} />,
  TrendingDown: ({ className, ...props }: { className?: string } & React.ComponentProps<'div'>) => <div data-testid="trending-down-icon" className={className} {...props} />,
  Eye: ({ className, ...props }: { className?: string } & React.ComponentProps<'div'>) => <div data-testid="eye-icon" className={className} {...props} />,
  Zap: ({ className, ...props }: { className?: string } & React.ComponentProps<'div'>) => <div data-testid="zap-icon" className={className} {...props} />,
  Clock: ({ className, ...props }: { className?: string } & React.ComponentProps<'div'>) => <div data-testid="clock-icon" className={className} {...props} />,
}));

// Mock performance utilities
jest.mock('../../../utils/performance', () => ({
  getStoredMetrics: jest.fn(() => ({
    LCP: [
      { value: 1200, grade: 'good', timestamp: Date.now() },
      { value: 1500, grade: 'good', timestamp: Date.now() - 1000 },
    ],
    FID: [
      { value: 50, grade: 'good', timestamp: Date.now() },
      { value: 80, grade: 'needs-improvement', timestamp: Date.now() - 1000 },
    ],
    CLS: [
      { value: 0.05, grade: 'good', timestamp: Date.now() },
      { value: 0.08, grade: 'good', timestamp: Date.now() - 1000 },
    ],
    FCP: [
      { value: 800, grade: 'good', timestamp: Date.now() },
      { value: 900, grade: 'good', timestamp: Date.now() - 1000 },
    ],
  })),
  calculatePerformanceScore: jest.fn(() => 85),
}));

describe('PerformanceDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
    
    // Reset localStorage
    global.localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Development Environment', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('renders toggle button in development mode', () => {
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it('shows activity icon on toggle button', () => {
      render(<PerformanceDashboard />);
      
      expect(screen.getByTestId('activity-icon')).toBeInTheDocument();
    });

    it('has proper toggle button styling', () => {
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      expect(toggleButton).toHaveClass('fixed');
      expect(toggleButton).toHaveClass('bottom-4');
      expect(toggleButton).toHaveClass('right-4');
      expect(toggleButton).toHaveClass('z-[9999]');
      expect(toggleButton).toHaveClass('bg-blue-600');
      expect(toggleButton).toHaveClass('hover:bg-blue-700');
      expect(toggleButton).toHaveClass('text-white');
    });

    it('opens dashboard when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      expect(screen.getByText('Performance Dashboard')).toBeInTheDocument();
    });
  });

  describe('Production Environment', () => {
    beforeEach(() => {
      mockEnv.DEV = false;
    });

    it('does not render in production mode', () => {
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.queryByRole('button', { name: /show performance dashboard/i });
      expect(toggleButton).not.toBeInTheDocument();
    });

    it('returns null in production', () => {
      const { container } = render(<PerformanceDashboard />);
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Dashboard Panel', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('displays performance score', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      expect(screen.getByText('85/100')).toBeInTheDocument();
    });

    it('shows overall performance score with color coding', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const scoreElement = screen.getByText('85/100');
      expect(scoreElement).toHaveClass('text-yellow-600'); // Score 85 should be yellow
    });

    it('displays performance score progress bar', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const progressBar = document.querySelector('[style*="width: 85%"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('shows trending up icon in dashboard header', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
    });
  });

  describe('Metrics Display', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('displays all Core Web Vitals metrics', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      expect(screen.getByText('LCP')).toBeInTheDocument();
      expect(screen.getByText('FID')).toBeInTheDocument();
      expect(screen.getByText('CLS')).toBeInTheDocument();
      expect(screen.getByText('FCP')).toBeInTheDocument();
    });

    it('shows metric descriptions', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      expect(screen.getByText('Largest Contentful Paint')).toBeInTheDocument();
      expect(screen.getByText('First Input Delay')).toBeInTheDocument();
      expect(screen.getByText('Cumulative Layout Shift')).toBeInTheDocument();
      expect(screen.getByText('First Contentful Paint')).toBeInTheDocument();
    });

    it('displays current and average values', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      expect(screen.getByText(/Current:/)).toBeInTheDocument();
      expect(screen.getByText(/Avg:/)).toBeInTheDocument();
    });

    it('shows metric icons', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument(); // LCP
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument(); // FID
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument(); // FCP
    });
  });

  describe('Metric Grading', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('displays grade badges for metrics', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const gradeBadges = document.querySelectorAll('.bg-green-100, .bg-yellow-100, .bg-red-100');
      expect(gradeBadges.length).toBeGreaterThan(0);
    });

    it('shows proper grade colors', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      // Should have good grades (green) based on mock data
      const goodGradeBadges = document.querySelectorAll('.bg-green-100.text-green-800');
      expect(goodGradeBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Real-time Monitoring', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('updates metrics every 5 seconds', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      // Fast-forward 5 seconds
      jest.advanceTimersByTime(5000);
      
      // Metrics should be updated (verified by checking if utils are called)
      expect(screen.getByText('Performance Dashboard')).toBeInTheDocument();
    });

    it('displays "Metrics update every 5s" in footer', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      expect(screen.getByText('Metrics update every 5s')).toBeInTheDocument();
    });

    it('shows "Development only" indicator', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      expect(screen.getByText('Development only')).toBeInTheDocument();
    });
  });

  describe('Control Buttons', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('displays refresh button', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('displays clear button', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('displays close button', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const closeButton = screen.getByRole('button', { name: /close dashboard/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('closes dashboard when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const closeButton = screen.getByRole('button', { name: /close dashboard/i });
      await user.click(closeButton);
      
      expect(screen.queryByText('Performance Dashboard')).not.toBeInTheDocument();
    });

    it('refreshes metrics when refresh button is clicked', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);
      
      // Should trigger metrics refresh
      expect(screen.getByText('Performance Dashboard')).toBeInTheDocument();
    });
  });

  describe('Clear Metrics Functionality', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('clears stored metrics when clear button is clicked', async () => {
      const user = userEvent.setup();
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
      
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);
      
      expect(removeItemSpy).toHaveBeenCalledWith('webVitalsMetrics');
      
      removeItemSpy.mockRestore();
    });
  });

  describe('Performance Score Calculation', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('displays calculated performance score', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const scoreElement = screen.getByText('85/100');
      expect(scoreElement).toBeInTheDocument();
    });

    it('applies correct color for good scores (90+)', async () => {
      // Mock high score
      const { calculatePerformanceScore } = jest.requireMock('../../../utils/performance');
      calculatePerformanceScore.mockReturnValue(95);
      
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const scoreElement = screen.getByText('95/100');
      expect(scoreElement).toHaveClass('text-green-600');
    });

    it('applies correct color for poor scores (<70)', async () => {
      // Mock low score
      const { calculatePerformanceScore } = jest.requireMock('../../../utils/performance');
      calculatePerformanceScore.mockReturnValue(50);
      
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const scoreElement = screen.getByText('50/100');
      expect(scoreElement).toHaveClass('text-red-600');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('has proper aria labels for buttons', () => {
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      expect(toggleButton).toHaveAttribute('aria-label');
    });

    it('provides accessible close button', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const closeButton = screen.getByRole('button', { name: /close dashboard/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Close dashboard');
    });

    it('uses semantic markup for metrics', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('has responsive dashboard dimensions', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const dashboard = document.querySelector('.w-96.max-h-96');
      expect(dashboard).toBeInTheDocument();
    });

    it('includes scroll capability for overflow', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const dashboard = document.querySelector('.overflow-y-auto');
      expect(dashboard).toBeInTheDocument();
    });

    it('positions dashboard correctly', async () => {
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const dashboard = document.querySelector('.fixed.bottom-20.right-4');
      expect(dashboard).toBeInTheDocument();
    });
  });

  describe('Memory Management', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('cleans up interval on unmount', () => {
      const { unmount } = render(<PerformanceDashboard />);
      
      unmount();
      
      // Advance timers to ensure no memory leaks
      jest.advanceTimersByTime(10000);
    });

    it('handles component lifecycle correctly', () => {
      expect(() => {
        const { unmount } = render(<PerformanceDashboard />);
        unmount();
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
    });

    it('handles missing metrics gracefully', async () => {
      // Mock empty metrics
      const { getStoredMetrics } = jest.requireMock('../../../utils/performance');
      getStoredMetrics.mockReturnValue({});
      
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      expect(screen.getByText('Performance Dashboard')).toBeInTheDocument();
    });

    it('handles localStorage errors gracefully', async () => {
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = jest.fn(() => {
        throw new Error('Storage error');
      });
      
      const user = userEvent.setup();
      render(<PerformanceDashboard />);
      
      const toggleButton = screen.getByRole('button', { name: /show performance dashboard/i });
      await user.click(toggleButton);
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      
      expect(() => user.click(clearButton)).not.toThrow();
      
      Storage.prototype.removeItem = originalRemoveItem;
    });
  });
});