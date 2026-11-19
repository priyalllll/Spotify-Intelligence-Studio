"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiController_1 = require("../controllers/apiController");
const router = (0, express_1.Router)();
// GET /api/profile -> Spotify GET /me
router.get('/profile', apiController_1.apiController.getProfile);
// GET /api/top-artists -> Spotify GET /me/top/artists
router.get('/top-artists', apiController_1.apiController.getTopArtists);
// GET /api/top-tracks -> Spotify GET /me/top/tracks
router.get('/top-tracks', apiController_1.apiController.getTopTracks);
// GET /api/playlists -> Spotify GET /me/playlists
router.get('/playlists', apiController_1.apiController.getPlaylists);
// GET /api/recently-played -> Spotify GET /me/player/recently-played
router.get('/recently-played', apiController_1.apiController.getRecentlyPlayed);
// GET /api/following -> Spotify GET /me/following?type=artist
router.get('/following', apiController_1.apiController.getFollowing);
exports.default = router;
