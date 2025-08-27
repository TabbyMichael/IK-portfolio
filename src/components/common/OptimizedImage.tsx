import React, { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'onError'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  lazy?: boolean;
  showPlaceholder?: boolean;
  quality?: number;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

// Generate responsive image URLs (you would implement this based on your image optimization service)
const generateResponsiveUrls = (src: string, quality: number = 85) => {
  // This is a mock implementation - replace with your actual image optimization service
  // Examples: Cloudinary, ImageKit, or your own image processing pipeline
  const baseSrc = src.replace(/\.[^.]+$/, ''); // Remove extension
  
  return {
    webp: {
      '1x': `${baseSrc}.webp?q=${quality}&w=400`,
      '2x': `${baseSrc}.webp?q=${quality}&w=800`,
      '3x': `${baseSrc}.webp?q=${quality}&w=1200`
    },
    fallback: {
      '1x': `${src}?q=${quality}&w=400`,
      '2x': `${src}?q=${quality}&w=800`,
      '3x': `${src}?q=${quality}&w=1200`
    }
  };
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  lazy = true,
  showPlaceholder = true,
  quality = 85,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [lazy, priority, isInView]);

  // Handle image load events
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    const errorMessage = 'Failed to load image';
    console.warn('Image load error:', { src, alt, error: errorMessage });
    onError?.(errorMessage);
  };

  // Generate responsive URLs
  const urls = generateResponsiveUrls(src, quality);

  // Generate srcSet for WebP and fallback
  const webpSrcSet = `${urls.webp['1x']} 1x, ${urls.webp['2x']} 2x, ${urls.webp['3x']} 3x`;
  const fallbackSrcSet = `${urls.fallback['1x']} 1x, ${urls.fallback['2x']} 2x, ${urls.fallback['3x']} 3x`;

  // Placeholder dimensions
  const placeholderAspectRatio = width && height ? (height / width) * 100 : 56.25; // Default to 16:9

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
        paddingBottom: !width || !height ? `${placeholderAspectRatio}%` : undefined,
        ...((!width || !height) && { height: 0 })
      }}
    >
      {/* Loading placeholder */}
      {isLoading && showPlaceholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading image: {alt}</span>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
          <AlertCircle className="w-8 h-8 mb-2" aria-hidden="true" />
          <span className="text-sm text-center px-2">Failed to load image</span>
          <span className="sr-only">Error loading image: {alt}</span>
        </div>
      )}

      {/* Actual image with WebP support */}
      {isInView && (
        <picture className="absolute inset-0">
          {/* WebP sources for modern browsers */}
          <source
            type="image/webp"
            srcSet={webpSrcSet}
            sizes={sizes}
          />
          
          {/* Fallback for browsers that don't support WebP */}
          <img
            ref={imgRef}
            src={urls.fallback['1x']}
            srcSet={fallbackSrcSet}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={lazy && !priority ? 'lazy' : 'eager'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            {...props}
          />
        </picture>
      )}

      {/* Overlay for additional styling */}
      {!isLoading && !hasError && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" />
      )}
    </div>
  );
};

// Utility function to preload critical images
export const preloadImage = (src: string, quality: number = 85): Promise<void> => {
  return new Promise((resolve, reject) => {
    const urls = generateResponsiveUrls(src, quality);
    
    // Preload WebP version
    const webpImg = new Image();
    webpImg.onload = () => resolve();
    webpImg.onerror = () => {
      // Fallback to original format
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve();
      fallbackImg.onerror = reject;
      fallbackImg.src = urls.fallback['1x'];
    };
    webpImg.src = urls.webp['1x'];
  });
};

// Hook for preloading multiple images
export const useImagePreloader = (sources: string[], quality: number = 85) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    sources.reduce((acc, src) => ({ ...acc, [src]: true }), {})
  );
  
  useEffect(() => {
    const preloadPromises = sources.map(async (src) => {
      try {
        await preloadImage(src, quality);
        setLoadingStates(prev => ({ ...prev, [src]: false }));
      } catch (error) {
        console.warn(`Failed to preload image: ${src}`, error);
        setLoadingStates(prev => ({ ...prev, [src]: false }));
      }
    });
    
    Promise.all(preloadPromises);
  }, [sources, quality]);
  
  return loadingStates;
};

export default OptimizedImage;