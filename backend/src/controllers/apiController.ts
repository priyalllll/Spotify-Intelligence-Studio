import { Request, Response } from 'express';
import { spotifyService } from '../services/spotifyService';
import { getSpotifyAccessToken } from '../utils/authHelper';

export class ApiController {
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    const token = getSpotifyAccessToken(req);
    if (!token) {
      res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
      return;
    }
    try {
      const data = await spotifyService.getUserProfile(token);
      res.json(data);
    } catch (err: any) {
      console.error('Error in /api/profile:', err.message);
      res.status(401).json({ error: 'Failed to fetch profile', details: err?.message || 'Unauthorized / Invalid Token' });
    }
  };

  public getTopArtists = async (req: Request, res: Response): Promise<void> => {
    const token = getSpotifyAccessToken(req);
    if (!token) {
      res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
      return;
    }
    try {
      const data = await spotifyService.getTopArtists(token);
      res.json(data);
    } catch (err: any) {
      console.error('Error in /api/top-artists:', err.message);
      res.status(401).json({ error: 'Failed to fetch top artists', details: err?.message || 'Unauthorized / Invalid Token' });
    }
  };

  public getTopTracks = async (req: Request, res: Response): Promise<void> => {
    const token = getSpotifyAccessToken(req);
    if (!token) {
      res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
      return;
    }
    try {
      const data = await spotifyService.getTopTracks(token);
      res.json(data);
    } catch (err: any) {
      console.error('Error in /api/top-tracks:', err.message);
      res.status(401).json({ error: 'Failed to fetch top tracks', details: err?.message || 'Unauthorized / Invalid Token' });
    }
  };

  public getPlaylists = async (req: Request, res: Response): Promise<void> => {
    const token = getSpotifyAccessToken(req);
    if (!token) {
      res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
      return;
    }
    try {
      const data = await spotifyService.getUserPlaylists(token);
      res.json(data);
    } catch (err: any) {
      console.error('Error in /api/playlists:', err.message);
      res.status(401).json({ error: 'Failed to fetch playlists', details: err?.message || 'Unauthorized / Invalid Token' });
    }
  };

  public getRecentlyPlayed = async (req: Request, res: Response): Promise<void> => {
    const token = getSpotifyAccessToken(req);
    if (!token) {
      res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
      return;
    }
    try {
      const data = await spotifyService.getRecentlyPlayed(token);
      res.json(data);
    } catch (err: any) {
      console.error('Error in /api/recently-played:', err.message);
      res.status(401).json({ error: 'Failed to fetch recently played', details: err?.message || 'Unauthorized / Invalid Token' });
    }
  };

  public getFollowing = async (req: Request, res: Response): Promise<void> => {
    const token = getSpotifyAccessToken(req);
    if (!token) {
      res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
      return;
    }
    try {
      const data = await spotifyService.getFollowedArtists(token);
      res.json(data);
    } catch (err: any) {
      console.error('Error in /api/following:', err.message);
      res.status(401).json({ error: 'Failed to fetch following', details: err?.message || 'Unauthorized / Invalid Token' });
    }
  };
}

export const apiController = new ApiController();
