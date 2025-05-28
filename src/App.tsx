import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import ErrorBoundary from './components/common/ErrorBoundary';
import './loader.css';
import PageLoader from './PageLoader';

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

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds
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

const App: React.FC = () => (
  <ErrorBoundary>
    <Router>
      <div className="relative min-h-screen">
        <ParticleBackground />
        <Navbar />
        <main className="relative z-10">
          <AppRoutes />
        </main>
      </div>
    </Router>
  </ErrorBoundary>
);

export default App;
