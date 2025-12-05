import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Metric } from 'web-vitals';

// Global type declarations
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function gtag(...args: unknown[]): void;
}

// Simple analytics interface for web vitals
export const reportWebVitals = (metric: Metric) => {
  // In a real application, you would send this to your analytics service
  // Examples: Google Analytics, Adobe Analytics, custom tracking service
  
  if (import.meta.env.DEV) {
    console.log('📊 Web Vital:', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
      timestamp: Date.now()
    });
  }
  
  // Example: Send to Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      custom_parameter_1: 'web_vitals'
    });
  }
  
  // Example: Send to custom analytics endpoint
  // fetch('/api/analytics/web-vitals', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     metric: metric.name,
  //     value: metric.value,
  //     id: metric.id,
  //     url: window.location.href,
  //     timestamp: Date.now()
  //   })
  // }).catch(console.warn);
};

// Custom event tracking
export const trackEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (import.meta.env.DEV) {
    console.log('🎯 Event tracked:', eventName, parameters);
  }
  
  // Google Analytics 4 event tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Page view tracking
export const trackPageView = (path: string, title?: string) => {
  if (import.meta.env.DEV) {
    console.log('👀 Page view:', path, title);
  }
  
  // Google Analytics 4 page view
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
      page_title: title
    });
  }
};



// Google Analytics Configuration
// Note: GA tracking IDs are meant to be public and visible in client-side code
// This is not a security risk - all websites using GA expose their tracking ID
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // Check if GA_TRACKING_ID is valid
  if (!GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') {
    console.warn('Google Analytics: Invalid or missing tracking ID. Please set VITE_GA_TRACKING_ID environment variable.');
    return;
  }

  console.log('Initializing Google Analytics with ID:', GA_TRACKING_ID);

  // Initialize dataLayer first
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  
  // Add error handling
  script.onerror = () => {
    console.error('Failed to load Google Analytics script');
  };
  
  script.onload = () => {
    console.log('Google Analytics script loaded successfully');
    
    // Initialize gtag after script loads
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      send_page_view: false // We'll send this manually
    });
    
    console.log('Google Analytics initialized');
  };
  
  document.head.appendChild(script);
};

// Log page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    console.log('GA Pageview:', url);
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Performance monitoring (keeping this for backward compatibility)
export const reportWebVitalsLegacy = (metric: {
  name: string;
  id: string;
  value: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
};

// Track user interactions
export const trackInteraction = (element: string, action: string) => {
  event({
    action: action,
    category: 'User Interaction',
    label: element
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean) => {
  event({
    action: success ? 'form_submit_success' : 'form_submit_error',
    category: 'Forms',
    label: formName
  });
};

// Track project views
export const trackProjectView = (projectName: string) => {
  event({
    action: 'project_view',
    category: 'Projects',
    label: projectName
  });
};

// Track downloads
export const trackDownload = (fileName: string) => {
  event({
    action: 'download',
    category: 'Files',
    label: fileName
  });
};

// Hook for automatic page tracking
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);
};

export default {
  reportWebVitals,
  trackEvent,
  trackPageView,
  initGA,
  pageview,
  event,
  trackInteraction,
  trackFormSubmission,
  trackProjectView,
  trackDownload,
  usePageTracking
};