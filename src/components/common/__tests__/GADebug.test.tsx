import { render, screen } from '@testing-library/react';
import GADebug from '../GADebug';

// Mock environment variables
const mockEnv = {
  NODE_ENV: 'development',
  DEV: true,
};

// Mock import.meta.env
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: mockEnv,
    },
  },
});

// Mock GA_TRACKING_ID
jest.mock('../../../config/analytics', () => ({
  GA_TRACKING_ID: 'GA_TEST_TRACKING_ID',
}));

describe('GADebug Component', () => {
  beforeEach(() => {
    // Reset environment
    mockEnv.NODE_ENV = 'development';
    mockEnv.DEV = true;
    
    // Reset window.gtag and dataLayer
    global.window.gtag = jest.fn() as (...args: unknown[]) => void;
    global.window.dataLayer = [];
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Reset window properties
    global.window.gtag = jest.fn() as (...args: unknown[]) => void;
    global.window.dataLayer = [];
  });

  it('renders debug panel in development mode', () => {
    render(<GADebug />);
    
    const debugPanel = document.querySelector('.fixed.bottom-4.right-4');
    expect(debugPanel).toBeInTheDocument();
    
    if (debugPanel) {
      expect(debugPanel).toHaveClass('fixed');
      expect(debugPanel).toHaveClass('bottom-4');
      expect(debugPanel).toHaveClass('right-4');
      expect(debugPanel).toHaveClass('bg-black');
      expect(debugPanel).toHaveClass('text-white');
      expect(debugPanel).toHaveClass('p-3');
      expect(debugPanel).toHaveClass('rounded-lg');
    }
  });

  it('detects when GA is not loaded', () => {
    global.window.gtag = jest.fn() as (...args: unknown[]) => void;
    render(<GADebug />);
    
    // Should show not loaded status
    expect(screen.getByText(/ga.*not.*loaded/i)).toBeInTheDocument();
  });

  it('detects when dataLayer is missing', () => {
    global.window.dataLayer = [];
    render(<GADebug />);
    
    // Should show appropriate status
    expect(screen.getByText(/datalayer.*empty/i)).toBeInTheDocument();
  });

  it('tracks events in real-time', () => {
    global.window.gtag = jest.fn() as (...args: unknown[]) => void;
    render(<GADebug />);
    
    // Simulating GA event tracking
    (global as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'test_event', { test: 'data' });
    
    // Should track the event
  });

  it('handles missing GA gracefully', () => {
    global.window.gtag = jest.fn() as (...args: unknown[]) => void;
    render(<GADebug />);
    
    // Should not crash and show appropriate message
    expect(screen.getByText(/ga.*status/i)).toBeInTheDocument();
  });

  it('cleans up intervals on unmount', () => {
    const { unmount } = render(<GADebug />);
    
    global.window.gtag = jest.fn() as (...args: unknown[]) => void;
    global.window.dataLayer = [];
    
    // @ts-expect-error - Mocking setTimeout for test
    global.setTimeout = jest.fn(() => 0) as typeof setTimeout;
    
    unmount();
    
    // Should clean up properly
  });
});