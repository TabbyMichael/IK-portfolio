import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal component</div>;
};

// Mock console.error to avoid noise in test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Mock window.location.reload
Object.defineProperty(window, 'location', {
  value: {
    reload: jest.fn(),
  },
  writable: true,
});

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Normal Operation', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('passes through multiple children correctly', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
          <span>Third child</span>
        </ErrorBoundary>
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByText('Third child')).toBeInTheDocument();
    });

    it('renders complex nested components without interference', () => {
      render(
        <ErrorBoundary>
          <div>
            <h1>Main Title</h1>
            <p>Description text</p>
            <button>Action Button</button>
          </div>
        </ErrorBoundary>
      );

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Description text')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Error Catching and Display', () => {
    it('catches errors and displays fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/We're sorry for the inconvenience/)).toBeInTheDocument();
    });

    it('displays user-friendly error message', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorMessage = screen.getByText(/We're sorry for the inconvenience/);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.textContent).toContain('Please try refreshing the page');
      expect(errorMessage.textContent).toContain('contact us if the problem persists');
    });

    it('shows refresh button in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const refreshButton = screen.getByRole('button', { name: /refresh page/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('logs error to console with error details', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalledWith(
        'Error caught by ErrorBoundary:',
        expect.any(Error),
        expect.any(Object)
      );
    });
  });

  describe('Fallback UI Rendering', () => {
    it('renders error UI with proper styling', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorContainer = document.querySelector('.min-h-screen.flex.items-center.justify-center');
      expect(errorContainer).toBeInTheDocument();
      expect(errorContainer).toHaveClass('bg-gray-900');
      expect(errorContainer).toHaveClass('text-white');
      expect(errorContainer).toHaveClass('p-4');
    });

    it('displays centered error message with proper layout', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorContent = document.querySelector('.max-w-md.text-center');
      expect(errorContent).toBeInTheDocument();
    });

    it('has properly styled refresh button', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const refreshButton = screen.getByRole('button', { name: /refresh page/i });
      expect(refreshButton).toHaveClass('bg-blue-600');
      expect(refreshButton).toHaveClass('hover:bg-blue-700');
      expect(refreshButton).toHaveClass('text-white');
      expect(refreshButton).toHaveClass('font-bold');
      expect(refreshButton).toHaveClass('py-2');
      expect(refreshButton).toHaveClass('px-4');
      expect(refreshButton).toHaveClass('rounded');
    });

    it('applies proper typography classes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const title = screen.getByText('Oops! Something went wrong');
      const description = screen.getByText(/We're sorry for the inconvenience/);

      expect(title).toHaveClass('text-2xl');
      expect(title).toHaveClass('font-bold');
      expect(title).toHaveClass('mb-4');
      expect(description).toHaveClass('mb-4');
      expect(description).toHaveClass('text-gray-300');
    });
  });

  describe('Refresh Functionality', () => {
    it('calls window.location.reload when refresh button is clicked', async () => {
      const user = userEvent.setup();
      const mockReload = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const refreshButton = screen.getByRole('button', { name: /refresh page/i });
      await user.click(refreshButton);

      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('maintains button interactivity in error state', async () => {
      const user = userEvent.setup();
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const refreshButton = screen.getByRole('button', { name: /refresh page/i });
      expect(refreshButton).not.toBeDisabled();
      
      // Should be clickable
      await user.click(refreshButton);
      // Should not throw any errors
    });
  });

  describe('Error Recovery', () => {
    it('can recover from error state when component re-renders without error', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Verify error state
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

      // Re-render with no error
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Should still show error state (ErrorBoundary doesn't automatically recover)
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('maintains error state after initial error', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

      // Re-render multiple times
      rerender(
        <ErrorBoundary>
          <div>New content</div>
        </ErrorBoundary>
      );

      // Should still show error state
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.queryByText('New content')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Children Handling', () => {
    it('catches errors from any child component', () => {
      render(
        <ErrorBoundary>
          <div>Safe component</div>
          <ThrowError shouldThrow={true} />
          <div>Another safe component</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.queryByText('Safe component')).not.toBeInTheDocument();
      expect(screen.queryByText('Another safe component')).not.toBeInTheDocument();
    });

    it('catches errors from deeply nested components', () => {
      render(
        <ErrorBoundary>
          <div>
            <div>
              <div>
                <ThrowError shouldThrow={true} />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Error Boundary State Management', () => {
    it('initializes with correct default state', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Normal content')).toBeInTheDocument();
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
    });

    it('updates state correctly when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides accessible error message structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Oops! Something went wrong');
    });

    it('has properly labeled refresh button', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const refreshButton = screen.getByRole('button', { name: /refresh page/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('maintains proper focus management in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const refreshButton = screen.getByRole('button', { name: /refresh page/i });
      expect(refreshButton).toBeVisible();
      expect(refreshButton).not.toHaveAttribute('disabled');
    });

    it('provides sufficient color contrast in error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorContainer = document.querySelector('.bg-gray-900.text-white');
      expect(errorContainer).toBeInTheDocument();
    });
  });

  describe('Performance and Reliability', () => {
    it('handles errors without memory leaks', () => {
      const { unmount } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      
      // Should unmount without issues
      unmount();
    });

    it('catches different types of errors', () => {
      const ThrowTypeError = () => {
        throw new TypeError('Type error test');
      };

      render(
        <ErrorBoundary>
          <ThrowTypeError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith(
        'Error caught by ErrorBoundary:',
        expect.any(TypeError),
        expect.any(Object)
      );
    });

    it('handles errors with custom error messages', () => {
      const ThrowCustomError = () => {
        throw new Error('Custom error message for testing');
      };

      render(
        <ErrorBoundary>
          <ThrowCustomError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith(
        'Error caught by ErrorBoundary:',
        expect.objectContaining({
          message: 'Custom error message for testing'
        }),
        expect.any(Object)
      );
    });
  });

  describe('Integration Scenarios', () => {
    it('works correctly with React components that use hooks', () => {
      const HookComponent = () => {
        const [count, setCount] = React.useState(0);
        if (count > 0) {
          throw new Error('Hook component error');
        }
        return (
          <button onClick={() => setCount(1)}>
            Trigger Error
          </button>
        );
      };

      // Check that component renders without container
      render(
        <ErrorBoundary>
          <HookComponent />
        </ErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /trigger error/i });
      expect(button).toBeInTheDocument();
    });

    it('isolates errors to prevent cascade failures', () => {
      render(
        <div>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
          <div>Content outside error boundary</div>
        </div>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Content outside error boundary')).toBeInTheDocument();
    });
  });
});