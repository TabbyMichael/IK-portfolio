import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import ErrorBoundary from './components/common/ErrorBoundary';
import SEOHelmet from './components/SEO/SEOHelmet';
import { ThemeProvider } from './contexts/ThemeContext';
import { initGA, usePageTracking } from './utils/analytics';
import { initSentry } from './utils/sentry';
import { initPerformanceMonitoring } from './utils/performance';
import './loader.css';
import PageLoader from './PageLoader';

// Conditionally import development components
const GADebug = import.meta.env.DEV 
  ? lazy(() => import('./components/common/GADebug'))
  : null;

const PerformanceDashboard = import.meta.env.DEV
  ? lazy(() => import('./components/common/PerformanceDashboard'))
  : null;

// Lazy-loaded route components with better error handling
const routes = [
  { 
    path: '/', 
    component: lazy(() => import('./pages/Home').catch(() => {
      return { default: () => <RouteErrorFallback routeName="Home" /> };
    })),
    name: 'Home'
  },
  { 
    path: '/about', 
    component: lazy(() => import('./pages/About').catch(() => {
      return { default: () => <RouteErrorFallback routeName="About" /> };
    })),
    name: 'About'
  },
  { 
    path: '/projects', 
    component: lazy(() => import('./pages/Projects').catch(() => {
      return { default: () => <RouteErrorFallback routeName="Projects" /> };
    })),
    name: 'Projects'
  },
  { 
    path: '/contact', 
    component: lazy(() => import('./pages/Contact').catch(() => {
      return { default: () => <RouteErrorFallback routeName="Contact" /> };
    })),
    name: 'Contact'
  },
  { 
    path: '/blog', 
    component: lazy(() => import('./pages/Blog').catch(() => {
      return { default: () => <RouteErrorFallback routeName="Blog" /> };
    })),
    name: 'Blog'
  },
  { 
    path: '/case', 
    component: lazy(() => import('./pages/CaseStudies').catch(() => {
      return { default: () => <RouteErrorFallback routeName="Case Studies" /> };
    })),
    name: 'Case Studies'
  },
  { 
    path: '/news', 
    component: lazy(() => import('./pages/Newsletter').catch(() => {
      return { default: () => <RouteErrorFallback routeName="Newsletter" /> };
    })),
    name: 'Newsletter'
  },
  { 
    path: '/testimonials', 
    component: lazy(() => import('./pages/Testimonials').catch(() => {
      return { default: () => <RouteErrorFallback routeName="Testimonials" /> };
    })),
    name: 'Testimonials'
  },
] as const;

// Route-specific error fallback component
const RouteErrorFallback: React.FC<{ routeName: string }> = ({ routeName }) => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading {routeName}</h2>
          <p className="text-red-600 mb-4">
            Failed to load {routeName} page. Please refresh the page or try again later.
          </p>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Initialize page tracking
  usePageTracking();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // Reduced from 2000ms to 800ms
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <PageLoader />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </Suspense>
    </>
  );
};

const App: React.FC = () => {
  // Initialize monitoring services
  useEffect(() => {
    // Initialize Google Analytics
    initGA();
    
    // Initialize Sentry for error tracking (production only)
    if (import.meta.env.PROD || import.meta.env.VITE_SENTRY_DSN) {
      initSentry();
    }
    
    // Initialize performance monitoring
    if (import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING !== 'false') {
      initPerformanceMonitoring();
    }
    
    // Preload critical testimonial images
    const testimonialImages = [
      '/assets/webp/dr-sarah-kimani.webp',
      '/assets/webp/michael-ochieng.webp',
      '/assets/webp/james-mwangi.webp',
      '/assets/webp/grace-wanjiku.webp',
      '/assets/webp/dr-peter-kinyanjui.webp',
      '/assets/webp/catherine-njeri.webp',
      '/assets/webp/robert-kamau.webp',
      '/assets/webp/mary-akinyi.webp'
    ];
    
    // Preload images with error handling
    testimonialImages.forEach(src => {
      const img = new Image();
      img.onload = () => console.log(`✓ Preloaded: ${src}`);
      img.onerror = () => console.error(`✗ Failed to preload: ${src}`);
      img.src = src;
    });
    
    // Log initialization status
    console.log('🚀 Portfolio app initialized with:', {
      environment: import.meta.env.MODE,
      analytics: !!import.meta.env.VITE_GA_TRACKING_ID,
      sentry: !!import.meta.env.VITE_SENTRY_DSN,
      performance: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING !== 'false'
    });
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <SEOHelmet />
          <div className="relative min-h-screen">
            <ParticleBackground />
            <Navbar />
            <main className="relative z-10" id="main-content" role="main" aria-label="Main content">
              <AppRoutes />
            </main>
            {import.meta.env.DEV && GADebug && (
              <Suspense fallback={null}>
                <GADebug />
              </Suspense>
            )}
            {import.meta.env.DEV && PerformanceDashboard && (
              <Suspense fallback={null}>
                <PerformanceDashboard />
              </Suspense>
            )}
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
