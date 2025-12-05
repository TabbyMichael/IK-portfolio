import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';
import React from 'react';
import { reportWebVitals } from './analytics';
import { addBreadcrumb, reportError } from './sentry';

// Web Vitals thresholds (Google's recommended values)
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
};

// Performance grade calculation
const getPerformanceGrade = (metric: Metric): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds = THRESHOLDS[metric.name as keyof typeof THRESHOLDS];
  if (!thresholds) return 'good';
  
  if (metric.value <= thresholds.good) return 'good';
  if (metric.value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
};

// Enhanced metric handler with detailed logging
const handleMetric = (metric: Metric) => {
  const grade = getPerformanceGrade(metric);
  const value = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value);
  
  console.log(`🔍 ${metric.name}: ${value}${metric.name === 'CLS' ? '' : 'ms'} (${grade})`);
  
  // Add breadcrumb for Sentry
  addBreadcrumb(
    `Web Vital: ${metric.name}`,
    'performance',
    grade === 'poor' ? 'warning' : 'info'
  );
  
  // Report to analytics
  reportWebVitals(metric);
  
  // Store in localStorage for performance dashboard
  storeMetric(metric, grade);
  
  // Alert for poor performance
  if (grade === 'poor') {
    console.warn(`⚠️ Poor ${metric.name} performance detected:`, {
      value,
      threshold: THRESHOLDS[metric.name as keyof typeof THRESHOLDS]?.poor,
      url: window.location.href,
      userAgent: navigator.userAgent
    });
    
    // Report critical performance issues
    if (metric.name === 'LCP' && value > 4000) {
      reportError(
        new Error(`Critical LCP performance: ${value}ms`),
        {
          metric: metric.name,
          value,
          url: window.location.href,
          timestamp: Date.now()
        }
      );
    }
  }
};

// Store metrics in localStorage for dashboard
const storeMetric = (metric: Metric, grade: string) => {
  try {
    const key = 'webVitalsMetrics';
    const stored = localStorage.getItem(key);
    const metrics = stored ? JSON.parse(stored) : {};
    
    if (!metrics[metric.name]) {
      metrics[metric.name] = [];
    }
    
    metrics[metric.name].push({
      value: metric.value,
      grade,
      timestamp: Date.now(),
      url: window.location.pathname,
      id: metric.id
    });
    
    // Keep only last 100 entries per metric
    if (metrics[metric.name].length > 100) {
      metrics[metric.name] = metrics[metric.name].slice(-100);
    }
    
    localStorage.setItem(key, JSON.stringify(metrics));
  } catch (error) {
    console.warn('Failed to store web vitals metric:', error);
  }
};

// Initialize Web Vitals monitoring
export const initWebVitals = () => {
  try {
    onCLS(handleMetric);
    onINP(handleMetric);
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
    
    console.log('✅ Web Vitals monitoring initialized');
  } catch (error) {
    console.error('Failed to initialize Web Vitals:', error);
    reportError(error as Error, { context: 'webVitalsInit' });
  }
};

// Get stored metrics for dashboard
export const getStoredMetrics = () => {
  try {
    const stored = localStorage.getItem('webVitalsMetrics');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to retrieve stored metrics:', error);
    return {};
  }
};

// Calculate performance score (0-100)
export const calculatePerformanceScore = () => {
  const metrics = getStoredMetrics();
  const scores: number[] = [];
  
  Object.entries(THRESHOLDS).forEach(([metricName, thresholds]) => {
    const metricData = metrics[metricName];
    if (metricData && metricData.length > 0) {
      const latestMetric = metricData[metricData.length - 1];
      const value = latestMetric.value;
      
      let score = 100;
      if (value > thresholds.good) {
        if (value > thresholds.poor) {
          score = 0;
        } else {
          // Linear interpolation between good and poor
          score = Math.round(50 * (thresholds.poor - value) / (thresholds.poor - thresholds.good));
        }
      }
      scores.push(score);
    }
  });
  
  return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
};

// Performance monitoring utilities
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private observers: Map<string, PerformanceObserver> = new Map();
  
  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }
  
  // Monitor resource loading
  monitorResources() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 1000) { // Resources taking > 1s
            console.warn('Slow resource:', {
              name: entry.name,
              duration: Math.round(entry.duration),
              size: (entry as PerformanceResourceTiming).transferSize || 'unknown'
            });
            
            addBreadcrumb(
              `Slow resource load: ${entry.name}`,
              'performance',
              'warning'
            );
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.set('resources', observer);
    }
  }
  
  // Monitor long tasks
  monitorLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.warn('Long task detected:', {
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime)
          });
          
          addBreadcrumb(
            `Long task: ${Math.round(entry.duration)}ms`,
            'performance',
            'warning'
          );
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', observer);
    }
  }
  
  // Monitor layout shifts
  monitorLayoutShifts() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry) => {
          // Layout shift entries have additional properties not in the standard PerformanceEntry
          const layoutShiftEntry = entry as PerformanceEntry & {
            value?: number;
            sources?: Array<{ node: Element }>;
          };
          
          if (layoutShiftEntry.value && layoutShiftEntry.value > 0.1) { // Significant layout shift
            console.warn('Layout shift detected:', {
              value: layoutShiftEntry.value.toFixed(4),
              sources: layoutShiftEntry.sources?.map((s) => s.node) || []
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('layout-shift', observer);
    }
  }
  
  // Cleanup observers
  cleanup() {
    this.observers.forEach((observer: PerformanceObserver) => observer.disconnect());
    this.observers.clear();
  }
}

// React hook for component performance monitoring
export const useComponentPerformance = (componentName: string) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      
      if (duration > 16) { // > 1 frame at 60fps
        console.log(`Component ${componentName} rendered in ${duration.toFixed(2)}ms`);
        addBreadcrumb(
          `Component render: ${componentName}`,
          'performance',
          duration > 100 ? 'warning' : 'info'
        );
      }
    };
  }, [componentName]);
};

// Initialize all performance monitoring
export const initPerformanceMonitoring = () => {
  initWebVitals();
  
  const tracker = PerformanceTracker.getInstance();
  tracker.monitorResources();
  tracker.monitorLongTasks();
  tracker.monitorLayoutShifts();
  
  // Monitor page visibility for performance context
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      addBreadcrumb('Page became hidden', 'navigation', 'info');
    } else {
      addBreadcrumb('Page became visible', 'navigation', 'info');
    }
  });
  
  console.log('🚀 Performance monitoring fully initialized');
};

export const performanceTracker = PerformanceTracker.getInstance();