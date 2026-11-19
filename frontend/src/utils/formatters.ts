/**
 * Safe Formatting Utilities for Spotify Web API Telemetry
 * Prevents undefined, null, NaN, or raw empty displays.
 */

export const formatFollowers = (count?: number | null): string => {
  if (count === undefined || count === null || isNaN(count)) {
    return 'Not Available';
  }
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toLocaleString();
};

export const formatDurationMs = (ms?: number | null): string => {
  if (!ms || isNaN(ms) || ms <= 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const formatNumber = (val?: number | null, fallback: string = '0'): string => {
  if (val === undefined || val === null || isNaN(val)) return fallback;
  return val.toLocaleString();
};

export const formatPercent = (val?: number | null, fallback: string = '0%'): string => {
  if (val === undefined || val === null || isNaN(val)) return fallback;
  return `${Math.round(val)}%`;
};

export const formatSafeString = (str?: string | null, fallback: string = 'Not Available'): string => {
  if (!str || str.trim() === '') return fallback;
  return str.trim();
};
