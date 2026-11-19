/**
 * Client-side Cache Service for Gemini AI Music Insights
 * Caches AI responses in sessionStorage & localStorage to reduce API calls & prevent rate-limiting.
 */

interface CachedAiResponse {
  answer: string;
  timestamp: number;
}

const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour TTL

export const getCachedAiInsight = (promptKey: string): string | null => {
  try {
    const raw = sessionStorage.getItem(`ai_cache_${promptKey}`) || localStorage.getItem(`ai_cache_${promptKey}`);
    if (!raw) return null;

    const data: CachedAiResponse = JSON.parse(raw);
    if (Date.now() - data.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(`ai_cache_${promptKey}`);
      localStorage.removeItem(`ai_cache_${promptKey}`);
      return null;
    }

    console.log(`[AiCacheService] Cache HIT for key: ${promptKey}`);
    return data.answer;
  } catch (err) {
    return null;
  }
};

export const setCachedAiInsight = (promptKey: string, answer: string): void => {
  try {
    const payload: CachedAiResponse = {
      answer,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(`ai_cache_${promptKey}`, JSON.stringify(payload));
    localStorage.setItem(`ai_cache_${promptKey}`, JSON.stringify(payload));
    console.log(`[AiCacheService] Cached AI insight for key: ${promptKey}`);
  } catch (err) {
    console.warn('[AiCacheService] Failed to store AI cache:', err);
  }
};
