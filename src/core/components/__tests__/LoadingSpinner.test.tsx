import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, animate, transition, ...props }: {
      children?: React.ReactNode;
      style?: React.CSSProperties;
      animate?: unknown;
      transition?: unknown;
    } & React.ComponentProps<'div'>) => {
      // Handle Infinity in transition for JSON serialization
      const transitionWithInfinity = transition && typeof transition === 'object' 
        ? JSON.stringify(transition, (_key, value) => 
            value === Infinity ? 'Infinity' : value
          )
        : JSON.stringify(transition);
      
      return (
        <div 
          {...props} 
          style={style}
          data-testid="loading-spinner"
          data-animate={JSON.stringify(animate)}
          data-transition={transitionWithInfinity}
        >
          {children}
        </div>
      );
    },
  },
}));

describe('LoadingSpinner Component', () => {
  describe('Basic Rendering', () => {
    it('renders loading spinner', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        width: '40px',
        height: '40px',
        border: '4px solid #3B82F6',
        borderBottomColor: 'transparent',
        borderRadius: '50%',
      });
    });

    it('has proper container styling', () => {
      render(<LoadingSpinner />);
      
      const container = document.querySelector('.flex.items-center.justify-center');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Size Customization', () => {
    it('renders with custom size', () => {
      render(<LoadingSpinner size={60} />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        width: '60px',
        height: '60px',
      });
    });

    it('handles small size values', () => {
      render(<LoadingSpinner size={20} />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        width: '20px',
        height: '20px',
      });
    });

    it('handles large size values', () => {
      render(<LoadingSpinner size={100} />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        width: '100px',
        height: '100px',
      });
    });

    it('maintains aspect ratio with custom size', () => {
      const customSize = 80;
      render(<LoadingSpinner size={customSize} />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        width: `${customSize}px`,
        height: `${customSize}px`,
      });
    });
  });

  describe('Color Customization', () => {
    it('renders with custom color', () => {
      const customColor = '#FF0000';
      render(<LoadingSpinner color={customColor} />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        border: `4px solid ${customColor}`,
        borderBottomColor: 'transparent',
      });
    });

    it('handles hex color values', () => {
      render(<LoadingSpinner color="#00FF00" />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        border: '4px solid #00FF00',
      });
    });

    it('handles RGB color values', () => {
      render(<LoadingSpinner color="rgb(255, 0, 255)" />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        border: '4px solid rgb(255, 0, 255)',
      });
    });

    it('handles CSS color names', () => {
      render(<LoadingSpinner color="red" />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        border: '4px solid red',
      });
    });

    it('maintains transparent bottom border regardless of color', () => {
      render(<LoadingSpinner color="#123456" />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        borderBottomColor: 'transparent',
      });
    });
  });

  describe('Combined Props', () => {
    it('handles both size and color customization', () => {
      render(<LoadingSpinner size={75} color="#9333EA" />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        width: '75px',
        height: '75px',
        border: '4px solid #9333EA',
        borderBottomColor: 'transparent',
      });
    });

    it('maintains border radius with custom props', () => {
      render(<LoadingSpinner size={50} color="#10B981" />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        borderRadius: '50%',
      });
    });
  });

  describe('Animation Configuration', () => {
    it('configures rotation animation', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByTestId('loading-spinner');
      const animateData = JSON.parse(spinner.getAttribute('data-animate') || '{}');
      expect(animateData.rotate).toBe(360);
    });

    it('configures animation transition', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByTestId('loading-spinner');
      const transitionData = JSON.parse(spinner.getAttribute('data-transition') || '{}', (_key, value) => 
        value === 'Infinity' ? Infinity : value
      );
      expect(transitionData).toEqual({
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      });
    });

    it('sets up continuous rotation', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByTestId('loading-spinner');
      const transitionData = JSON.parse(spinner.getAttribute('data-transition') || '{}', (_key, value) => 
        value === 'Infinity' ? Infinity : value
      );
      expect(transitionData.repeat).toBe(Infinity);
    });

    it('uses linear easing for smooth rotation', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByTestId('loading-spinner');
      const transitionData = JSON.parse(spinner.getAttribute('data-transition') || '{}');
      expect(transitionData.ease).toBe('linear');
    });
  });

  describe('Styling and Layout', () => {
    it('centers the spinner in its container', () => {
      render(<LoadingSpinner />);
      
      const container = document.querySelector('.flex.items-center.justify-center');
      expect(container).toBeInTheDocument();
    });

    it('creates circular spinner shape', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        borderRadius: '50%',
      });
    });

    it('maintains consistent border width', () => {
      render(<LoadingSpinner size={80} />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner.style.border).toContain('4px solid');
    });

    it('applies proper border styling for spinner effect', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        borderBottomColor: 'transparent',
      });
    });
  });

  describe('TypeScript Props Interface', () => {
    it('accepts optional size prop', () => {
      expect(() => {
        render(<LoadingSpinner size={50} />);
      }).not.toThrow();
    });

    it('accepts optional color prop', () => {
      expect(() => {
        render(<LoadingSpinner color="#000000" />);
      }).not.toThrow();
    });

    it('works without any props (all optional)', () => {
      expect(() => {
        render(<LoadingSpinner />);
      }).not.toThrow();
    });

    it('handles undefined props gracefully', () => {
      expect(() => {
        render(<LoadingSpinner size={undefined} color={undefined} />);
      }).not.toThrow();
    });
  });

  describe('Accessibility Considerations', () => {
    it('is visually identifiable as a loading indicator', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toBeVisible();
    });

    it('maintains visibility with custom colors', () => {
      render(<LoadingSpinner color="#FFFFFF" />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeVisible();
    });

    it('scales appropriately for different sizes', () => {
      const { rerender } = render(<LoadingSpinner size={16} />);
      let spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({ width: '16px', height: '16px' });

      rerender(<LoadingSpinner size={64} />);
      spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({ width: '64px', height: '64px' });
    });
  });

  describe('Performance', () => {
    it('renders without throwing errors', () => {
      expect(() => {
        render(<LoadingSpinner />);
      }).not.toThrow();
    });

    it('handles rapid prop changes', () => {
      const { rerender } = render(<LoadingSpinner size={40} color="#FF0000" />);
      
      expect(() => {
        rerender(<LoadingSpinner size={60} color="#00FF00" />);
        rerender(<LoadingSpinner size={30} color="#0000FF" />);
        rerender(<LoadingSpinner size={50} color="#FFFF00" />);
      }).not.toThrow();
    });

    it('unmounts cleanly', () => {
      const { unmount } = render(<LoadingSpinner />);
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero size gracefully', () => {
      render(<LoadingSpinner size={0} />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        width: '0px',
        height: '0px',
      });
    });

    it('handles very large sizes', () => {
      render(<LoadingSpinner size={1000} />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        width: '1000px',
        height: '1000px',
      });
    });

    it('handles empty color string', () => {
      render(<LoadingSpinner color="" />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('handles negative size values', () => {
      render(<LoadingSpinner size={-10} />);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        width: '-10px',
        height: '-10px',
      });
    });
  });

  describe('Visual Consistency', () => {
    it('maintains circular shape across different sizes', () => {
      const sizes = [20, 40, 60, 80, 100];
      
      sizes.forEach(size => {
        const { unmount } = render(<LoadingSpinner size={size} />);
        const spinner = screen.getByTestId('loading-spinner');
        
        expect(spinner).toHaveStyle({
          borderRadius: '50%',
          width: `${size}px`,
          height: `${size}px`,
        });
        
        unmount();
      });
    });

    it('maintains animation properties across different configurations', () => {
      const configs = [
        { size: 30, color: '#FF0000' },
        { size: 50, color: '#00FF00' },
        { size: 70, color: '#0000FF' },
      ];

      configs.forEach(config => {
        const { unmount } = render(<LoadingSpinner {...config} />);
        const spinner = screen.getByTestId('loading-spinner');
        
        const animateData = JSON.parse(spinner.getAttribute('data-animate') || '{}');
        const transitionData = JSON.parse(spinner.getAttribute('data-transition') || '{}', (_key, value) => 
          value === 'Infinity' ? Infinity : value
        );
        
        expect(animateData.rotate).toBe(360);
        expect(transitionData.repeat).toBe(Infinity);
        expect(transitionData.ease).toBe('linear');
        
        unmount();
      });
    });
  });
});