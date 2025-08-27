import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './common/ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle escape key and focus management
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      const focusableElements = menuRef.current?.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements?.length) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus first menu item when opened
      setTimeout(() => {
        firstMenuItemRef.current?.focus();
      }, 100);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { name: 'Home', path: '/', ariaLabel: 'Navigate to Home page' },
    { name: 'About', path: '/about', ariaLabel: 'Navigate to About page' },
    { name: 'Projects', path: '/projects', ariaLabel: 'Navigate to Projects showcase' },
    { name: 'Newsletter', path: '/news', ariaLabel: 'Navigate to Newsletter signup' },
    { name: 'Contact', path: '/contact', ariaLabel: 'Navigate to Contact page' },
  ];

  return (
    <>
      {/* Skip Navigation Link for Screen Readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-primary px-4 py-2 rounded z-[9999] focus:outline-none focus:ring-2 focus:ring-white"
        onFocus={(e) => {
          e.currentTarget.classList.remove('sr-only');
          e.currentTarget.classList.add('fixed');
        }}
        onBlur={(e) => {
          e.currentTarget.classList.add('sr-only');
          e.currentTarget.classList.remove('fixed');
        }}
      >
        Skip to main content
      </a>

      <nav 
        className="fixed w-full z-50 glass" 
        role="navigation" 
        aria-label="Main navigation"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="text-accent font-poppins font-bold text-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary rounded"
            aria-label="Ian Kibugu Portfolio - Home"
          >
            IK
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-baseline space-x-8" role="navigation" aria-label="Desktop navigation">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1 relative ${
                      isActive 
                        ? 'text-accent border-b-2 border-accent' 
                        : 'text-gray-300 hover:text-accent focus:text-accent'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={item.ariaLabel}
                    tabIndex={0}
                  >
                    {item.name}
                    {isActive && (
                      <span className="sr-only"> (current page)</span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary rounded p-1"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden glass fixed top-16 left-0 right-0 z-50 max-h-screen overflow-y-auto"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <nav className="px-4 pt-4 pb-6 space-y-2" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  ref={index === 0 ? firstMenuItemRef : undefined}
                  to={item.path}
                  className={`block px-4 py-3 text-lg transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary ${
                    isActive 
                      ? 'text-accent bg-accent/20 font-semibold' 
                      : 'text-gray-300 hover:text-accent hover:bg-accent/10 focus:text-accent focus:bg-accent/10'
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    // Announce navigation to screen readers
                    const announcement = `Navigating to ${item.name}`;
                    const ariaLive = document.createElement('div');
                    ariaLive.setAttribute('aria-live', 'polite');
                    ariaLive.setAttribute('aria-atomic', 'true');
                    ariaLive.className = 'sr-only';
                    ariaLive.textContent = announcement;
                    document.body.appendChild(ariaLive);
                    setTimeout(() => document.body.removeChild(ariaLive), 1000);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.ariaLabel}
                  tabIndex={0}
                >
                  {item.name}
                  {isActive && (
                    <span className="sr-only"> (current page)</span>
                  )}
                </Link>
              );
            })}
            
            {/* Close button for better mobile UX */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 px-4 py-2 text-center text-gray-400 hover:text-accent focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary rounded"
              aria-label="Close navigation menu"
            >
              Close Menu
            </button>
          </nav>
        </motion.div>
      )}
    </nav>
    </>
  );
}