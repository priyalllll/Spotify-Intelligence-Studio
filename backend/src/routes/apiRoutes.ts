import { Router } from 'express';
import { apiController } from '../controllers/apiController';

const router = Router();

// GET /api/profile -> Spotify GET /me
router.get('/profile', apiController.getProfile);

// GET /api/top-artists -> Spotify GET /me/top/artists
router.get('/top-artists', apiController.getTopArtists);

// GET /api/top-tracks -> Spotify GET /me/top/tracks
router.get('/top-tracks', apiController.getTopTracks);

// GET /api/playlists -> Spotify GET /me/playlists
router.get('/playlists', apiController.getPlaylists);

// GET /api/recently-played -> Spotify GET /me/player/recently-played
router.get('/recently-played', apiController.getRecentlyPlayed);

// GET /api/following -> Spotify GET /me/following?type=artist
router.get('/following', apiController.getFollowing);

export default router;
