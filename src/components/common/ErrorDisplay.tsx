import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { ErrorInfo, ErrorTypes, ErrorType } from '../../utils/errorHandling';

interface ErrorDisplayProps {
  error: ErrorInfo;
  onRetry?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  compact = false,
  className = '',
}) => {
  const getSeverityStyles = (severity: ErrorInfo['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'high':
        return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-200';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-200';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-200';
    }
  };

  const getRetryableErrors = (): ErrorType[] => {
    return [
      ErrorTypes.NETWORK_ERROR,
      ErrorTypes.SERVER_ERROR,
      ErrorTypes.UNKNOWN_ERROR,
    ];
  };

  const canRetry = error.code && getRetryableErrors().includes(error.code as ErrorType);
  const severityStyles = getSeverityStyles(error.severity);

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 p-2 rounded border ${severityStyles} ${className}`}
        role="alert"
        aria-live="polite"
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm flex-1">{error.message}</span>
        
        <div className="flex items-center gap-1">
          {canRetry && onRetry && (
            <button
              onClick={onRetry}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Retry operation"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border p-4 ${severityStyles} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <AlertCircle 
          className="w-5 h-5 flex-shrink-0 mt-0.5" 
          aria-hidden="true" 
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium mb-1">
                {error.severity === 'critical' && 'Critical Error'}
                {error.severity === 'high' && 'Error'}
                {error.severity === 'medium' && 'Warning'}
                {error.severity === 'low' && 'Information'}
              </h3>
              
              <p className="text-sm mb-3">{error.message}</p>
              
              {error.code && (
                <p className="text-xs opacity-75 mb-2">
                  Error Code: {error.code}
                </p>
              )}
              
              {process.env.NODE_ENV === 'development' && error.context && (
                <details className="text-xs opacity-75">
                  <summary className="cursor-pointer hover:opacity-100">
                    Debug Information
                  </summary>
                  <pre className="mt-2 p-2 bg-black/10 dark:bg-white/10 rounded overflow-auto">
                    {JSON.stringify(error.context, null, 2)}
                  </pre>
                </details>
              )}
            </div>
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {canRetry && onRetry && (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded transition-colors"
                aria-label="Retry the failed operation"
              >
                <RefreshCw className="w-3 h-3" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;