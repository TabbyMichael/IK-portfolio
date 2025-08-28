import '@testing-library/jest-dom';
import './jest.d.ts';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [];
  
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock HTMLCanvasElement.getContext for particle background
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  translate: jest.fn(),
  transform: jest.fn(),
  setTransform: jest.fn(),
  createLinearGradient: jest.fn().mockReturnValue({
    addColorStop: jest.fn(),
  }),
  fillStyle: '',
  strokeStyle: '',
  globalAlpha: 1,
  lineWidth: 1,
  font: '10px sans-serif',
  textAlign: 'start',
  textBaseline: 'alphabetic',
});

// Mock environment variables
process.env.VITE_GA_TRACKING_ID = 'test-ga-id';
process.env.VITE_SENTRY_DSN = 'test-sentry-dsn';
process.env.VITE_ENVIRONMENT = 'test';

// Mock import.meta.env for Vite
const mockImportMetaEnv = {
  DEV: true,
  PROD: false,
  MODE: 'test',
  VITE_GA_TRACKING_ID: 'test-ga-id',
  VITE_SENTRY_DSN: 'test-sentry-dsn',
  VITE_ENVIRONMENT: 'test',
  VITE_ENABLE_PERFORMANCE_MONITORING: 'true'
};

// Define import.meta globally
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: mockImportMetaEnv
    }
  },
  writable: true,
  configurable: true
});

// Silence console.log in tests unless needed
const originalConsoleLog = console.log;
console.log = (...args) => {
  if (process.env.JEST_VERBOSE === 'true') {
    originalConsoleLog(...args);
  }
};