import { useState, useCallback } from 'react';
import { reportError } from './sentry';

export interface ErrorInfo {
  message: string;
  code?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, unknown>;
  timestamp: number;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ErrorInfo | null;
}

// Standardized error types
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorType = typeof ErrorTypes[keyof typeof ErrorTypes];

// Error severity mapping
const ERROR_SEVERITY_MAP: Record<ErrorType, ErrorInfo['severity']> = {
  [ErrorTypes.NETWORK_ERROR]: 'medium',
  [ErrorTypes.VALIDATION_ERROR]: 'low',
  [ErrorTypes.AUTH_ERROR]: 'high',
  [ErrorTypes.PERMISSION_ERROR]: 'high',
  [ErrorTypes.NOT_FOUND]: 'medium',
  [ErrorTypes.SERVER_ERROR]: 'critical',
  [ErrorTypes.CLIENT_ERROR]: 'medium',
  [ErrorTypes.UNKNOWN_ERROR]: 'high',
};

// User-friendly error messages
const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorTypes.NETWORK_ERROR]: 'Unable to connect to the server. Please check your internet connection and try again.',
  [ErrorTypes.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ErrorTypes.AUTH_ERROR]: 'Authentication failed. Please log in again.',
  [ErrorTypes.PERMISSION_ERROR]: 'You do not have permission to perform this action.',
  [ErrorTypes.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorTypes.SERVER_ERROR]: 'A server error occurred. Please try again later.',
  [ErrorTypes.CLIENT_ERROR]: 'An error occurred. Please try again.',
  [ErrorTypes.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
};

/**
 * Creates a standardized error object
 */
export const createError = (
  type: ErrorType,
  customMessage?: string,
  context?: Record<string, unknown>
): ErrorInfo => ({
  message: customMessage || ERROR_MESSAGES[type],
  code: type,
  severity: ERROR_SEVERITY_MAP[type],
  context,
  timestamp: Date.now(),
});

/**
 * Handles different types of errors and returns appropriate ErrorInfo
 */
export const handleError = (
  error: unknown,
  context?: Record<string, unknown>
): ErrorInfo => {
  // If it's already an ErrorInfo object
  if (error && typeof error === 'object' && 'message' in error && 'severity' in error) {
    return error as ErrorInfo;
  }

  // Handle different error types
  if (error instanceof Error) {
    let errorType: ErrorType = ErrorTypes.UNKNOWN_ERROR;
    const customMessage = error.message;

    // Network errors
    if (error.message.includes('fetch') || error.message.includes('Network')) {
      errorType = ErrorTypes.NETWORK_ERROR;
    }
    // Validation errors
    else if (error.message.includes('validation') || error.message.includes('invalid')) {
      errorType = ErrorTypes.VALIDATION_ERROR;
    }
    // Auth errors
    else if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      errorType = ErrorTypes.AUTH_ERROR;
    }
    // Permission errors
    else if (error.message.includes('permission') || error.message.includes('forbidden')) {
      errorType = ErrorTypes.PERMISSION_ERROR;
    }
    // Not found errors
    else if (error.message.includes('not found') || error.message.includes('404')) {
      errorType = ErrorTypes.NOT_FOUND;
    }

    return createError(errorType, customMessage, { ...context, originalError: error.message });
  }

  // Handle HTTP response errors
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: number }).status;
    let errorType: ErrorType;

    if (status >= 500) {
      errorType = ErrorTypes.SERVER_ERROR;
    } else if (status === 404) {
      errorType = ErrorTypes.NOT_FOUND;
    } else if (status === 401) {
      errorType = ErrorTypes.AUTH_ERROR;
    } else if (status === 403) {
      errorType = ErrorTypes.PERMISSION_ERROR;
    } else {
      errorType = ErrorTypes.CLIENT_ERROR;
    }

    return createError(errorType, undefined, { ...context, status });
  }

  // Handle string errors
  if (typeof error === 'string') {
    return createError(ErrorTypes.UNKNOWN_ERROR, error, context);
  }

  // Fallback for unknown error types
  return createError(ErrorTypes.UNKNOWN_ERROR, 'An unexpected error occurred', {
    ...context,
    errorType: typeof error,
    errorValue: String(error),
  });
};

/**
 * Hook for managing async operations with standardized error handling
 */
export const useAsyncOperation = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    operation: () => Promise<T>,
    context?: Record<string, unknown>
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await operation();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorInfo = handleError(error, context);
      setState(prev => ({ ...prev, loading: false, error: errorInfo }));
      
      // Report error to monitoring service
      if (errorInfo.severity === 'critical' || errorInfo.severity === 'high') {
        reportError(error instanceof Error ? error : new Error(errorInfo.message), {
          ...context,
          errorInfo,
        });
      }
      
      throw errorInfo;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearError,
  };
};

/**
 * Hook for managing form submission with error handling
 */
export const useFormSubmission = <T>() => {
  const asyncOp = useAsyncOperation<T>();

  const submit = useCallback(async (
    formData: unknown,
    submitFn: (data: unknown) => Promise<T>,
    validationFn?: (data: unknown) => void
  ) => {
    // Run validation if provided
    if (validationFn) {
      validationFn(formData);
    }

    const result = await asyncOp.execute(
      () => submitFn(formData),
      { formData, action: 'form_submission' }
    );
    
    return result;
  }, [asyncOp]);

  return {
    ...asyncOp,
    submit,
  };
};

/**
 * Utility for retrying failed operations
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context?: Record<string, unknown>
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain error types
      const errorInfo = handleError(error);
      if (
        errorInfo.code === ErrorTypes.AUTH_ERROR ||
        errorInfo.code === ErrorTypes.PERMISSION_ERROR ||
        errorInfo.code === ErrorTypes.VALIDATION_ERROR
      ) {
        throw errorInfo;
      }

      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw handleError(error, { ...context, attempts: attempt });
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw handleError(lastError, { ...context, attempts: maxRetries });
};