import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

// GET /auth/login -> Redirect to Spotify authorization screen
router.get('/login', authController.login);

// GET /auth/callback -> Exchange authorization code for tokens & redirect to frontend /dashboard
router.get('/callback', authController.callback);

// GET /auth/refresh -> Refresh access token
router.get('/refresh', authController.refresh);

// GET /auth/me -> Fetch current user profile
router.get('/me', authController.getMe);

// GET /auth/top-artists -> Fetch user's top artists
router.get('/top-artists', authController.getTopArtists);

// GET /auth/top-tracks -> Fetch user's top tracks
router.get('/top-tracks', authController.getTopTracks);

// GET /auth/playlists -> Fetch user's playlists
router.get('/playlists', authController.getPlaylists);

// GET /auth/audio-analysis -> Fetch audio features analysis
router.get('/audio-analysis', authController.getAudioAnalysis);

export default router;
