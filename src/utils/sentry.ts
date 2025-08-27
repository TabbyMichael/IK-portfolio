import React from 'react';
import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router-dom';

// Type definitions for optional Sentry
type SentryType = {
  init: (options: unknown) => void;
  withErrorBoundary: (component: React.ComponentType) => React.ComponentType;
  withScope: (callback: (scope: unknown) => void) => void;
  captureException: (error: Error) => void;
  startTransaction: (options: { name: string; op: string }) => unknown;
  addBreadcrumb: (breadcrumb: {
    message: string;
    category: string;
    level: string;
    data?: Record<string, unknown>;
  }) => void;
  setUser: (user: { id: string; email?: string; username?: string }) => void;
  reactRouterV6Instrumentation: (...args: unknown[]) => unknown;
};

type BrowserTracingType = new (options?: unknown) => unknown;

// Optional Sentry imports - will be undefined if packages not installed
let Sentry: SentryType | undefined;
let BrowserTracing: BrowserTracingType | undefined;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Sentry = require('@sentry/react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sentryTracing = require('@sentry/tracing');
  BrowserTracing = sentryTracing.BrowserTracing;
} catch {
  console.warn('Sentry packages not installed. Error tracking disabled.');
}

// Sentry configuration
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';
const RELEASE = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Initialize Sentry only in production or when DSN is provided
export const initSentry = () => {
  if (!Sentry) {
    console.warn('Sentry not available. Error tracking disabled.');
    return;
  }
  
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not found. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: `ian-portfolio@${RELEASE}`,
    
    // Performance monitoring
    integrations: BrowserTracing ? [
      new BrowserTracing({
        // Track navigation and route changes
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
    ] : [],
    
    // Performance monitoring sample rate
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    
    // Session replay for debugging
    replaysSessionSampleRate: ENVIRONMENT === 'production' ? 0.01 : 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Error filtering
    beforeSend(event: unknown, hint: unknown) {
      // Filter out common non-critical errors
      const error = (hint as { originalException?: { message?: string } })?.originalException;
      
      if (error && error.message) {
        // Filter out network errors that aren't actionable
        if (error.message.includes('Network Error') || 
            error.message.includes('Failed to fetch')) {
          return null;
        }
        
        // Filter out extension-related errors
        if (error.message.includes('extension') || 
            error.message.includes('Extension')) {
          return null;
        }
      }
      
      return event;
    },
    
    // Additional context
    initialScope: {
      tags: {
        component: 'portfolio-site',
        version: RELEASE,
      },
      user: {
        segment: 'portfolio-visitor'
      }
    }
  });
  
  console.log(`✅ Sentry initialized for ${ENVIRONMENT} environment`);
};

// Error boundary component with Sentry integration
export const SentryErrorBoundary = Sentry 
  ? Sentry.withErrorBoundary 
  : ((component: React.ComponentType) => component);

// Manual error reporting utilities
export const reportError = (error: Error, context?: Record<string, unknown>) => {
  if (ENVIRONMENT === 'development') {
    console.error('Error:', error, context);
  }
  
  if (!Sentry) return;
  
  Sentry.withScope((scope: unknown) => {
    const scopeObj = scope as { setContext?: (key: string, value: unknown) => void };
    if (context && scopeObj.setContext) {
      Object.entries(context).forEach(([key, value]) => {
        scopeObj.setContext!(key, value);
      });
    }
    Sentry.captureException(error);
  });
};

// Performance monitoring utilities
export const startTransaction = (name: string, op: string) => {
  return Sentry ? Sentry.startTransaction({ name, op }) : null;
};

export const addBreadcrumb = (message: string, category: string, level = 'info') => {
  if (!Sentry) return;
  
  Sentry.addBreadcrumb({
    message,
    category,
    level
  });
};

// User identification for authenticated features
export const identifyUser = (userId: string, email?: string, username?: string) => {
  if (!Sentry) return;
  
  Sentry.setUser({
    id: userId,
    email,
    username
  });
};

// Custom performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  startTiming(name: string): void {
    this.metrics.set(name, performance.now());
  }
  
  endTiming(name: string): number {
    const startTime = this.metrics.get(name);
    if (!startTime) {
      console.warn(`No start time found for metric: ${name}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.metrics.delete(name);
    
    // Report to Sentry
    if (Sentry) {
      Sentry.addBreadcrumb({
        message: `Performance timing: ${name}`,
        category: 'performance',
        data: { duration: `${duration.toFixed(2)}ms` },
        level: 'info'
      });
    }
    
    return duration;
  }
  
  recordMetric(name: string, value: number, unit: string = 'ms'): void {
    if (Sentry) {
      Sentry.addBreadcrumb({
        message: `Custom metric: ${name}`,
        category: 'metrics',
        data: { value, unit },
        level: 'info'
      });
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  React.useEffect(() => {
    performanceMonitor.startTiming(`${componentName}-mount`);
    
    return () => {
      const mountDuration = performanceMonitor.endTiming(`${componentName}-mount`);
      
      // Report slow components
      if (mountDuration > 100) {
        addBreadcrumb(
          `Slow component mount: ${componentName}`, 
          'performance', 
          'warning'
        );
      }
    };
  }, [componentName]);
};

export default Sentry || {};