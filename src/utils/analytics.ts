import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (command: string, target?: string | Date, config?: Record<string, unknown>) => void;
    dataLayer: unknown[];
  }
}

// Google Analytics Configuration
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // Check if GA_TRACKING_ID is valid
  if (!GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') {
    console.warn('Google Analytics: Invalid or missing tracking ID');
    return;
  }

  console.log('Initializing Google Analytics with ID:', GA_TRACKING_ID);

  // Initialize dataLayer first
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: [string, (string | Date)?, Record<string, unknown>?]) {
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

// Performance monitoring
export const reportWebVitals = (metric: {
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