import { Request, Response } from 'express';
import { spotifyService } from '../services/spotifyService';
import { getSpotifyAccessToken } from '../utils/authHelper';
import { FRONTEND_URL } from '../config/spotify';

export class AuthController {
  public login = (req: Request, res: Response): void => {
    const authUrl = spotifyService.getAuthorizationUrl();
    if (req.query.redirect === 'true' || req.headers.accept?.includes('text/html')) {
      res.redirect(authUrl);
    } else {
      res.json({ authUrl });
    }
  };

  public callback = async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code as string;
    const error = req.query.error as string;

    const frontendBase = req.headers.referer
      ? new URL(req.headers.referer).origin
      : FRONTEND_URL;

    if (error) {
      console.error('Spotify OAuth error in callback:', error);
      res.redirect(`${frontendBase}/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!code) {
      res.status(400).json({ error: 'Authorization code is missing from callback query' });
      return;
    }

    try {
      const tokenData = await spotifyService.handleCallback(code);
      const redirectUrl = `${frontendBase}/dashboard?access_token=${tokenData.accessToken}&refresh_token=${tokenData.refreshToken}&expires_in=${tokenData.expiresIn}`;
      console.log(`[OAuth Callback] Redirecting user to ${redirectUrl}`);
      res.redirect(redirectUrl);
    } catch (err: any) {
      console.error('Error handling Spotify OAuth callback:', err);
      res.status(500).json({
        error: 'Failed to complete OAuth authentication',
        details: err?.body?.error_description || err?.message || 'Callback failed',
      });
    }
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = (req.body?.refreshToken || req.query?.refreshToken) as string;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }

    try {
      const tokenData = await spotifyService.refreshAccessToken(refreshToken);
      res.json(tokenData);
    } catch (err: any) {
      console.error('Error refreshing Spotify access token:', err);
      res.status(500).json({
        error: 'Failed to refresh access token',
        details: err?.body?.error_description || err?.message || 'Token refresh failed',
      });
    }
  };

  public getMe = async (req: Request, res: Response): Promise<void> => {
    const accessToken = getSpotifyAccessToken(req);

    if (!accessToken) {
      res.status(401).json({ error: 'Access token is required in Authorization header or query parameter' });
      return;
    }

    try {
      const profile = await spotifyService.getUserProfile(accessToken);
      res.json(profile);
    } catch (err: any) {
      console.error('Error fetching Spotify user profile:', err);
      res.status(401).json({
        error: 'Failed to fetch user profile',
        details: err?.body?.error_description || err?.message || 'Fetch profile failed',
      });
    }
  };

  public getTopArtists = async (req: Request, res: Response): Promise<void> => {
    const accessToken = getSpotifyAccessToken(req);

    if (!accessToken) {
      res.status(401).json({ error: 'Access token is required in Authorization header or query parameter' });
      return;
    }

    try {
      const topArtists = await spotifyService.getTopArtists(accessToken);
      res.json(topArtists);
    } catch (err: any) {
      console.error('Error fetching Spotify top artists:', err);
      res.status(401).json({
        error: 'Failed to fetch top artists',
        details: err?.body?.error_description || err?.message || 'Fetch top artists failed',
      });
    }
  };

  public getTopTracks = async (req: Request, res: Response): Promise<void> => {
    const accessToken = getSpotifyAccessToken(req);

    if (!accessToken) {
      res.status(401).json({ error: 'Access token is required in Authorization header or query parameter' });
      return;
    }

    try {
      const topTracks = await spotifyService.getTopTracks(accessToken);
      res.json(topTracks);
    } catch (err: any) {
      console.error('Error fetching Spotify top tracks:', err);
      res.status(401).json({
        error: 'Failed to fetch top tracks',
        details: err?.body?.error_description || err?.message || 'Fetch top tracks failed',
      });
    }
  };

  public getPlaylists = async (req: Request, res: Response): Promise<void> => {
    const accessToken = getSpotifyAccessToken(req);

    if (!accessToken) {
      res.status(401).json({ error: 'Access token is required in Authorization header or query parameter' });
      return;
    }

    try {
      const playlists = await spotifyService.getUserPlaylists(accessToken);
      res.json(playlists);
    } catch (err: any) {
      console.error('Error fetching Spotify playlists:', err);
      res.status(401).json({
        error: 'Failed to fetch playlists',
        details: err?.body?.error_description || err?.message || 'Fetch playlists failed',
      });
    }
  };

  public getAudioAnalysis = async (req: Request, res: Response): Promise<void> => {
    const accessToken = getSpotifyAccessToken(req);

    if (!accessToken) {
      res.status(401).json({ error: 'Access token is required in Authorization header or query parameter' });
      return;
    }

    try {
      const audioAnalysis = await spotifyService.getAudioAnalysis(accessToken);
      res.json(audioAnalysis);
    } catch (err: any) {
      console.error('Error fetching Spotify audio analysis:', err);
      res.status(401).json({
        error: 'Failed to fetch audio analysis',
        details: err?.body?.error_description || err?.message || 'Fetch audio analysis failed',
      });
    }
  };
}

export const authController = new AuthController();
