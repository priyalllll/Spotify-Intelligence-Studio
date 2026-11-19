import type { SpotifyAudioAnalysisResponse } from '../types/spotify';

export class SpotifyAudioService {
  /**
   * Fetch Audio Analysis (Top Tracks + Audio Features) from Backend API
   */
  public async getAudioAnalysis(accessToken: string): Promise<SpotifyAudioAnalysisResponse> {
    const response = await fetch(`http://localhost:5000/auth/audio-analysis?access_token=${accessToken}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.details || errData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  }
}

export const spotifyAudioService = new SpotifyAudioService();
