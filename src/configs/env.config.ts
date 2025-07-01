// src/configs/env.config.ts

/**
 * Environment configuration
 * Handles environment variables with fallbacks
 */

interface EnvConfig {
  API_URL: string;
  APP_ENV: 'development' | 'production' | 'test';
  ENABLE_DEVTOOLS: boolean;
  GOOGLE_CLIENT_ID?: string;
  VNPAY_TMN_CODE?: string;
  MOMO_PARTNER_CODE?: string;
  SENTRY_DSN?: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || '';
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const ENV_CONFIG: EnvConfig = {
  API_URL: getEnvVar('REACT_APP_API_URL', 'http://localhost:3001'),
  APP_ENV: (getEnvVar('NODE_ENV', 'development') as EnvConfig['APP_ENV']),
  ENABLE_DEVTOOLS: getBooleanEnvVar('REACT_APP_ENABLE_DEVTOOLS', true),
  GOOGLE_CLIENT_ID: getEnvVar('REACT_APP_GOOGLE_CLIENT_ID'),
  VNPAY_TMN_CODE: getEnvVar('REACT_APP_VNPAY_TMN_CODE'),
  MOMO_PARTNER_CODE: getEnvVar('REACT_APP_MOMO_PARTNER_CODE'),
  SENTRY_DSN: getEnvVar('REACT_APP_SENTRY_DSN'),
};

// Utility functions
export const isDevelopment = () => ENV_CONFIG.APP_ENV === 'development';
export const isProduction = () => ENV_CONFIG.APP_ENV === 'production';
export const isTest = () => ENV_CONFIG.APP_ENV === 'test';
