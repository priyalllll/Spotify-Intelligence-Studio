/**
 * Application Environment Configuration
 * Centralized API Base URL and environment flags for production readiness.
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

export const IS_PRODUCTION = import.meta.env.PROD;
