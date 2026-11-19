"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// GET /auth/login -> Redirect to Spotify authorization screen
router.get('/login', authController_1.authController.login);
// GET /auth/callback -> Exchange authorization code for tokens & redirect to frontend /dashboard
router.get('/callback', authController_1.authController.callback);
// GET /auth/refresh -> Refresh access token
router.get('/refresh', authController_1.authController.refresh);
// GET /auth/me -> Fetch current user profile
router.get('/me', authController_1.authController.getMe);
// GET /auth/top-artists -> Fetch user's top artists
router.get('/top-artists', authController_1.authController.getTopArtists);
// GET /auth/top-tracks -> Fetch user's top tracks
router.get('/top-tracks', authController_1.authController.getTopTracks);
// GET /auth/playlists -> Fetch user's playlists
router.get('/playlists', authController_1.authController.getPlaylists);
// GET /auth/audio-analysis -> Fetch audio features analysis
router.get('/audio-analysis', authController_1.authController.getAudioAnalysis);
exports.default = router;
