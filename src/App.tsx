import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// Route configuration
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

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size={60} />
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="relative min-h-screen">
          <ParticleBackground />
          <Navbar />
          <main className="relative z-10">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {routes.map(({ path, component: Component }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<Component />}
                  />
                ))}
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;