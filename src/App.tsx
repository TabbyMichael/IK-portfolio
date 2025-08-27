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

const routes = [
  { path: '/', component: lazy(() => import('./pages/Home')) },
  { path: '/about', component: lazy(() => import('./pages/About')) },
  { path: '/projects', component: lazy(() => import('./pages/Projects')) },
  { path: '/contact', component: lazy(() => import('./pages/Contact')) },
  { path: '/blog', component: lazy(() => import('./pages/Blog')) },
  { path: '/case', component: lazy(() => import('./pages/CaseStudies')) },
  { path: '/news', component: lazy(() => import('./pages/Newsletter')) },
  { path: '/testimonials', component: lazy(() => import('./pages/Testimonials')) },
] as const;

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
