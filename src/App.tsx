import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import ErrorBoundary from './components/common/ErrorBoundary';
import SEOHelmet from './components/SEO/SEOHelmet';
import { initGA, usePageTracking } from './utils/analytics';
import './loader.css';
import PageLoader from './PageLoader';

// Conditionally import GADebug only in development
const GADebug = import.meta.env.DEV 
  ? lazy(() => import('./components/common/GADebug'))
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
  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <SEOHelmet />
        <div className="relative min-h-screen">
          <ParticleBackground />
          <Navbar />
          <main className="relative z-10">
            <AppRoutes />
          </main>
          {import.meta.env.DEV && GADebug && (
            <Suspense fallback={null}>
              <GADebug />
            </Suspense>
          )}
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
