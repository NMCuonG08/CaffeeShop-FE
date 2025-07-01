// src/utils/error.ts

/**
 * Error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export class CustomError extends Error implements AppError {
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Create a standardized error object
 */
export const createError = (
  message: string,
  code?: string,
  statusCode?: number,
  details?: Record<string, unknown>
): AppError => ({
  message,
  code,
  statusCode,
  details,
});

/**
 * Check if error is an API error
 */
export const isApiError = (error: unknown): error is AppError => {
  return error !== null && typeof error === 'object' && 'message' in error && typeof error.message === 'string';
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'Đã xảy ra lỗi không xác định';
};

/**
 * Handle async operations with error catching
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<[T | null, AppError | null]> => {
  try {
    const result = await operation();
    return [result, null];
  } catch (error) {
    const appError = createError(
      errorMessage || getErrorMessage(error),
      'OPERATION_FAILED'
    );
    return [null, appError];
  }
};

/**
 * Retry an async operation
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};
