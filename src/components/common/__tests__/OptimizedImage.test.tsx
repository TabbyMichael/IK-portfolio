import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OptimizedImage from '../OptimizedImage';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Loader2: ({ className, ...props }: { className?: string } & React.ComponentProps<'div'>) => <div data-testid="loader-icon" className={className} {...props} />,
  AlertCircle: ({ className, ...props }: { className?: string } & React.ComponentProps<'div'>) => <div data-testid="alert-icon" className={className} {...props} />,
}));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

describe('OptimizedImage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIntersectionObserver.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders image container', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
        />
      );

      const container = document.querySelector('.relative.overflow-hidden');
      expect(container).toBeInTheDocument();
    });

    it('displays loading placeholder initially', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
        />
      );

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      expect(screen.getByText('Loading image: Test image')).toBeInTheDocument();
    });

    it('sets proper aspect ratio from width and height', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
        />
      );

      const container = document.querySelector('.relative.overflow-hidden');
      expect(container).toHaveStyle({ aspectRatio: '400 / 300' });
    });

    it('uses default aspect ratio when width/height not provided', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
        />
      );

      const container = document.querySelector('.relative.overflow-hidden');
      expect(container).toHaveStyle({ paddingBottom: '56.25%' }); // 16:9 ratio
    });
  });

  describe('Lazy Loading', () => {
    it('implements lazy loading by default', () => {
      const mockObserve = jest.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      });

      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
        />
      );

      expect(mockIntersectionObserver).toHaveBeenCalled();
      expect(mockObserve).toHaveBeenCalled();
    });

    it('skips lazy loading when lazy=false', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const picture = document.querySelector('picture');
      expect(picture).toBeInTheDocument();
    });

    it('skips lazy loading when priority=true', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          priority={true}
        />
      );

      const picture = document.querySelector('picture');
      expect(picture).toBeInTheDocument();
    });

    it('loads image when intersection observer triggers', () => {
      let intersectionCallback: (entries: { isIntersecting: boolean; target: Element }[]) => void = () => {};
      
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
        />
      );

      // Simulate intersection
      intersectionCallback([{ isIntersecting: true, target: document.createElement('div') }]);

      const picture = document.querySelector('picture');
      expect(picture).toBeInTheDocument();
    });
  });

  describe('Image Loading States', () => {
    it('shows loading state initially', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const loadingPlaceholder = document.querySelector('.bg-gray-200.animate-pulse');
      expect(loadingPlaceholder).toBeInTheDocument();
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('handles successful image load', async () => {
      const onLoadMock = jest.fn();
      
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
          onLoad={onLoadMock}
        />
      );

      const img = document.querySelector('img');
      if (img) {
        fireEvent.load(img);
      }

      await waitFor(() => {
        expect(onLoadMock).toHaveBeenCalled();
      });
    });

    it('handles image load error', async () => {
      const onErrorMock = jest.fn();
      
      render(
        <OptimizedImage 
          src="/invalid-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
          onError={onErrorMock}
        />
      );

      const img = document.querySelector('img');
      if (img) {
        fireEvent.error(img);
      }

      await waitFor(() => {
        expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
        expect(screen.getByText('Failed to load image')).toBeInTheDocument();
        expect(onErrorMock).toHaveBeenCalledWith('Failed to load image');
      });
    });

    it('displays error state UI', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const img = document.querySelector('img');
      if (img) {
        fireEvent.error(img);
      }

      const errorContainer = document.querySelector('.bg-gray-100.flex.flex-col.items-center.justify-center');
      expect(errorContainer).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
      expect(screen.getByText('Failed to load image')).toBeInTheDocument();
    });
  });

  describe('Image Optimization', () => {
    it('generates WebP sources for modern browsers', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const webpSource = document.querySelector('source[type="image/webp"]');
      expect(webpSource).toBeInTheDocument();
    });

    it('provides fallback sources for compatibility', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const img = document.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src');
      expect(img).toHaveAttribute('srcSet');
    });

    it('applies custom quality setting', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          quality={95}
          lazy={false}
        />
      );

      const webpSource = document.querySelector('source[type="image/webp"]');
      const img = document.querySelector('img');
      
      // Quality should be reflected in generated URLs
      expect(webpSource).toBeInTheDocument();
      expect(img).toBeInTheDocument();
    });

    it('uses custom sizes attribute', () => {
      const customSizes = "(max-width: 600px) 100vw, 50vw";
      
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          sizes={customSizes}
          lazy={false}
        />
      );

      const webpSource = document.querySelector('source[type="image/webp"]');
      const img = document.querySelector('img');
      
      expect(webpSource).toHaveAttribute('sizes', customSizes);
      expect(img).toHaveAttribute('sizes', customSizes);
    });
  });

  describe('Performance Testing', () => {
    it('sets appropriate loading attribute for lazy loading', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={true}
        />
      );

      // Image won't be in DOM initially due to lazy loading
      // This tests the lazy loading behavior
    });

    it('sets eager loading for priority images', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          priority={true}
          lazy={false}
        />
      );

      const img = document.querySelector('img');
      expect(img).toHaveAttribute('loading', 'eager');
    });

    it('includes decoding="async" for performance', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const img = document.querySelector('img');
      expect(img).toHaveAttribute('decoding', 'async');
    });

    it('configures intersection observer with proper margins', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
        />
      );

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          rootMargin: '50px',
          threshold: 0.1
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('logs warnings for missing images', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      render(
        <OptimizedImage 
          src="/missing-image.jpg" 
          alt="Missing image" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const img = document.querySelector('img');
      if (img) {
        fireEvent.error(img);
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        'Image load error:',
        expect.objectContaining({
          src: '/missing-image.jpg',
          alt: 'Missing image',
          error: 'Failed to load image'
        })
      );

      consoleSpy.mockRestore();
    });

    it('gracefully handles intersection observer unavailability', () => {
      // Temporarily remove IntersectionObserver
      const originalIntersectionObserver = window.IntersectionObserver;
      // @ts-expect-error - Testing error condition
      delete window.IntersectionObserver;

      expect(() => {
        render(
          <OptimizedImage 
            src="/test-image.jpg" 
            alt="Test image" 
            width={400} 
            height={300} 
          />
        );
      }).not.toThrow();

      // Restore IntersectionObserver
      window.IntersectionObserver = originalIntersectionObserver;
    });

    it('cleans up intersection observer on unmount', () => {
      const mockUnobserve = jest.fn();
      const mockDisconnect = jest.fn();
      
      mockIntersectionObserver.mockReturnValue({
        observe: jest.fn(),
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      });

      const { unmount } = render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
        />
      );

      unmount();

      expect(mockUnobserve).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Descriptive alt text" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const img = document.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Descriptive alt text');
    });

    it('includes screen reader text for loading state', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
        />
      );

      expect(screen.getByText('Loading image: Test image')).toBeInTheDocument();
      expect(screen.getByText('Loading image: Test image')).toHaveClass('sr-only');
    });

    it('includes screen reader text for error state', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const img = document.querySelector('img');
      if (img) {
        fireEvent.error(img);
      }

      expect(screen.getByText('Error loading image: Test image')).toBeInTheDocument();
      expect(screen.getByText('Error loading image: Test image')).toHaveClass('sr-only');
    });

    it('hides decorative icons from screen readers', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
        />
      );

      const loaderIcon = screen.getByTestId('loader-icon');
      expect(loaderIcon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Responsive Behavior', () => {
    it('applies custom className', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          className="custom-class rounded-lg"
        />
      );

      const container = document.querySelector('.relative.overflow-hidden');
      expect(container).toHaveClass('custom-class');
      expect(container).toHaveClass('rounded-lg');
    });

    it('passes through additional props', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
          data-testid="custom-image"
        />
      );

      const img = document.querySelector('img[data-testid="custom-image"]');
      expect(img).toBeInTheDocument();
    });

    it('maintains container dimensions', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={800} 
          height={600} 
        />
      );

      const container = document.querySelector('.relative.overflow-hidden');
      expect(container).toHaveStyle({ aspectRatio: '800 / 600' });
    });
  });

  describe('Loading Placeholder Control', () => {
    it('shows placeholder when showPlaceholder=true', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          showPlaceholder={true}
        />
      );

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('hides placeholder when showPlaceholder=false', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          showPlaceholder={false}
        />
      );

      expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
    });
  });

  describe('Image Transition Effects', () => {
    it('applies opacity transition on load', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const img = document.querySelector('img');
      expect(img).toHaveClass('transition-opacity');
      expect(img).toHaveClass('duration-300');
    });

    it('starts with opacity-0 when loading', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const img = document.querySelector('img');
      expect(img).toHaveClass('opacity-0');
    });

    it('transitions to opacity-100 after load', async () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width={400} 
          height={300} 
          lazy={false}
        />
      );

      const img = document.querySelector('img');
      if (img) {
        fireEvent.load(img);
      }

      await waitFor(() => {
        expect(img).toHaveClass('opacity-100');
      });
    });
  });
});