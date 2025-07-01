// src/configs/env.config.ts

/**
 * Environment configuration
 * Handles environment variables with fallbacks
 */

interface EnvConfig {
  API_URL: string;
  GRAPHQL_URL: string;
  APP_ENV: 'development' | 'production' | 'test';
  APP_NAME: string;
  APP_VERSION: string;
  ENABLE_DEVTOOLS: boolean;
  GOOGLE_CLIENT_ID?: string;
  VNPAY_MERCHANT_ID?: string;
  MOMO_PARTNER_CODE?: string;
  SENTRY_DSN?: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || '';
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const ENV_CONFIG: EnvConfig = {
  API_URL: getEnvVar('VITE_API_URL', 'http://localhost:8080'),
  GRAPHQL_URL: getEnvVar('VITE_GRAPHQL_URL', 'http://localhost:8080/graphql'),
  APP_ENV: (getEnvVar('NODE_ENV', 'development') as EnvConfig['APP_ENV']),
  APP_NAME: getEnvVar('VITE_APP_NAME', 'CafeShop'),
  APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  ENABLE_DEVTOOLS: getBooleanEnvVar('VITE_ENABLE_DEVTOOLS', true),
  GOOGLE_CLIENT_ID: getEnvVar('VITE_GOOGLE_CLIENT_ID'),
  VNPAY_MERCHANT_ID: getEnvVar('VITE_VNPAY_MERCHANT_ID'),
  MOMO_PARTNER_CODE: getEnvVar('VITE_MOMO_PARTNER_CODE'),
  SENTRY_DSN: getEnvVar('VITE_SENTRY_DSN'),
};

// Utility functions
export const isDevelopment = () => ENV_CONFIG.APP_ENV === 'development';
export const isProduction = () => ENV_CONFIG.APP_ENV === 'production';
export const isTest = () => ENV_CONFIG.APP_ENV === 'test';
