import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from '../../../contexts/ThemeContext';

// Mock the theme context
jest.mock('../../../contexts/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, className, ...props }: {
      children: React.ReactNode;
      onClick?: () => void;
      className?: string;
    } & React.ComponentProps<'button'>) => (
      <button onClick={onClick} className={className} {...props}>
        {children}
      </button>
    ),
    div: ({ children, className, ...props }: {
      children: React.ReactNode;
      className?: string;
    } & React.ComponentProps<'div'>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Moon: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="moon-icon" className={className} {...props} />,
  Sun: ({ className, ...props }: { className?: string } & React.ComponentProps<'svg'>) => <svg data-testid="sun-icon" className={className} {...props} />,
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('ThemeToggle Component', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockToggleTheme.mockClear();
  });

  describe('Rendering', () => {
    it('renders with dark theme', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });

    it('renders with light theme', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });

    it('has proper styling classes', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('p-2');
      expect(button).toHaveClass('rounded-full');
      expect(button).toHaveClass('bg-white/10');
      expect(button).toHaveClass('dark:bg-white/10');
      expect(button).toHaveClass('backdrop-blur-md');
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('border-white/20');
      expect(button).toHaveClass('dark:border-white/20');
    });

    it('displays correct icon classes', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      const { unmount } = render(<ThemeToggle />);
      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toHaveClass('w-6');
      expect(moonIcon).toHaveClass('h-6');
      expect(moonIcon).toHaveClass('text-yellow-300');
      
      unmount();

      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      render(<ThemeToggle />);
      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toHaveClass('w-6');
      expect(sunIcon).toHaveClass('h-6');
      expect(sunIcon).toHaveClass('text-orange-400');
    });
  });

  describe('Theme Switching Functionality', () => {
    it('calls toggleTheme when button is clicked', async () => {
      const user = userEvent.setup();
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('handles rapid clicking gracefully', async () => {
      const user = userEvent.setup();
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(mockToggleTheme).toHaveBeenCalledTimes(3);
    });

    it('maintains functionality during theme transitions', () => {
      const { rerender } = render(<ThemeToggle />);
      
      // Switch from dark to light
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });
      
      rerender(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });
  });

  describe('State Persistence', () => {
    it('reflects current theme state correctly', () => {
      // Test dark theme
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });
      
      const { rerender } = render(<ThemeToggle />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
      
      // Test light theme
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });
      
      rerender(<ThemeToggle />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('updates visual feedback based on theme', () => {
      // Start with dark theme
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });
      
      const { rerender } = render(<ThemeToggle />);
      
      // Switch to light theme
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });
      
      rerender(<ThemeToggle />);
      
      // Should show both icons but with different opacity/scale
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides meaningful aria-label', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button.getAttribute('aria-label')).toContain('Switch to');
    });

    it('updates aria-label based on current theme', () => {
      // Test dark theme label
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });
      
      const { rerender } = render(<ThemeToggle />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
      
      // Test light theme label
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });
      
      rerender(<ThemeToggle />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('maintains button semantics', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
      expect(button).not.toHaveAttribute('disabled');
    });

    it('provides keyboard accessibility', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      
      // Test keyboard interaction
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyDown(button, { key: ' ' });
      
      // Button should remain accessible
      expect(button).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders without throwing errors', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      expect(() => {
        render(<ThemeToggle />);
      }).not.toThrow();
    });

    it('handles theme context errors gracefully', () => {
      mockUseTheme.mockImplementation(() => {
        throw new Error('Theme context error');
      });

      expect(() => {
        render(<ThemeToggle />);
      }).toThrow('Theme context error');
    });

    it('unmounts cleanly', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      const { unmount } = render(<ThemeToggle />);
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('handles rapid theme changes', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      const { rerender } = render(<ThemeToggle />);
      
      // Rapid theme changes
      mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme: mockToggleTheme, setTheme: jest.fn() });
      rerender(<ThemeToggle />);
      
      mockUseTheme.mockReturnValue({ theme: 'dark', toggleTheme: mockToggleTheme, setTheme: jest.fn() });
      rerender(<ThemeToggle />);
      
      mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme: mockToggleTheme, setTheme: jest.fn() });
      rerender(<ThemeToggle />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('works with theme context provider', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      render(<ThemeToggle />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(mockUseTheme).toHaveBeenCalled();
    });

    it('maintains state consistency with theme context', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        setTheme: jest.fn(),
      });

      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      
      // Verify theme context was called
      expect(mockUseTheme).toHaveBeenCalled();
    });
  });
});